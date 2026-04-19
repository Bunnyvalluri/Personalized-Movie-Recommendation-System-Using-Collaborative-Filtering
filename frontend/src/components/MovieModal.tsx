'use client';

import { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2, Check, Star } from 'lucide-react';
import { formatImageUrl, getHybridRecommendations, addMovieToFavorites, addMovieRating, addMovieToHistory, removeMovieFromFavorites } from '@/lib/api';
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
  const [isLiked, setIsLiked] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const user_id = "demo_user_123";

  useEffect(() => {
    if (movie) {
      const fetchRecs = async () => {
        try {
          const recs = await getHybridRecommendations(user_id, movie.id);
          setRecommendations(recs);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      };
      fetchRecs();
      setIsLiked(false);
      setIsRated(false);
    }
  }, [movie]);

  const handlePlay = async () => {
    if (!movie) return;
    await addMovieToHistory(user_id, movie.id);
    alert(`Playing: ${movie.title}\nAdded to Watch History!`);
  };

  const handleFavorite = async () => {
    if (!movie) return;
    if (isLiked) {
      await removeMovieFromFavorites(user_id, movie.id);
    } else {
      await addMovieToFavorites(user_id, movie.id);
    }
    setIsLiked(!isLiked);
  };

  const handleRate = async (rating: number) => {
    if (!movie) return;
    await addMovieRating(user_id, movie.id, rating);
    setIsRated(true);
    setShowRating(false);
    alert(`Rated ${movie.title} - ${rating} Stars!`);
  };

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
              src={formatImageUrl(movie.backdrop_path || movie.poster_path)}
              className="h-full w-full object-cover"
              alt={movie.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            
            <div className="absolute bottom-10 left-10 space-y-4">
              <h2 className="text-4xl font-bold drop-shadow-lg">{movie.title}</h2>
              <div className="flex space-x-2 items-center">
                <button 
                  onClick={handlePlay}
                  className="flex items-center gap-x-2 rounded bg-white px-8 py-2 text-black hover:bg-white/80 transition font-bold"
                >
                  <Play className="fill-current" /> Play
                </button>
                <div 
                  onClick={handleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition cursor-pointer ${isLiked ? 'bg-[#e50914] border-transparent' : 'border-white/50 bg-[#2a2a2a] hover:border-white'}`}
                >
                  {isLiked ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
                <div className="relative">
                  <div 
                    onClick={() => setShowRating(!showRating)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition cursor-pointer ${isRated ? 'text-yellow-400 border-yellow-400' : 'border-white/50 bg-[#2a2a2a] hover:border-white'}`}
                  >
                    <ThumbsUp className="h-6 w-6" />
                  </div>
                  {showRating && (
                    <div className="absolute top-full mt-2 bg-[#2a2a2a] p-2 rounded shadow-xl flex space-x-1 z-50">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className="h-5 w-5 cursor-pointer hover:text-yellow-400 fill-current text-white/40" onClick={() => handleRate(n)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-500 font-bold">{Math.round((movie.vote_average || 7.5) * 10)}% Match</span>
                <span className="text-gray-400">{movie.release_date?.split('-')[0] || "2024"}</span>
                <span className="border border-white/40 px-1 text-[10px]">HD</span>
                <span className="text-white/60">Adult 16+</span>
              </div>
              <p className="text-lg leading-relaxed">{movie.overview || "No overview available for this title."}</p>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-500 font-medium">Cast: </span>
                <span className="text-white hover:underline cursor-pointer">Live Actors...</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 font-medium">Genres: </span>
                <span className="text-white hover:underline cursor-pointer">Action, Sci-Fi...</span>
              </div>
            </div>
          </div>

          <div className="px-10 pb-10">
            <h3 className="text-2xl font-bold mb-6">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.length > 0 ? recommendations.map((rec) => (
                <div key={rec.id} className="bg-[#2f2f2f] rounded overflow-hidden cursor-pointer hover:brightness-110 transition group">
                  <div className="aspect-video relative">
                     <img src={formatImageUrl(rec.backdrop_path || rec.poster_path)} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
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
              )) : (
                <div className="col-span-full py-10 text-center text-white/40">
                  Calculating personalized recommendations...
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
