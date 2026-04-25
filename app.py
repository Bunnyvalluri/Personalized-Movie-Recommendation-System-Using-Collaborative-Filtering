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

# ─── SPEED: cache all TMDB calls so repeat visits are instant ────────────────
# fetch_movie_details is cached per movie_id for 1 hour
# fetch_trending is cached for 30 minutes
TMDB_CACHE_TTL   = 3600   # 1 hour for movie details
TRENDING_TTL     = 1800   # 30 minutes for trending list


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
        r = session.get(proxy, headers=HEADERS, timeout=6)  # was 10s – fail faster
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



@st.cache_data(ttl=TMDB_CACHE_TTL, show_spinner=False)
def fetch_movie_details(movie_id):
    """Fetches poster, trailer, overview, and genres from TMDB API.
    Result is cached per movie_id for 1 hour — repeat visits are instant.
    """
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
        # w342 is ~40% smaller than w500 — loads faster at card size
        details['poster'] = "https://media.themoviedb.org/t/p/w342" + data['poster_path']
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


@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_trending():
    """Fetches the top 5 trending movies of the week. Cached for 30 minutes."""
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

    import streamlit.components.v1 as components
    
    # Hide Streamlit's default margins and navbar when watching a movie
    st.markdown("""
    <style>
    .stApp > header {display:none;}
    .block-container {padding: 0 !important; max-width: 100% !important;}
    iframe {border: none;}
    </style>
    """, unsafe_allow_html=True)

    player_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ background: #050505; font-family: 'Outfit', sans-serif !important; min-height: 100vh; color: #fff; margin: 0; overflow-x: hidden; }}
    @keyframes auroraPlayer {{
        0%   {{ background-position: 0% 50%; }}
        50%  {{ background-position: 100% 50%; }}
        100% {{ background-position: 0% 50%; }}
    }}
    body {{ 
        background: linear-gradient(125deg, #0a0010 0%, #130020 15%, #0d0000 30%, #000d1a 50%, #0a0010 65%, #1a0005 80%, #000010 100%);
        background-size: 400% 400%;
        animation: auroraPlayer 22s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        font-family: 'Outfit', sans-serif !important; 
        min-height: 100vh; color: #fff; margin: 0; overflow-x: hidden; 
    }}
    body::before {{
        content: ""; position: fixed; inset: 0;
        background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
        opacity: 0.04; pointer-events: none; z-index: 1;
    }}
    .p-navbar {{
        display: flex; align-items: center; justify-content: flex-start;
        gap: 20px; padding: 16px 32px; background: rgba(0,0,0,0.85);
        backdrop-filter: blur(25px); border-bottom: 1px solid rgba(229,9,20,0.3);
        position: sticky; top: 0; z-index: 9999;
    }}
    .p-logo {{ font-size: 1.6rem; font-weight: 800; color: #e50914;
        text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px rgba(229,9,20,0.6); }}
    .p-back {{
        color: #aaa !important; text-decoration: none !important; font-size: 13px;
        border: 1px solid rgba(255,255,255,0.15); padding: 7px 18px; border-radius: 20px;
        transition: all 0.3s;
    }}
    .p-back:hover {{ color: #fff !important; border-color: #e50914; background: rgba(229,9,20,0.1); }}
    .p-title-strip {{
        background: linear-gradient(135deg, #1a0000 0%, #0d0d0d 50%, #1a0000 100%);
        padding: 18px 32px; border-bottom: 1px solid rgba(229,9,20,0.12);
        display: flex; align-items: center; gap: 14px;
    }}
    .p-play-icon {{
        width: 40px; height: 40px; background: #e50914; border-radius: 50%;
        display: flex; align-items: center; justify-content: center; font-size: 16px;
        box-shadow: 0 0 18px rgba(229,9,20,0.5); flex-shrink: 0;
    }}
    .p-movie-name {{ font-size: 1.35rem; font-weight: 700; color: #fff; }}
    .p-movie-name span {{ color: #e50914; }}
    .p-srv-bar {{
        display: flex; align-items: center; gap: 10px; padding: 13px 32px;
        background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05);
        flex-wrap: wrap;
    }}
    .p-srv-label {{ color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 1px; margin-right: 4px; }}
    .srv-btn {{
        padding: 7px 18px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05); color: #ccc !important; cursor: pointer;
        font-size: 13px; font-weight: 600; text-decoration: none !important;
        transition: all 0.25s; font-family: 'Outfit', sans-serif;
    }}
    .srv-btn:hover {{ background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.5); color: #fff !important; }}
    .srv-btn.active {{ background: #e50914; border-color: #e50914; color: #fff !important;
        box-shadow: 0 4px 14px rgba(229,9,20,0.4); }}
    .p-cinema {{ width: 100%; max-width: 1280px; margin: 24px auto; padding: 0 24px; }}
    .p-player-wrap {{
        position: relative; border-radius: 14px; overflow: hidden;
        box-shadow: 0 0 80px rgba(229,9,20,0.15), 0 30px 60px rgba(0,0,0,0.8);
        border: 1px solid rgba(229,9,20,0.2); background: #000;
    }}
    #player-frame {{ width: 100%; height: 680px; border: none; display: block; }}
    /* Fullscreen */
    .p-player-wrap:fullscreen, .p-player-wrap:-webkit-full-screen,
    .p-player-wrap:-moz-full-screen, .p-player-wrap:-ms-fullscreen {{
        border-radius: 0 !important; border: none !important;
        max-width: 100vw !important; width: 100vw !important; height: 100vh !important;
    }}
    .p-player-wrap:fullscreen #player-frame,
    .p-player-wrap:-webkit-full-screen #player-frame,
    .p-player-wrap:-moz-full-screen #player-frame,
    .p-player-wrap:-ms-fullscreen #player-frame {{
        width: 100vw !important; height: 100vh !important;
    }}
    .fs-btn {{
        position: absolute; bottom: 14px; right: 14px; z-index: 20;
        width: 42px; height: 42px; background: rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,255,0.25); border-radius: 8px;
        color: #fff; cursor: pointer; display: flex; align-items: center;
        justify-content: center; transition: all 0.2s ease; backdrop-filter: blur(8px);
    }}
    .fs-btn:hover {{ background: #e50914; border-color: #e50914; transform: scale(1.1);
        box-shadow: 0 4px 18px rgba(229,9,20,0.55); }}
    .fs-btn svg {{ width: 20px; height: 20px; pointer-events: none; }}
    /* Loading overlay */
    .p-loading {{
        position: absolute; inset: 0; display: flex; flex-direction: column;
        align-items: center; justify-content: center; background: #000;
        z-index: 10; gap: 14px; transition: opacity 0.4s;
    }}
    .p-loading.hidden {{ opacity: 0; pointer-events: none; }}
    .p-spinner {{
        width: 46px; height: 46px;
        border: 3px solid rgba(229,9,20,0.2); border-top-color: #e50914;
        border-radius: 50%; animation: spin 0.8s linear infinite;
    }}
    @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
    .p-loading-text {{ color: #777; font-size: 13px; }}
    /* Cinema unavailable banner */
    .p-unavail {{
        display: none; flex-direction: column; align-items: center;
        justify-content: center; gap: 16px; padding: 50px 30px;
        background: rgba(10,10,16,0.97); position: absolute; inset: 0;
        z-index: 25; text-align: center; border-radius: 14px;
    }}
    .p-unavail.show {{ display: flex; }}
    .p-unavail-icon {{ font-size: 3.2rem; }}
    .p-unavail-title {{ font-size: 1.25rem; font-weight: 800; color: #fff; }}
    .p-unavail-sub {{ font-size: 13px; color: #666; max-width: 360px; line-height: 1.6; }}
    .p-unavail-links {{ display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }}
    .p-unavail-link {{
        padding: 10px 22px; border-radius: 8px; text-decoration: none !important;
        font-weight: 700; font-size: 13px; transition: all 0.25s;
    }}
    .p-unavail-link.red {{ background: linear-gradient(135deg,#e50914,#b8000b);
        color:#fff !important; box-shadow:0 4px 16px rgba(229,9,20,0.4); }}
    .p-unavail-link.red:hover {{ transform:translateY(-2px); box-shadow:0 8px 24px rgba(229,9,20,0.6); }}
    .p-unavail-link.grey {{ background:rgba(255,255,255,0.07); color:#ccc !important;
        border:1px solid rgba(255,255,255,0.14); }}
    .p-unavail-link.grey:hover {{ background:rgba(255,255,255,0.14); color:#fff !important; }}
    .p-retry {{ background:none; border:none; color:#555; font-size:12px; cursor:pointer;
        text-decoration:underline; font-family:'Outfit',sans-serif; margin-top:4px; }}
    .p-retry:hover {{ color:#aaa; }}
    .p-footer {{ text-align:center; padding:30px; color:#555; font-size:12px; font-weight: 600; letter-spacing: 1px;}}
    .p-footer span {{ color:#ff0040; opacity: 0.8;}}
    .p-footer kbd {{
        background:#1a1a1a; border:1px solid #2a2a2a; padding:1px 7px;
        border-radius:4px; color:#888; font-size:11px; font-family:monospace;
    }}
    @media (max-width:600px) {{
        .p-navbar {{ padding:12px 16px; }} .p-logo {{ font-size:1.2rem; }}
        .p-title-strip {{ padding:12px 16px; }} .p-movie-name {{ font-size:1rem; }}
        .p-srv-bar {{ padding:10px 16px; }} .p-cinema {{ padding:0 10px; }}
        #player-frame {{ height:220px; }}
    }}
    </style>
    </head>
    <body>

    <nav class="p-navbar">
        <!-- Back button moved to left to avoid Streamlit Cloud toolbar collision -->
        <a class="p-back" onclick="window.parent.location.href='/?home=1'">← Back to Home</a>
        <div class="p-logo">iBOMMA RAHUL</div>
    </nav>

    <div class="p-title-strip">
        <div class="p-play-icon">▶</div>
        <div class="p-movie-name">Now Playing: <span>{movie_title}</span></div>
    </div>

    <div class="p-srv-bar">
        <span class="p-srv-label">Switch Server:</span>
        <a class="srv-btn active" onclick="loadSrc('s1',this)" href="#">⚡ Server 1</a>
        <a class="srv-btn" onclick="loadSrc('s2',this)" href="#">⚡ Server 2</a>
        <a class="srv-btn" onclick="loadSrc('s3',this)" href="#">⚡ Server 3</a>
        <a class="srv-btn" onclick="loadSrc('s4',this)" href="#">⚡ Server 4</a>
        <a class="srv-btn" onclick="loadSrc('s5',this)" href="#">⚡ Server 5</a>
        <a class="srv-btn" onclick="loadSrc('s6',this)" href="#">⚡ Server 6</a>
    </div>

    <div class="p-cinema">
        <div class="p-player-wrap" id="pwrap">
            <div class="p-loading" id="pload">
                <div class="p-spinner"></div>
                <div class="p-loading-text">Connecting to server…</div>
            </div>
            <div class="p-unavail" id="punavail">
                <div class="p-unavail-icon">🎭</div>
                <div class="p-unavail-title">Not Available Yet</div>
                <div class="p-unavail-sub">
                    This movie may still be in theaters or not yet on any streaming server.
                    Try all 6 servers, or check back in a few weeks.
                </div>
                <div class="p-unavail-links">
                    <a id="yt-link" href="#" target="_blank" class="p-unavail-link red">▶ Watch Trailer</a>
                    <a id="jw-link" href="#" target="_blank" class="p-unavail-link grey">🔍 Find on JustWatch</a>
                </div>
                <button class="p-retry" onclick="retryAll()">↩ Try all servers again</button>
            </div>
            <iframe id="player-frame"
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"
                src="about:blank"
                onload="onLoad()">
            </iframe>
            <button class="fs-btn" id="fs-btn" onclick="goFullscreen()" title="Fullscreen (F)">
                <svg id="fs-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <svg id="fs-collapse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="10" y1="14" x2="3" y2="21"></line>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                </svg>
            </button>
        </div>
    </div>

    <div class="p-footer">Powered by ⚡ Premium Streaming Servers &nbsp;•&nbsp;
        Blank? Try another server &nbsp;•&nbsp;
        <kbd>F</kbd> Fullscreen &nbsp;•&nbsp; <kbd>Esc</kbd> Exit
    </div>

    <script>
    var mid = '{movie_id}';
    var mtitle = '{movie_title}';
    var servers = {{
        s1: 'https://moviesapi.club/movie/' + mid,
        s2: 'https://www.2embed.cc/embed/' + mid,
        s3: 'https://vidsrc.rip/embed/movie/' + mid,
        s4: 'https://multiembed.mov/?video_id=' + mid + '&tmdb=1',
        s5: 'https://embed.su/embed/movie/' + mid,
        s6: 'https://vidsrc.me/embed/movie?tmdb=' + mid
    }};

    var blankTimer = null;
    var realSrcLoaded = false;  // flag: ignore onload from about:blank

    function startTimer() {{
        clearTimeout(blankTimer);
        blankTimer = setTimeout(function() {{
            var ld = document.getElementById('pload');
            if (ld && !ld.classList.contains('hidden')) {{
                ld.classList.add('hidden');
                showUnavail();
            }}
        }}, 5000);  // 5 seconds — faster than 8s
    }}

    function showUnavail() {{
        document.getElementById('yt-link').href =
            'https://www.youtube.com/results?search_query=' + encodeURIComponent(mtitle + ' official trailer');
        document.getElementById('jw-link').href =
            'https://www.justwatch.com/in/search?q=' + encodeURIComponent(mtitle);
        document.getElementById('punavail').classList.add('show');
    }}

    function retryAll() {{
        document.getElementById('punavail').classList.remove('show');
        var keys = ['s1','s2','s3','s4','s5','s6'], i = 0;
        function tryNext() {{
            if (i >= keys.length) {{ showUnavail(); return; }}
            var ld = document.getElementById('pload');
            if (ld) ld.classList.remove('hidden');
            document.getElementById('player-frame').src = servers[keys[i++]];
            startTimer();
        }}
        tryNext();
    }}

    function onLoad() {{
        // Ignore the initial about:blank fire — only react to real src loads
        if (!realSrcLoaded) return;
        clearTimeout(blankTimer);
        var ld = document.getElementById('pload');
        if (ld) ld.classList.add('hidden');
    }}

    function loadSrc(key, btn) {{
        document.getElementById('punavail').classList.remove('show');
        var ld = document.getElementById('pload');
        if (ld) ld.classList.remove('hidden');
        document.getElementById('player-frame').src = servers[key];
        document.querySelectorAll('.srv-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        event.preventDefault();
        startTimer();
    }}

    function goFullscreen() {{
        var wrap = document.getElementById('pwrap');
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {{
            var req = wrap.requestFullscreen || wrap.webkitRequestFullscreen
                   || wrap.mozRequestFullScreen || wrap.msRequestFullscreen;
            if (req) req.call(wrap).catch(function(e) {{ console.warn(e); }});
        }} else {{
            var ex = document.exitFullscreen || document.webkitExitFullscreen
                  || document.mozCancelFullScreen || document.msExitFullscreen;
            if (ex) ex.call(document);
        }}
    }}

    ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
        .forEach(function(ev) {{
            document.addEventListener(ev, function() {{
                var on = !!(document.fullscreenElement || document.webkitFullscreenElement);
                document.getElementById('fs-expand').style.display  = on ? 'none' : '';
                document.getElementById('fs-collapse').style.display = on ? '' : 'none';
            }});
        }});

    document.addEventListener('keydown', function(e) {{
        if ((e.key==='f'||e.key==='F') && !e.ctrlKey && !e.metaKey && !e.altKey) goFullscreen();
    }});

    // Animated loading dots
    var dotEl = document.querySelector('.p-loading-text');
    if (dotEl) {{
        var dots = 0;
        setInterval(function() {{
            dots = (dots + 1) % 4;
            dotEl.textContent = 'Connecting to server' + '.'.repeat(dots);
        }}, 500);
    }}

    // Start loading server 1 after short delay
    setTimeout(function() {{
        realSrcLoaded = true;  // now onLoad should react
        document.getElementById('player-frame').src = servers.s1;
        startTimer();
    }}, 80);
    </script>
    </body>
    </html>
    """
    
    components.html(player_html, height=1200, scrolling=True)
    st.stop()






# ─── CSS ──────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');

header {visibility: hidden;}
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
.block-container { padding-top: 0 !important; max-width: 100% !important; }

/* ── AURORA BACKGROUND ── */
@keyframes aurora {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.stApp {
    background: linear-gradient(125deg,
        #0a0010 0%, #130020 15%, #0d0000 30%,
        #000d1a 50%, #0a0010 65%, #1a0005 80%, #000010 100%);
    background-size: 400% 400%;
    animation: aurora 22s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    color: #f0f0f0;
    font-family: 'Outfit', sans-serif !important;
    min-height: 100vh;
    position: relative;
}
.stApp::before {
    content: "";
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
}

/* ── GLOWING NAVBAR ── */
@keyframes shimmer { to { background-position: 200% center; } }

.main-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 60px;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(40px) saturate(180%);
    border-bottom: 1px solid rgba(229,9,20,0.3);
    box-shadow: 0 10px 50px rgba(0,0,0,0.8);
    position: sticky;
    top: 0;
    z-index: 9999;
    margin-bottom: 40px;
}
.nav-logo {
    font-size: 2.2rem;
    font-weight: 900;
    background: linear-gradient(90deg, #ff4d5e, #e50914, #ffb3b9, #e50914);
    background-size: 200% auto;
    animation: shimmer 4s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
    letter-spacing: 7px;
    filter: drop-shadow(0 0 20px rgba(229,9,20,0.6));
}
.nav-right {
    display: flex;
    align-items: center;
    gap: 24px;
}
.nav-tagline {
    font-size: 0.75rem;
    color: #888;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
}
.nav-badge {
    background: linear-gradient(135deg,#e50914,#9e0009);
    color:#fff;
    font-size:11px;
    font-weight:800;
    padding:4px 14px;
    border-radius:30px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    box-shadow: 0 0 20px rgba(229,9,20,0.4);
    border: 1px solid rgba(255,255,255,0.1);
}

/* ── HERO REMOVED – replaced by navbar ── */
@keyframes shimmer2 { to { background-position: 200% center; } }

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
.stButton { display: flex; justify-content: center; margin: 40px 0; }
.stButton>button {
    background: linear-gradient(90deg, #e50914, #ff2233, #8a0006) !important;
    background-size: 200% auto !important;
    color: white !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    padding: 16px 60px !important;
    border-radius: 60px !important;
    font-weight: 800 !important;
    font-size: 1.2rem !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    box-shadow: 0 10px 30px rgba(229,9,20,0.5) !important;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    animation: shimmer 3s linear infinite !important;
}
.stButton>button:hover {
    transform: scale(1.08) translateY(-5px) !important;
    box-shadow: 0 20px 45px rgba(229,9,20,0.8) !important;
    letter-spacing: 3px !important;
}

/* ── MOVIE ROW ── */
.movie-row {
    display: flex;
    gap: 20px;
    padding: 10px 32px 60px;
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
    width: 260px;
    background: rgba(14,14,20,0.92);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
    box-shadow: 0 12px 50px rgba(0,0,0,0.8);
    cursor: pointer;
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
    display: flex;
    flex-direction: column;
    position: relative;
}
.movie-card:nth-child(1) { animation-delay: 0.05s; }
.movie-card:nth-child(2) { animation-delay: 0.12s; }
.movie-card:nth-child(3) { animation-delay: 0.19s; }
.movie-card:nth-child(4) { animation-delay: 0.26s; }
.movie-card:nth-child(5) { animation-delay: 0.33s; }
.movie-card:hover {
    transform: scale(1.08) translateY(-18px) !important;
    box-shadow: 0 40px 80px rgba(229,9,20,0.35), 0 15px 40px rgba(0,0,0,1);
    border-color: rgba(229,9,20,0.8);
    z-index: 10;
}
.movie-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e50914, transparent);
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    pointer-events: none;
}
.movie-card:hover::before { opacity: 1; }

/* ── POSTER AREA WITH OVERLAY ── */
.poster-wrap {
    position: relative;
    overflow: hidden;
}
.movie-poster {
    width: 100%;
    height: 340px;
    object-fit: cover;
    display: block;
    transition: transform 0.55s ease;
}
.movie-card:hover .movie-poster { transform: scale(1.07); }
.poster-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 65%;
    background: linear-gradient(to top, rgba(10,10,16,0.98) 0%, rgba(10,10,16,0.4) 55%, transparent 100%);
}
.rating-badge {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(0,0,0,0.72);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(229,9,20,0.4);
    border-radius: 7px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    z-index: 3;
}

/* ── CARD INFO ── */
.movie-info {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.movie-title {
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.5px;
}
.movie-meta {
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
    text-align: center;
    font-weight: 600;
    letter-spacing: 1px;
}
.movie-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
    margin-bottom: 10px;
}
.genre-tag {
    font-size: 9px;
    color: #e50914;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border: 1px solid rgba(229,9,20,0.3);
    border-radius: 4px;
    padding: 2px 7px;
    background: rgba(229,9,20,0.06);
}
.movie-overview {
    font-size: 11.5px;
    color: #888;
    line-height: 1.6;
    margin-bottom: 18px;
    text-align: center;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.rating-star { color: #f5c518; font-weight: 800; }

.btn-group { display: flex; gap: 10px; margin-top: auto; }
.watch-btn, .trailer-btn {
    flex: 1;
    padding: 11px 8px;
    text-align: center;
    border-radius: 12px;
    text-decoration: none !important;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 0.8px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
.watch-btn {
    background: linear-gradient(135deg, #e50914 0%, #a30008 100%);
    color: white !important;
    box-shadow: 0 4px 15px rgba(229,9,20,0.3);
    border: 1px solid rgba(255,255,255,0.1);
}
.watch-btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 25px rgba(229,9,20,0.5);
    background: linear-gradient(135deg, #ff1a28 0%, #e50914 100%);
    color: white !important;
}
.trailer-btn {
    background: rgba(255,255,255,0.06);
    color: #ccc !important;
    border: 1px solid rgba(255,255,255,0.12);
}
.trailer-btn:hover {
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.3);
    color: #fff !important;
    transform: translateY(-3px) scale(1.02);
}
.section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin: 60px 0 30px;
    padding: 0 32px;
    text-shadow: 0 0 15px rgba(255,255,255,0.2);
}
.section-title::before, .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(229,9,20,0.5), transparent);
    max-width: 200px;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="main-nav">
    <div class="nav-logo">iBOMMA RAHUL</div>
    <div class="nav-right">
        <div class="nav-tagline">Stream · Discover · Experience</div>
        <div class="nav-badge">💎 Premium</div>
    </div>
</div>

<div style="text-align: center; padding: 40px 20px 20px;">
    <h1 style="font-size: 3.5rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; background: linear-gradient(135deg, #fff 0%, #888 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Find Your Next Favorite Movie
    </h1>
    <p style="font-size: 1.1rem; color: #666; max-width: 600px; margin: 0 auto 30px; line-height: 1.6;">
        Explore a curated collection of cinematic masterpieces. Powered by advanced collaborative filtering and real-time streaming servers.
    </p>
</div>
""", unsafe_allow_html=True)

# ─── LOAD DATA (cached – loads once per server session) ───────────────────────
@st.cache_resource(show_spinner=False)
def load_data():
    movies_dict = pickle.load(open('artifacts/movie_dict.pkl', 'rb'))
    movies = pd.DataFrame(movies_dict)

    if not os.path.exists('artifacts/similarity.pkl'):
        cv = CountVectorizer(max_features=5000, stop_words='english')
        vectors = cv.fit_transform(movies['tags']).toarray()
        similarity = cosine_similarity(vectors)
        pickle.dump(similarity, open('artifacts/similarity.pkl', 'wb'))
    else:
        similarity = pickle.load(open('artifacts/similarity.pkl', 'rb'))

    return movies, similarity

try:
    with st.spinner("Loading iBOMMA Rahul… ⚡"):
        movies, similarity = load_data()
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
        genres_raw   = d.get("genres", "")
        poster_url   = escape(d.get("poster", ""))
        from urllib.parse import quote as _q
        # Use internal Streamlit query-param route — works on Streamlit Cloud
        # (static file serving is unreliable on Cloud)
        watch_url = f"/?watch={movie_id}&title={_q(titles[i])}"
        trailer_html = (
            f'<a href="{escape(d["trailer"])}" target="_blank" class="trailer-btn">🎬 Trailer</a>'
            if d.get("trailer") else ''
        )

        # Build genre pills
        genre_pills = ""
        for g in genres_raw.split(" • "):
            if g.strip():
                genre_pills += f'<span class="genre-tag">{escape(g.strip())}</span>'

        cards_html += (
            f'<div class="movie-card">'
            f'<div class="poster-wrap">'
            f'<img src="{poster_url}" class="movie-poster" alt="{title_esc}" '
            f'onerror="this.src=\'https://placehold.co/500x750/111/FFFFFF?text=No+Poster\'">'
            f'<div class="poster-overlay"></div>'
            f'<div class="rating-badge">⭐ {rating}</div>'
            f'</div>'
            f'<div class="movie-info">'
            f'<div class="movie-title" title="{title_esc}">{title_esc}</div>'
            f'<div class="movie-meta">{year}</div>'
            f'<div class="movie-genres">{genre_pills}</div>'
            f'<div class="movie-overview">{overview_esc}</div>'
            f'<div class="btn-group">'
            f'<a href="{watch_url}" target="_blank" class="watch-btn">▶ Watch</a>'
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
    # On load, show Trending movies (cached after first load – instant on refresh)
    with st.spinner('⚡ Fetching trending movies…'):
        trending = fetch_trending()
        if trending:
            t_ids = [str(m['id']) for m in trending]
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                t_details = list(executor.map(fetch_movie_details, t_ids))

            t_names   = [m.get('title', 'Unknown') for m in trending]
            t_years   = [safe_year(m.get('release_date', '')) for m in trending]
            t_ratings = [safe_rating(m.get('vote_average', 0)) for m in trending]

            st.markdown("<div class='section-title'>🔥 Trending This Week</div>", unsafe_allow_html=True)
            render_movie_cards(t_names, t_years, t_ratings, t_ids, t_details)
        else:
            st.info("Could not load trending movies. Please check your internet connection.")

st.markdown("""
<div style="margin-top: 100px; padding: 60px 40px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
    <div style="font-size: 1.5rem; font-weight: 900; letter-spacing: 4px; color: #e50914; margin-bottom: 20px;">iBOMMA RAHUL</div>
    <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 30px;">
        <a href="#" style="color: #666; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;">Home</a>
        <a href="#" style="color: #666; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;">Movies</a>
        <a href="#" style="color: #666; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;">Trending</a>
        <a href="#" style="color: #666; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;">About</a>
    </div>
    <div style="color: #444; font-size: 0.8rem; letter-spacing: 1px;">
        © 2026 iBOMMA RAHUL. ALL RIGHTS RESERVED. <br>
        <span style="font-size: 0.7rem; margin-top: 10px; display: block;">BUILT WITH ❤️ FOR CINEMA LOVERS</span>
    </div>
</div>
""", unsafe_allow_html=True)
