'''
Author: Bappy Ahmed
Email: entbappy73@gmail.com
Date: 2021-Nov-15
Updated by: Malhar Nikam
'''

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

def fetch_poster(movie_id):
    """Fetches the movie poster URL from TMDB API."""
    tmdb_url = "https://api.themoviedb.org/3/movie/{}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US".format(movie_id)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    # Try direct connection first
    try:
        data = session.get(tmdb_url, headers=headers, timeout=4)
        if data.status_code == 200:
            poster_path = data.json().get('poster_path')
            if poster_path:
                return "https://media.themoviedb.org/t/p/w500" + poster_path
    except Exception:
        pass
        
    # Fallback to proxy if blocked
    proxy_url = "https://api.allorigins.win/raw?url=" + tmdb_url
    try:
        data = session.get(proxy_url, headers=headers, timeout=5)
        if data.status_code == 200:
            poster_path = data.json().get('poster_path')
            if poster_path:
                return "https://media.themoviedb.org/t/p/w500" + poster_path
    except Exception:
        pass
        
    return "https://placehold.co/500x750/333/FFFFFF?text=No+Poster"


def recommend(movie):
    """Recommends 5 similar movies based on the selected movie."""
    try:
        index = movies[movies['title'] == movie].index[0]
    except IndexError:
        st.error("Movie not found in the dataset. Please select another one.")
        return [], [], [], [], []
        
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    
    recommended_movie_names = []
    recommended_movie_posters = []
    recommended_movie_years = []
    recommended_movie_ratings = []

    # Get details for top 5 recommendations
    top_indices = [i[0] for i in distances[1:6]]
    movie_ids = [movies.iloc[idx].movie_id for idx in top_indices]

    # Fetch posters concurrently to make loading extremely fast
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        posters = list(executor.map(fetch_poster, movie_ids))

    for idx, poster in zip(top_indices, posters):
        recommended_movie_posters.append(poster)
        recommended_movie_names.append(movies.iloc[idx].title)
        recommended_movie_years.append(movies.iloc[idx].year)
        recommended_movie_ratings.append(movies.iloc[idx].vote_average)

    return recommended_movie_names, recommended_movie_posters, recommended_movie_years, recommended_movie_ratings, movie_ids


st.set_page_config(layout="wide", page_title="Cinephile Recommender")

# Injecting Netflix-style Custom CSS
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

/* Hide Streamlit header (Star icon), menu, and footer */
header {visibility: hidden;}
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}

/* Cinematic Radial Background */
.stApp {
    background: radial-gradient(circle at top, #2b0000 0%, #0a0a0a 50%, #000000 100%);
    background-attachment: fixed;
    color: #e5e5e5;
    font-family: 'Outfit', sans-serif !important;
}

/* Custom Hero Header */
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

/* Dropdown and Form Styling */
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

/* Gradient Netflix Button */
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

/* Movie Row Container */
.movie-row {
    display: flex;
    gap: 30px;
    padding: 40px 10px;
    flex-wrap: wrap;
    justify-content: center;
}

/* Fade-in Entrance Animation */
@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

/* Glassmorphism Movie Card */
.movie-card {
    flex: 0 0 auto;
    width: 220px;
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
}

/* Staggered Card Animation Delays */
.movie-card:nth-child(1) { animation-delay: 0.1s; }
.movie-card:nth-child(2) { animation-delay: 0.2s; }
.movie-card:nth-child(3) { animation-delay: 0.3s; }
.movie-card:nth-child(4) { animation-delay: 0.4s; }
.movie-card:nth-child(5) { animation-delay: 0.5s; }

.movie-card:hover {
    transform: scale(1.08) translateY(-10px) !important;
    box-shadow: 0 20px 40px rgba(229, 9, 20, 0.3);
    border-color: rgba(229, 9, 20, 0.5);
    z-index: 10;
}

.movie-poster {
    width: 100%;
    height: 330px;
    object-fit: cover;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.movie-info {
    padding: 15px;
    text-align: center;
}

.movie-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.movie-meta {
    font-size: 13px;
    color: #a3a3a3;
    margin-bottom: 15px;
}

.rating-star {
    color: #e50914;
    font-weight: 800;
}

/* Gradient Watch Now Button */
.watch-btn {
    display: block;
    margin: 0 auto;
    padding: 10px;
    background: linear-gradient(90deg, #e50914 0%, #b8000b 100%);
    color: white !important;
    text-align: center;
    border-radius: 8px;
    text-decoration: none !important;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(229,9,20,0.3);
}
.watch-btn:hover {
    background: linear-gradient(90deg, #f40612 0%, #e50914 100%);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(229,9,20,0.6);
}

/* Recommendations Title */
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
<div class="hero-title">CINEPHILE AI</div>
<div class="hero-subtitle">Discover and stream your next favorite movie instantly.</div>
""", unsafe_allow_html=True)

# Load the data files
try:
    movies_dict = pickle.load(open('artifacts/movie_dict.pkl', 'rb'))
    movies = pd.DataFrame(movies_dict)
    
    # Auto-generate similarity.pkl if it doesn't exist (useful for cloud deployments)
    if not os.path.exists('artifacts/similarity.pkl'):
        with st.spinner("Initializing AI Model Weights... (First time only)"):
            cv = CountVectorizer(max_features=5000, stop_words='english')
            vectors = cv.fit_transform(movies['tags']).toarray()
            similarity = cosine_similarity(vectors)
            pickle.dump(similarity, open('artifacts/similarity.pkl', 'wb'))
    else:
        similarity = pickle.load(open('artifacts/similarity.pkl', 'rb'))
        
except FileNotFoundError:
    st.error("Core dataset 'movie_dict.pkl' not found. Please ensure it's placed in the 'artifacts/' folder.")
    st.stop()


movie_list = movies['title'].values
selected_movie = st.selectbox(
    "What's your favorite movie? Let's find similar ones:",
    movie_list
)

if st.button('Show Recommendation'):
    with st.spinner('Curating recommendations...'):
        recommended_movie_names, recommended_movie_posters, recommended_movie_years, recommended_movie_ratings, recommended_movie_ids = recommend(selected_movie)
    
    if recommended_movie_names:
        st.markdown("<div class='section-title'>Top Picks For You</div>", unsafe_allow_html=True)
        
        # Build HTML for the movie row
        html_content = '<div class="movie-row">'
        for i in range(len(recommended_movie_names)):
            year = int(recommended_movie_years[i]) if pd.notna(recommended_movie_years[i]) else 'N/A'
            rating = f"{recommended_movie_ratings[i]:.1f}"
            movie_id = recommended_movie_ids[i]
            # Formatting as a single line to prevent Streamlit from treating indented content as a Markdown code block
            html_content += f'<div class="movie-card"><img src="{recommended_movie_posters[i]}" class="movie-poster" alt="{recommended_movie_names[i]}"><div class="movie-info"><div class="movie-title" title="{recommended_movie_names[i]}">{recommended_movie_names[i]}</div><div class="movie-meta">{year} &nbsp;•&nbsp; <span class="rating-star">{rating} ⭐</span></div><a href="https://multiembed.mov/?video_id={movie_id}&tmdb=1" target="_blank" class="watch-btn">▶ Watch Now</a></div></div>'
        html_content += '</div>'
        
        # Render the custom HTML
        st.markdown(html_content, unsafe_allow_html=True)
