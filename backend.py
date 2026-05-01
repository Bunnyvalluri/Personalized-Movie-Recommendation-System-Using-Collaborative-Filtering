"""Shared backend — imported by all pages."""
import requests, os, time, threading, concurrent.futures
import pandas as pd, numpy as np
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import streamlit as st

# ── HTTP Session ──────────────────────────────────────────────────────────────
_adapter = HTTPAdapter(
    max_retries=Retry(total=2, backoff_factor=0.3,
                      status_forcelist=[429,500,502,503,504],
                      allowed_methods=["GET"], raise_on_status=False),
    pool_connections=10, pool_maxsize=20, pool_block=False,
)
session = requests.Session()
session.mount("https://", _adapter)
session.mount("http://",  _adapter)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
}

# ── L1 In-process Cache ───────────────────────────────────────────────────────
_L1: dict = {}
_L1_LOCK  = threading.Lock()
_L1_TTL   = 3600
TMDB_CACHE_TTL = 3600
TRENDING_TTL   = 1800

def _l1_get(key):
    with _L1_LOCK:
        e = _L1.get(key)
        if e and (time.time() - e["ts"]) < _L1_TTL:
            return e["val"]
    return None

def _l1_set(key, val):
    with _L1_LOCK:
        _L1[key] = {"val": val, "ts": time.time()}
        if len(_L1) > 2000:
            for k in sorted(_L1, key=lambda k: _L1[k]["ts"])[:200]:
                del _L1[k]

# ── Circuit Breaker ───────────────────────────────────────────────────────────
class CircuitBreaker:
    THRESHOLD, COOLDOWN = 3, 60
    def __init__(self):
        self._state, self._lock = {}, threading.Lock()
    def is_open(self, ep):
        with self._lock:
            s = self._state.get(ep)
            if not s: return False
            if s["fails"] >= self.THRESHOLD:
                if time.time() - s["opened_at"] < self.COOLDOWN: return True
                s["fails"] = 0
            return False
    def record_failure(self, ep):
        with self._lock:
            s = self._state.setdefault(ep, {"fails":0,"opened_at":0})
            s["fails"] += 1; s["opened_at"] = time.time()
    def record_success(self, ep):
        with self._lock: self._state.pop(ep, None)

_cb = CircuitBreaker()

# ── Request Deduplication ─────────────────────────────────────────────────────
_IN_FLIGHT: dict = {}
_IN_FLIGHT_LOCK  = threading.Lock()

def _dedup_get(key, fetch_fn):
    cached = _l1_get(key)
    if cached is not None: return cached
    with _IN_FLIGHT_LOCK:
        if key not in _IN_FLIGHT:
            _IN_FLIGHT[key] = threading.Event(); leader = True
        else:
            event = _IN_FLIGHT[key]; leader = False
    if leader:
        try:
            result = fetch_fn()
            if result: _l1_set(key, result)
            return result
        finally:
            with _IN_FLIGHT_LOCK: ev = _IN_FLIGHT.pop(key, None)
            if ev: ev.set()
    else:
        event.wait(timeout=8); return _l1_get(key) or {}

# ── API Key ───────────────────────────────────────────────────────────────────
try:    TMDB_KEY = st.secrets["TMDB_KEY"]
except: TMDB_KEY = os.environ.get("TMDB_KEY", "8265bd1679663a7ea12ac168da84d2e8")

# ── Core API Call ─────────────────────────────────────────────────────────────
def tmdb_get(path: str) -> dict:
    from urllib.parse import quote
    def _fetch():
        mirror = f"https://api.tmdb.org/3/{path}&api_key={TMDB_KEY}"
        direct = f"https://api.themoviedb.org/3/{path}&api_key={TMDB_KEY}"
        proxy  = f"https://api.codetabs.com/v1/proxy?quest={quote(direct,safe='')}"
        for label, url, timeout in [("mirror",mirror,4),("direct",direct,4),("proxy",proxy,7)]:
            if _cb.is_open(label): continue
            try:
                r = session.get(url, headers=HEADERS, timeout=timeout)
                if r.status_code == 200:
                    data = r.json()
                    if data and not data.get("error"):
                        _cb.record_success(label); return data
                _cb.record_failure(label)
            except: _cb.record_failure(label)
        return {}
    return _dedup_get(path, _fetch)

