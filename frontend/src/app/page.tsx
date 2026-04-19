'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import MovieModal from '@/components/MovieModal';
import SkeletonRow from '@/components/SkeletonRow';
import Footer from '@/components/Footer';
import { getTrending, API_BASE } from '@/lib/api';

interface Movie {
  id: number;
  title?: string;
  name?: string; 
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [realityTV, setRealityTV] = useState<Movie[]>([]);
  const [horrorBooks, setHorrorBooks] = useState<Movie[]>([]);
  
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchJSON = async (url: string) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            return res.json();
        };

        const [trending, interstellar, darkKnight, drama, anime, reality, horror] = await Promise.all([
            getTrending(),
            fetchJSON(`${API_BASE}/tmdb/movie/157336`),
            fetchJSON(`${API_BASE}/tmdb/movie/155`),
            fetchJSON(`${API_BASE}/tmdb/discover?with_genres=18`),
            fetchJSON(`${API_BASE}/tmdb/discover?with_genres=16`),
            fetchJSON(`${API_BASE}/tmdb/discover/tv?with_genres=10764`),
            fetchJSON(`${API_BASE}/tmdb/discover?with_genres=27&with_keywords=818`)
        ]);

        const combinedTrending = [
            interstellar.id ? interstellar : null, 
            darkKnight.id ? darkKnight : null, 
            ...(trending.results || [])
        ].filter((m): m is Movie => m?.id !== undefined)
         .filter((m, i, self) => i === self.findIndex((x) => x.id === m.id));

        setTrendingMovies(combinedTrending);
        setDramaMovies(drama.results || []);
        setAnimeMovies(anime.results || []);
        setRealityTV(reality.results?.map((item: any) => ({...item, title: item.name})) || []);
        setHorrorBooks(horror.results || []);

      } catch (error) {
        console.error('Data acquisition error:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (results: Movie[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <main className="relative min-h-screen bg-[#050505] pb-24 font-inter selection:bg-[#e50914]">
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      
      {!isSearching ? (
        <>
          {isLoading ? (
             <div className="pt-32 space-y-24">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
             </div>
          ) : (
            <>
              {trendingMovies.length > 0 && <Hero movie={trendingMovies[0]} />}
              <div className="relative -mt-48 space-y-12 pb-20">
                <MovieRow title="Pinned Selection" movies={trendingMovies.slice(0, 5)} onMovieClick={setSelectedMovie} />
                <MovieRow title="Trending Now" movies={trendingMovies.slice(5)} onMovieClick={setSelectedMovie} />
                <MovieRow title="Premium Drama" movies={dramaMovies} onMovieClick={setSelectedMovie} />
                <MovieRow title="Anime Collection" movies={animeMovies} onMovieClick={setSelectedMovie} />
                <MovieRow title="Escapist Reality TV" movies={realityTV} onMovieClick={setSelectedMovie} />
                <MovieRow title="Literary Horror Masterpieces" movies={horrorBooks} onMovieClick={setSelectedMovie} />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="pt-32 px-6 lg:px-16 max-w-[1920px] mx-auto min-h-screen">
          <div className="flex items-center justify-between mb-12">
             <h2 className="text-4xl font-black uppercase tracking-tighter text-white/90">Search Results</h2>
             <span className="text-[#e50914] text-xs font-black tracking-widest uppercase">{searchResults.length} NODES IDENTIFIED</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {searchResults.length > 0 ? searchResults.map((movie) => (
              <div key={movie.id} onClick={() => setSelectedMovie(movie)} className="cursor-pointer group">
                <div className="aspect-[2/3] relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:scale-105 transition-all duration-500 group-hover:shadow-[#e50914]/10">
                   <img 
                    src={movie.poster_path ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`) : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={movie.title || movie.name}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 pt-12 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-black uppercase tracking-tight text-sm lg:text-base mb-1">{movie.title || movie.name}</h3>
                    <div className="text-[10px] text-green-500 font-black tracking-widest">{Math.round(movie.vote_average * 10)}% MATCH</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-40 border-2 border-dashed border-white/5 rounded-3xl text-white/10 uppercase font-black tracking-widest">
                No results detected in matrix
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}
