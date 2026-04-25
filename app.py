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
/* Netflix Background and Font */
.stApp {
    background-color: #141414;
    color: #e5e5e5;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
/* Title Styling */
h1 {
    color: #e50914 !important;
    font-weight: 800;
    font-size: 3rem !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 30px !important;
}
/* Dropdown text color */
.stSelectbox label {
    color: #fff !important;
    font-size: 1.1rem;
}
/* Netflix Button */
.stButton>button {
    background-color: #e50914 !important;
    color: white !important;
    border: none !important;
    padding: 10px 30px !important;
    border-radius: 4px !important;
    font-weight: bold !important;
    font-size: 1.1rem !important;
    transition: background-color 0.2s, transform 0.2s !important;
}
.stButton>button:hover {
    background-color: #f40612 !important;
    transform: scale(1.05) !important;
}
/* Netflix Movie Row */
.movie-row {
    display: flex;
    gap: 25px;
    padding: 30px 10px;
    flex-wrap: wrap;
    justify-content: center;
}
/* Movie Card with Hover Animation */
.movie-card {
    flex: 0 0 auto;
    width: 220px;
    background-color: #181818;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    cursor: pointer;
}
.movie-card:hover {
    transform: scale(1.1) translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.8);
    z-index: 10;
}
.movie-poster {
    width: 100%;
    height: 330px;
    object-fit: cover;
    border-bottom: 2px solid #333;
}
.movie-info {
    padding: 15px;
    text-align: center;
}
.movie-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.movie-meta {
    font-size: 13px;
    color: #a3a3a3;
    margin-bottom: 10px;
}
.rating-star {
    color: #e50914;
    font-weight: bold;
}
/* Watch Now Button */
.watch-btn {
    display: block;
    margin: 10px auto 0 auto;
    padding: 8px;
    background-color: rgba(229, 9, 20, 0.9);
    color: white !important;
    text-align: center;
    border-radius: 4px;
    text-decoration: none !important;
    font-weight: bold;
    font-size: 14px;
    transition: background-color 0.2s, transform 0.2s;
}
.watch-btn:hover {
    background-color: #f40612;
    transform: scale(1.05);
}
</style>
""", unsafe_allow_html=True)

st.title('Cinephile AI Recommender')

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
        st.markdown("<h3 style='color: white; margin-top: 20px;'>Top Picks for You</h3>", unsafe_allow_html=True)
        
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
