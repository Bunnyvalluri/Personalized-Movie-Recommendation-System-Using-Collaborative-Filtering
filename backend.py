"""
Core backend data layer for iBOMMA Streaming.
Handles TMDB API interactions, circuit breaking, in-memory caching,
request deduplication, and ML-based recommendation generation.
"""

import os
import time
import json
import logging
import threading
import concurrent.futures
from typing import List, Dict, Any, Optional, Tuple, Set

import numpy as np
import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import streamlit as st

# ── Configuration & Logging ───────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("backend")

class Config:
    TMDB_KEY: str = st.secrets.get("TMDB_KEY", os.environ.get("TMDB_KEY", "8265bd1679663a7ea12ac168da84d2e8"))
    L1_CACHE_TTL: int = 3600
    TMDB_CACHE_TTL: int = 3600
    TRENDING_TTL: int = 1800
    MAX_WORKERS_API: int = 8
    MAX_WORKERS_UI: int = 20

# ── Custom Exceptions ─────────────────────────────────────────────────────────

class TMDBAPIError(Exception):
    """Raised when the TMDB API fails across all mirrors/proxies."""
    pass

# ── Circuit Breaker ───────────────────────────────────────────────────────────

class CircuitBreaker:
    """Thread-safe circuit breaker for external API routing."""
    def __init__(self, threshold: int = 3, cooldown: int = 60):
        self._threshold = threshold
        self._cooldown = cooldown
        self._state: Dict[str, Dict[str, float]] = {}
        self._lock = threading.Lock()

    def is_open(self, endpoint: str) -> bool:
        with self._lock:
            s = self._state.get(endpoint)
            if not s:
                return False
            if s["fails"] >= self._threshold:
                if time.time() - s["opened_at"] < self._cooldown:
                    return True
                s["fails"] = 0  # Cooldown passed, half-open
            return False

    def record_failure(self, endpoint: str) -> None:
        with self._lock:
            s = self._state.setdefault(endpoint, {"fails": 0, "opened_at": 0.0})
            s["fails"] += 1
            s["opened_at"] = time.time()
            logger.warning(f"CircuitBreaker: Recorded failure for '{endpoint}'. Fails: {s['fails']}")

    def record_success(self, endpoint: str) -> None:
        with self._lock:
            if endpoint in self._state:
                logger.info(f"CircuitBreaker: Resetting circuit for '{endpoint}' after success.")
                self._state.pop(endpoint, None)

# ── TMDB Client ───────────────────────────────────────────────────────────────

class TMDBClient:
    """Handles rate-limited, deduplicated, resilient TMDB API requests."""
    _adapter = HTTPAdapter(
        max_retries=Retry(
            total=2, backoff_factor=0.3,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"], raise_on_status=False
        ),
        pool_connections=10, pool_maxsize=20, pool_block=False,
    )
    
    def __init__(self):
        self.session = requests.Session()
        self.session.mount("https://", self._adapter)
        self.session.mount("http://", self._adapter)
        self.headers = {
            "User-Agent": "iBOMMA-Backend/1.0",
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        }
        self.cb = CircuitBreaker()
        self._l1: Dict[str, Dict[str, Any]] = {}
        self._l1_lock = threading.Lock()
        self._in_flight: Dict[str, threading.Event] = {}
        self._in_flight_lock = threading.Lock()

    def _get_l1(self, key: str) -> Optional[Any]:
        with self._l1_lock:
            e = self._l1.get(key)
            if e and (time.time() - e["ts"]) < Config.L1_CACHE_TTL:
                return e["val"]
        return None

    def _set_l1(self, key: str, val: Any) -> None:
        with self._l1_lock:
            self._l1[key] = {"val": val, "ts": time.time()}
            if len(self._l1) > 2000:
                for k in sorted(self._l1, key=lambda k: self._l1[k]["ts"])[:200]:
                    del self._l1[k]

    def fetch(self, path: str) -> dict:
        """Fetches data from TMDB with L1 caching and request deduplication."""
        cached = self._get_l1(path)
        if cached is not None:
            return cached

        leader = False
        with self._in_flight_lock:
            if path not in self._in_flight:
                self._in_flight[path] = threading.Event()
                leader = True
            else:
                event = self._in_flight[path]

        if leader:
            try:
                result = self._execute_request(path)
                if result:
                    self._set_l1(path, result)
                return result
            except Exception as e:
                logger.error(f"TMDB Fetch Failed for {path}: {e}")
                return {}
            finally:
                with self._in_flight_lock:
                    ev = self._in_flight.pop(path, None)
                if ev:
                    ev.set()
        else:
            event.wait(timeout=8)
            return self._get_l1(path) or {}

    def _execute_request(self, path: str) -> dict:
        from urllib.parse import quote
        sep = "&" if "?" in path else "?"
        mirror = f"https://api.tmdb.org/3/{path}{sep}api_key={Config.TMDB_KEY}"
        direct = f"https://api.themoviedb.org/3/{path}{sep}api_key={Config.TMDB_KEY}"
        proxy = f"https://api.codetabs.com/v1/proxy?quest={quote(direct, safe='')}"
        
        endpoints = [
            ("mirror", mirror, 4),
            ("direct", direct, 4),
            ("proxy", proxy, 7)
        ]
        
        for label, url, timeout in endpoints:
            if self.cb.is_open(label):
                continue
            try:
                r = self.session.get(url, headers=self.headers, timeout=timeout)
                if r.status_code == 200:
                    data = r.json()
                    if data and not data.get("error"):
                        self.cb.record_success(label)
                        return data
                self.cb.record_failure(label)
            except requests.RequestException as e:
                logger.debug(f"Endpoint '{label}' failed: {e}")
                self.cb.record_failure(label)
                
        logger.error(f"All TMDB endpoints failed for path: {path}")
        return {}

