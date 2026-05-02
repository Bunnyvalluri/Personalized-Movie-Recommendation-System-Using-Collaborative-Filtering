"""Home Page — Ultra-Premium Cinematic Landing."""
import streamlit as st
import concurrent.futures, os, json, html as _html
from urllib.parse import quote as _q
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

# ── NAV INTERCEPT ─────────────────────────────────────────────────────────────
nav_target = st.query_params.get("nav")
if nav_target == "telugu":
    st.switch_page("pages/telugu_cinema.py")
elif nav_target == "hindi":
    st.switch_page("pages/hindi_cinema.py")
elif nav_target == "global":
    st.switch_page("pages/global_cinema.py")

# ── PLAYER ROUTE ──────────────────────────────────────────────────────────────
if "watch" in st.query_params:
    import streamlit.components.v1 as components
    mid      = st.query_params.get("watch", "")
    mtitle   = st.query_params.get("title", "Movie")
    from_m   = st.query_params.get("from", "")
    
    # Fetch additional details for the player (Release Status)
    try:
        det = fetch_movie_details(mid)
        rel_date = det.get("year", "N/A")
    except:
        rel_date = "N/A"
    
    # ── PREMIUM PLAYER ROUTE ────────────────────────────────────────────────
    try:
        with open("static/player.html", "r", encoding="utf-8") as f:
            html_content = f.read()
        
        # Robust Global Variable Injection
        injection_script = f"""
        <script>
            window.OVERRIDE_ID = '{mid}';
            window.OVERRIDE_TITLE = '{mtitle.replace("'", "\\'")}';
            window.OVERRIDE_FROM = '{from_m.replace("'", "\\'")}';
            window.OVERRIDE_REL = '{rel_date}';
        </script>
        """
        final_html = html_content.replace("<head>", f"<head>{injection_script}")
        
        st.markdown("""<style>
        .stApp>header, footer, #MainMenu {display:none!important;}
        .block-container {padding:0!important; max-width:100%!important; height:100vh!important;}
        iframe {border:none !important;}
        </style>""", unsafe_allow_html=True)
        
        components.html(final_html, height=1200, scrolling=True)
    except Exception as e:
        st.error(f"Failed to load premium player: {e}")
        st.stop()
        
    # Related movies section (visible on scroll)
    try:
        movies_df, similarity_mtx = load_data()
        names, years, ratings, ids, details = _rec_engine(mtitle, movies_df, similarity_mtx)
        if names:
            st.markdown('<div style="padding:40px 0 16px"><div class="section-title">📺 You Might Also Like</div></div>', unsafe_allow_html=True)
            render_movie_cards(names, years, ratings, ids, details, mtitle)
    except Exception as e:
        pass
        
    st.stop()

# ── LANDING PAGE ──────────────────────────────────────────────────────────────
inject_base_css()

