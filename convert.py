import pickle
import json
import numpy as np
import os

print("Starting conversion...")

# Convert movie_dict
try:
    with open('artifacts/movie_dict.pkl', 'rb') as f:
        movie_dict = pickle.load(f)
    with open('artifacts/movie_dict.json', 'w') as f:
        json.dump(movie_dict, f)
    print("Converted movie_dict.pkl to movie_dict.json")
except Exception as e:
    print(f"Error converting movie_dict: {e}")

# Convert similarity
try:
    if os.path.exists('artifacts/similarity.pkl'):
        with open('artifacts/similarity.pkl', 'rb') as f:
            similarity = pickle.load(f, encoding='latin1')
        np.save('artifacts/similarity.npy', similarity)
        print("Converted similarity.pkl to similarity.npy")
    else:
        print("similarity.pkl not found, skipping.")
except Exception as e:
    print(f"Error converting similarity: {e}")

print("Done.")
