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


def fetch_movie_details(movie_id):
    """Fetches poster, trailer, overview, and genres from TMDB API."""
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US&append_to_response=videos"
    headers = {"User-Agent": "Mozilla/5.0"}

    details = {
        'poster': "https://placehold.co/500x750/333/FFFFFF?text=No+Poster",
        'trailer': None,
        'overview': "No plot summary available.",
        'genres': ""
    }

    def parse_data(data):
        if not isinstance(data, dict):
            return
        if data.get('poster_path'):
            details['poster'] = "https://media.themoviedb.org/t/p/w500" + data['poster_path']
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

    try:
        data = session.get(tmdb_url, headers=headers, timeout=5).json()
        parse_data(data)
        return details
    except Exception:
        pass

    try:
        proxy_url = "https://api.allorigins.win/raw?url=" + tmdb_url
        data = session.get(proxy_url, headers=headers, timeout=6).json()
        parse_data(data)
    except Exception:
        pass

    return details


def fetch_trending():
    """Fetches the top 5 trending movies of the week from TMDB."""
    url = "https://api.themoviedb.org/3/trending/movie/week?api_key=8265bd1679663a7ea12ac168da84d2e8"
    try:
        data = session.get(url, timeout=5).json()
        return data.get('results', [])[:5]
    except Exception:
        return []


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

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
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
st.set_page_config(layout="wide", page_title="iBOMMA Rahul")

# ─── CSS ──────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

header {visibility: hidden;}
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}