# Inject premium landing CSS
st.markdown("""<style>
/* ─── PREMIUM HERO ─── */
.hero-wrap{
  position:relative;min-height:92vh;display:flex;flex-direction:column;
  justify-content:center;overflow:hidden;padding:100px 64px 60px;margin:0 -1rem;
}
.hero-glow-1{
  position:absolute;top:-20%;left:-10%;width:70%;height:90%;
  background:radial-gradient(ellipse,rgba(229,9,20,0.18) 0%,transparent 65%);
  pointer-events:none;animation:pulse1 8s ease-in-out infinite;
}
.hero-glow-2{
  position:absolute;bottom:-10%;right:-5%;width:60%;height:70%;
  background:radial-gradient(ellipse,rgba(120,40,200,0.1) 0%,transparent 65%);
  pointer-events:none;animation:pulse1 10s ease-in-out infinite reverse;
}
@keyframes pulse1{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}

/* Film grain overlay */
.hero-grain{
  position:absolute;inset:0;opacity:0.035;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size:200px;
}

/* Floating dots */
.hero-dots{
  position:absolute;right:5%;top:15%;width:340px;height:340px;
  background-image:radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px);
  background-size:28px 28px;pointer-events:none;
  mask-image:radial-gradient(ellipse 60% 60% at 50% 50%,black 30%,transparent 100%);
  opacity:.5;
}

.hero-content{position:relative;z-index:2;max-width:720px;}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  padding:5px 14px 5px 5px;
  background:rgba(229,9,20,0.12);border:1px solid rgba(229,9,20,0.3);
  border-radius:100px;margin-bottom:32px;
}
.hero-eyebrow-dot{
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#e50914,#ff4444);
  display:flex;align-items:center;justify-content:center;font-size:.9rem;
}
.hero-eyebrow-txt{
  font-family:'Outfit',sans-serif;font-size:.7rem;font-weight:700;
  letter-spacing:2px;color:#ff6b6b;text-transform:uppercase;
}
.hero-h1{
  font-family:'Outfit',sans-serif!important;
  font-size:clamp(3.5rem,7.5vw,6.5rem)!important;
  font-weight:900!important;line-height:.95!important;
  letter-spacing:-3px!important;color:#fff!important;
  margin-bottom:28px!important;
  -webkit-text-fill-color:unset!important;
}
.hero-h1 .acc{
  background:linear-gradient(135deg,#e50914 0%,#ff6060 45%,#ffaa33 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.hero-sub{
  font-family:'Inter',sans-serif;font-size:1.1rem;color:#999;
  line-height:1.75;max-width:520px;margin-bottom:48px;
}

/* Stats pills */
.stats-row{display:flex;gap:12px;margin-bottom:48px;flex-wrap:wrap;}
.stat-pill{
  display:flex;align-items:center;gap:10px;
  padding:10px 20px;border-radius:100px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.09);
  backdrop-filter:blur(8px);
}
.stat-pill-num{
  font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:900;color:#fff;
}
.stat-pill-lbl{font-size:.72rem;color:#555;font-weight:600;letter-spacing:.5px;}

/* Genre cards row */
.genre-row{display:flex;gap:14px;margin-bottom:0;flex-wrap:wrap;}
.genre-card{
  display:flex;align-items:center;gap:10px;
  padding:14px 24px;border-radius:14px;
  font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;
  text-decoration:none!important;color:#fff!important;
  border:1px solid rgba(255,255,255,0.1);
  transition:all 0.3s cubic-bezier(.175,.885,.32,1.275);
  cursor:pointer;
}
.genre-card:hover{transform:translateY(-4px);}
.gc-telugu{background:linear-gradient(135deg,rgba(229,9,20,0.9),rgba(160,5,10,0.95));box-shadow:0 8px 32px rgba(229,9,20,0.35);}
.gc-hindi{background:linear-gradient(135deg,rgba(100,20,180,0.9),rgba(60,10,120,0.95));box-shadow:0 8px 32px rgba(100,20,180,0.3);}
.gc-telugu:hover{box-shadow:0 16px 48px rgba(229,9,20,0.5);}
.gc-hindi:hover{box-shadow:0 16px 48px rgba(100,20,180,0.45);}
.gc-icon{font-size:1.4rem;}
.gc-info{display:flex;flex-direction:column;}
.gc-label{font-size:1rem;font-weight:800;line-height:1.1;}
.gc-sub{font-size:.7rem;opacity:.65;font-weight:500;letter-spacing:.5px;margin-top:2px;}

/* ─── SEARCH SECTION ─── */
.ai-search-wrap{
  position:relative;margin:0 0 56px;
  background:rgba(255,255,255,0.025);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:24px;padding:40px 48px;
  overflow:hidden;
}
.ai-search-wrap::before{
  content:'';position:absolute;top:-1px;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(229,9,20,0.7),transparent);
}
.ai-search-wrap::after{
  content:'';position:absolute;bottom:0;right:0;
  width:280px;height:280px;
  background:radial-gradient(circle,rgba(229,9,20,0.06) 0%,transparent 70%);
  pointer-events:none;
}
.ai-header{display:flex;align-items:center;gap:18px;margin-bottom:20px;}
.ai-icon{
  width:52px;height:52px;border-radius:16px;flex-shrink:0;
  background:linear-gradient(135deg,#e50914,#ff6b6b);
  display:flex;align-items:center;justify-content:center;font-size:1.5rem;
  box-shadow:0 8px 20px rgba(229,9,20,0.35);
}
.ai-title{font-family:'Outfit',sans-serif;font-size:1.5rem;font-weight:800;color:#fff;}
.ai-desc{font-size:.85rem;color:#555;margin-top:3px;}
.ai-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
.ai-chip{
  padding:5px 14px;border-radius:100px;font-size:.75rem;font-weight:600;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);
  color:#888;
}

/* Responsive */
@media(max-width:768px){
  .hero-wrap{padding:70px 20px 40px;min-height:80vh;}
  .hero-dots{display:none;}
  .ai-search-wrap{padding:28px 22px;}
  .genre-card{padding:12px 18px;}
}
</style>""", unsafe_allow_html=True)

