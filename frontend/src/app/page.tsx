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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrending();
        setTrendingMovies(trending.results);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] pb-24">
      <Navbar />
      
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

      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </main>
  );
}
