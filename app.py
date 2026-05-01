"""Home Page — Trending + Recommendations."""
import streamlit as st
import concurrent.futures, os
import numpy as np, pandas as pd
from backend import (fetch_trending, fetch_movie_details, load_data,
                     safe_year, safe_rating, recommend as _rec_engine)
from ui import inject_base_css, render_nav, render_hero_banner, render_movie_cards, render_section

st.set_page_config(
    layout="wide",
    page_title="iBOMMA RAHUL — Home",
    page_icon="🎬",
    initial_sidebar_state="collapsed",
)

# ── INTERNAL PLAYER ROUTE ─────────────────────────────────────────────────────
if "watch" in st.query_params:
    import json, html as _html
    from urllib.parse import quote as _q
    mid   = st.query_params.get("watch","")
    mtitle = st.query_params.get("title","Movie")
    from_m = st.query_params.get("from","")
    mid_safe   = json.dumps(mid)
    mtitle_safe = json.dumps(mtitle)
    mtitle_esc  = _html.escape(mtitle)
    back_url = f"/?recs=1&movie={_q(from_m)}" if from_m else "/"
    st.markdown("""<style>.stApp>header{display:none!important;}
    .block-container{padding:0!important;max-width:100%!important;}
    footer{display:none!important;}#MainMenu{display:none!important;}</style>""", unsafe_allow_html=True)
    import streamlit.components.v1 as components
    _GH = "https://bunnyvalluri.github.io/Personalized-Movie-Recommendation-System-Using-Collaborative-Filtering"
    srv = {
        "v1": f"https://vidsrc.to/embed/movie/{mid}",
        "v2": f"https://embed.su/embed/movie/{mid}",
        "v3": f"https://vidsrc.xyz/embed/movie/{mid}",
        "v4": f"https://multiembed.mov/?video_id={mid}&tmdb=1",
        "v5": f"https://www.2embed.cc/embed/{mid}",
        "v6": f"https://player.autoembed.cc/embed/movie/{mid}",
    }
    srv_js = json.dumps(srv)
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
var srvN={{"v1":"VidSrc","v2":"EmbedSu","v3":"VidSrc XYZ","v4":"MultiEmbed","v5":"2Embed","v6":"AutoEmbed"}};
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

st.markdown("""
<div style="text-align:center;padding:40px 20px 20px;">
  <h1 style="font-size:clamp(2.5rem,5vw,4.5rem);font-weight:900;letter-spacing:-1px;margin-bottom:10px;
    background:linear-gradient(135deg,#fff 0%,#a0a0a0 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
    Find Your Next Favorite Movie
  </h1>
  <p style="font-size:clamp(1rem,2vw,1.15rem);color:#888;max-width:650px;margin:0 auto 30px;line-height:1.7;">
    Powered by collaborative filtering &amp; real-time streaming.
  </p>
</div>""", unsafe_allow_html=True)

# ── LOAD ML DATA ──────────────────────────────────────────────────────────────
try:
    movies, similarity = load_data()
except Exception as e:
    st.error(f"❌ Failed to load data: {e}"); st.stop()

movie_list = list(movies["title"].values)
default_index = 0
if "movie" in st.query_params:
    try: default_index = movie_list.index(st.query_params["movie"])
    except: pass

selected_movie = st.selectbox("What's your favorite movie? Let's find similar ones:", movie_list, index=default_index)

# ── RECOMMENDATIONS ───────────────────────────────────────────────────────────
show_recs = st.button("🎬 Show Recommendations")
if show_recs or ("recs" in st.query_params):
    if show_recs:
        st.query_params["recs"] = "1"
        st.query_params["movie"] = selected_movie
    with st.spinner("Curating recommendations..."):
        r_names, r_years, r_ratings, r_ids, r_details = _rec_engine(selected_movie, movies, similarity)
    if r_names:
        st.markdown("<div class='section-title'>🎯 Top Picks For You</div>", unsafe_allow_html=True)
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
            st.markdown("<div class='section-title'>🔥 Trending This Week <span style='font-size:.8rem;margin-left:10px;background:rgba(229,9,20,.1);padding:4px 12px;border-radius:20px;border:1px solid rgba(229,9,20,.3);color:#e50914;'>🔴 LIVE</span></div>", unsafe_allow_html=True)
            render_section(trending)
        else:
            st.warning("⚠️ Could not load trending movies. Please refresh.")
    except Exception as e:
        st.error(f"❌ Error: {e}")

st.markdown("""
<div style="margin-top:80px;padding:60px 40px;background:rgba(0,0,0,.5);border-top:1px solid rgba(255,255,255,.05);text-align:center;">
  <div style="color:#444;font-size:.8rem;letter-spacing:1px;">
    © 2026 iBOMMA RAHUL. ALL RIGHTS RESERVED.<br>
    <span style="font-size:.7rem;display:block;margin-top:8px;">BUILT WITH ❤️ FOR CINEMA LOVERS</span>
  </div>
</div>""", unsafe_allow_html=True)