render_nav("home")


# ── HERO: 2-column layout ─────────────────────────────────────────────────────
import streamlit.components.v1 as _comps

hero_left, hero_right = st.columns([1, 1], gap="large")

with hero_left:
    st.markdown("""
    <div class="hero-wrap" style="min-height:unset;padding:40px 0 0;margin:0;">
      <div class="hero-glow-1" style="top:-10%;left:-20%;width:90%;height:100%;"></div>
      <div class="hero-grain"></div>
      <div class="hero-content" style="max-width:100%;">
        <div class="hero-eyebrow">
          <div class="hero-eyebrow-dot">🎬</div>
          <span class="hero-eyebrow-txt">AI-Powered Free Streaming</span>
        </div>
        <h1 class="hero-h1">Infinite Cinema.<br><span class="acc">Zero Limits.</span></h1>
        <p class="hero-sub">
          Telugu blockbusters, Hindi hits &amp; global cinema — all in one place.
          AI picks your next obsession. Stream free, forever.
        </p>
        <div class="stats-row">
          <div class="stat-pill"><span class="stat-pill-num">10K+</span><span class="stat-pill-lbl">Movies</span></div>
          <div class="stat-pill"><span class="stat-pill-num">HD</span><span class="stat-pill-lbl">Quality</span></div>
          <div class="stat-pill"><span class="stat-pill-num">Free</span><span class="stat-pill-lbl">Forever</span></div>
          <div class="stat-pill"><span class="stat-pill-num">Zero</span><span class="stat-pill-lbl">Ads</span></div>
        </div>
      </div>
    </div>
    """, unsafe_allow_html=True)

