import pickle
import streamlit as st
import requests
import pandas as pd
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import concurrent.futures
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure requests session with minimal retries to fail fast
session = requests.Session()
retries = Retry(total=1, backoff_factor=0.1)
session.mount('https://', HTTPAdapter(max_retries=retries))


TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def tmdb_get(path):
    """Fetch a TMDB API path, trying proxy first then direct."""
    from urllib.parse import quote
    direct = f"https://api.themoviedb.org/3/{path}&api_key={TMDB_KEY}"
    # URL-encode the inner URL so codetabs proxy doesn't misparse the & symbols
    proxy = f"https://api.codetabs.com/v1/proxy?quest={quote(direct, safe='')}"

    # Try proxy first (works when TMDB is ISP-blocked)
    try:
        r = session.get(proxy, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data and not data.get('error'):
                return data
    except Exception:
        pass

    # Fallback: try direct
    try:
        r = session.get(direct, headers=HEADERS, timeout=5)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass

    return {}



def fetch_movie_details(movie_id):
    """Fetches poster, trailer, overview, and genres from TMDB API."""
    details = {
        'poster': "https://placehold.co/500x750/333/FFFFFF?text=No+Poster",
        'trailer': None,
        'overview': "No plot summary available.",
        'genres': ""
    }

    data = tmdb_get(f"movie/{movie_id}?language=en-US&append_to_response=videos")
    if not data:
        return details

    if data.get('poster_path'):
        details['poster'] = "https://media.themoviedb.org/t/p/w500" + data['poster_path']
    if data.get('overview'):
        overview = data['overview']
        details['overview'] = overview[:110] + '...' if len(overview) > 110 else overview
    if data.get('genres'):
        details['genres'] = " • ".join([g['name'] for g in data['genres'][:2]])
    if 'videos' in data and isinstance(data['videos'], dict):
        for video in data['videos'].get('results', []):
            if video.get('site') == 'YouTube' and video.get('type') == 'Trailer':
                details['trailer'] = f"https://www.youtube.com/watch?v={video['key']}"
                break

    return details


def fetch_trending():
    """Fetches the top 5 trending movies of the week from TMDB."""
    data = tmdb_get("trending/movie/week?")
    return data.get('results', [])[:5] if data else []



def safe_year(val):
    """Safely extract a 4-digit year string from any value."""
    try:
        s = str(val).strip()
        return s[:4] if len(s) >= 4 else s
    except Exception:
        return 'N/A'


def safe_rating(val):
    """Safely format a rating to one decimal place."""
    try:
        return f"{float(val):.1f}"
    except Exception:
        return 'N/A'


def recommend(movie):
    """Recommends 5 similar movies based on the selected movie."""
    try:
        index = movies[movies['title'] == movie].index[0]
    except (IndexError, KeyError):
        st.error("Movie not found in the dataset. Please select another one.")
        return [], [], [], [], []

    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])

    top_indices = [i[0] for i in distances[1:6]]
    movie_ids = [str(movies.iloc[idx].movie_id) for idx in top_indices]

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        details_list = list(executor.map(fetch_movie_details, movie_ids))

    names, years, ratings = [], [], []
    for idx in top_indices:
        row = movies.iloc[idx]
        names.append(row.get('title', 'Unknown') if hasattr(row, 'get') else str(row['title']))
        # year column may be named differently
        year_val = row.get('year', row.get('release_date', 'N/A')) if hasattr(row, 'get') else 'N/A'
        years.append(safe_year(year_val))
        rating_val = row.get('vote_average', 0) if hasattr(row, 'get') else 0
        ratings.append(safe_rating(rating_val))

    return names, years, ratings, movie_ids, details_list


# ─── PAGE CONFIG ──────────────────────────────────────────────────────────────
st.set_page_config(layout="wide", page_title="iBOMMA Rahul - Watch")

