'use client';

import { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';
import { formatImageUrl, getHybridRecommendations } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  useEffect(() => {
    if (movie) {
      const fetchRecs = async () => {
        try {
          const recs = await getHybridRecommendations('test_user', movie.id);
          setRecommendations(recs);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      };
      fetchRecs();
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-[#181818] text-white no-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full bg-[#181818] p-1 border border-white/10 hover:bg-[#202020]"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative aspect-video w-full">
            <img
              src={formatImageUrl(movie.backdrop_path)}
              className="h-full w-full object-cover"
              alt={movie.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            
            <div className="absolute bottom-10 left-10 space-y-4">
              <h2 className="text-4xl font-bold">{movie.title}</h2>
              <div className="flex space-x-2">
                <button className="flex items-center gap-x-2 rounded bg-white px-8 py-2 text-black hover:bg-white/80 transition font-bold">
                  <Play className="fill-current" /> Play
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-[#2a2a2a] hover:border-white transition cursor-pointer">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-[#2a2a2a] hover:border-white transition cursor-pointer">
                  <ThumbsUp className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-500 font-bold">{movie.vote_average * 10}% Match</span>
                <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
                <span className="border border-white/40 px-1 text-[10px]">HD</span>
              </div>
              <p className="text-lg leading-relaxed">{movie.overview}</p>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">Cast: </span>
                <span className="text-white hover:underline cursor-pointer">Live Actors...</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Genres: </span>
                <span className="text-white hover:underline cursor-pointer">Action, Sci-Fi...</span>
              </div>
            </div>
          </div>

          <div className="px-10 pb-10">
            <h3 className="text-2xl font-bold mb-6">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-[#2f2f2f] rounded overflow-hidden cursor-pointer hover:brightness-110 transition">
                  <div className="aspect-video relative">
                     <img src={formatImageUrl(rec.backdrop_path || rec.poster_path)} className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2 text-xs font-bold bg-black/50 px-2 py-1">HD</div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-green-500 text-sm font-bold">Match</span>
                       <Plus className="h-5 w-5 border rounded-full p-1" />
                    </div>
                    <h4 className="font-bold text-sm line-clamp-1">{rec.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3">{rec.overview}</p>
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
