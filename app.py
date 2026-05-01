"""Home Page — Premium Landing + Trending + Recommendations."""
import streamlit as st
import concurrent.futures, os
import numpy as np, pandas as pd
from backend import (fetch_trending, fetch_movie_details, load_data,
                     safe_year, safe_rating, recommend as _rec_engine)
from ui import inject_base_css, render_nav, render_hero_banner, render_movie_cards, render_section

st.set_page_config(
    layout="wide",
    page_title="iBOMMA RAHUL — Stream Free Movies",
    page_icon="🎬",
    initial_sidebar_state="collapsed",
)

# ── NAVIGATION INTERCEPT ──────────────────────────────────────────────────────
nav_target = st.query_params.get("nav")
if nav_target == "telugu":
    st.markdown('<meta http-equiv="refresh" content="0; url=/telugu_cinema">', unsafe_allow_html=True)
    st.stop()
elif nav_target == "hindi":
    st.markdown('<meta http-equiv="refresh" content="0; url=/hindi_cinema">', unsafe_allow_html=True)
    st.stop()

# ── INTERNAL PLAYER ROUTE ─────────────────────────────────────────────────────
if "watch" in st.query_params:
    import json, html as _html
    from urllib.parse import quote as _q
    mid    = st.query_params.get("watch", "")
    mtitle = st.query_params.get("title", "Movie")
    from_m = st.query_params.get("from", "")
    mtitle_esc = _html.escape(mtitle)
    back_url   = f"/?recs=1&movie={_q(from_m)}" if from_m else "/"
    srv = {
        "v1": f"https://vidsrc.in/embed/movie/{mid}",
        "v2": f"https://vidsrc.cc/v2/embed/movie/{mid}",
        "v3": f"https://multiembed.mov/directstream.php?video_id={mid}&tmdb=1",
        "v4": f"https://vidsrc.to/embed/movie/{mid}",
        "v5": f"https://embed.su/embed/movie/{mid}",
        "v6": f"https://vidsrc.rip/embed/movie/{mid}",
    }
    srv_js = json.dumps(srv)
    st.markdown("""<style>.stApp>header{display:none!important;}
    .block-container{padding:0!important;max-width:100%!important;}
    footer{display:none!important;}#MainMenu{display:none!important;}</style>""", unsafe_allow_html=True)
    import streamlit.components.v1 as components
    components.html(f"""<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>iBOMMA RAHUL – {mtitle_esc}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
*{{box-sizing:border-box;margin:0;padding:0;}}
body{{background:#000;font-family:'Outfit',sans-serif;color:#fff;height:100vh;display:flex;flex-direction:column;}}
#pw{{flex:1;position:relative;}}
#pf{{width:100%;height:100%;border:none;}}
.bar{{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#0a0a0a;border-bottom:1px solid #1a1a1a;}}
.logo{{font-weight:900;font-size:1rem;background:linear-gradient(135deg,#e50914,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}}
.back{{color:#888;text-decoration:none;font-size:13px;font-weight:700;padding:6px 14px;border:1px solid #333;border-radius:20px;transition:.2s;}}
.back:hover{{color:#fff;border-color:#555;}}
.title{{flex:1;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}}
.srvs{{display:flex;gap:6px;flex-wrap:wrap;}}
.srv-btn{{font-size:11px;padding:5px 12px;border-radius:20px;border:1px solid #333;background:transparent;color:#888;cursor:pointer;transition:.2s;font-family:'Outfit',sans-serif;font-weight:700;}}
.srv-btn:hover,.srv-btn.active{{background:#e50914;border-color:#e50914;color:#fff;}}
#pl{{position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;transition:opacity .3s;}}
#pl.hidden{{opacity:0;pointer-events:none;}}
.spin{{width:40px;height:40px;border:3px solid #333;border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite;}}
@keyframes spin{{to{{transform:rotate(360deg)}}}}
.pl-txt{{color:#888;font-size:13px;}}
</style></head><body>
<div class="bar">
  <a href="{back_url}" class="back">← Back</a>
  <div class="logo">iBOMMA</div>
  <div class="title">{mtitle_esc}</div>
  <div class="srvs" id="srvs"></div>
</div>
<div id="pw">
  <div id="pl"><div class="spin"></div><div class="pl-txt" id="plt">Loading...</div></div>
  <iframe id="pf" allowfullscreen allow="autoplay;fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe>
</div>
<script>
var srv={srv_js};
var ORD=["v1","v2","v3","v4","v5","v6"];
var srvN={{"v1":"VidSrc IN","v2":"VidSrc CC","v3":"MultiEmbed","v4":"VidSrc","v5":"Embed.su","v6":"VidSrc RIP"}};
var curKey=ORD[0],timer,autoCycle=true,realLoad=false;
var plEl=document.getElementById('pl'),pltEl=document.getElementById('plt'),pf=document.getElementById('pf');
var srvsEl=document.getElementById('srvs');
ORD.forEach(function(k){{
  var b=document.createElement('button');b.className='srv-btn';b.dataset.key=k;b.textContent=srvN[k];
  b.onclick=function(){{loadSrc(k);}};srvsEl.appendChild(b);
}});
function setActive(k){{document.querySelectorAll('.srv-btn').forEach(function(b){{b.classList.toggle('active',b.dataset.key===k);}});}}
function showLoad(k){{plEl.classList.remove('hidden');pltEl.textContent='Connecting to '+srvN[k]+'...';}}
function startTimer(k){{
  clearTimeout(timer);timer=setTimeout(function(){{
    if(!plEl.classList.contains('hidden')){{
      var ni=ORD.indexOf(k)+1;
      if(ni<ORD.length&&autoCycle){{var nk=ORD[ni];setActive(nk);showLoad(nk);pf.src=srv[nk];startTimer(nk);}}
      else{{plEl.classList.add('hidden');}}
    }}
  }},6000);
}}
function loadSrc(k){{autoCycle=false;setActive(k);showLoad(k);pf.src=srv[k];startTimer(k);}}
pf.onload=function(){{if(realLoad){{clearTimeout(timer);plEl.classList.add('hidden');}}}};
setTimeout(function(){{realLoad=true;setActive(curKey);showLoad(curKey);pf.src=srv[curKey];startTimer(curKey);}},100);
</script></body></html>""", height=900, scrolling=True)
    st.stop()

