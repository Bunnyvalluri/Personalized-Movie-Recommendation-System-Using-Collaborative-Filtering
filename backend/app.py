from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import database

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