# ── Movie Details ─────────────────────────────────────────────────────────────
@st.cache_data(ttl=TMDB_CACHE_TTL, show_spinner=False)
def fetch_movie_details(movie_id: str) -> dict:
    details = {"poster":None,"trailer":None,"overview":"No plot summary available.",
               "genres":"","title":"","year":"","runtime":"","rating":""}
    data = tmdb_get(f"movie/{movie_id}?language=en-US&append_to_response=videos")
    if not data:
        details["poster"] = "https://placehold.co/500x750/1a1a2e/e50914?text=No+Poster"
        return details
    details["title"]  = data.get("title","")
    details["year"]   = (data.get("release_date","") or "")[:4]
    details["rating"] = f"{data.get('vote_average',0):.1f}"
    rt = data.get("runtime") or 0
    if rt: details["runtime"] = f"{rt//60}h {rt%60}m"
    if data.get("poster_path"):
        details["poster"] = "https://media.themoviedb.org/t/p/w342" + data["poster_path"]
    if data.get("overview"):
        ov = data["overview"]; details["overview"] = ov[:110]+"..." if len(ov)>110 else ov
    if data.get("genres"):
        details["genres"] = " • ".join(g["name"] for g in data["genres"][:2])
    if isinstance(data.get("videos"), dict):
        for v in data["videos"].get("results",[]):
            if v.get("site")=="YouTube" and v.get("type")=="Trailer":
                details["trailer"] = f"https://www.youtube.com/watch?v={v['key']}"; break
    if not details["poster"] and details["title"]:
        from urllib.parse import quote as _q
        yr = f"&year={details['year']}" if details["year"] else ""
        sr = tmdb_get(f"search/movie?query={_q(details['title'])}&language=en-US{yr}&page=1")
        for hit in (sr.get("results") or [])[:5]:
            if hit.get("poster_path"):
                details["poster"] = "https://media.themoviedb.org/t/p/w342" + hit["poster_path"]
                if details["overview"]=="No plot summary available." and hit.get("overview"):
                    ov=hit["overview"]; details["overview"]=ov[:110]+"..." if len(ov)>110 else ov
                break
    if not details["poster"]:
        details["poster"] = "https://placehold.co/500x750/1a1a2e/e50914?text=No+Poster"
    return details

# ── Regional Fetch ────────────────────────────────────────────────────────────
def _fetch_regional(lang: str, genre_label: str) -> dict:
    genre_id = "18" if lang == "te" else "35"
    queries = {
        "🔥 Popular":     f"discover/movie?with_original_language={lang}&sort_by=popularity.desc&page=1",
        "🔥 Popular 2":   f"discover/movie?with_original_language={lang}&sort_by=popularity.desc&page=2",
        "⭐ Top Rated":   f"discover/movie?with_original_language={lang}&sort_by=vote_average.desc&vote_count.gte=300",
        "🆕 Latest":      f"discover/movie?with_original_language={lang}&sort_by=release_date.desc&primary_release_date.gte=2024-01-01&vote_count.gte=10",
        "🏆 Classics":    f"discover/movie?with_original_language={lang}&sort_by=vote_count.desc&primary_release_date.gte=2015-01-01&primary_release_date.lte=2023-12-31",
        "📼 Old Classics": f"discover/movie?with_original_language={lang}&sort_by=vote_count.desc&primary_release_date.lte=2014-12-31",
        "💥 Action":      f"discover/movie?with_original_language={lang}&with_genres=28&sort_by=popularity.desc&page=1",
        genre_label:      f"discover/movie?with_original_language={lang}&with_genres={genre_id}&sort_by=vote_average.desc&vote_count.gte=200",
    }
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        results = list(ex.map(tmdb_get, queries.values()))
    grouped, seen = {}, set()
    for key, data in zip(queries.keys(), results):
        movies = []
        for m in (data.get("results",[])[:20] if data else []):
            if m["id"] not in seen:
                title = m.get("title", "").lower()
                if "maa alludu very good" in title:
                    continue
                movies.append(m)
                seen.add(m["id"])
        grouped[key] = movies
    p2 = grouped.pop("🔥 Popular 2", [])
    grouped["🔥 Popular"] = grouped.get("🔥 Popular",[]) + p2
    return grouped

