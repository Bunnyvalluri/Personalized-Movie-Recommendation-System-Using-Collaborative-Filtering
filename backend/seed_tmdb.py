import requests
import database
import pandas as pd
import time

# Configuration
API_KEY = "f3a2b7c9d0e1f8g4h5i6j7k8l9m0n1o2"
BASE_URL = "https://api.themoviedb.org/3"

def seed_real_data():
    print("Initializing Real-World Seeding from TMDB...")
    database.init_db()
    
    movies_data = []
    
    # Fetch top 5 pages of popular movies (total 100)
    for page in range(1, 6):
        print(f"Fetching page {page}...")
        url = f"{BASE_URL}/movie/popular?api_key={API_KEY}&page={page}"
        response = requests.get(url)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            for movie in results:
                movie_id = movie.get('id')
                title = movie.get('title')
                overview = movie.get('overview')
                poster = f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}"
                
                # Fetch genres for each movie specifically
                genres = "Action, Drama" # Default
                try:
                    detail_url = f"{BASE_URL}/movie/{movie_id}?api_key={API_KEY}"
                    detail_res = requests.get(detail_url).json()
                    genres = ", ".join([g['name'] for g in detail_res.get('genres', [])])
                except:
                    pass
                
                movies_data.append({
                    "id": movie_id,
                    "title": title,
                    "genre": genres,
                    "overview": overview,
                    "poster_path": poster
                })
                print(f"Added: {title}")
                time.sleep(0.05) # Faster seeding
        else:
            print(f"Failed to fetch page {page}")

    # Save to CSV for the Content-Based Engine
    df = pd.DataFrame(movies_data)
    df.to_csv('movies.csv', index=False)
    print(f"Successfully seeded {len(movies_data)} REAL movies to movies.csv!")

if __name__ == "__main__":
    seed_real_data()
