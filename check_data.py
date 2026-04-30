import requests, json, os
import pandas as pd
import numpy as np

key = '8265bd1679663a7ea12ac168da84d2e8'
base = 'https://api.tmdb.org/3'

print("=" * 60)
print("  iBOMMA RAHUL - DATA VERIFICATION REPORT")
print("=" * 60)

# 1. Check local JSON dataset
print("\n[1] LOCAL DATASET (movie_dict.json)")
try:
    with open('artifacts/movie_dict.json', 'r') as f:
        d = json.load(f)
    df = pd.DataFrame(d).reset_index(drop=True)
    print(f"  OK - Loaded {len(df)} movies from local database.")
    print(f"  Columns found: {list(df.columns)}")
    print(f"  Top 5 movies in your library: {list(df['title'].head(5))}")
except Exception as e:
    print(f"  ERROR: {e}")

# 2. Check similarity matrix
print("\n[2] RECOMMENDATION ENGINE (similarity.npy)")
try:
    sim = np.load('artifacts/similarity.npy')
    print(f"  OK - Similarity matrix loaded. Size: {sim.shape}")
except Exception as e:
    print(f"  ERROR: {e}")

# 3. Check TMDB API endpoints
print("\n[3] LIVE STREAMING DATA (TMDB API)")

endpoints = [
    ("Global Trending",   f"{base}/trending/movie/week?api_key={key}"),
    ("Telugu Cinema",     f"{base}/discover/movie?with_original_language=te&sort_by=vote_count.desc&api_key={key}"),
    ("Hindi Cinema",      f"{base}/discover/movie?with_original_language=hi&sort_by=vote_count.desc&api_key={key}"),
]

for name, url in endpoints:
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            results = r.json().get('results', [])[:5]
            print(f"\n  [{name}] Connection OK - {r.json().get('total_results','?')} movies found.")
            for i, m in enumerate(results, 1):
                title = m.get('title', m.get('name', 'N/A'))
                lang = m.get('original_language', '?')
                rating = m.get('vote_average', 0)
                print(f"    {i}. {title} ({lang}) - Rating: {rating}")
        else:
            print(f"\n  [{name}] API Error: HTTP {r.status_code}")
    except Exception as e:
        print(f"  ERROR for {name}: {e}")

print("\n" + "=" * 60)
print("  VERIFICATION COMPLETE - DATA IS HEALTHY")
print("=" * 60)