@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_trending():
    data = tmdb_get("trending/movie/week?")
    return data.get("results",[])[:10] if data else []

@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_telugu_movies():
    return _fetch_regional("te","🎭 Drama")

@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_hindi_movies():
    return _fetch_regional("hi","😂 Comedy")

# ── Pre-warmer ────────────────────────────────────────────────────────────────
def _prewarm(movie_list: list):
    def _w():
        ids = [str(m["id"]) for m in movie_list]
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
            list(ex.map(fetch_movie_details, ids))
    threading.Thread(target=_w, daemon=True).start()

# ── Helpers ───────────────────────────────────────────────────────────────────
def safe_year(val):
    try: s=str(val).strip(); return s[:4] if len(s)>=4 else s
    except: return "N/A"

def safe_rating(val):
    try: return f"{float(val):.1f}"
    except: return "N/A"

@st.cache_data(ttl=86400, show_spinner=False)
def get_genre_map() -> dict:
    data = tmdb_get("genre/movie/list?language=en-US")
    return {g["id"]: g["name"] for g in (data.get("genres",[]) if data else [])}

def details_from_discover(movie: dict, gmap: dict = None) -> dict:
    if gmap is None: gmap = get_genre_map()
    poster = movie.get("poster_path")
    title = movie.get("title","")
    year = (movie.get("release_date","") or "")[:4]
    
    genres = " • ".join(gmap.get(gid,"") for gid in (movie.get("genre_ids") or [])[:2] if gmap.get(gid))
    ov = movie.get("overview","") or ""
    return {
        "poster":   f"https://media.themoviedb.org/t/p/w342{poster}" if poster
                    else "https://placehold.co/500x750/1a1a2e/e50914?text=No+Poster",
        "trailer":  None, "genres": genres, "title": title,
        "year":     year,
        "overview": (ov[:110]+"...") if len(ov)>110 else ov,
        "runtime":  "", "rating": f"{movie.get('vote_average',0):.1f}",
    }

def recommend(movie: str, movies, similarity, top_n: int = 5):
    """Return top_n recommendations weighted by similarity × rating."""
    try:
        idx = movies[movies["title"] == movie].index[0]
    except (IndexError, KeyError):
        return [], [], [], [], []

    sims = similarity[idx].copy()
    sims[idx] = 0

    raw_ratings = pd.to_numeric(movies.get("vote_average", pd.Series(dtype=float)), errors="coerce").fillna(0).values
    max_r = raw_ratings.max() or 1.0
    norm_r = raw_ratings / max_r
    scores = 0.7 * sims + 0.3 * norm_r

    k = min(top_n, len(scores) - 1)
    top_indices = np.argpartition(scores, -k)[-k:]
    top_indices = top_indices[np.argsort(scores[top_indices])[::-1]]

    movie_ids = [str(movies.iloc[i].movie_id) for i in top_indices]
    with concurrent.futures.ThreadPoolExecutor(max_workers=top_n) as executor:
        details_list = list(executor.map(fetch_movie_details, movie_ids))

    names, years, ratings = [], [], []
    for i in top_indices:
        row = movies.iloc[i]
        names.append(str(row.get("title","Unknown") if hasattr(row,"get") else row["title"]))
        year_val = row.get("year", row.get("release_date","N/A")) if hasattr(row,"get") else "N/A"
        years.append(safe_year(year_val))
        ratings.append(safe_rating(row.get("vote_average",0) if hasattr(row,"get") else 0))

    return names, years, ratings, movie_ids, details_list

@st.cache_resource(show_spinner=False)
def load_data():
    import json
    with open("artifacts/movie_dict.json","r") as f:
        movies_dict = json.load(f)
    movies = pd.DataFrame(movies_dict).reset_index(drop=True)
    if not os.path.exists("artifacts/similarity.npy"):
        cv = CountVectorizer(max_features=5000, stop_words="english")
        vectors = cv.fit_transform(movies["tags"]).toarray()
        similarity = cosine_similarity(vectors)
        np.save("artifacts/similarity.npy", similarity)
    else:
        similarity = np.load("artifacts/similarity.npy")
    return movies, similarity