# ── MAIN HOME PAGE ────────────────────────────────────────────────────────────
inject_base_css()
render_nav("home")

# ── PREMIUM HERO SECTION ──────────────────────────────────────────────────────
st.markdown("""
<div class="landing-hero">
  <div class="landing-hero-bg"></div>
  <div class="landing-hero-content">
    <div class="landing-badge">🎬 AI-POWERED STREAMING</div>
    <h1 class="landing-title">Your Cinema.<br><span class="landing-title-accent">Unlimited.</span></h1>
    <p class="landing-subtitle">
      Discover Telugu, Hindi &amp; global blockbusters with AI recommendations.<br>
      Stream instantly — zero ads, zero cost.
    </p>
    <div class="landing-stats">
      <div class="stat-item"><span class="stat-num">10K+</span><span class="stat-lbl">Movies</span></div>
      <div class="stat-divider"></div>
      <div class="stat-item"><span class="stat-num">HD</span><span class="stat-lbl">Quality</span></div>
      <div class="stat-divider"></div>
      <div class="stat-item"><span class="stat-num">Free</span><span class="stat-lbl">Forever</span></div>
      <div class="stat-divider"></div>
      <div class="stat-item"><span class="stat-num">AI</span><span class="stat-lbl">Powered</span></div>
    </div>
    <div class="landing-cta-row">
      <a href="/telugu_cinema" class="cta-btn cta-primary">🌶️ Telugu Cinema</a>
      <a href="/hindi_cinema"  class="cta-btn cta-secondary">🌟 Hindi Cinema</a>
    </div>
  </div>
  <div class="landing-film-strip">
    <div class="film-reel"></div>
  </div>
</div>

<style>
/* ── HERO ── */
.landing-hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 0 -1rem;
  padding: 80px 60px 60px;
}
.landing-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 50%, rgba(229,9,20,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(120,40,200,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 100%, rgba(229,9,20,0.06) 0%, transparent 50%);
  pointer-events: none;
}
.landing-hero-content {
  position: relative;
  z-index: 2;
  max-width: 680px;
}
.landing-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(229,9,20,0.15);
  border: 1px solid rgba(229,9,20,0.35);
  color: #ff6b6b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 28px;
  font-family: 'Outfit', sans-serif;
  text-transform: uppercase;
}
.landing-title {
  font-family: 'Outfit', sans-serif !important;
  font-size: clamp(3rem, 7vw, 6rem) !important;
  font-weight: 900 !important;
  line-height: 1.0 !important;
  letter-spacing: -2px !important;
  color: #ffffff !important;
  margin-bottom: 24px !important;
  -webkit-text-fill-color: unset !important;
}
.landing-title-accent {
  background: linear-gradient(135deg, #e50914 0%, #ff6b6b 50%, #ffaa44 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.landing-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: #aaa;
  line-height: 1.75;
  margin-bottom: 40px;
  max-width: 560px;
}
/* Stats bar */
.landing-stats {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 44px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px 28px;
  backdrop-filter: blur(12px);
  width: fit-content;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 28px;
}
.stat-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}
.stat-lbl {
  font-size: 0.72rem;
  color: #666;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.1);
}
/* CTA Buttons */
.landing-cta-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  padding: 16px 36px;
  border-radius: 12px;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}
.cta-primary {
  background: linear-gradient(135deg, #e50914 0%, #c20812 100%);
  color: #fff !important;
  box-shadow: 0 8px 32px rgba(229,9,20,0.4);
}
.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(229,9,20,0.5);
}
.cta-secondary {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff !important;
}
.cta-secondary:hover {
  background: rgba(255,255,255,0.14);
  transform: translateY(-3px);
}

/* ── AI SEARCH BOX SECTION ── */
.search-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  padding: 48px 52px;
  margin: 0 0 48px;
  position: relative;
  overflow: hidden;
}
.search-section::before {
  content: '';
  position: absolute;
  top: -1px; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(229,9,20,0.6), transparent);
}
.search-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.search-icon {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, #e50914, #ff6b6b);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.search-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
}
.search-desc {
  font-size: 0.9rem;
  color: #666;
  margin-top: 2px;
}
@media(max-width:768px) {
  .landing-hero { padding: 60px 20px 40px; min-height: 70vh; }
  .landing-stats { padding: 16px 16px; }
  .stat-item { padding: 0 16px; }
  .search-section { padding: 32px 24px; }
}
</style>
""", unsafe_allow_html=True)

