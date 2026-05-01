"""Shared UI helpers — CSS injection, card rendering, hero banner."""
import streamlit as st
import html as _html
from urllib.parse import quote as _q
from backend import safe_year, safe_rating, details_from_discover

GH_BASE = "https://bunnyvalluri.github.io/Personalized-Movie-Recommendation-System-Using-Collaborative-Filtering"

def escape(text):
    return _html.escape(str(text), quote=True)

def inject_base_css():
    st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');
header{visibility:hidden;}#MainMenu{visibility:hidden;}footer{visibility:hidden;}
.block-container{padding-top:0!important;max-width:100%!important;}
@keyframes aurora{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
.stApp{
  background:linear-gradient(125deg,#0a0010 0%,#130020 15%,#0d0000 30%,#000d1a 50%,#0a0010 65%,#1a0005 80%,#000010 100%);
  background-size:400% 400%;animation:aurora 22s cubic-bezier(.45,.05,.55,.95) infinite;
  color:#f0f0f0;font-family:'Outfit',sans-serif!important;min-height:100vh;}
.section-title{font-size:clamp(1.4rem,3vw,2rem);font-weight:900;color:#fff;
  padding:40px 0 20px;letter-spacing:-0.5px;}
.movie-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;padding:0 0 32px;}
.movie-card{background:rgba(20,20,30,.85);border-radius:14px;overflow:hidden;
  border:1px solid rgba(255,255,255,.07);transition:transform .3s ease,box-shadow .3s ease;cursor:pointer;}
.movie-card:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,.6);}
.poster-wrap{position:relative;aspect-ratio:2/3;overflow:hidden;}
.movie-poster{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
.movie-card:hover .movie-poster{transform:scale(1.05);}
.poster-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 50%);}
.rating-badge{position:absolute;top:10px;right:10px;background:rgba(255,180,0,.9);
  color:#000;font-size:11px;font-weight:800;padding:4px 8px;border-radius:20px;}
.movie-info{padding:12px;}
.movie-title{font-size:13px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;}
.movie-meta{font-size:11px;color:#888;margin-bottom:6px;}
.movie-genres{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;}
.genre-tag{font-size:10px;background:rgba(255,255,255,.06);color:#aaa;padding:2px 8px;border-radius:20px;}
.movie-overview{font-size:11px;color:#888;line-height:1.5;display:-webkit-box;
  -webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px;}
.btn-group{display:flex;gap:6px;flex-wrap:wrap;}
.watch-btn{flex:1;text-align:center;padding:8px 6px;background:linear-gradient(135deg,#e50914,#a30008);
  color:#fff!important;text-decoration:none!important;font-size:11px;font-weight:800;border-radius:8px;transition:all .3s;}
.watch-btn:hover{box-shadow:0 6px 20px rgba(229,9,20,.5);}
.trailer-btn{padding:8px 10px;background:rgba(255,255,255,.06);color:#fff!important;
  text-decoration:none!important;font-size:11px;font-weight:700;border-radius:8px;
  border:1px solid rgba(255,255,255,.12);transition:all .3s;}
.trailer-btn:hover{background:rgba(255,255,255,.12);}
/* Nav */
.main-nav{display:flex;align-items:center;justify-content:space-between;
  padding:16px 32px;background:rgba(0,0,0,.6);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,255,255,.06);position:sticky;top:0;z-index:999;}
.nav-logo{font-size:1.4rem;font-weight:900;letter-spacing:-0.5px;
  background:linear-gradient(135deg,#e50914,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.nav-links{display:flex;gap:24px;}
.nav-links a{color:#888;text-decoration:none;font-size:13px;font-weight:700;
  letter-spacing:1px;text-transform:uppercase;transition:color .3s;}
.nav-links a:hover,.nav-links a.active{color:#fff;}
.nav-badge{font-size:11px;background:rgba(229,9,20,.15);color:#e50914;
  padding:5px 14px;border-radius:20px;border:1px solid rgba(229,9,20,.3);font-weight:700;letter-spacing:1px;}
/* Tabs */
div[data-testid="stTabs"] button[data-baseweb="tab"]{
  font-family:'Outfit',sans-serif!important;font-weight:700!important;font-size:13px!important;
  padding:10px 20px!important;border-radius:50px 50px 0 0!important;
  transition:all .25s ease!important;color:#888!important;
  border-bottom:2px solid transparent!important;white-space:nowrap!important;}
div[data-testid="stTabsTabList"]{border-bottom:1px solid rgba(255,255,255,.08)!important;gap:4px!important;flex-wrap:wrap!important;}
/* Section headers */
.te-header{display:flex;align-items:center;gap:14px;padding:18px 24px;
  background:linear-gradient(135deg,rgba(255,140,0,.12),rgba(255,60,0,.06));
  border:1px solid rgba(255,140,0,.25);border-radius:18px;margin-bottom:20px;}
.te-header .label{font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,#ff8c00,#ff4500);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Outfit',sans-serif;}
.te-header .tag{margin-left:auto;font-size:.7rem;font-weight:700;padding:5px 14px;
  border-radius:20px;letter-spacing:1.5px;background:rgba(255,140,0,.15);color:#ff8c00;border:1px solid rgba(255,140,0,.3);}
.te-section div[data-testid="stTabs"] button[data-baseweb="tab"]:hover{color:#ff8c00!important;background:rgba(255,140,0,.08)!important;}
.te-section div[data-testid="stTabs"] button[data-baseweb="tab"][aria-selected="true"]{color:#ff8c00!important;border-bottom:2px solid #ff8c00!important;background:rgba(255,140,0,.1)!important;}
.hi-header{display:flex;align-items:center;gap:14px;padding:18px 24px;
  background:linear-gradient(135deg,rgba(77,166,255,.12),rgba(0,100,255,.06));
  border:1px solid rgba(77,166,255,.25);border-radius:18px;margin-bottom:20px;}
.hi-header .label{font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,#4da6ff,#0066ff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Outfit',sans-serif;}
.hi-header .tag{margin-left:auto;font-size:.7rem;font-weight:700;padding:5px 14px;
  border-radius:20px;letter-spacing:1.5px;background:rgba(77,166,255,.15);color:#4da6ff;border:1px solid rgba(77,166,255,.3);}
.hi-section div[data-testid="stTabs"] button[data-baseweb="tab"]:hover{color:#4da6ff!important;background:rgba(77,166,255,.08)!important;}
.hi-section div[data-testid="stTabs"] button[data-baseweb="tab"][aria-selected="true"]{color:#4da6ff!important;border-bottom:2px solid #4da6ff!important;background:rgba(77,166,255,.1)!important;}
/* Hero */
.hero-banner{position:relative;width:100%;height:520px;overflow:hidden;margin-bottom:40px;}
.hero-backdrop{position:absolute;inset:0;background-size:cover;background-position:center top;filter:brightness(.45);}
.hero-gradient{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.85) 40%,transparent 100%),linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 50%);}
.hero-content{position:absolute;bottom:60px;left:48px;max-width:620px;}
.hero-badge{display:inline-block;font-size:.7rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;
  color:#e50914;background:rgba(229,9,20,.12);border:1px solid rgba(229,9,20,.35);
  padding:5px 16px;border-radius:20px;margin-bottom:16px;}
.hero-title{font-size:clamp(2rem,5vw,3.2rem);font-weight:900;color:#fff;line-height:1.1;margin-bottom:12px;letter-spacing:-1px;}
.hero-meta{font-size:.95rem;color:#bbb;margin-bottom:14px;}
.hero-overview{font-size:.95rem;color:#ccc;line-height:1.65;margin-bottom:24px;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.hero-buttons{display:flex;gap:12px;flex-wrap:wrap;}
.hero-watch-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;
  background:linear-gradient(135deg,#e50914,#a30008);color:#fff!important;text-decoration:none!important;
  font-weight:800;font-size:15px;border-radius:50px;box-shadow:0 8px 25px rgba(229,9,20,.45);transition:all .3s;}
.hero-watch-btn:hover{transform:scale(1.05) translateY(-2px);box-shadow:0 14px 35px rgba(229,9,20,.65);}
.hero-info-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;
  background:rgba(255,255,255,.1);backdrop-filter:blur(12px);color:#fff!important;text-decoration:none!important;
  font-weight:700;font-size:15px;border-radius:50px;border:1px solid rgba(255,255,255,.2);transition:all .3s;}
.hero-info-btn:hover{background:rgba(255,255,255,.2);}
@media(max-width:768px){
  .hero-banner{height:380px;}.hero-content{padding:0 24px;max-width:100%;}
  .hero-title{font-size:1.8rem;}.movie-row{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}
}
</style>""", unsafe_allow_html=True)


def render_nav(active_page="home"):
    pages = [("🏠 Home", "/", "home"), ("🎬 Telugu", "/Telugu_Cinema", "telugu"), ("🌟 Hindi", "/Hindi_Cinema", "hindi")]
    links = "".join(
        f'<a href="{url}" class="{"active" if key==active_page else ""}">{label}</a>'
        for label, url, key in pages
    )
    st.markdown(f"""
    <div class="main-nav">
      <div class="nav-logo">iBOMMA RAHUL</div>
      <div class="nav-links">{links}</div>
      <div class="nav-badge">💎 Premium</div>
    </div>""", unsafe_allow_html=True)


def render_hero_banner(movie, details):
    mid   = str(movie.get("id",""))
    title = escape(movie.get("title","Featured Movie"))
    overview = escape((movie.get("overview","") or "")[:200])
    year  = safe_year(movie.get("release_date",""))
    rating = safe_rating(movie.get("vote_average",0))
    backdrop = movie.get("backdrop_path","")
    backdrop_url = f"https://image.tmdb.org/t/p/w1280{backdrop}" if backdrop else ""
    watch_url = f"{GH_BASE}/player.html?id={_q(mid)}&title={_q(movie.get('title',''))}&from={_q(movie.get('title',''))}"
    trailer_url = (details or {}).get("trailer","")
    st.markdown(f"""
    <div class="hero-banner">
      <div class="hero-backdrop" style="background-image:url('{backdrop_url}');"></div>
      <div class="hero-gradient"></div>
      <div class="hero-content">
        <span class="hero-badge">🔥 Featured Today</span>
        <div class="hero-title">{title}</div>
        <div class="hero-meta">⭐ {rating} &nbsp;·&nbsp; 📅 {year}</div>
        <div class="hero-overview">{overview}</div>
        <div class="hero-buttons">
          <a href="{watch_url}" target="_blank" class="hero-watch-btn">▶ Watch Now</a>
          {'<a href="'+escape(trailer_url)+'" target="_blank" class="hero-info-btn">🎬 Trailer</a>' if trailer_url else ''}
        </div>
      </div>
    </div>""", unsafe_allow_html=True)


def render_movie_cards(titles, years, ratings, ids, details_list, selected_movie=""):
    cards_html = ""
    for i in range(len(titles)):
        d = details_list[i] or {"poster":"https://placehold.co/500x750/333/FFF?text=No+Poster","trailer":None,"overview":"","genres":""}
        mid = str(ids[i])
        watch_url = f"{GH_BASE}/player.html?id={_q(mid)}&title={_q(titles[i])}&from={_q(selected_movie)}"
        poster = escape(d.get("poster",""))
        title_esc = escape(titles[i])
        overview_esc = escape(d.get("overview",""))
        genre_pills = "".join(f'<span class="genre-tag">{escape(g.strip())}</span>' for g in d.get("genres","").split(" • ") if g.strip())
        trailer_html = f'<a href="{escape(d["trailer"])}" target="_blank" class="trailer-btn">🎬</a>' if d.get("trailer") else ""
        cards_html += (
            f'<div class="movie-card">'
            f'<div class="poster-wrap">'
            f'<img src="{poster}" class="movie-poster" alt="{title_esc}" onerror="this.src=\'https://placehold.co/500x750/111/FFF?text=No+Poster\'">'
            f'<div class="poster-overlay"></div>'
            f'<div class="rating-badge">⭐ {ratings[i]}</div>'
            f'</div>'
            f'<div class="movie-info">'
            f'<div class="movie-title" title="{title_esc}">{title_esc}</div>'
            f'<div class="movie-meta">{years[i]}</div>'
            f'<div class="movie-genres">{genre_pills}</div>'
            f'<div class="movie-overview">{overview_esc}</div>'
            f'<div class="btn-group"><a href="{watch_url}" target="_blank" class="watch-btn">&#9654; Watch</a>{trailer_html}</div>'
            f'</div></div>'
        )
    st.markdown(f'<div class="movie-row">{cards_html}</div>', unsafe_allow_html=True)


def render_section(movie_list, selected_movie=""):
    if not movie_list: return
    names   = [m.get("title","Unknown") for m in movie_list]
    years   = [safe_year(m.get("release_date","")) for m in movie_list]
    ratings = [safe_rating(m.get("vote_average",0)) for m in movie_list]
    ids     = [str(m["id"]) for m in movie_list]
    details = [details_from_discover(m) for m in movie_list]
    render_movie_cards(names, years, ratings, ids, details, selected_movie)


def render_cinema_tabs(grouped: dict, section_class: str, selected_movie=""):
    tab_labels = [k for k, v in grouped.items() if v]
    if not tab_labels: return
    tab_objects = st.tabs(tab_labels)
    for tab_obj, label in zip(tab_objects, tab_labels):
        with tab_obj:
            movies = grouped.get(label, [])
            if movies:
                render_section(movies, selected_movie)
            else:
                st.info("No movies available.")
