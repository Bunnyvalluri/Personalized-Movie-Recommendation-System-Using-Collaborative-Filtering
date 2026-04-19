'use client';

import { Play, Info } from 'lucide-react';
import { formatImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
}

export default function Hero({ movie }: { movie: Movie }) {
  if (!movie) return <div className="h-[80vh] w-full bg-[#0f0f0f]" />;

  return (
    <div className="relative h-[100vh] w-full lg:h-[95vh]">
      <div className="absolute inset-0">
        <img
          src={formatImageUrl(movie.backdrop_path)}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-side-gradient absolute inset-0" />
      </div>

      <div className="absolute top-[30%] flex max-w-2xl flex-col space-y-4 px-4 lg:left-12 lg:space-y-6 lg:px-0">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black md:text-6xl lg:text-7xl"
        >
          {movie.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="line-clamp-3 text-lg text-white/80 md:text-xl lg:max-w-xl"
        >
          {movie.overview}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-row space-x-3"
        >
          <button className="flex items-center gap-x-2 rounded bg-white px-5 py-2.5 text-black transition-opacity hover:opacity-80 md:px-8 md:py-3.5 md:text-xl">
            <Play className="fill-current h-6 w-6" />
            Play
          </button>
          <button className="flex items-center gap-x-2 rounded bg-gray-500/70 px-5 py-2.5 text-white transition-all hover:bg-gray-500/50 md:px-8 md:py-3.5 md:text-xl">
            <Info className="h-6 w-6" />
            More Info
          </button>
        </motion.div>
      </div>
    </div>
  );
}