# ── AI SEARCH / RECOMMENDATION SECTION ───────────────────────────────────────
st.markdown("""
<div class="search-section">
  <div class="search-header">
    <div class="search-icon">🤖</div>
    <div>
      <div class="search-title">AI Movie Recommendations</div>
      <div class="search-desc">Tell us a movie you love — we'll find your next obsession</div>
    </div>
  </div>
</div>
""", unsafe_allow_html=True)

# ── LOAD ML DATA ──────────────────────────────────────────────────────────────
try:
    movies, similarity = load_data()
except Exception as e:
    st.error(f"❌ Failed to load data: {e}"); st.stop()

movie_list    = list(movies["title"].values)
default_index = 0
if "movie" in st.query_params:
    try: default_index = movie_list.index(st.query_params["movie"])
    except: pass

col1, col2 = st.columns([5, 1])
with col1:
    selected_movie = st.selectbox(
        "Pick a movie you love:",
        movie_list,
        index=default_index,
        label_visibility="collapsed",
    )
with col2:
    show_recs = st.button("🎯 Find Similar", use_container_width=True)

# ── RECOMMENDATIONS ───────────────────────────────────────────────────────────
if show_recs or ("recs" in st.query_params):
    if show_recs:
        st.query_params["recs"] = "1"
        st.query_params["movie"] = selected_movie
    with st.spinner("🤖 AI is curating your picks..."):
        r_names, r_years, r_ratings, r_ids, r_details = _rec_engine(selected_movie, movies, similarity)
    if r_names:
        st.markdown(f"""
        <div style="padding:40px 0 16px;">
          <div class="section-title">🎯 Because You Like <em style="color:#e50914;">{selected_movie}</em></div>
        </div>""", unsafe_allow_html=True)
        render_movie_cards(r_names, r_years, r_ratings, r_ids, r_details, selected_movie)
    else:
        st.info("No recommendations found. Try a different movie.")
else:
    # ── TRENDING ──────────────────────────────────────────────────────────────
    try:
        with st.spinner("⚡ Loading trending movies…"):
            trending = fetch_trending()
        if trending:
            hero_det = fetch_movie_details(str(trending[0]["id"]))
            render_hero_banner(trending[0], hero_det)
            st.markdown("""
            <div style="padding:40px 0 16px;">
              <div class="section-title">🔥 Trending This Week
                <span style="font-size:.75rem;margin-left:12px;background:rgba(229,9,20,.12);
                  padding:4px 14px;border-radius:100px;border:1px solid rgba(229,9,20,.3);
                  color:#e50914;vertical-align:middle;">● LIVE</span>
              </div>
            </div>""", unsafe_allow_html=True)
            render_section(trending)
        else:
            st.warning("⚠️ Could not load trending movies. Please refresh.")
    except Exception as e:
        st.error(f"❌ Error: {e}")

# ── FOOTER ────────────────────────────────────────────────────────────────────
st.markdown("""
<div style="margin-top:100px;padding:60px 40px;
     background:linear-gradient(180deg,transparent,rgba(0,0,0,0.8));
     border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
  <div style="font-family:'Outfit',sans-serif;font-size:1.8rem;font-weight:900;
    background:linear-gradient(135deg,#e50914,#ff6b6b);-webkit-background-clip:text;
    -webkit-text-fill-color:transparent;margin-bottom:12px;">iBOMMA RAHUL</div>
  <div style="color:#555;font-size:.8rem;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:24px;">
    Stream Free · AI Powered · Zero Ads
  </div>
  <div style="display:flex;justify-content:center;gap:24px;margin-bottom:28px;flex-wrap:wrap;">
    <a href="/telugu_cinema" style="color:#666;font-size:.85rem;text-decoration:none;font-weight:600;transition:.2s;">Telugu Cinema</a>
    <a href="/hindi_cinema"  style="color:#666;font-size:.85rem;text-decoration:none;font-weight:600;transition:.2s;">Hindi Cinema</a>
  </div>
  <div style="color:#333;font-size:.72rem;letter-spacing:.5px;">
    © 2026 iBOMMA RAHUL — Built with ❤️ for cinema lovers
  </div>
</div>""", unsafe_allow_html=True)
