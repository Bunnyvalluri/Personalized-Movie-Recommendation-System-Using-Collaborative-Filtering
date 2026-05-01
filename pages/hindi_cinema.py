"""Hindi Cinema Page."""
import streamlit as st
from backend import fetch_hindi_movies
from ui import inject_base_css, render_nav, render_cinema_tabs

st.set_page_config(
    layout="wide",
    page_title="Hindi Cinema — iBOMMA RAHUL",
    page_icon="🌟",
    initial_sidebar_state="collapsed",
)

inject_base_css()
render_nav("hindi")

# ── Section Header ─────────────────────────────────────────────────────────────
st.markdown("""
<div style="padding: 40px 0 10px;">
  <div class="hi-header">
    <span style="font-size:2.5rem;">🌟</span>
    <span class="label">Hindi Cinema</span>
    <span class="tag">🎬 BOLLYWOOD</span>
  </div>
  <p style="color:#888;font-size:1rem;margin-bottom:24px;line-height:1.7;">
    The best of Bollywood — blockbuster hits, golden era classics, top-rated dramas, 
    action thrillers, and laugh-out-loud comedies. All curated for you.
  </p>
</div>
<div class="hi-section">
""", unsafe_allow_html=True)

# ── Fetch & Render ─────────────────────────────────────────────────────────────
try:
    with st.spinner("⚡ Loading Hindi movies…"):
        hindi = fetch_hindi_movies()

    if not isinstance(hindi, dict):
        hindi = {}

    if any(v for v in hindi.values()):
        render_cinema_tabs(hindi, "hi-section")
    else:
        st.warning("⚠️ Could not load Hindi movies right now. Please refresh the page.")
except Exception as e:
    st.error(f"❌ Error loading Hindi Cinema: {e}")

st.markdown("</div>", unsafe_allow_html=True)

st.markdown("""
<div style="margin-top:60px;padding:40px;background:rgba(0,0,0,.5);
     border-top:1px solid rgba(255,255,255,.05);text-align:center;
     color:#444;font-size:.8rem;letter-spacing:1px;">
  © 2026 iBOMMA RAHUL — BOLLYWOOD COLLECTION
</div>""", unsafe_allow_html=True)
