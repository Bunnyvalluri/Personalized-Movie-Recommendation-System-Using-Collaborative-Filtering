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
    st.markdown('<meta http-equiv="refresh" content="0; url=/telugu_cinema">', unsafe_allow_html=True)
    st.stop()
elif nav_target == "hindi":
    st.markdown('<meta http-equiv="refresh" content="0; url=/hindi_cinema">', unsafe_allow_html=True)
    st.stop()

# ── PLAYER ROUTE ──────────────────────────────────────────────────────────────
if "watch" in st.query_params:
    import streamlit.components.v1 as components
    mid      = st.query_params.get("watch", "")
    mtitle   = st.query_params.get("title", "Movie")
    from_m   = st.query_params.get("from", "")
    me       = _html.escape(mtitle)
    back_url = f"/?recs=1&movie={_q(from_m)}" if from_m else "/"
    srv = {
        "v1": f"https://vidsrc.in/embed/movie/{mid}",
        "v2": f"https://vidsrc.cc/v2/embed/movie/{mid}",
        "v3": f"https://multiembed.mov/directstream.php?video_id={mid}&tmdb=1",
        "v4": f"https://vidsrc.to/embed/movie/{mid}",
        "v5": f"https://embed.su/embed/movie/{mid}",
        "v6": f"https://vidsrc.rip/embed/movie/{mid}",
    }
    sj = json.dumps(srv)
    st.markdown("""<style>.stApp>header,.block-container,footer,#MainMenu{display:none!important;}
    .block-container{padding:0!important;max-width:100%!important;}</style>""", unsafe_allow_html=True)
    components.html(f"""<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&display=swap');
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#000;font-family:'Outfit',sans-serif;color:#fff;height:100vh;display:flex;flex-direction:column}}
#pw{{flex:1;position:relative}}#pf{{width:100%;height:100%;border:none}}
.bar{{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#080808;border-bottom:1px solid #1a1a1a}}
.logo{{font-weight:900;background:linear-gradient(135deg,#e50914,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}}
.back{{color:#888;text-decoration:none;font-size:13px;font-weight:700;padding:6px 14px;border:1px solid #333;border-radius:20px}}
.ttl{{flex:1;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.srvs{{display:flex;gap:6px;flex-wrap:wrap}}
.sb{{font-size:11px;padding:5px 12px;border-radius:20px;border:1px solid #333;background:transparent;color:#888;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:700}}
.sb:hover,.sb.active{{background:#e50914;border-color:#e50914;color:#fff}}
#pl{{position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px}}
#pl.h{{opacity:0;pointer-events:none}}.sp{{width:40px;height:40px;border:3px solid #222;border-top-color:#e50914;border-radius:50%;animation:sp 1s linear infinite}}
@keyframes sp{{to{{transform:rotate(360deg)}}}}
</style></head><body>
<div class="bar"><a href="{back_url}" class="back">← Back</a><div class="logo">iBOMMA</div>
<div class="ttl">{me}</div><div class="srvs" id="s"></div></div>
<div id="pw"><div id="pl"><div class="sp"></div><div style="color:#666;font-size:13px" id="pt">Loading...</div></div>
<iframe id="pf" allowfullscreen allow="autoplay;fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe></div>
<script>
var sv={sj},OR=["v1","v2","v3","v4","v5","v6"],
nm={{"v1":"VidSrc IN","v2":"VidSrc CC","v3":"MultiEmbed","v4":"VidSrc","v5":"Embed.su","v6":"VidSrc RIP"}},
ck=OR[0],tm,ac=true,rl=false,
pl=document.getElementById('pl'),pt=document.getElementById('pt'),pf=document.getElementById('pf'),se=document.getElementById('s');
OR.forEach(k=>{{var b=document.createElement('button');b.className='sb';b.dataset.key=k;b.textContent=nm[k];b.onclick=()=>ls(k);se.appendChild(b);}});
function sa(k){{document.querySelectorAll('.sb').forEach(b=>b.classList.toggle('active',b.dataset.key===k));}}
function sl(k){{pl.classList.remove('h');pt.textContent='Connecting to '+nm[k]+'...';}}
function st2(k){{clearTimeout(tm);tm=setTimeout(()=>{{if(!pl.classList.contains('h')){{var ni=OR.indexOf(k)+1;if(ni<OR.length&&ac){{var nk=OR[ni];sa(nk);sl(nk);pf.src=sv[nk];st2(nk);}}else pl.classList.add('h');}}}},6000);}}
function ls(k){{ac=false;sa(k);sl(k);pf.src=sv[k];st2(k);}}
pf.onload=()=>{{if(rl){{clearTimeout(tm);pl.classList.add('h');}}}};
setTimeout(()=>{{rl=true;sa(ck);sl(ck);pf.src=sv[ck];st2(ck);}},100);
</script></body></html>""", height=900, scrolling=True)
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
    }
    /* Card 1 — Telugu (front-center) */
    .c1{
      transform:translate(-50%,-50%) translateZ(80px) rotateY(0deg);
      animation:float1 4s ease-in-out infinite;
      z-index:3;
    }
    .c1 .card-face{
      background:linear-gradient(160deg,#1a0a00 0%,#3d0000 40%,#8b0000 70%,#e50914 100%);
      border:1px solid rgba(229,9,20,0.5);
      box-shadow:0 30px 80px rgba(229,9,20,0.5),inset 0 1px 0 rgba(255,255,255,0.15);
    }
    /* Card 2 — Hindi (left-back) */
    .c2{
      transform:translate(-50%,-50%) translateZ(-30px) translateX(-90px) rotateY(25deg);
      animation:float2 4.5s ease-in-out infinite;
      z-index:2;
    }
    .c2 .card-face{
      background:linear-gradient(160deg,#080018 0%,#1a0038 40%,#4a00a8 70%,#7c3aed 100%);
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
      background:linear-gradient(160deg,#001a10 0%,#003828 40%,#007040 70%,#10b981 100%);
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
      display:flex;align-items:center;justify-content:center;
      opacity:0.15;font-size:90px;
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
          <div class="card c1">
            <div class="card-face">
              <div class="poster-art">🎭</div>
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
          <div class="card c2">
            <div class="card-face">
              <div class="poster-art">✨</div>
              <div class="poster-tag">✨ Bollywood</div>
              <div class="poster-title">Pathaan</div>
              <div class="poster-meta">
                <span class="poster-rating">★ 7.2</span>
                <span class="poster-genre">Thriller</span>
              </div>
            </div>
          </div>
          <!-- Card 3: Global -->
          <div class="card c3">
            <div class="card-face">
              <div class="poster-art">🌍</div>
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
import streamlit.components.v1 as _btns
_btns.html("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{background:transparent;font-family:'Outfit',sans-serif;}
.btn-row{display:flex;gap:16px;padding:8px 0 4px;flex-wrap:wrap;}
.genre-btn{
  display:flex;align-items:center;gap:14px;
  padding:18px 32px;border-radius:16px;border:none;
  cursor:pointer;font-family:'Outfit',sans-serif;
  font-size:1rem;font-weight:800;color:#fff;
  position:relative;overflow:hidden;
  transition:transform 0.25s cubic-bezier(.175,.885,.32,1.275),
             box-shadow 0.25s ease;
  text-align:left;min-width:220px;
}
.genre-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(rgba(255,255,255,0.12),transparent);
  pointer-events:none;
}
.genre-btn:hover{transform:translateY(-5px);}
.genre-btn:active{transform:translateY(-2px);}
/* Telugu — vivid red-orange */
.btn-telugu{
  background:linear-gradient(135deg,#ff0a16 0%,#e50914 40%,#c20000 100%);
  box-shadow:0 8px 28px rgba(229,9,20,0.5),
             0 2px 8px rgba(229,9,20,0.3),
             inset 0 1px 0 rgba(255,255,255,0.2);
}
.btn-telugu:hover{
  box-shadow:0 18px 48px rgba(229,9,20,0.65),
             0 4px 16px rgba(229,9,20,0.4),
             inset 0 1px 0 rgba(255,255,255,0.25);
}
/* Hindi — vivid violet-indigo */
.btn-hindi{
  background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 40%,#5b21b6 100%);
  box-shadow:0 8px 28px rgba(139,92,246,0.5),
             0 2px 8px rgba(124,58,237,0.3),
             inset 0 1px 0 rgba(255,255,255,0.2);
}
.btn-hindi:hover{
  box-shadow:0 18px 48px rgba(139,92,246,0.65),
             0 4px 16px rgba(124,58,237,0.4),
             inset 0 1px 0 rgba(255,255,255,0.25);
}
.btn-icon{font-size:1.5rem;line-height:1;}
.btn-info{display:flex;flex-direction:column;gap:2px;}
.btn-label{font-size:1rem;font-weight:900;letter-spacing:-0.3px;}
.btn-sub{font-size:0.7rem;font-weight:600;opacity:0.65;letter-spacing:1px;text-transform:uppercase;}
/* Shine animation */
@keyframes shine{0%{left:-120%}60%,100%{left:120%}}
.genre-btn::after{
  content:'';position:absolute;top:0;left:-120%;
  width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
  animation:shine 3.5s ease-in-out infinite;
}
.btn-hindi::after{animation-delay:1.75s;}
</style>
<div class="btn-row">
  <button class="genre-btn btn-telugu" onclick="window.parent.location.href='/telugu_cinema'">
    <span class="btn-icon">🌶️</span>
    <div class="btn-info">
      <span class="btn-label">Telugu Cinema</span>
      <span class="btn-sub">Tollywood · 500+ Films</span>
    </div>
  </button>
  <button class="genre-btn btn-hindi" onclick="window.parent.location.href='/hindi_cinema'">
    <span class="btn-icon">✨</span>
    <div class="btn-info">
      <span class="btn-label">Hindi Cinema</span>
      <span class="btn-sub">Bollywood · 500+ Films</span>
    </div>
  </button>
</div>
""", height=100)

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
            render_section(trending)
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
