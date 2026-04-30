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


# ─── SECURITY: Load API key securely ─────────────────────────────────────────
try:
    TMDB_KEY = st.secrets["TMDB_KEY"]
except (KeyError, FileNotFoundError):
    # Fallback to env var or hardcoded for demo purposes only
    TMDB_KEY = os.environ.get("TMDB_KEY", "8265bd1679663a7ea12ac168da84d2e8")

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def tmdb_get(path):
    """Fetch a TMDB API path, intelligently routing via direct or proxy."""
    from urllib.parse import quote
    mirror = f"https://api.tmdb.org/3/{path}&api_key={TMDB_KEY}"
    direct = f"https://api.themoviedb.org/3/{path}&api_key={TMDB_KEY}"
    proxy = f"https://api.codetabs.com/v1/proxy?quest={quote(direct, safe='')}"

    # 1. Try Mirror first (bypasses ISP blocks and connection throttling)
    try:
        r = session.get(mirror, headers=HEADERS, timeout=3.5)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass

    # 2. Try Direct
    try:
        r = session.get(direct, headers=HEADERS, timeout=3.5)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass

    # 3. Fallback to Proxy
    try:
        r = session.get(proxy, headers=HEADERS, timeout=6)
        if r.status_code == 200:
            data = r.json()
            if data and not data.get('error'):
                return data
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
    """Fetches the top 10 trending movies of the week. Cached for 30 minutes."""
    data = tmdb_get("trending/movie/week?")
    return data.get('results', [])[:10] if data else []

@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_telugu_movies():
    """Fetches the top 10 popular Telugu movies. Cached for 30 minutes."""
    data = tmdb_get("discover/movie?with_original_language=te&sort_by=popularity.desc")
    return data.get('results', [])[:10] if data else []

