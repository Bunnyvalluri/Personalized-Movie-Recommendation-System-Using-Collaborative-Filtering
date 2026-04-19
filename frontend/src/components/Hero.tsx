'use client';

import { Play, Info, SquarePlay } from 'lucide-react';
import { formatImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Hero({ movie }: { movie: any }) {
  if (!movie) return <div className="h-[90vh] w-full bg-[#050505] skeleton" />;

  return (
    <div className="relative h-[95vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src={formatImageUrl(movie.backdrop_path)}
          alt={movie.title}
          className="h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
      </div>

      <div className="absolute h-full w-full flex flex-col justify-center px-6 lg:px-16 max-w-[1920px] mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl space-y-8"
        >
          <div className="flex items-center gap-3">
            <span className="bg-[#e50914] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">Original</span>
            <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Movie Collection</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] drop-shadow-2xl">
            {movie?.title?.toUpperCase() || "FEATURED SELECTION"}
          </h1>

          
          <p className="line-clamp-3 text-lg md:text-xl text-white/70 max-w-xl font-light leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button className="group relative flex items-center gap-3 rounded bg-white px-8 py-3.5 text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-lg">
              <Play className="fill-black h-5 w-5" />
              Watch Now
            </button>
            <button className="flex items-center gap-3 rounded bg-white/10 backdrop-blur-md border border-white/10 px-8 py-3.5 text-white font-bold transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
              <Info className="h-5 w-5" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-6 lg:right-16 flex items-center gap-4">
        <div className="flex flex-col items-end border-r-4 border-white/20 pr-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Critics Choice</span>
          <span className="text-2xl font-black">98% SCORE</span>
        </div>
        <div className="h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition">
             <span className="text-sm font-bold">16+</span>
        </div>
      </div>
    </div>
  );
}