# ─── INTERNAL MOVIE PLAYER ROUTE ─────────────────────────────────────────────
if "watch" in st.query_params:
    movie_id = st.query_params.get("watch", "")
    movie_title = st.query_params.get("title", "Movie")

    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    header {{visibility: hidden;}} #MainMenu {{visibility: hidden;}} footer {{visibility: hidden;}}
    .stApp {{
        background: #050505;
        font-family: 'Outfit', sans-serif !important;
        min-height: 100vh;
    }}
    /* TOP NAVBAR */
    .p-navbar {{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 32px;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(229,9,20,0.2);
        margin-bottom: 0;
    }}
    .p-logo {{
        font-size: 1.6rem;
        font-weight: 800;
        color: #e50914;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 20px rgba(229,9,20,0.6);
    }}
    .p-back {{
        color: #aaa !important;
        text-decoration: none !important;
        font-size: 13px;
        border: 1px solid rgba(255,255,255,0.15);
        padding: 7px 18px;
        border-radius: 20px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 6px;
    }}
    .p-back:hover {{ color: #fff !important; border-color: #e50914; background: rgba(229,9,20,0.1); }}
    /* MOVIE TITLE STRIP */
    .p-title-strip {{
        background: linear-gradient(135deg, #1a0000 0%, #0d0d0d 50%, #1a0000 100%);
        padding: 22px 32px;
        border-bottom: 1px solid rgba(229,9,20,0.15);
        display: flex;
        align-items: center;
        gap: 16px;
    }}
    .p-play-icon {{
        width: 44px;
        height: 44px;
        background: #e50914;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 0 20px rgba(229,9,20,0.5);
        flex-shrink: 0;
    }}
    .p-movie-name {{
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }}
    .p-movie-name span {{ color: #e50914; }}
    /* SERVER BAR */
    .p-srv-bar {{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 32px;
        background: rgba(255,255,255,0.02);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        flex-wrap: wrap;
    }}
    .p-srv-label {{
        color: #666;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-right: 4px;
    }}
    .srv-btn {{
        padding: 7px 20px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #ccc !important;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none !important;
        transition: all 0.25s;
        font-family: 'Outfit', sans-serif;
    }}
    .srv-btn:hover {{
        background: rgba(229,9,20,0.15);
        border-color: rgba(229,9,20,0.5);
        color: #fff !important;
    }}
    .srv-btn.active {{
        background: #e50914;
        border-color: #e50914;
        color: #fff !important;
        box-shadow: 0 4px 15px rgba(229,9,20,0.4);
    }}
    /* PLAYER */
    .p-cinema {{
        width: 100%;
        max-width: 1280px;
        margin: 24px auto;
        padding: 0 24px;
    }}
    .p-player-wrap {{
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 0 80px rgba(229,9,20,0.15), 0 30px 60px rgba(0,0,0,0.8);
        border: 1px solid rgba(229,9,20,0.2);
        background: #000;
    }}
    .p-player-wrap::before {{
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 15px;
        background: linear-gradient(135deg, rgba(229,9,20,0.3), transparent 40%, transparent 60%, rgba(229,9,20,0.1));
        z-index: 0;
        pointer-events: none;
    }}
    #player-frame {{
        width: 100%;
        height: 680px;
        border: none;
        display: block;
        position: relative;
        z-index: 1;
    }}
    .p-footer {{
        text-align: center;
        padding: 20px;
        color: #444;
        font-size: 12px;
    }}
    .p-footer span {{ color: #e50914; }}
    </style>

    <div class="p-navbar">
        <div class="p-logo">iBOMMA RAHUL</div>
        <a class="p-back" href="/">← Back to Home</a>
    </div>

    <div class="p-title-strip">
        <div class="p-play-icon">▶</div>
        <div class="p-movie-name">Now Playing: <span>{movie_title}</span></div>
    </div>

    <div class="p-srv-bar">
        <span class="p-srv-label">Switch Server:</span>
        <a class="srv-btn active" onclick="loadSrc('https://moviesapi.club/movie/{movie_id}', this)" href="#">⚡ Server 1</a>
        <a class="srv-btn" onclick="loadSrc('https://www.2embed.cc/embed/{movie_id}', this)" href="#">⚡ Server 2</a>
        <a class="srv-btn" onclick="loadSrc('https://vidsrc.rip/embed/movie/{movie_id}', this)" href="#">⚡ Server 3</a>
        <a class="srv-btn" onclick="loadSrc('https://multiembed.mov/?video_id={movie_id}&tmdb=1', this)" href="#">⚡ Server 4</a>
    </div>

    <div class="p-cinema">
        <div class="p-player-wrap">
            <iframe id="player-frame"
                src="https://moviesapi.club/movie/{movie_id}"
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture">
            </iframe>
        </div>
    </div>

    <div class="p-footer">Powered by <span>iBOMMA RAHUL</span> &nbsp;•&nbsp; If the player is blank, switch to another server above.</div>

    <script>
    function loadSrc(url, btn) {{
        document.getElementById('player-frame').src = url;
        document.querySelectorAll('.srv-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        event.preventDefault();
    }}
    </script>
    """, unsafe_allow_html=True)
    st.stop()


# ─── CSS ──────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

header {visibility: hidden;}
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}

/* ── ANIMATED BACKGROUND ── */
@keyframes bgShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.stApp {
    background: linear-gradient(135deg, #0d0000 0%, #1a0000 20%, #0a0a0a 50%, #000814 80%, #050005 100%);
    background-size: 400% 400%;
    animation: bgShift 12s ease infinite;
    color: #e5e5e5;
    font-family: 'Outfit', sans-serif !important;
}

/* ── GLOWING NAVBAR ── */
.main-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 40px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(229,9,20,0.25);
    margin-bottom: 10px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
}
.nav-logo {
    font-size: 2.2rem;
    font-weight: 800;
    background: linear-gradient(90deg, #ff2233, #e50914, #ff6666);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    letter-spacing: 4px;
    filter: drop-shadow(0 0 12px rgba(229,9,20,0.7));
}
.nav-tagline {
    font-size: 0.75rem;
    color: #666;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-align: center;
    margin-top: 2px;
}

/* ── HERO AREA ── */
.hero-title {
    font-family: 'Outfit', sans-serif;
    background: linear-gradient(90deg, #ff2233, #e50914, #ff6666, #e50914);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    font-size: 4rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-top: 0.5rem;
    margin-bottom: 0.3rem;
}
@keyframes shimmer {
    to { background-position: 200% center; }
}
.hero-subtitle {
    text-align: center;
    color: #666;
    font-size: 1rem;
    margin-bottom: 2.5rem;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
}

/* ── SEARCH AREA ── */
.stSelectbox label {
    color: #aaa !important;
    font-size: 0.85rem;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 1px;
}
div[data-baseweb="select"] > div {
    background-color: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    border-radius: 10px;
    transition: all 0.3s;
}
div[data-baseweb="select"] > div:hover {
    border-color: #e50914;
    box-shadow: 0 0 20px rgba(229,9,20,0.15);
}

/* ── RECOMMEND BUTTON ── */
.stButton { display: flex; justify-content: center; margin-top: 20px; }
.stButton>button {
    background: linear-gradient(90deg, #e50914, #ff2233, #b8000b) !important;
    background-size: 200% auto !important;
    color: white !important;
    border: none !important;
    padding: 13px 50px !important;
    border-radius: 50px !important;
    font-weight: 700 !important;
    font-size: 1.1rem !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    box-shadow: 0 6px 25px rgba(229,9,20,0.5) !important;
    transition: all 0.4s ease !important;
    animation: shimmer 3s linear infinite !important;
}
.stButton>button:hover {
    transform: scale(1.07) translateY(-3px) !important;
    box-shadow: 0 12px 35px rgba(229,9,20,0.7) !important;
}

/* ── MOVIE ROW ── */
.movie-row {
    display: flex;
    gap: 24px;
    padding: 20px 20px 60px;
    flex-wrap: wrap;
    justify-content: center;
}

/* ── CARD ANIMATION ── */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── MOVIE CARD ── */
.movie-card {
    flex: 0 0 auto;
    width: 220px;
    background: rgba(18, 18, 18, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    cursor: pointer;
    opacity: 0;
    transform: translateY(40px);
    animation: fadeInUp 0.7s ease forwards;
    display: flex;
    flex-direction: column;
    position: relative;
}
.movie-card:nth-child(1) { animation-delay: 0.05s; }
.movie-card:nth-child(2) { animation-delay: 0.15s; }
.movie-card:nth-child(3) { animation-delay: 0.25s; }
.movie-card:nth-child(4) { animation-delay: 0.35s; }
.movie-card:nth-child(5) { animation-delay: 0.45s; }
.movie-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(229,9,20,0.08), transparent);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
}
.movie-card:hover::after { opacity: 1; }
.movie-card:hover {
    transform: scale(1.07) translateY(-12px) !important;
    box-shadow: 0 25px 50px rgba(229,9,20,0.25), 0 10px 20px rgba(0,0,0,0.8);
    border-color: rgba(229,9,20,0.4);
    z-index: 10;
}

/* ── POSTER AREA WITH OVERLAY ── */
.poster-wrap {
    position: relative;
    overflow: hidden;
}
.movie-poster {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
}
.movie-card:hover .movie-poster { transform: scale(1.05); }
.poster-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
}

/* ── CARD INFO ── */
.movie-info {
    padding: 14px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    border-top: 1px solid rgba(255,255,255,0.05);
}
.movie-title {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 5px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.movie-meta {
    font-size: 11px;
    color: #777;
    margin-bottom: 7px;
    text-align: center;
}
.movie-genres {
    font-size: 10px;
    color: #e50914;
    text-align: center;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}
.movie-overview {
    font-size: 11px;
    color: #888;
    line-height: 1.4;
    margin-bottom: 15px;
    text-align: center;
    flex-grow: 1;
}
.rating-star { color: #e50914; font-weight: 800; }

.btn-group { display: flex; gap: 8px; margin-top: auto; }
.watch-btn, .trailer-btn {
    flex: 1;
    padding: 8px 4px;
    text-align: center;
    border-radius: 6px;
    text-decoration: none !important;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.3s ease;
}
.watch-btn {
    background: linear-gradient(90deg, #e50914 0%, #b8000b 100%);
    color: white !important;
    box-shadow: 0 4px 15px rgba(229,9,20,0.3);
}
.watch-btn:hover {
    background: linear-gradient(90deg, #f40612 0%, #e50914 100%);
    box-shadow: 0 6px 20px rgba(229,9,20,0.6);
}
.trailer-btn {
    background: rgba(255,255,255,0.1);
    color: white !important;
    border: 1px solid rgba(255,255,255,0.2);
}
.trailer-btn:hover {
    background: rgba(255,255,255,0.2);
    border-color: #fff;
}
.section-title {
    color: white;
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    font-size: 2.2rem;
    margin-top: 40px;
    margin-bottom: 10px;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="main-nav">
    <div>
        <div class="nav-logo">iBOMMA RAHUL</div>
        <div class="nav-tagline">Stream · Discover · Experience</div>
    </div>
</div>
<div class="hero-title">iBOMMA RAHUL</div>
<div class="hero-subtitle">Stream · Discover · Experience</div>
""", unsafe_allow_html=True)

# ─── LOAD DATA ────────────────────────────────────────────────────────────────
try:
    movies_dict = pickle.load(open('artifacts/movie_dict.pkl', 'rb'))
    movies = pd.DataFrame(movies_dict)

    if not os.path.exists('artifacts/similarity.pkl'):
        with st.spinner("Initializing AI Model... (First time only, please wait)"):
            cv = CountVectorizer(max_features=5000, stop_words='english')
            vectors = cv.fit_transform(movies['tags']).toarray()
            similarity = cosine_similarity(vectors)
            pickle.dump(similarity, open('artifacts/similarity.pkl', 'wb'))
    else:
        similarity = pickle.load(open('artifacts/similarity.pkl', 'rb'))

except FileNotFoundError:
    st.error("❌ Core dataset 'movie_dict.pkl' not found in the 'artifacts/' folder.")
    st.stop()
except Exception as e:
    st.error(f"❌ Failed to load data: {e}")
    st.stop()

# ─── MOVIE SELECTOR ───────────────────────────────────────────────────────────
movie_list = movies['title'].values
selected_movie = st.selectbox(
    "What's your favorite movie? Let's find similar ones:",
    movie_list
)


# ─── RENDER CARDS ─────────────────────────────────────────────────────────────
import html as _html

def escape(text):
    """Safely escape text for use inside HTML attributes and content."""
    return _html.escape(str(text), quote=True)

def render_movie_cards(titles, years, ratings, ids, details_list):
    cards_html = ""
    for i in range(len(titles)):
        year    = years[i] if years[i] else 'N/A'
        rating  = ratings[i] if ratings[i] else 'N/A'
        movie_id = str(ids[i])
        d = details_list[i] if details_list[i] else {
            'poster': "https://placehold.co/500x750/333/FFFFFF?text=No+Poster",
            'trailer': None, 'overview': '', 'genres': ''
        }

        title_esc    = escape(titles[i])
        overview_esc = escape(d.get("overview", ""))
        genres_esc   = escape(d.get("genres", ""))
        poster_url   = escape(d.get("poster", ""))
        from urllib.parse import quote as _q
        watch_url = f"/?watch={movie_id}&title={_q(titles[i])}"
        trailer_html = (
            f'<a href="{escape(d["trailer"])}" target="_blank" class="trailer-btn">🎬 Trailer</a>'
            if d.get("trailer") else ''
        )

        cards_html += (
            f'<div class="movie-card">'
            f'<div class="poster-wrap">'
            f'<img src="{poster_url}" class="movie-poster" alt="{title_esc}" '
            f'onerror="this.src=\'https://placehold.co/500x750/111/FFFFFF?text=No+Poster\'">'
            f'<div class="poster-overlay"></div>'
            f'</div>'
            f'<div class="movie-info">'
            f'<div class="movie-title" title="{title_esc}">{title_esc}</div>'
            f'<div class="movie-meta">{year} &nbsp;•&nbsp; <span class="rating-star">{rating} ⭐</span></div>'
            f'<div class="movie-genres">{genres_esc}</div>'
            f'<div class="movie-overview">{overview_esc}</div>'
            f'<div class="btn-group">'
            f'<a href="{watch_url}" target="_self" class="watch-btn">▶ Watch</a>'
            f'{trailer_html}'
            f'</div></div></div>'
        )

    st.markdown(f'<div class="movie-row">{cards_html}</div>', unsafe_allow_html=True)



# ─── MAIN LOGIC ───────────────────────────────────────────────────────────────
if st.button('🎬 Show Recommendations'):
    with st.spinner('Curating recommendations...'):
        r_names, r_years, r_ratings, r_ids, r_details = recommend(selected_movie)

    if r_names:
        st.markdown("<div class='section-title'>🎯 Top Picks For You</div>", unsafe_allow_html=True)
        render_movie_cards(r_names, r_years, r_ratings, r_ids, r_details)
    else:
        st.warning("No recommendations found. Try another movie!")
else:
    # On load, show Trending movies
    with st.spinner('Loading Trending Movies...'):
        trending = fetch_trending()
        if trending:
            t_ids = [str(m['id']) for m in trending]
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                t_details = list(executor.map(fetch_movie_details, t_ids))

            t_names = [m.get('title', 'Unknown') for m in trending]
            t_years = [safe_year(m.get('release_date', '')) for m in trending]
            t_ratings = [safe_rating(m.get('vote_average', 0)) for m in trending]

            st.markdown("<div class='section-title'>🔥 Trending This Week</div>", unsafe_allow_html=True)
            render_movie_cards(t_names, t_years, t_ratings, t_ids, t_details)
        else:
            st.info("Could not load trending movies. Please check your internet connection.")
