'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import MovieModal from '@/components/MovieModal';
import { getTrending } from '@/lib/api';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [animationMovies, setAnimationMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);

  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchGenre = async (id: number) => {
           const res = await fetch(`http://127.0.0.1:5000/api/tmdb/genre/${id}`);
           const data = await res.json();
           return data.results || [];
        };

        const [trending, scifi, action, animation, horror, comedy] = await Promise.all([
          getTrending(),
          fetchGenre(878), // Sci-Fi
          fetchGenre(28),  // Action
          fetchGenre(16),  // Animation
          fetchGenre(27),  // Horror
          fetchGenre(35),  // Comedy
        ]);
        
        // Pin specific movies requested by user: Interstellar and The Dark Knight
        const interstellarRes = await fetch(`http://127.0.0.1:5000/api/tmdb/movie/157336`);
        const darkKnightRes = await fetch(`http://127.0.0.1:5000/api/tmdb/movie/155`);
        
        const interstellar = await interstellarRes.json();
        const darkKnight = await darkKnightRes.json();

        const combinedTrending = [
          interstellar.id ? interstellar : null, 
          darkKnight.id ? darkKnight : null, 
          ...(trending.results || [])
        ].filter((movie): movie is Movie => movie !== null && movie !== undefined && movie.id !== undefined)
         .filter((movie, index, self) => index === self.findIndex((m) => m.id === movie.id));

        setTrendingMovies(combinedTrending);
        setSciFiMovies(scifi);
        setActionMovies(action);
        setAnimationMovies(animation);
        setHorrorMovies(horror);
        setComedyMovies(comedy);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#050505] pb-24">
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      
      {!isSearching ? (
        <>
          {trendingMovies.length > 0 && <Hero movie={trendingMovies[0]} />}

          <div className="relative -mt-32 space-y-2 lg:space-y-4">
            <MovieRow title="Trending Now" movies={trendingMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Sci-Fi Masterpieces" movies={sciFiMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Binge-Worthy Animation" movies={animationMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Action Blockbusters" movies={actionMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Top Rated Classics" movies={[...trendingMovies].reverse()} onMovieClick={setSelectedMovie} />
            <MovieRow title="Psychological Horror" movies={horrorMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Comedy Hits" movies={comedyMovies} onMovieClick={setSelectedMovie} />
            <MovieRow title="Recommended For You" movies={trendingMovies.slice().sort(() => 0.5 - Math.random())} onMovieClick={setSelectedMovie} />
          </div>
        </>
      ) : (
        <div className="pt-32 px-6 lg:px-16 container-max mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-white/40">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {searchResults.length > 0 ? searchResults.map((movie) => (
              <div key={movie.id} onClick={() => setSelectedMovie(movie)} className="cursor-pointer group">
                <div className="aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 transition-all group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#e50914]">
                   <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                    className="w-full h-full object-cover" 
                    alt={movie.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <h3 className="font-black uppercase tracking-tight text-sm lg:text-base">{movie.title}</h3>
                    <div className="text-xs text-green-500 font-black">98% OPTIMAL</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-2xl">
                No Results Found
              </div>
            )}
          </div>
        </div>
      )}

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}