.stApp {
    background: radial-gradient(circle at top, #2b0000 0%, #0a0a0a 50%, #000000 100%);
    background-attachment: fixed;
    color: #e5e5e5;
    font-family: 'Outfit', sans-serif !important;
}

.hero-title {
    font-family: 'Outfit', sans-serif;
    color: #e50914;
    font-weight: 800;
    font-size: 4.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 30px rgba(229,9,20,0.5);
}
.hero-subtitle {
    text-align: center;
    color: #a3a3a3;
    font-size: 1.2rem;
    margin-bottom: 3rem;
    font-weight: 300;
    letter-spacing: 1px;
}

.stSelectbox label {
    color: #fff !important;
    font-size: 1.1rem;
    text-align: center;
    width: 100%;
}
div[data-baseweb="select"] > div {
    background-color: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    border-radius: 8px;
    transition: border-color 0.3s;
}
div[data-baseweb="select"] > div:hover {
    border-color: #e50914;
}

.stButton {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}
.stButton>button {
    background: linear-gradient(90deg, #e50914 0%, #b8000b 100%) !important;
    color: white !important;
    border: none !important;
    padding: 12px 40px !important;
    border-radius: 30px !important;
    font-weight: 600 !important;
    font-size: 1.2rem !important;
    box-shadow: 0 4px 15px rgba(229,9,20,0.4) !important;
    transition: all 0.3s ease !important;
}
.stButton>button:hover {
    transform: scale(1.05) translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(229,9,20,0.6) !important;
}

.movie-row {
    display: flex;
    gap: 30px;
    padding: 20px 10px 50px 10px;
    flex-wrap: wrap;
    justify-content: center;
}

@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

.movie-card {
    flex: 0 0 auto;
    width: 230px;
    background: rgba(24, 24, 24, 0.4);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    cursor: pointer;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.6s ease forwards;
    display: flex;
    flex-direction: column;
}
.movie-card:nth-child(1) { animation-delay: 0.1s; }
.movie-card:nth-child(2) { animation-delay: 0.2s; }
.movie-card:nth-child(3) { animation-delay: 0.3s; }
.movie-card:nth-child(4) { animation-delay: 0.4s; }
.movie-card:nth-child(5) { animation-delay: 0.5s; }
.movie-card:hover {
    transform: scale(1.05) translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(229, 9, 20, 0.3);
    border-color: rgba(229, 9, 20, 0.5);
    z-index: 10;
}

.movie-poster {
    width: 100%;
    height: 345px;
    object-fit: cover;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.movie-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.movie-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 6px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.movie-meta {
    font-size: 12px;
    color: #a3a3a3;
    margin-bottom: 8px;
    text-align: center;
}
.movie-genres {
    font-size: 11px;
    color: #e50914;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 10px;
}
.movie-overview {
    font-size: 11px;
    color: #888;
    line-height: 1.4;
    margin-bottom: 15px;
    text-align: center;
    flex-grow: 1;
}
.rating-star { color: #e50914; font-weight: 800; }

.btn-group { display: flex; gap: 8px; margin-top: auto; }
.watch-btn, .trailer-btn {
    flex: 1;
    padding: 8px 4px;
    text-align: center;
    border-radius: 6px;
    text-decoration: none !important;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.3s ease;
}
.watch-btn {
    background: linear-gradient(90deg, #e50914 0%, #b8000b 100%);
    color: white !important;
    box-shadow: 0 4px 15px rgba(229,9,20,0.3);
}
.watch-btn:hover {
    background: linear-gradient(90deg, #f40612 0%, #e50914 100%);
    box-shadow: 0 6px 20px rgba(229,9,20,0.6);
}
.trailer-btn {
    background: rgba(255,255,255,0.1);
    color: white !important;
    border: 1px solid rgba(255,255,255,0.2);
}
.trailer-btn:hover {
    background: rgba(255,255,255,0.2);
    border-color: #fff;
}
.section-title {
    color: white;
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    font-size: 2.2rem;
    margin-top: 40px;
    margin-bottom: 10px;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero-title">iBOMMA RAHUL</div>
<div class="hero-subtitle">Discover and stream your next favorite movie instantly.</div>
""", unsafe_allow_html=True)

# ─── LOAD DATA ────────────────────────────────────────────────────────────────
try:
    movies_dict = pickle.load(open('artifacts/movie_dict.pkl', 'rb'))
    movies = pd.DataFrame(movies_dict)

    if not os.path.exists('artifacts/similarity.pkl'):
        with st.spinner("Initializing AI Model... (First time only, please wait)"):
            cv = CountVectorizer(max_features=5000, stop_words='english')
            vectors = cv.fit_transform(movies['tags']).toarray()
            similarity = cosine_similarity(vectors)
            pickle.dump(similarity, open('artifacts/similarity.pkl', 'wb'))
    else:
        similarity = pickle.load(open('artifacts/similarity.pkl', 'rb'))

except FileNotFoundError:
    st.error("❌ Core dataset 'movie_dict.pkl' not found in the 'artifacts/' folder.")
    st.stop()
except Exception as e:
    st.error(f"❌ Failed to load data: {e}")
    st.stop()

# ─── MOVIE SELECTOR ───────────────────────────────────────────────────────────
movie_list = movies['title'].values
selected_movie = st.selectbox(
    "What's your favorite movie? Let's find similar ones:",
    movie_list
)


# ─── RENDER CARDS ─────────────────────────────────────────────────────────────
def render_movie_cards(titles, years, ratings, ids, details_list):
    html_content = '<div class="movie-row">'
    for i in range(len(titles)):
        year = years[i] if years[i] else 'N/A'
        rating = ratings[i] if ratings[i] else 'N/A'
        movie_id = str(ids[i])
        d = details_list[i] if details_list[i] else {
            'poster': "https://placehold.co/500x750/333/FFFFFF?text=No+Poster",
            'trailer': None, 'overview': '', 'genres': ''
        }

        trailer_html = f'<a href="{d["trailer"]}" target="_blank" class="trailer-btn">🎬 Trailer</a>' if d.get("trailer") else ''

        html_content += f'''
        <div class="movie-card">
            <img src="{d["poster"]}" class="movie-poster" alt="{titles[i]}" onerror="this.src='https://placehold.co/500x750/333/FFFFFF?text=No+Poster'">
            <div class="movie-info">
                <div class="movie-title" title="{titles[i]}">{titles[i]}</div>
                <div class="movie-meta">{year} &nbsp;•&nbsp; <span class="rating-star">{rating} ⭐</span></div>
                <div class="movie-genres">{d.get("genres", "")}</div>
                <div class="movie-overview">{d.get("overview", "")}</div>
                <div class="btn-group">
                    <a href="https://vidsrc.rip/embed/movie/{movie_id}" target="_blank" class="watch-btn">▶ Watch</a>
                    {trailer_html}
                </div>
            </div>
        </div>'''
    html_content += '</div>'
    st.markdown(html_content, unsafe_allow_html=True)


# ─── MAIN LOGIC ───────────────────────────────────────────────────────────────
if st.button('🎬 Show Recommendations'):
    with st.spinner('Curating recommendations...'):
        r_names, r_years, r_ratings, r_ids, r_details = recommend(selected_movie)

    if r_names:
        st.markdown("<div class='section-title'>🎯 Top Picks For You</div>", unsafe_allow_html=True)
        render_movie_cards(r_names, r_years, r_ratings, r_ids, r_details)
    else:
        st.warning("No recommendations found. Try another movie!")
else:
    # On load, show Trending movies
    with st.spinner('Loading Trending Movies...'):
        trending = fetch_trending()
        if trending:
            t_ids = [str(m['id']) for m in trending]
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                t_details = list(executor.map(fetch_movie_details, t_ids))

            t_names = [m.get('title', 'Unknown') for m in trending]
            t_years = [safe_year(m.get('release_date', '')) for m in trending]
            t_ratings = [safe_rating(m.get('vote_average', 0)) for m in trending]

            st.markdown("<div class='section-title'>🔥 Trending This Week</div>", unsafe_allow_html=True)
            render_movie_cards(t_names, t_years, t_ratings, t_ids, t_details)
        else:
            st.info("Could not load trending movies. Please check your internet connection.")
