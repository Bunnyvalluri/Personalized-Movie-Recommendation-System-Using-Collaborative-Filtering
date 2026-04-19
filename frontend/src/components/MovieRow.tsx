'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';
import { formatImageUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function MovieRow({ title, movies, onMovieClick }: any) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 px-6 lg:px-16 container-max mx-auto overflow-visible mb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-3xl font-bold tracking-tight text-white/90">
          {title}
        </h2>
        <div className="flex gap-2">
            <button 
                onClick={() => handleClick('left')}
                className={`h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-90 ${!isMoved && 'opacity-0'}`}
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
                onClick={() => handleClick('right')}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-90"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
      </div>

      <div className="group relative">
        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-scroll no-scrollbar py-4 px-2 -mx-2"
        >
          {movies.map((movie: any) => (
            <motion.div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              whileHover={{ y: -8 }}
              className="relative min-w-[200px] md:min-w-[300px] aspect-[16/9] cursor-pointer group/card"
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface-raised border border-white/5 shadow-2xl transition-all duration-300 group-hover/card:ring-2 group-hover/card:ring-[#e50914]/50 group-hover/card:shadow-[#e50914]/10">
                <img
                    src={formatImageUrl(movie.backdrop_path || movie.poster_path)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    alt={movie.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 p-4 w-full transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 opacity-0 group-hover/card:opacity-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-[10px] uppercase font-bold text-white/70 tracking-widest">Premium</span>
                        </div>
                        <Plus className="h-4 w-4 bg-white/20 rounded-full" />
                    </div>
                    <h4 className="font-bold text-sm lg:text-base line-clamp-1">{movie.title}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
