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
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrending();
        
        // Pin specific movies requested by user: Interstellar and The Dark Knight
        const interstellarRes = await fetch(`http://127.0.0.1:5000/api/tmdb/movie/157336`);
        const darkKnightRes = await fetch(`http://127.0.0.1:5000/api/tmdb/movie/155`);
        
        const interstellar = await interstellarRes.json();
        const darkKnight = await darkKnightRes.json();

        // Combine and filter out duplicates, ensuring every item has an id
        const combined = [
          interstellar.id ? interstellar : null, 
          darkKnight.id ? darkKnight : null, 
          ...(trending.results || [])
        ].filter((movie): movie is Movie => movie !== null && movie !== undefined && movie.id !== undefined)
         .filter((movie, index, self) => index === self.findIndex((m) => m.id === movie.id));


        setTrendingMovies(combined);
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
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] pb-24">
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      
      {!isSearching ? (
        <>
          {trendingMovies.length > 0 && (
            <Hero movie={trendingMovies[0]} />
          )}

          <div className="relative -mt-32 space-y-24">
            <MovieRow 
              title="Trending Now" 
              movies={trendingMovies} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Top Rated" 
              movies={[...trendingMovies].reverse()} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Recommended For You" 
              movies={trendingMovies.slice().sort(() => 0.5 - Math.random())} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieRow 
              title="Action Thrillers" 
              movies={trendingMovies.slice(5, 15)} 
              onMovieClick={setSelectedMovie} 
            />
          </div>
        </>
      ) : (
        <div className="pt-32 px-4 lg:px-12">
          <h2 className="text-3xl font-bold mb-8 text-white/60">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.length > 0 ? searchResults.map((movie) => (
              <div 
                key={movie.id} 
                onClick={() => setSelectedMovie(movie)}
                className="cursor-pointer transition duration-200 transform hover:scale-105"
              >
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg border border-white/5">
                   <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                    className="w-full h-full object-cover" 
                    alt={movie.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <h3 className="font-bold text-sm lg:text-base">{movie.title}</h3>
                    <div className="text-xs text-green-500 font-semibold">{Math.round(movie.vote_average * 10)}% Match</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 text-white/20">
                No movies found for your search query.
              </div>
            )}
          </div>
        </div>
      )}

      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </main>
  );
}
