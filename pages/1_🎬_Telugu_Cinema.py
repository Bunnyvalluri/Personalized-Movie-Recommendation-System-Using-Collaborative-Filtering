"""Telugu Cinema Page."""
import streamlit as st
from backend import fetch_telugu_movies
from ui import inject_base_css, render_nav, render_cinema_tabs

st.set_page_config(
    layout="wide",
    page_title="Telugu Cinema — iBOMMA RAHUL",
    page_icon="🎬",
    initial_sidebar_state="collapsed",
)

inject_base_css()
render_nav("telugu")

# ── Section Header ─────────────────────────────────────────────────────────────
st.markdown("""
<div style="padding: 40px 0 10px;">
  <div class="te-header">
    <span style="font-size:2.5rem;">🎬</span>
    <span class="label">Telugu Cinema</span>
    <span class="tag">🌶️ TOLLYWOOD</span>
  </div>
  <p style="color:#888;font-size:1rem;margin-bottom:24px;line-height:1.7;">
    The best of Tollywood — popular blockbusters, top-rated classics, latest releases, 
    action hits, and timeless dramas. All in one place.
  </p>
</div>
<div class="te-section">
""", unsafe_allow_html=True)

# ── Fetch & Render ─────────────────────────────────────────────────────────────
try:
    with st.spinner("⚡ Loading Telugu movies…"):
        telugu = fetch_telugu_movies()

    if not isinstance(telugu, dict):
        telugu = {}

    if any(v for v in telugu.values()):
        render_cinema_tabs(telugu, "te-section")
    else:
        st.warning("⚠️ Could not load Telugu movies right now. Please refresh the page.")
except Exception as e:
    st.error(f"❌ Error loading Telugu Cinema: {e}")

st.markdown("</div>", unsafe_allow_html=True)

st.markdown("""
<div style="margin-top:60px;padding:40px;background:rgba(0,0,0,.5);
     border-top:1px solid rgba(255,255,255,.05);text-align:center;
     color:#444;font-size:.8rem;letter-spacing:1px;">
  © 2026 iBOMMA RAHUL — TOLLYWOOD COLLECTION
</div>""", unsafe_allow_html=True)