with hero_right:
    _comps.html("""
    <!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:transparent;overflow:hidden;height:520px;display:flex;align-items:center;justify-content:center;}
    .scene{
      width:320px;height:460px;
      perspective:900px;
      perspective-origin:50% 40%;
    }
    .cards-3d{
      width:100%;height:100%;
      position:relative;
      transform-style:preserve-3d;
      animation:slowSpin 18s ease-in-out infinite;
    }
    @keyframes slowSpin{
      0%   {transform:rotateX(10deg) rotateY(0deg);}
      25%  {transform:rotateX(6deg)  rotateY(22deg);}
      50%  {transform:rotateX(10deg) rotateY(0deg);}
      75%  {transform:rotateX(6deg)  rotateY(-22deg);}
      100% {transform:rotateX(10deg) rotateY(0deg);}
    }
    .card{
      position:absolute;
      width:200px;height:290px;
      border-radius:18px;
      transform-style:preserve-3d;
      cursor:pointer;
      transition:transform 0.4s ease;
      left:50%;top:50%;
      transform-origin:center center;
    }
    .card:hover{filter:brightness(1.15);}
    .card-face{
      position:absolute;inset:0;
      border-radius:18px;
      display:flex;flex-direction:column;
      justify-content:flex-end;padding:16px;
      backface-visibility:hidden;
      overflow:hidden;
      background-size: cover;
      background-position: center;
    }
    /* Card 1 — Telugu (front-center) */
    .c1{
      transform:translate(-50%,-50%) translateZ(80px) rotateY(0deg);
      animation:float1 4s ease-in-out infinite;
      z-index:3;
    }
    .c1 .card-face{
      background-image: linear-gradient(160deg, rgba(229,9,20,0.4), rgba(0,0,0,0.8)), url('https://image.tmdb.org/t/p/w500/n7m76YjZS78X5I7m7vJ2yS5Uv8.jpg');
      border:1px solid rgba(229,9,20,0.5);
      box-shadow:0 30px 80px rgba(229,9,20,0.5),inset 0 1px 0 rgba(255,255,255,0.1);
    }
    /* Card 2 — Hindi (left-back) */
    .c2{
      transform:translate(-50%,-50%) translateZ(-30px) translateX(-90px) rotateY(25deg);
      animation:float2 4.5s ease-in-out infinite;
      z-index:2;
    }
    .c2 .card-face{
      background-image: linear-gradient(160deg, rgba(124,58,237,0.4), rgba(0,0,0,0.8)), url('https://image.tmdb.org/t/p/w500/m1B96SYFnLZ67m709YpT9I3oSTa.jpg');
      border:1px solid rgba(124,58,237,0.5);
      box-shadow:0 25px 70px rgba(124,58,237,0.4),inset 0 1px 0 rgba(255,255,255,0.1);
    }
    /* Card 3 — Global (right-back) */
    .c3{
      transform:translate(-50%,-50%) translateZ(-30px) translateX(90px) rotateY(-25deg);
      animation:float3 5s ease-in-out infinite;
      z-index:2;
    }
    .c3 .card-face{
      background-image: linear-gradient(160deg, rgba(16,185,129,0.4), rgba(0,0,0,0.8)), url('https://image.tmdb.org/t/p/w500/gEU2QniE6EwfVDxCzs25vubU2Ky.jpg');
      border:1px solid rgba(16,185,129,0.5);
      box-shadow:0 25px 70px rgba(16,185,129,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
    }
    @keyframes float1{0%,100%{transform:translate(-50%,-50%) translateZ(80px) rotateY(0deg) translateY(0);}50%{transform:translate(-50%,-50%) translateZ(80px) rotateY(0deg) translateY(-16px);}}
    @keyframes float2{0%,100%{transform:translate(-50%,-50%) translateZ(-30px) translateX(-90px) rotateY(25deg) translateY(0);}50%{transform:translate(-50%,-50%) translateZ(-30px) translateX(-90px) rotateY(25deg) translateY(-10px);}}
    @keyframes float3{0%,100%{transform:translate(-50%,-50%) translateZ(-30px) translateX(90px) rotateY(-25deg) translateY(0);}50%{transform:translate(-50%,-50%) translateZ(-30px) translateX(90px) rotateY(-25deg) translateY(-12px);}}
    /* Poster content */
    .poster-tag{
      font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
      color:rgba(255,255,255,0.5);margin-bottom:6px;font-family:sans-serif;
    }
    .poster-title{
      font-size:18px;font-weight:900;color:#fff;line-height:1.1;
      font-family:sans-serif;text-shadow:0 2px 12px rgba(0,0,0,0.8);
      margin-bottom:8px;
    }
    .poster-meta{display:flex;align-items:center;gap:8px;}
    .poster-rating{
      font-size:11px;font-weight:700;color:#fbbf24;
      background:rgba(0,0,0,0.4);padding:3px 8px;border-radius:6px;
    }
    .poster-genre{
      font-size:10px;color:rgba(255,255,255,0.6);
      font-family:sans-serif;font-weight:600;
    }
    /* Poster illustration area */
    .poster-art{
      position:absolute;top:0;left:0;right:0;bottom:0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
      pointer-events:none;
    }
    /* Play button overlay */
    .play-overlay{
      position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);
      width:52px;height:52px;border-radius:50%;
      background:rgba(255,255,255,0.15);
      backdrop-filter:blur(8px);
      border:2px solid rgba(255,255,255,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:20px;color:#fff;
      animation:pulsePlay 2.5s ease-in-out infinite;
    }
    @keyframes pulsePlay{
      0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.2);}
      50%{box-shadow:0 0 0 14px rgba(255,255,255,0);}
    }
    /* Glow floor reflection */
    .floor-glow{
      position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);
      width:260px;height:60px;
      background:radial-gradient(ellipse,rgba(229,9,20,0.25) 0%,transparent 70%);
      filter:blur(16px);
      animation:float1 4s ease-in-out infinite;
    }
    /* Stars */
    .stars{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
    .star{
      position:absolute;border-radius:50%;background:#fff;
      animation:twinkle var(--d) ease-in-out infinite;
      opacity:0;
    }
    @keyframes twinkle{0%,100%{opacity:0;}50%{opacity:var(--op);}}
    /* Orbit ring */
    .orbit-ring{
      position:absolute;top:50%;left:50%;
      width:380px;height:380px;
      margin:-190px 0 0 -190px;
      border-radius:50%;
      border:1px solid rgba(229,9,20,0.12);
      animation:orbitSpin 20s linear infinite;
      pointer-events:none;
    }
    .orbit-ring2{
      width:480px;height:480px;margin:-240px 0 0 -240px;
      border-color:rgba(124,58,237,0.08);
      animation-duration:30s;animation-direction:reverse;
    }
    @keyframes orbitSpin{to{transform:rotate(360deg);}}
    .orbit-dot{
      position:absolute;top:-4px;left:50%;margin-left:-4px;
      width:8px;height:8px;border-radius:50%;
      background:rgba(229,9,20,0.8);
      box-shadow:0 0 8px rgba(229,9,20,0.6);
    }
    </style></head><body>
    <div style="position:relative;width:520px;height:520px;display:flex;align-items:center;justify-content:center;">
      <!-- Stars -->
      <div class="stars" id="stars"></div>
      <!-- Orbit rings -->
      <div class="orbit-ring"><div class="orbit-dot"></div></div>
      <div class="orbit-ring orbit-ring2"></div>
      <!-- 3D Scene -->
      <div class="scene">
        <div class="cards-3d" id="cards">
          <!-- Card 1: Telugu -->
          <div class="card c1" onclick="window.top.location.href='/telugu_cinema'">
            <div class="card-face">
              <div class="poster-art"></div>
              <div class="play-overlay">▶</div>
              <div class="poster-tag">🌶️ Tollywood</div>
              <div class="poster-title">RRR</div>
              <div class="poster-meta">
                <span class="poster-rating">★ 8.0</span>
                <span class="poster-genre">Action · Drama</span>
              </div>
            </div>
          </div>
          <!-- Card 2: Hindi -->
          <div class="card c2" onclick="window.top.location.href='/hindi_cinema'">
            <div class="card-face">
              <div class="poster-art"></div>
              <div class="poster-tag">✨ Bollywood</div>
              <div class="poster-title">Pathaan</div>
              <div class="poster-meta">
                <span class="poster-rating">★ 7.2</span>
                <span class="poster-genre">Thriller</span>
              </div>
            </div>
          </div>
          <!-- Card 3: Global -->
          <div class="card c3" onclick="window.top.location.href='/global_cinema'">
            <div class="card-face">
              <div class="poster-art"></div>
              <div class="poster-tag">🌍 Global</div>
              <div class="poster-title">Interstellar</div>
              <div class="poster-meta">
                <span class="poster-rating">★ 8.7</span>
                <span class="poster-genre">Sci-Fi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Floor glow -->
      <div class="floor-glow"></div>
    </div>
    <script>
    // Generate stars
    const sc = document.getElementById('stars');
    for(let i=0;i<55;i++){
      const s=document.createElement('div');
      s.className='star';
      const sz=Math.random()*2.5+0.5;
      s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*4}s;--op:${0.4+Math.random()*0.6};animation-delay:${Math.random()*4}s;`;
      sc.appendChild(s);
    }
    // Mouse parallax on the scene
    const cards=document.getElementById('cards');
    document.addEventListener('mousemove',e=>{
      const x=(e.clientX/window.innerWidth-0.5)*18;
      const y=(e.clientY/window.innerHeight-0.5)*-10;
      cards.style.transform=`rotateX(${10+y}deg) rotateY(${x}deg)`;
    });
    </script>
    </body></html>
    """, height=530, scrolling=False)