# ── Global Instances ──────────────────────────────────────────────────────────

tmdb_client = TMDBClient()

def tmdb_get(path: str) -> dict:
    """Legacy wrapper for the new TMDBClient."""
    return tmdb_client.fetch(path)

# ── Utility Functions ─────────────────────────────────────────────────────────

def safe_year(val: Any) -> str:
    try:
        s = str(val).strip()
        return s[:4] if len(s) >= 4 else s
    except Exception:
        return "N/A"

def safe_rating(val: Any) -> str:
    try:
        return f"{float(val):.1f}"
    except Exception:
        return "N/A"

# ── Data Fetching ─────────────────────────────────────────────────────────────

@st.cache_data(ttl=Config.TMDB_CACHE_TTL, show_spinner=False)
def fetch_movie_details(movie_id: str) -> dict:
    """Fetches comprehensive movie details including trailer extraction."""
    details = {
        "poster": "https://placehold.co/500x750/1a1a2e/e50914?text=No+Poster",
        "trailer": None,
        "overview": "No plot summary available.",
        "genres": "",
        "title": "",
        "year": "",
        "runtime": "",
        "rating": ""
    }
    
    data = tmdb_get(f"movie/{movie_id}?language=en-US&append_to_response=videos")
    if not data:
        return details

    details["title"] = data.get("title", "")
    details["year"] = (data.get("release_date", "") or "")[:4]
    details["rating"] = f"{data.get('vote_average', 0):.1f}"
    
    rt = data.get("runtime") or 0
    if rt:
        details["runtime"] = f"{rt//60}h {rt%60}m"
        
    if data.get("poster_path"):
        details["poster"] = "https://media.themoviedb.org/t/p/w342" + data["poster_path"]
        
    if data.get("overview"):
        ov = data["overview"]
        details["overview"] = ov[:110] + "..." if len(ov) > 110 else ov
        
    if data.get("genres"):
        details["genres"] = " • ".join(g["name"] for g in data["genres"][:2])
        
    if isinstance(data.get("videos"), dict):
        for v in data["videos"].get("results", []):
            if v.get("site") == "YouTube" and v.get("type") == "Trailer":
                details["trailer"] = f"https://www.youtube.com/watch?v={v['key']}"
                break
                
    return details

@st.cache_data(ttl=86400, show_spinner=False)
def get_genre_map() -> dict:
    """Fetches and caches the TMDB genre ID map."""
    data = tmdb_get("genre/movie/list?language=en-US")
    return {g["id"]: g["name"] for g in (data.get("genres", []) if data else [])}

def details_from_discover(movie: dict, gmap: Optional[dict] = None) -> dict:
    """Fast-path details extraction directly from a list/discover result."""
    if gmap is None:
        gmap = get_genre_map()
        
    poster = movie.get("poster_path")
    title = movie.get("title", "")
    year = (movie.get("release_date", "") or "")[:4]
    genres = " • ".join(gmap.get(gid, "") for gid in (movie.get("genre_ids") or [])[:2] if gmap.get(gid))
    ov = movie.get("overview", "") or ""
    
    return {
        "poster": f"https://media.themoviedb.org/t/p/w342{poster}" if poster else "https://placehold.co/500x750/1a1a2e/e50914?text=No+Poster",
        "trailer": None,
        "genres": genres,
        "title": title,
        "year": year,
        "overview": (ov[:110] + "...") if len(ov) > 110 else ov,
        "runtime": "",
        "rating": f"{movie.get('vote_average', 0):.1f}",
    }