@st.cache_data(ttl=TRENDING_TTL, show_spinner=False)
def fetch_hindi_movies():
    """Fetches the top 10 popular Hindi movies. Cached for 30 minutes."""
    data = tmdb_get("discover/movie?with_original_language=hi&sort_by=popularity.desc")
    return data.get('results', [])[:10] if data else []



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

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
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
    import json, html
    movie_id_raw    = st.query_params.get("watch", "")
    movie_title_raw = st.query_params.get("title", "Movie")
    from_movie      = st.query_params.get("from", "")

    # Security: HTML escape and JSON serialize to prevent XSS
    movie_title_esc  = html.escape(movie_title_raw)
    movie_id_safe    = json.dumps(movie_id_raw)
    movie_title_safe = json.dumps(movie_title_raw)

    from urllib.parse import quote as _q
    # Back URL restores the recommendations page
    back_url = f"/?recs=1&movie={_q(from_movie)}" if from_movie else "/"

    # Hide Streamlit chrome
    st.markdown("""
    <style>
    .stApp > header {display:none !important;}
    .block-container {padding:0 !important; max-width:100% !important;}
    footer {display:none !important;}
    #MainMenu {display:none !important;}
    </style>
    """, unsafe_allow_html=True)

    import streamlit.components.v1 as components
    components.html(f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https:; frame-src https:;">
<title>iBOMMA RAHUL – {movie_title_esc}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
@keyframes ap {{ 0%{{background-position:0% 50%;}} 50%{{background-position:100% 50%;}} 100%{{background-position:0% 50%;}} }}
body {{
    background: linear-gradient(125deg, #0a0010 0%, #130020 15%, #0d0000 30%, #000d1a 50%, #0a0010 65%, #1a0005 80%, #000010 100%);
    background-size: 400% 400%; animation: ap 22s ease infinite;
    font-family: 'Outfit', sans-serif; color: #fff; margin: 0; overflow-x: hidden; min-height: 100vh;
}}
.p-navbar {{
    display:flex; align-items:center; gap:20px; padding:14px 28px;
    background:rgba(0,0,0,0.88); backdrop-filter:blur(25px);
    border-bottom:1px solid rgba(229,9,20,0.35); position:sticky; top:0; z-index:9999;
}}
.p-logo {{ font-size:1.5rem; font-weight:900; color:#e50914; text-transform:uppercase; letter-spacing:2px; text-shadow:0 0 20px rgba(229,9,20,0.6); }}
.p-back {{
    color:#aaa; font-size:13px; border:1px solid rgba(255,255,255,0.18); padding:7px 18px;
    border-radius:30px; cursor:pointer; background:none; font-family:'Outfit',sans-serif;
    font-weight:600; transition:all 0.3s;
}}
.p-back:hover {{ color:#fff; border-color:#e50914; background:rgba(229,9,20,0.12); }}
.p-strip {{ background:linear-gradient(135deg,#1a0000,#0d0d0d,#1a0000); padding:16px 28px; border-bottom:1px solid rgba(229,9,20,0.12); display:flex; align-items:center; gap:14px; }}
.p-icon {{ width:38px; height:38px; background:#e50914; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 0 18px rgba(229,9,20,0.5); flex-shrink:0; }}
.p-mname {{ font-size:1.2rem; font-weight:700; }}
.p-mname span {{ color:#e50914; }}
.p-srv {{ display:flex; align-items:center; gap:8px; padding:12px 28px; background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.06); flex-wrap:wrap; }}
.p-srv-label {{ color:#555; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-right:4px; }}
.srv-btn {{ padding:6px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); color:#bbb; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.25s; font-family:'Outfit',sans-serif; }}
.srv-btn:hover {{ background:rgba(229,9,20,0.15); border-color:rgba(229,9,20,0.5); color:#fff; }}
.srv-btn.active {{ background:linear-gradient(135deg,#e50914,#a30008); border-color:#e50914; color:#fff; box-shadow:0 4px 16px rgba(229,9,20,0.45); }}
.srv-status {{ margin-left:auto; font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; }}
.srv-status.trying {{ color:#f0a000; background:rgba(240,160,0,0.1); border:1px solid rgba(240,160,0,0.3); }}
.srv-status.live {{ color:#22c55e; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); }}
.srv-status.dead {{ color:#e50914; background:rgba(229,9,20,0.1); border:1px solid rgba(229,9,20,0.3); }}
.p-cinema {{ width:100%; max-width:1280px; margin:24px auto; padding:0 20px; }}
.p-wrap {{ position:relative; border-radius:14px; overflow:hidden; box-shadow:0 0 80px rgba(229,9,20,0.18),0 30px 70px rgba(0,0,0,0.9); border:1px solid rgba(229,9,20,0.22); background:#000; }}
#pf {{ width:100%; height:calc(100vh - 160px); min-height:500px; border:none; display:block; }}
.p-load {{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000; z-index:10; gap:14px; transition:opacity 0.4s; }}
.p-load.hidden {{ opacity:0; pointer-events:none; }}
.spinner {{ width:48px; height:48px; border:3px solid rgba(229,9,20,0.2); border-top-color:#e50914; border-radius:50%; animation:spin 0.8s linear infinite; }}
@keyframes spin {{ to {{ transform:rotate(360deg); }} }}
.p-lt {{ color:#666; font-size:13px; }}
.p-ls {{ color:#444; font-size:11px; }}
.p-unavail {{ display:none; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:50px 30px; background:rgba(8,8,14,0.98); position:absolute; inset:0; z-index:25; text-align:center; border-radius:14px; }}
.p-unavail.show {{ display:flex; }}
.p-unavail-icon {{ font-size:3rem; }}
.p-unavail-title {{ font-size:1.2rem; font-weight:800; }}
.p-unavail-sub {{ font-size:13px; color:#555; max-width:380px; line-height:1.7; }}
.p-unavail-links {{ display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }}
.pul {{ padding:10px 22px; border-radius:10px; text-decoration:none; font-weight:700; font-size:13px; transition:all 0.25s; }}
.pul.red {{ background:linear-gradient(135deg,#e50914,#b8000b); color:#fff; box-shadow:0 4px 18px rgba(229,9,20,0.4); }}
.pul.red:hover {{ transform:translateY(-2px); box-shadow:0 8px 28px rgba(229,9,20,0.65); }}
.pul.grey {{ background:rgba(255,255,255,0.07); color:#ccc; border:1px solid rgba(255,255,255,0.14); }}
.pul.grey:hover {{ background:rgba(255,255,255,0.14); color:#fff; }}
.p-retry {{ background:none; border:none; color:#444; font-size:12px; cursor:pointer; text-decoration:underline; font-family:'Outfit',sans-serif; }}
.fs-btn {{ position:absolute; bottom:14px; right:14px; z-index:20; width:40px; height:40px; background:rgba(0,0,0,0.75); border:1px solid rgba(255,255,255,0.22); border-radius:8px; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; backdrop-filter:blur(8px); }}
.fs-btn:hover {{ background:#e50914; border-color:#e50914; transform:scale(1.1); }}
.fs-btn svg {{ width:20px; height:20px; pointer-events:none; }}
.p-tips {{ margin:14px 20px 0; padding:12px 18px; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:10px; display:flex; gap:20px; flex-wrap:wrap; }}
.p-tip {{ font-size:11px; color:#555; }}
.p-tip strong {{ color:#777; }}
.p-footer {{ text-align:center; padding:24px; color:#444; font-size:12px; font-weight:600; letter-spacing:1px; }}
.p-footer kbd {{ background:#181818; border:1px solid #2a2a2a; padding:2px 8px; border-radius:5px; color:#777; font-size:11px; font-family:monospace; }}
@media (max-width:640px) {{ .p-navbar{{padding:10px 14px;}} .p-cinema{{padding:0 8px;}} #pf{{height:240px;}} .p-tips{{display:none;}} }}
</style>
</head>
<body>
<nav class="p-navbar">
    <a class="p-back" href="{back_url}" target="_top" style="text-decoration:none;">&#8592; Back to Results</a>
    <div class="p-logo">iBOMMA RAHUL</div>
</nav>
<div class="p-strip">
    <div class="p-icon">&#9654;</div>
    <div class="p-mname">Now Playing: <span id="mtitle">{movie_title_esc}</span></div>
</div>
<div class="p-srv">
    <span class="p-srv-label">Server:</span>
    <button class="srv-btn active" data-key="s1" onclick="loadSrc('s1',this)">&#9889; Server 1</button>
    <button class="srv-btn" data-key="s2" onclick="loadSrc('s2',this)">&#9889; Server 2</button>
    <button class="srv-btn" data-key="s3" onclick="loadSrc('s3',this)">&#9889; Server 3</button>
    <button class="srv-btn" data-key="s4" onclick="loadSrc('s4',this)">&#9889; Server 4</button>
    <button class="srv-btn" data-key="s5" onclick="loadSrc('s5',this)">&#9889; Server 5</button>
    <button class="srv-btn" data-key="s6" onclick="loadSrc('s6',this)">&#9889; Server 6</button>
    <span class="srv-status trying" id="st">Connecting...</span>
</div>
<div class="p-cinema">
    <div class="p-wrap" id="pw">
        <div class="p-load" id="pl">
            <div class="spinner"></div>
            <div class="p-lt" id="plt">Connecting to server...</div>
            <div class="p-ls" id="pls">Trying fastest server first</div>
        </div>
        <div class="p-unavail" id="pu">
            <div class="p-unavail-icon">&#127917;</div>
            <div class="p-unavail-title">Movie Not Available</div>
            <div class="p-unavail-sub">All servers failed. The movie may be in theaters, or try disabling your ad-blocker.</div>
            <div class="p-unavail-links">
                <a id="ytl" href="#" target="_blank" class="pul red">&#9654; Watch Trailer</a>
                <a id="jwl" href="#" target="_blank" class="pul grey">&#128269; Find on JustWatch</a>
            </div>
            <button class="p-retry" onclick="retryAll()">&#8617; Try all servers again</button>
        </div>
        <iframe id="pf" src="about:blank"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allowfullscreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"
            onload="onFL()"></iframe>
        <button class="fs-btn" onclick="goFS()" title="Fullscreen (F)">
            <svg id="fse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            <svg id="fsc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="10" y1="14" x2="3" y2="21"></line><line x1="21" y1="3" x2="14" y2="10"></line></svg>
        </button>
    </div>
    <div class="p-tips">
        <span class="p-tip">&#128161; <strong>Blank screen?</strong> Switch servers above</span>
        <span class="p-tip">&#128721; <strong>Ad-blocker?</strong> Try disabling for this page</span>
        <span class="p-tip"><kbd>F</kbd> Fullscreen &nbsp; <kbd>Esc</kbd> Exit</span>
    </div>
</div>
<div class="p-footer">iBOMMA RAHUL &nbsp;&bull;&nbsp; Premium Streaming &nbsp;&bull;&nbsp; 6 Servers</div>
<script>
var mid={movie_id_safe}, mtitle={movie_title_safe};
var srv={{
    s1:'https://vidlink.pro/movie/'+mid,
    s2:'https://vidsrc.cc/v2/embed/movie/'+mid,
    s3:'https://moviesapi.club/movie/'+mid,
    s4:'https://www.2embed.cc/embed/'+mid,
    s5:'https://vidsrc.rip/embed/movie/'+mid,
    s6:'https://embed.su/embed/movie/'+mid
}};
var srvN={{s1:'VidLink',s2:'VidSrc CC',s3:'MoviesAPI',s4:'2Embed',s5:'VidSrc RIP',s6:'Embed.su'}};
var ORD=['s1','s2','s3','s4','s5','s6'];
var timer=null, realLoad=false, curKey=null, autoCycle=true;
var stEl=document.getElementById('st');
var plEl=document.getElementById('pl');
var pltEl=document.getElementById('plt');
var plsEl=document.getElementById('pls');
function setStatus(cls,txt){{stEl.className='srv-status '+cls;stEl.textContent=txt;}}
function activateBtn(k){{document.querySelectorAll('.srv-btn').forEach(function(b){{b.classList.toggle('active',b.dataset.key===k);}});curKey=k;}}
function showLoad(k){{
    plEl.classList.remove('hidden');
    document.getElementById('pu').classList.remove('show');
    pltEl.textContent='Connecting to '+srvN[k]+'...';
    plsEl.textContent='Server '+(ORD.indexOf(k)+1)+' of 6';
    setStatus('trying','Trying '+srvN[k]+'...');
}}
function startTimer(k){{
    clearTimeout(timer);
    timer=setTimeout(function(){{
        if(plEl&&!plEl.classList.contains('hidden')){{
            var ni=ORD.indexOf(k)+1;
            if(ni<ORD.length&&autoCycle){{
                var nk=ORD[ni];
                activateBtn(nk); showLoad(nk);
                document.getElementById('pf').src=srv[nk];
                startTimer(nk);
            }}else{{plEl.classList.add('hidden');showUnavail();}}
        }}
    }},6000);
}}
function showUnavail(){{
    setStatus('dead','All servers failed');
    document.getElementById('ytl').href='https://www.youtube.com/results?search_query='+encodeURIComponent(mtitle+' official trailer');
    document.getElementById('jwl').href='https://www.justwatch.com/in/search?q='+encodeURIComponent(mtitle);
    document.getElementById('pu').classList.add('show');
}}
function onFL(){{
    if(!realLoad)return;
    clearTimeout(timer);
    plEl.classList.add('hidden');
    setStatus('live','&#127902; Live – '+srvN[curKey]);
}}
function loadSrc(k,btn){{
    autoCycle=false;
    activateBtn(k); showLoad(k);
    document.getElementById('pf').src=srv[k];
    startTimer(k);
}}
function retryAll(){{
    autoCycle=true;
    document.getElementById('pu').classList.remove('show');
    var k=ORD[0]; activateBtn(k); showLoad(k);
    document.getElementById('pf').src=srv[k];
    startTimer(k);
}}
function goFS(){{
    var w=document.getElementById('pw');
    if(!document.fullscreenElement&&!document.webkitFullscreenElement){{
        var r=w.requestFullscreen||w.webkitRequestFullscreen;
        if(r)r.call(w).catch(function(){{}});
    }}else{{
        var ex=document.exitFullscreen||document.webkitExitFullscreen;
        if(ex)ex.call(document);
    }}
}}
['fullscreenchange','webkitfullscreenchange'].forEach(function(ev){{
    document.addEventListener(ev,function(){{
        var on=!!(document.fullscreenElement||document.webkitFullscreenElement);
        document.getElementById('fse').style.display=on?'none':'';
        document.getElementById('fsc').style.display=on?'':'none';
    }});
}});
document.addEventListener('keydown',function(e){{if((e.key==='f'||e.key==='F')&&!e.ctrlKey&&!e.metaKey&&!e.altKey)goFS();}});
var dots=0;
setInterval(function(){{
    dots=(dots+1)%4;
    if(!plEl.classList.contains('hidden'))pltEl.textContent=pltEl.textContent.replace(/[.]+$/,'')+'.'.repeat(dots);
}},600);
setTimeout(function(){{
    realLoad=true;
    var k=ORD[0]; activateBtn(k); showLoad(k);
    document.getElementById('pf').src=srv[k];
    startTimer(k);
}},100);
</script>
</body>
</html>
    """, height=900, scrolling=True)
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
    background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ff4d5e 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
    letter-spacing: 5px;
    filter: drop-shadow(0 2px 10px rgba(255,255,255,0.1));
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

/* ── CUSTOM SCROLLBAR ── */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #0a0010; }
::-webkit-scrollbar-thumb { background: rgba(229,9,20,0.5); border-radius: 10px; border: 2px solid #0a0010; }
::-webkit-scrollbar-thumb:hover { background: rgba(229,9,20,0.8); }

/* ── CINEMATIC AMBIENT GLOW ── */
.stApp::after {
    content: "";
    position: fixed;
    top: -20vh;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
    height: 60vh;
    background: radial-gradient(ellipse at center, rgba(229,9,20,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

/* ── PREMIUM SEARCH BAR ── */
.stSelectbox {
    max-width: 800px;
    margin: 0 auto;
}
.stSelectbox label {
    color: #e0e0e0 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
}
div[data-baseweb="select"] > div {
    background: rgba(14,14,20,0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 16px;
    padding: 6px 16px;
    color: white;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.4);
    transition: all 0.3s ease;
}
div[data-baseweb="select"] > div:focus-within, div[data-baseweb="select"] > div:hover {
    border-color: rgba(229,9,20,0.8);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 25px rgba(229,9,20,0.25);
    background: rgba(20,20,28,0.95);
}

/* ── RECOMMEND BUTTON ── */
.stButton { display: flex; justify-content: center; margin: 40px 0; }
.stButton>button {
    background: linear-gradient(135deg, #e50914 0%, #a30008 100%) !important;
    color: white !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    padding: 16px 60px !important;
    border-radius: 60px !important;
    font-weight: 800 !important;
    font-size: 1.2rem !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    box-shadow: 0 8px 25px rgba(229,9,20,0.4), inset 0 1px 2px rgba(255,255,255,0.3) !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.stButton>button:hover {
    transform: scale(1.05) translateY(-3px) !important;
    box-shadow: 0 15px 35px rgba(229,9,20,0.6), inset 0 1px 2px rgba(255,255,255,0.4) !important;
    background: linear-gradient(135deg, #ff1a28 0%, #e50914 100%) !important;
    letter-spacing: 3px !important;
}

/* ── MOVIE ROW ── */
.movie-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 28px;
    padding: 10px 40px 60px;
    max-width: 1400px;
    margin: 0 auto;
}

/* ── CARD ANIMATION ── */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── MOVIE CARD ── */
.movie-card {
    background: rgba(14,14,20,0.7);
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    border: 1px solid rgba(255,255,255,0.08);
    border-top: 1px solid rgba(255,255,255,0.2);
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 12px 40px rgba(0,0,0,0.6);
    cursor: pointer;
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
}
.movie-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
    opacity: 0.2;
    pointer-events: none;
    z-index: 1;
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

@media (max-width: 768px) {
    .main-nav { padding: 15px 20px; margin-bottom: 20px; }
    .nav-tagline { display: none; }
    .nav-logo { font-size: 1.6rem; letter-spacing: 3px; }
    .movie-row { padding: 10px 20px 40px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
    .movie-poster { height: 260px; }
    .movie-title { font-size: 15px; }
    .btn-group { flex-direction: column; }
    .stButton>button { width: 100%; padding: 14px 20px !important; font-size: 1rem !important; }
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
    <h1 style="font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 4px 20px rgba(255,255,255,0.1));">
        Find Your Next Favorite Movie
    </h1>
    <p style="font-size: clamp(1rem, 2vw, 1.15rem); color: #888; max-width: 650px; margin: 0 auto 30px; line-height: 1.7; font-weight: 400;">
        Explore a curated collection of cinematic masterpieces. Powered by advanced collaborative filtering and real-time streaming servers.
    </p>
</div>
""", unsafe_allow_html=True)

# ─── LOAD DATA (cached – loads once per server session) ───────────────────────
@st.cache_resource(show_spinner=False)
def load_data():
    import json
    import numpy as np
    
    # 1. Load dictionary from JSON safely (mitigates Pickle vulnerabilities)
    with open('artifacts/movie_dict.json', 'r') as f:
        movies_dict = json.load(f)
    movies = pd.DataFrame(movies_dict).reset_index(drop=True)

    # 2. Load or compute similarity matrix safely
    if not os.path.exists('artifacts/similarity.npy'):
        cv = CountVectorizer(max_features=5000, stop_words='english')
        vectors = cv.fit_transform(movies['tags']).toarray()
        similarity = cosine_similarity(vectors)
        np.save('artifacts/similarity.npy', similarity)
    else:
        similarity = np.load('artifacts/similarity.npy')

    return movies, similarity

try:
    with st.spinner("Loading iBOMMA Rahul… ⚡"):
        movies, similarity = load_data()
except FileNotFoundError:
    st.error("❌ Core dataset 'movie_dict.json' not found in the 'artifacts/' folder.")
    st.stop()
except Exception as e:
    st.error(f"❌ Failed to load data: {e}")
    st.stop()

# ─── MOVIE SELECTOR ───────────────────────────────────────────────────────────
movie_list = list(movies['title'].values)
default_index = 0
if "movie" in st.query_params:
    try:
        default_index = movie_list.index(st.query_params["movie"])
    except ValueError:
        pass

selected_movie = st.selectbox(
    "What's your favorite movie? Let's find similar ones:",
    movie_list,
    index=default_index
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
        # GitHub Pages hosts the standalone player — serves HTML with correct content-type.
        # Streamlit Cloud cannot serve .html files as HTML (only text/plain).
        _gh_pages_base = "https://bunnyvalluri.github.io/Personalized-Movie-Recommendation-System-Using-Collaborative-Filtering"
        watch_url = f"{_gh_pages_base}/player.html?id={_q(movie_id)}&title={_q(titles[i])}&from={_q(selected_movie)}"
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
            f'<a href="{watch_url}" target="_blank" class="watch-btn">&#9654; Watch</a>'
            f'{trailer_html}'
            f'</div></div></div>'
        )

    st.markdown(f'<div class="movie-row">{cards_html}</div>', unsafe_allow_html=True)



# ─── MAIN LOGIC ───────────────────────────────────────────────────────────────
show_recs = st.button('🎬 Show Recommendations')
if show_recs or ("recs" in st.query_params):
    if show_recs:
        st.query_params["recs"] = "1"
        st.query_params["movie"] = selected_movie
    
    with st.spinner('Curating recommendations...'):
        r_names, r_years, r_ratings, r_ids, r_details = recommend(selected_movie)

    if r_names:
        st.markdown("<div class='section-title'>🎯 Top Picks For You</div>", unsafe_allow_html=True)
        render_movie_cards(r_names, r_years, r_ratings, r_ids, r_details)
    else:
        st.markdown("""
        <div style="text-align: center; padding: 60px 20px; background: rgba(14,14,20,0.6); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); max-width: 600px; margin: 40px auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.8; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));">🍿</div>
            <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 10px; font-weight: 800; font-family: 'Outfit', sans-serif;">No recommendations found</h3>
            <p style="color: #888; font-size: 1rem; line-height: 1.6;">We couldn't find exact matches for this specific title. Try searching for a different movie to discover new favorites.</p>
        </div>
        """, unsafe_allow_html=True)
else:
    # On load, show curated categories (cached after first load – instant on refresh)
    with st.spinner('⚡ Fetching curated movies for iBOMMA RAHUL…'):
        trending = fetch_trending()
        telugu = fetch_telugu_movies()
        hindi = fetch_hindi_movies()
        
        all_movies = trending + telugu + hindi
        if all_movies:
            all_ids = [str(m['id']) for m in all_movies]
            
            # Fetch all details in parallel extremely fast
            with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
                all_details = list(executor.map(fetch_movie_details, all_ids))
            
            # Split them back up safely
            def extract_data(movie_list, start_idx):
                end_idx = start_idx + len(movie_list)
                names = [m.get('title', 'Unknown') for m in movie_list]
                years = [safe_year(m.get('release_date', '')) for m in movie_list]
                ratings = [safe_rating(m.get('vote_average', 0)) for m in movie_list]
                ids = [str(m['id']) for m in movie_list]
                details = all_details[start_idx:end_idx]
                return names, years, ratings, ids, details
            
            tab1, tab2, tab3 = st.tabs(["Global Trending", "Telugu Cinema", "Hindi Cinema"])
            
            with tab1:
                if trending:
                    tn, ty, tr, ti, td = extract_data(trending, 0)
                    st.markdown("<div class='section-title'>Global Trending Now <span style='font-size:0.8rem; vertical-align:middle; margin-left:10px; background:rgba(229,9,20,0.1); padding:4px 12px; border-radius:20px; border:1px solid rgba(229,9,20,0.3); color:#e50914; letter-spacing:1px;'>🔴 LIVE</span></div>", unsafe_allow_html=True)
                    render_movie_cards(tn, ty, tr, ti, td)
                    
            with tab2:
                if telugu:
                    tn, ty, tr, ti, td = extract_data(telugu, len(trending))
                    st.markdown("<div class='section-title'>Premium Telugu Releases</div>", unsafe_allow_html=True)
                    render_movie_cards(tn, ty, tr, ti, td)

            with tab3:
                if hindi:
                    tn, ty, tr, ti, td = extract_data(hindi, len(trending) + len(telugu))
                    st.markdown("<div class='section-title'>Trending Hindi Features</div>", unsafe_allow_html=True)
                    render_movie_cards(tn, ty, tr, ti, td)
        else:
            st.info("Could not load movies. Please check your internet connection.")

st.markdown("""
<div style="margin-top: 100px; padding: 80px 40px; background: rgba(0,0,0,0.5); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
    <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 40px;">
        <a href="/" style="color: #888; text-decoration: none; font-size: 0.85rem; transition: color 0.3s; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Home</a>
        <a href="#" style="color: #888; text-decoration: none; font-size: 0.85rem; transition: color 0.3s; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Movies</a>
        <a href="#" style="color: #888; text-decoration: none; font-size: 0.85rem; transition: color 0.3s; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Trending</a>
        <a href="#" style="color: #888; text-decoration: none; font-size: 0.85rem; transition: color 0.3s; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">About</a>
    </div>
    <div style="color: #444; font-size: 0.8rem; letter-spacing: 1px;">
        © 2026 iBOMMA RAHUL. ALL RIGHTS RESERVED. <br>
        <span style="font-size: 0.7rem; margin-top: 10px; display: block;">BUILT WITH ❤️ FOR CINEMA LOVERS</span>
    </div>
</div>
""", unsafe_allow_html=True)
