'use client';

import { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Check, Star, Share2 } from 'lucide-react';
import { formatImageUrl, getHybridRecommendations, addMovieToFavorites, addMovieRating, addMovieToHistory, removeMovieFromFavorites } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MovieModal({ movie, onClose }: any) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const user_id = "demo_user_123";

  useEffect(() => {
    if (movie) {
      const fetchRecs = async () => {
        try {
          const recs = await getHybridRecommendations(user_id, movie.id);
          setRecommendations(recs);
        } catch (error) {
          console.error(error);
        }
      };
      fetchRecs();
      setIsLiked(false);
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        />
        
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl no-scrollbar z-10"
        >
          <div className="absolute right-6 top-6 z-50 flex gap-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full bg-[#e50914] text-white shadow-xl hover:scale-110 active:scale-90 transition transform">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative aspect-[21/9] w-full min-h-[400px]">
            <img src={formatImageUrl(movie.backdrop_path || movie.poster_path)} className="h-full w-full object-cover" alt={movie.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            
            <div className="absolute bottom-12 left-12 max-w-3xl space-y-6">
              <img src="/n-logo.svg" className="h-8 w-8 mb-4 opacity-80" alt="" />
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl">{movie.title}</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    addMovieToHistory(user_id, movie.id);
                    toast.success(`Broadcasting ${movie.title} to your primary display...`);
                  }}
                  className="flex items-center gap-3 rounded-full bg-white px-10 py-4 text-black font-black uppercase tracking-tighter text-sm hover:scale-105 transition"
                >
                  <Play className="fill-black h-4 w-4" /> Start Watching
                </button>
                <button 
                  onClick={() => {
                    if (isLiked) {
                        removeMovieFromFavorites(user_id, movie.id);
                        toast.info("Removed from your secure collection");
                    } else {
                        addMovieToFavorites(user_id, movie.id);
                        toast.success("Added to your secure collection");
                    }
                    setIsLiked(!isLiked);
                  }}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${isLiked ? 'bg-[#e50914] border-transparent text-white' : 'border-white/20 bg-black/40 hover:border-white'}`}
                >
                  {isLiked ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 font-black rounded-lg border border-green-500/20">
                  <Star className="h-3 w-3 fill-current" />
                  98% MATCH
                </div>
                <span className="text-white/40 font-bold">{movie.release_date?.split('-')[0]}</span>
                <span className="border border-white/20 px-2 py-0.5 rounded text-[10px] font-black">ULTRA HD 4K</span>
                <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-black tracking-widest uppercase">Dolby Atmos</div>
              </div>
              <p className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed max-w-4xl">{movie.overview}</p>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4 pt-1">
                <div>
                  <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-2">Production Cast</h4>
                  <p className="text-sm text-white/80 font-medium leading-relaxed">Top Real World Actors, TMDB Leads, Featured Talents...</p>
                </div>
                <div>
                    <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-2">Category Matrix</h4>
                    <p className="text-sm text-white/80 font-medium">Hyper-Personalized, Algorithm Choice, Top Picks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-12 pb-24">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Engine Predictions</h3>
                <span className="text-xs text-white/40 font-medium">Based on your activity matrix</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="relative group/rec bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                     <img src={formatImageUrl(rec.backdrop_path || rec.poster_path)} className="w-full h-full object-cover transition-transform duration-500 group-hover/rec:scale-110" alt={rec.title} />
                     <div className="absolute top-3 right-3 text-[10px] font-black bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 uppercase tracking-widest">Prediction</div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-green-500 text-xs font-black tracking-tighter italic">OPTIMAL MATCH</span>
                       <Plus className="h-6 w-6 border-2 border-white/20 rounded-full p-1 group-hover/rec:bg-white group-hover/rec:text-black transition" />
                    </div>
                    <h4 className="font-black text-lg uppercase tracking-tight line-clamp-1">{rec.title}</h4>
                    <p className="text-xs text-white/40 font-medium line-clamp-3 leading-relaxed">{rec.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