# ── GENRE NAVIGATION BUTTONS ─────────────────────────────────────────────────
# ── GENRE NAVIGATION BUTTONS ─────────────────────────────────────────────────
st.markdown("""
<style>
.btn-row{display:flex;gap:16px;padding:8px 0 24px;flex-wrap:wrap;margin-bottom:20px;}
.genre-link{text-decoration:none !important;}
.genre-btn{
  display:flex;align-items:center;gap:14px;
  padding:18px 32px;border-radius:16px;border:none;
  cursor:pointer;font-family:'Outfit',sans-serif;
  font-size:1rem;font-weight:800;color:#fff !important;
  position:relative;overflow:hidden;
  transition:all 0.3s cubic-bezier(.175,.885,.32,1.275);
  text-align:left;min-width:220px;
}
.genre-btn:hover{transform:translateY(-8px) scale(1.02); filter: brightness(1.1); box-shadow: 0 12px 32px rgba(0,0,0,0.3);}
.genre-btn:active{transform:translateY(-2px) scale(0.98); filter: brightness(0.9);}
.btn-telugu{background:linear-gradient(135deg,#ff0a16 0%,#e50914 40%,#c20000 100%);box-shadow:0 8px 28px rgba(229,9,20,0.4);}
.btn-hindi{background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 40%,#5b21b6 100%);box-shadow:0 8px 28px rgba(139,92,246,0.4);}
.btn-global{background:linear-gradient(135deg,#10b981 0%,#059669 40%,#047857 100%);box-shadow:0 8px 28px rgba(16,185,129,0.4);}
.btn-icon{font-size:1.5rem;line-height:1;}
.btn-info{display:flex;flex-direction:column;gap:2px;}
.btn-label{font-size:1rem;font-weight:900;letter-spacing:-0.3px;}
.btn-sub{font-size:0.7rem;font-weight:600;opacity:0.65;letter-spacing:1px;text-transform:uppercase;}
</style>
<div class="btn-row">
  <a href="/telugu_cinema" class="genre-link" target="_self">
    <button class="genre-btn btn-telugu">
      <span class="btn-icon">🌶️</span>
      <div class="btn-info"><span class="btn-label">Telugu Cinema</span><span class="btn-sub">Tollywood · 500+ Films</span></div>
    </button>
  </a>
  <a href="/hindi_cinema" class="genre-link" target="_self">
    <button class="genre-btn btn-hindi">
      <span class="btn-icon">✨</span>
      <div class="btn-info"><span class="btn-label">Hindi Cinema</span><span class="btn-sub">Bollywood · 500+ Films</span></div>
    </button>
  </a>
  <a href="/global_cinema" class="genre-link" target="_self">
    <button class="genre-btn btn-global">
      <span class="btn-icon">🌍</span>
      <div class="btn-info"><span class="btn-label">Global Cinema</span><span class="btn-sub">Hollywood · 1000+ Films</span></div>
    </button>
  </a>
</div>
""", unsafe_allow_html=True)