def _fetch_regional(lang: str, genre_label: str) -> Dict[str, list]:
    """Parallel fetch of regional movie lists based on language and primary genre."""
    genre_id = "18" if lang == "te" else "35"
    queries = {
        "🔥 Popular":     f"discover/movie?with_original_language={lang}&sort_by=popularity.desc&page=1",
        "🔥 Popular 2":   f"discover/movie?with_original_language={lang}&sort_by=popularity.desc&page=2",
        "⭐ Top Rated":   f"discover/movie?with_original_language={lang}&sort_by=vote_average.desc&vote_count.gte=50",
        "🆕 Latest":      f"discover/movie?with_original_language={lang}&sort_by=release_date.desc&primary_release_date.gte=2023-01-01&vote_count.gte=5",
        "🏆 Classics":    f"discover/movie?with_original_language={lang}&sort_by=vote_count.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2023-12-31",
        "📼 Old Classics":f"discover/movie?with_original_language={lang}&sort_by=vote_count.desc&primary_release_date.lte=2014-12-31",
        "💥 Action":      f"discover/movie?with_original_language={lang}&with_genres=28&sort_by=popularity.desc&page=1",
        genre_label:      f"discover/movie?with_original_language={lang}&with_genres={genre_id}&sort_by=popularity.desc&vote_count.gte=20",
    }
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=Config.MAX_WORKERS_API) as ex:
        results = list(ex.map(tmdb_get, queries.values()))
        
    grouped: Dict[str, list] = {}
    seen: Set[int] = set()
    
    for key, data in zip(queries.keys(), results):
        movies = []
        for m in (data.get("results", [])[:20] if data else []):
            mid = m.get("id")
            if mid and mid not in seen:
                movies.append(m)
                seen.add(mid)
        grouped[key] = movies
        
    # Merge pages
    p2 = grouped.pop("🔥 Popular 2", [])
    grouped["🔥 Popular"] = grouped.get("🔥 Popular", []) + p2
    
    # Remove empty tabs so UI doesn't show blank sections
    return {k: v for k, v in grouped.items() if v}

@st.cache_data(ttl=Config.TRENDING_TTL, show_spinner=False)
def fetch_trending() -> list:
    data = tmdb_get("trending/movie/week?")
    return data.get("results", [])[:10] if data else []

@st.cache_data(ttl=Config.TRENDING_TTL, show_spinner=False)
def fetch_telugu_movies() -> Dict[str, list]:
    return _fetch_regional("te", "🎭 Drama")

@st.cache_data(ttl=Config.TRENDING_TTL, show_spinner=False)
def fetch_hindi_movies() -> Dict[str, list]:
    return _fetch_regional("hi", "😂 Comedy")

# ── Recommendation Engine ─────────────────────────────────────────────────────

@st.cache_resource(show_spinner=False)
def load_data() -> Tuple[pd.DataFrame, np.ndarray]:
    """Loads CSV/JSON artifacts and calculates NLP cosine similarity cache."""
    try:
        with open("artifacts/movie_dict.json", "r", encoding="utf-8") as f:
            movies_dict = json.load(f)
        movies = pd.DataFrame(movies_dict).reset_index(drop=True)
        
        if not os.path.exists("artifacts/similarity.npy"):
            logger.info("Building similarity matrix...")
            cv = CountVectorizer(max_features=5000, stop_words="english")
            vectors = cv.fit_transform(movies["tags"]).toarray()
            similarity = cosine_similarity(vectors)
            np.save("artifacts/similarity.npy", similarity)
        else:
            similarity = np.load("artifacts/similarity.npy")
            
        return movies, similarity
    except Exception as e:
        logger.error(f"Data Load Error: {e}")
        return pd.DataFrame(), np.array([])

def recommend(movie_title: str, movies: pd.DataFrame, similarity: np.ndarray, top_n: int = 5) -> Tuple[list, list, list, list, list]:
    """Return top_n recommendations weighted by ML similarity × user ratings."""
    try:
        idx = movies[movies["title"] == movie_title].index[0]
    except (IndexError, KeyError):
        return [], [], [], [], []

    sims = similarity[idx].copy()
    sims[idx] = 0

    raw_ratings = pd.to_numeric(movies.get("vote_average", pd.Series(dtype=float)), errors="coerce").fillna(0).values
    max_r = raw_ratings.max() or 1.0
    norm_r = raw_ratings / max_r
    
    # 70% content similarity weight, 30% rating weight
    scores = 0.7 * sims + 0.3 * norm_r

    k = min(top_n, len(scores) - 1)
    if k <= 0:
        return [], [], [], [], []
        
    top_indices = np.argpartition(scores, -k)[-k:]
    top_indices = top_indices[np.argsort(scores[top_indices])[::-1]]

    movie_ids = [str(movies.iloc[i].movie_id) for i in top_indices]
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=top_n) as executor:
        details_list = list(executor.map(fetch_movie_details, movie_ids))

    names, years, ratings = [], [], []
    for i in top_indices:
        row = movies.iloc[i]
        names.append(str(row.get("title", "Unknown")))
        year_val = row.get("year", row.get("release_date", "N/A"))
        years.append(safe_year(year_val))
        ratings.append(safe_rating(row.get("vote_average", 0)))

    return names, years, ratings, movie_ids, details_list
