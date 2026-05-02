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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;600;700;800;900&display=swap');
header { visibility: hidden; }
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
.block-container { padding-top: 0 !important; max-width: 100% !important; padding-bottom: 0 !important; }

/* Aurora Background - Static for performance */
.stApp {
  background: linear-gradient(135deg, #05050a 0%, #0d0b14 25%, #150f1a 50%, #0a0a14 75%, #020205 100%);
  color: #f5f5f7;
  font-family: 'Inter', sans-serif !important;
  min-height: 100vh;
}

/* Typography */
h1, h2, h3, .hero-title, .te-header .label, .hi-header .label, .section-title {
  font-family: 'Outfit', sans-serif !important;
}
.section-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #ffffff;
  padding: 50px 0 24px;
  letter-spacing: -0.5px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  margin-bottom: 30px;
}

/* Netflix-style Movie Cards */
.movie-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 0 0 40px;
}
.movie-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #111;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  aspect-ratio: 2 / 3;
}
.movie-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.05);
  z-index: 10;
}
.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease;
}
.movie-card:hover .movie-poster {
  transform: scale(1.08);
  filter: brightness(0.4) blur(2px);
}
.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #ffb400;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 180, 0, 0.3);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Card Hover Info (Slides up) */
.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%);
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}
.movie-card:hover .movie-info {
  transform: translateY(0);
  opacity: 1;
}
.movie-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}
.movie-meta {
  font-size: 12px;
  color: #bbb;
  font-weight: 500;
  margin-bottom: 10px;
}
.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.genre-tag {
  font-size: 10px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  color: #ddd;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.movie-overview {
  font-size: 12px;
  color: #aaa;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
}
.btn-group {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
.watch-btn {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  background: #e50914;
  color: #fff !important;
  text-decoration: none !important;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.watch-btn:hover {
  background: #f40612;
  transform: scale(1.02);
}
.trailer-btn {
  padding: 10px 14px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(4px);
  color: #fff !important;
  text-decoration: none !important;
  font-size: 13px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trailer-btn:hover {
  background: rgba(255,255,255,0.25);
  transform: scale(1.02);
}

/* Premium Navbar */
.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: sticky;
  top: 0;
  z-index: 999;
}
.nav-logo {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fff 0%, #aaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-logo span { color: #e50914; -webkit-text-fill-color: #e50914; }
.nav-links {
  display: flex;
  gap: 8px;
  background: rgba(255,255,255,0.03);
  padding: 6px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.05);
}
.nav-links a {
  color: #888;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 50px;
  transition: all 0.3s ease;
}
.nav-links a:hover { color: #fff; }
.nav-links a.active {
  background: rgba(255,255,255,0.1);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.nav-badge {
  font-size: 11px;
  background: linear-gradient(135deg, rgba(229,9,20,0.2), rgba(229,9,20,0.05));
  color: #ff4b4b;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1px solid rgba(229,9,20,0.3);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Modernized Streamlit Tabs */
div[data-testid="stTabs"] button[data-baseweb="tab"] {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  padding: 12px 24px !important;
  border-radius: 8px 8px 0 0 !important;
  color: #888 !important;
  border: none !important;
  background: transparent !important;
  transition: all 0.3s ease !important;
}
div[data-testid="stTabsTabList"] {
  border-bottom: 2px solid rgba(255,255,255,0.05) !important;
  gap: 8px !important;
}
.te-section div[data-testid="stTabs"] button[data-baseweb="tab"][aria-selected="true"] {
  color: #ff8c00 !important;
  border-bottom: 2px solid #ff8c00 !important;
}
.hi-section div[data-testid="stTabs"] button[data-baseweb="tab"][aria-selected="true"] {
  color: #4da6ff !important;
  border-bottom: 2px solid #4da6ff !important;
}

/* Regional Headers */
.te-header, .hi-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  border-radius: 24px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}
.te-header {
  background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(20,10,0,0.5));
  border: 1px solid rgba(255,140,0,0.15);
}
.hi-header {
  background: linear-gradient(135deg, rgba(77,166,255,0.1), rgba(0,10,20,0.5));
  border: 1px solid rgba(77,166,255,0.15);
}
.te-header::before, .hi-header::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('https://grainy-gradients.vercel.app/noise.svg');
  opacity: 0.05; pointer-events: none;
}
.te-header .label {
  font-size: 2rem;
  background: linear-gradient(135deg, #ffb347, #ff7b00);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hi-header .label {
  font-size: 2rem;
  background: linear-gradient(135deg, #80c7ff, #0077ff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* Cinematic Hero Banner */
.hero-banner {
  position: relative;
  width: 100%;
  height: 75vh;
  min-height: 500px;
  border-radius: 0 0 32px 32px;
  overflow: hidden;
  margin-bottom: 60px;
}
.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 20%;
  filter: brightness(0.6) contrast(1.1);
  transition: transform 10s ease-out;
}
.hero-banner:hover .hero-backdrop { transform: scale(1.03); }
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(5,5,10,1) 0%, rgba(5,5,10,0.6) 50%, transparent 100%),
              linear-gradient(to top, rgba(5,5,10,1) 0%, transparent 40%);
}
.hero-content {
  position: absolute;
  bottom: 10%;
  left: 5%;
  max-width: 650px;
  padding: 20px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  background: rgba(229,9,20,0.8);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.05;
  margin-bottom: 16px;
  letter-spacing: -1.5px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.hero-meta {
  font-size: 1rem;
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.hero-overview {
  font-size: 1.05rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 400;
}
.hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
.hero-watch-btn {
  padding: 14px 36px;
  background: #e50914;
  color: #fff !important;
  text-decoration: none !important;
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex; align-items: center; gap: 10px;
}
.hero-watch-btn:hover { background: #f40612; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(229,9,20,0.4); }
.hero-info-btn {
  padding: 14px 32px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff !important;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex; align-items: center; gap: 10px;
}
.hero-info-btn:hover { background: rgba(255,255,255,0.3); }

@media(max-width: 768px) {
  .hero-banner { height: 60vh; border-radius: 0 0 20px 20px; }
  .hero-content { left: 20px; right: 20px; bottom: 20px; }
  .movie-row { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .main-nav { padding: 16px 20px; }
  .nav-links { display: none; }
}
</style>""", unsafe_allow_html=True)


def render_nav(active_page="home"):
    pages = [("🏠 Home", "/", "home"), ("🎬 Telugu", "/telugu_cinema", "telugu"), ("🌟 Hindi", "/hindi_cinema", "hindi")]
    links = "".join(
        f'<a href="{url}" class="{"active" if key==active_page else ""}">{label}</a>'
        for label, url, key in pages
    )
    st.markdown(f"""
    <div class="main-nav">
      <div class="nav-logo">iBOMMA<span>RAHUL</span></div>
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
        <div class="hero-badge">🔥 Featured Today</div>
        <div class="hero-title">{title}</div>
        <div class="hero-meta"><span>⭐ {rating}</span> <span>•</span> <span>📅 {year}</span></div>
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
        if d.get("trailer"):
            trailer_html = f'<a href="{escape(d["trailer"])}" target="_blank" class="trailer-btn">🎬</a>'
        else:
            search_query = _q(f"{titles[i]} {years[i]} official trailer")
            trailer_html = f'<a href="https://www.youtube.com/results?search_query={search_query}" target="_blank" class="trailer-btn">🎬</a>'
            
        cards_html += (
            f'<div class="movie-card">'
            f'<img src="{poster}" class="movie-poster" alt="{title_esc}" onerror="this.src=\'https://placehold.co/500x750/111/FFF?text=No+Poster\'">'
            f'<div class="rating-badge">★ {ratings[i]}</div>'
            f'<div class="movie-info">'
            f'<div class="movie-title" title="{title_esc}">{title_esc}</div>'
            f'<div class="movie-meta">{years[i]}</div>'
            f'<div class="movie-genres">{genre_pills}</div>'
            f'<div class="movie-overview">{overview_esc}</div>'
            f'<div class="btn-group">'
            f'<a href="{watch_url}" target="_blank" class="watch-btn">▶ Play</a>'
            f'{trailer_html}'
            f'</div>'
            f'</div>'
            f'</div>'
        )
    st.markdown(f'<div class="movie-row">{cards_html}</div>', unsafe_allow_html=True)


def render_section(movie_list, selected_movie=""):
    if not movie_list: return
    import concurrent.futures
    names   = [m.get("title","Unknown") for m in movie_list]
    years   = [safe_year(m.get("release_date","")) for m in movie_list]
    ratings = [safe_rating(m.get("vote_average",0)) for m in movie_list]
    ids     = [str(m["id"]) for m in movie_list]
    
    from backend import get_genre_map
    gmap = get_genre_map()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        details = list(executor.map(lambda m: details_from_discover(m, gmap), movie_list))
        
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