# AI Search
st.markdown("""
<div class="ai-search-wrap">
  <div class="ai-header">
    <div class="ai-icon">🤖</div>
    <div>
      <div class="ai-title">AI Movie Recommendations</div>
      <div class="ai-desc">Type a movie you love — our AI finds your next obsession instantly</div>
    </div>
  </div>
  <div class="ai-chips">
    <span class="ai-chip">🎭 Drama</span>
    <span class="ai-chip">💥 Action</span>
    <span class="ai-chip">😂 Comedy</span>
    <span class="ai-chip">💕 Romance</span>
    <span class="ai-chip">🔬 Sci-Fi</span>
    <span class="ai-chip">🔪 Thriller</span>
  </div>
</div>
""", unsafe_allow_html=True)

# ── ML DATA ───────────────────────────────────────────────────────────────────
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
    selected_movie = st.selectbox("Pick a movie:", movie_list, index=default_index, label_visibility="collapsed")
with col2:
    show_recs = st.button("🎯 Find Similar", use_container_width=True)

# ── RECOMMENDATIONS ───────────────────────────────────────────────────────────
if show_recs or ("recs" in st.query_params):
    if show_recs:
        st.query_params["recs"] = "1"
        st.query_params["movie"] = selected_movie
    with st.spinner("🤖 Finding your perfect matches..."):
        r_names, r_years, r_ratings, r_ids, r_details = _rec_engine(selected_movie, movies, similarity)
    if r_names:
        st.markdown(f"""<div style="padding:40px 0 16px">
          <div class="section-title">🎯 Because You Like <em style="color:#e50914">{selected_movie}</em></div>
        </div>""", unsafe_allow_html=True)
        render_movie_cards(r_names, r_years, r_ratings, r_ids, r_details, selected_movie)
    else:
        st.info("No recommendations found. Try another movie.")
