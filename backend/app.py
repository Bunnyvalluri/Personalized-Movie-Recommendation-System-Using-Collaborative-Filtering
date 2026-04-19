from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import database
import requests

# TMDB Configuration
TMDB_API_KEY = "f3a2b7c9d0e1f8g4h5i6j7k8l9m0n1o2"
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# Import Surprise library for Collaborative Filtering (SVD)
try:
    from surprise import SVD, Dataset, Reader
    import pandas as pd
    SURPRISE_INSTALLED = True
except ImportError:
    SURPRISE_INSTALLED = False

# Initialize database
database.init_db()


app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv('movies.csv')
movies_list = df.to_dict('records')

# Preprocess for recommendation
# Combine genre and overview to create a rich content feature
df['content'] = df['genre'] + " " + df['overview']

# Compute TF-IDF matrix
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['content'])

# Compute cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_recommendations(movie_id, cosine_sim=cosine_sim, top_n=5):
    # Find the index of the movie
    idx = df.index[df['id'] == movie_id].tolist()
    if not idx:
        return []
    idx = idx[0]

    # Get pairwise similarity scores
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort movies based on similarity
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top_n similar movies (ignoring the first one because it's the movie itself)
    sim_scores = sim_scores[1:top_n+1]
    
    # Get movie indices
    movie_indices = [i[0] for i in sim_scores]
    
    # Return top 10 most similar movies
    res = df.iloc[movie_indices].to_dict('records')
    return res

@app.route('/api/movies', methods=['GET'])
def get_all_movies():
    return jsonify(movies_list)

@app.route('/api/recommend', methods=['GET'])
def recommend():
    movie_id = request.args.get('movie_id', type=int)
    if not movie_id:
        return jsonify({'error': 'Please provide a movie_id'}), 400
    
    recommendations = get_recommendations(movie_id)
    return jsonify(recommendations)

@app.route('/api/recommend/hybrid', methods=['GET'])
def hybrid_recommend():
    uid = request.args.get('uid', type=str)
    movie_id = request.args.get('movie_id', type=int)
    
    if not uid or not movie_id:
        return jsonify({'error': 'Please provide uid and movie_id'}), 400
    
    # 1. Content-based (genres, overview) via Cosine Similarity
    cb_recs = get_recommendations(movie_id, top_n=20)
    
    # 2. Collaborative Filtering (User ratings) via SVD
    ratings_data = database.get_all_ratings()
    
    final_recs = []
    
    if SURPRISE_INSTALLED and len(ratings_data) > 10:
        # Train SVD Model on the fly using real user data
        ratings_df = pd.DataFrame(ratings_data)
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(ratings_df[['uid', 'movie_id', 'rating']], reader)
        trainset = data.build_full_trainset()
        svd_model = SVD()
        svd_model.fit(trainset)
        
        # Predict ratings for the content-based candidates
        for rec in cb_recs:
            pred_rating = svd_model.predict(uid, rec['id']).est
            rec['hybrid_score'] = pred_rating + (rec.get('vote_average', 0) * 0.1) # Trending bump
            final_recs.append(rec)
            
        final_recs.sort(key=lambda x: x['hybrid_score'], reverse=True)
    else:
        # Fallback to pure Content-Based + Trending Score if not enough collaborative data
        for rec in cb_recs:
            rec['hybrid_score'] = rec.get('vote_average', 0)
            final_recs.append(rec)
            
        final_recs.sort(key=lambda x: x['hybrid_score'], reverse=True)
        
    return jsonify(final_recs[:10])



@app.route('/api/users', methods=['POST'])
def save_user_info():
    data = request.json
    database.save_user(data.get('uid'), data.get('email'), data.get('username'))
    return jsonify({"message": "User saved"})

@app.route('/api/users/<uid>', methods=['GET'])
def get_user_info(uid):
    user = database.get_user(uid)
    if user:
        return jsonify(user)
    return jsonify({"error": "Not found"}), 404

@app.route('/api/history', methods=['POST'])
def add_history():
    data = request.json
    database.add_to_history(data.get('uid'), data.get('movieId'))
    return jsonify({"message": "History added"})

@app.route('/api/ratings', methods=['POST'])
def add_user_rating():
    data = request.json
    database.add_rating(data.get('uid'), data.get('movieId'), data.get('rating'))
    return jsonify({"message": "Rating saved"})

@app.route('/api/favorites', methods=['POST'])
def add_favorite_movie():
    data = request.json
    database.add_favorite(data.get('uid'), data.get('movieId'))
    return jsonify({"message": "Added to favorites"})

@app.route('/api/favorites', methods=['DELETE'])
def remove_favorite_movie():
    data = request.json
    database.remove_favorite(data.get('uid'), data.get('movieId'))
    return jsonify({"message": "Removed from favorites"})

# ---------------------------------------------------------
# TMDB (The Movie Database) Live Data Endpoints
# ---------------------------------------------------------

@app.route('/api/tmdb/trending', methods=['GET'])
def get_trending_movies():
    try:
        url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            print(f"TMDB Error: {response.status_code}")
            return jsonify({"results": movies_list[:20]}) # Fallback to local CSV data
    except Exception as e:
        print(f"TMDB Connection Failed: {e}")
        return jsonify({"results": movies_list[:20]})

@app.route('/api/tmdb/movie/<int:movie_id>', methods=['GET'])
def get_tmdb_movie_details(movie_id):
    try:
        url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        # Fallback to local CSV data
        local_movie = next((m for m in movies_list if m['id'] == movie_id), None)
        if local_movie:
            return jsonify(local_movie)
        return jsonify({"error": "Movie not found"}), 404
    except Exception as e:
        local_movie = next((m for m in movies_list if m['id'] == movie_id), None)
        if local_movie:
            return jsonify(local_movie)
        return jsonify({"error": str(e)}), 500


@app.route('/api/tmdb/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"results": []})
    try:
        url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={query}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        return jsonify({"results": []})
    except Exception as e:
        return jsonify({"results": []})




@app.route('/api/tmdb/discover', methods=['GET'])
def discover_movies():
    genre_id = request.args.get('with_genres', '')
    keyword_id = request.args.get('with_keywords', '')
    try:
        url = f"{TMDB_BASE_URL}/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&with_keywords={keyword_id}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        return jsonify({"results": movies_list[:15]}) # Fallback
    except Exception as e:
        return jsonify({"results": movies_list[:15]})

@app.route('/api/tmdb/discover/tv', methods=['GET'])
def discover_tv():
    genre_id = request.args.get('with_genres', '')
    try:
        url = f"{TMDB_BASE_URL}/discover/tv?api_key={TMDB_API_KEY}&with_genres={genre_id}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return jsonify(response.json())
        # Mocking reality TV for fallback from movies list
        return jsonify({"results": [
            {"id": 1, "name": "Love Is Blind", "poster_path": "/xO9uP0eUHeW8Z4884F7fKjXj6Sg.jpg", "overview": "A social experiment..."},
            {"id": 2, "name": "Survivor", "poster_path": "/iytmG8F2oUpiaaGk7M0kFhA4Iq5.jpg", "overview": "Stranded in a remote location..."}
        ]})
    except Exception as e:
        return jsonify({"results": []})



@app.before_request
def log_request_info():
    print(f"Request: {request.method} {request.url}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
