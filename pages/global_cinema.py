"""Global Cinema Page."""
import streamlit as st
from backend import fetch_global_movies
from ui import inject_base_css, render_nav, render_cinema_tabs

st.set_page_config(
    layout="wide",
    page_title="Global Cinema — iBOMMA RAHUL",
    page_icon="🌍",
    initial_sidebar_state="collapsed",
)

inject_base_css()
render_nav("global")

# ── Section Header ─────────────────────────────────────────────────────────────
st.markdown("""
<div style="padding: 40px 0 10px;">
  <div class="gl-header">
    <span style="font-size:2.5rem;">🌍</span>
    <span class="label">Global Cinema</span>
    <span class="tag">🎬 HOLLYWOOD & BEYOND</span>
  </div>
  <p style="color:#888;font-size:1rem;margin-bottom:24px;line-height:1.7;">
    The best of Hollywood and World Cinema — popular hits, top-rated masterpieces, 
    latest sci-fi, and global blockbusters.
  </p>
</div>
<div class="gl-section">
""", unsafe_allow_html=True)

# ── Fetch & Render ─────────────────────────────────────────────────────────────
try:
    with st.spinner("⚡ Loading Global movies…"):
        global_movies = fetch_global_movies()

    if not isinstance(global_movies, dict):
        global_movies = {}

    if any(v for v in global_movies.values()):
        render_cinema_tabs(global_movies, "gl-section")
    else:
        st.warning("⚠️ Could not load Global movies right now. Please refresh the page.")
except Exception as e:
    st.error(f"❌ Error loading Global Cinema: {e}")

st.markdown("</div>", unsafe_allow_html=True)

st.markdown("""
<div style="margin-top:60px;padding:40px;background:rgba(0,0,0,.5);
     border-top:1px solid rgba(255,255,255,.05);text-align:center;
     color:#444;font-size:.8rem;letter-spacing:1px;">
  © 2026 iBOMMA RAHUL — GLOBAL COLLECTION
</div>""", unsafe_allow_html=True)
