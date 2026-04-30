import requests, time

key = '8265bd1679663a7ea12ac168da84d2e8'
base = 'https://api.tmdb.org/3'

endpoints = [
    ("Trending", f"{base}/trending/movie/week?api_key={key}"),
    ("Telugu",   f"{base}/discover/movie?with_original_language=te&sort_by=popularity.desc&api_key={key}"),
    ("Hindi",    f"{base}/discover/movie?with_original_language=hi&sort_by=popularity.desc&api_key={key}"),
]

for name, url in endpoints:
    try:
        t = time.time()
        r = requests.get(url, timeout=10)
        results = r.json().get('results', [])
        print(f"{name}: HTTP {r.status_code} | {len(results)} results | {time.time()-t:.2f}s")
        if results:
            print(f"  First title: {results[0].get('title', results[0].get('name', 'N/A'))}")
    except Exception as e:
        print(f"{name}: ERROR - {e}")