else:
    # ── TRENDING ──────────────────────────────────────────────────────────────
    try:
        with st.spinner("⚡ Loading trending movies…"):
            trending = fetch_trending()
        if trending:
            hero_det = fetch_movie_details(str(trending[0]["id"]))
            render_hero_banner(trending[0], hero_det)
            st.markdown("""<div style="padding:40px 0 16px">
              <div class="section-title">🔥 Trending This Week
                <span style="font-size:.72rem;margin-left:12px;padding:4px 14px;border-radius:100px;
                  background:rgba(229,9,20,.1);border:1px solid rgba(229,9,20,.3);color:#e50914;vertical-align:middle">
                  ● LIVE
                </span>
              </div></div>""", unsafe_allow_html=True)
            render_section(trending[1:]) # Skip the first one as it's in the hero banner

            # ── ENHANCED REGIONAL DASHBOARD ───────────────────────────────────
            from backend import fetch_telugu_movies, fetch_hindi_movies, fetch_global_movies
            
            # ROW 1: TELUGU
            st.markdown('<div style="padding:40px 0 16px"><div class="section-title">🎬 New Telugu Releases</div></div>', unsafe_allow_html=True)
            te = fetch_telugu_movies()
            if te: render_section(list(te.values())[0])

            # ROW 2: HINDI
            st.markdown('<div style="padding:40px 0 16px"><div class="section-title">🌟 Hindi Super Hits</div></div>', unsafe_allow_html=True)
            hi = fetch_hindi_movies()
            if hi: render_section(list(hi.values())[0])

            # ROW 3: GLOBAL
            st.markdown('<div style="padding:40px 0 16px"><div class="section-title">🌍 Global Blockbusters</div></div>', unsafe_allow_html=True)
            gl = fetch_global_movies()
            if gl: render_section(list(gl.values())[0])

            # ROW 4: ACTION & DRAMA (Mixed)
            st.markdown('<div style="padding:40px 0 16px"><div class="section-title">🔥 Action & Drama Special</div></div>', unsafe_allow_html=True)
            if te and len(te) > 1: render_section(list(te.values())[1])
        else:
            st.warning("⚠️ Could not load trending movies. Please refresh.")
    except Exception as e:
        st.error(f"❌ Error: {e}")

# ── FOOTER ────────────────────────────────────────────────────────────────────
st.markdown("""
<div style="margin-top:100px;padding:56px 48px 40px;
  background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.7) 100%);
  border-top:1px solid rgba(255,255,255,0.05)">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:40px;margin-bottom:48px">
    <div>
      <div style="font-family:'Outfit',sans-serif;font-size:2rem;font-weight:900;
        background:linear-gradient(135deg,#e50914,#ff6b6b);-webkit-background-clip:text;
        -webkit-text-fill-color:transparent;margin-bottom:10px">iBOMMA RAHUL</div>
      <div style="color:#444;font-size:.85rem;max-width:280px;line-height:1.6">
        Premium free streaming powered by AI recommendation engine.
      </div>
    </div>
    <div style="display:flex;gap:60px;flex-wrap:wrap">
      <div>
        <div style="color:#fff;font-weight:700;font-size:.85rem;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px">Cinema</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <a href="/telugu_cinema" style="color:#555;font-size:.85rem;text-decoration:none">Telugu Cinema</a>
          <a href="/hindi_cinema" style="color:#555;font-size:.85rem;text-decoration:none">Hindi Cinema</a>
        </div>
      </div>
      <div>
        <div style="color:#fff;font-weight:700;font-size:.85rem;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px">Features</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="color:#555;font-size:.85rem">AI Recommendations</span>
          <span style="color:#555;font-size:.85rem">HD Streaming</span>
          <span style="color:#555;font-size:.85rem">Zero Ads</span>
        </div>
      </div>
    </div>
  </div>
  <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:28px;
    display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
    <div style="color:#333;font-size:.75rem;letter-spacing:.5px">
      © 2026 iBOMMA RAHUL — All rights reserved
    </div>
    <div style="color:#333;font-size:.75rem">Built with ❤️ for cinema lovers</div>
  </div>
</div>""", unsafe_allow_html=True)
