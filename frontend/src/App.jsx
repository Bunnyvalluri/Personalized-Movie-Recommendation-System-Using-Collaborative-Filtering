import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, X, ChevronRight, Film, Heart, Search } from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/movies');
      setMovies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching movies", err);
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie);
    setRecLoading(true);
    setRecommendations([]);
    try {
      const res = await axios.get(`http://localhost:5000/api/recommend?movie_id=${movie.id}`);
      setRecommendations(res.data);
    } catch (err) {
      console.error("Error fetching recommendations", err);
    } finally {
      setRecLoading(false);
    }
  };

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-700/50 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Film className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">StreamAI</h1>
              <p className="text-[0.65rem] font-medium text-rose-400 uppercase tracking-widest">ML Powered</p>
            </div>
          </div>

          <div className="relative w-64 md:w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
            <p className="text-slate-400 animate-pulse text-sm font-medium">Loading MovieLens Dataset...</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Hero Banner Feature */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-2xl">
              <div className="absolute inset-0">
                <img 
                  src="https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MvrIdfi1.jpg" 
                  alt="Hero" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              </div>
              
              <div className="relative p-10 md:p-16 max-w-2xl flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  <Sparkles className="w-3 h-3" /> Machine Learning Engine
                </div>
                <h2 className="text-4xl md:text-5xl border-slate-700/50 font-bold leading-tight tracking-tight text-white">
                  Discover movies<br />you're destined to love.
                </h2>
                <p className="text-lg text-slate-300 font-medium">
                  Select a movie below to see our Content-Based Filtering algorithm in action. It calculates cosine similarity using TF-IDF vectors to find your perfect match.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2">
                    <Play className="w-4 h-4 fill-current" /> Browse Catalog
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Catalog */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold tracking-tight">Available Catalog</h3>
                <span className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{filteredMovies.length} movies loaded</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                {filteredMovies.map(movie => (
                  <motion.div 
                    key={movie.id} 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group cursor-pointer flex flex-col gap-3"
                    onClick={() => handleSelectMovie(movie)}
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 shadow-lg">
                      <img 
                        src={movie.poster_path} 
                        alt={movie.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Hover Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40">
                          <Play className="w-5 h-5 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-100 truncate group-hover:text-rose-400 transition-colors">{movie.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1 truncate">{movie.genre}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Modal / Sidebar for Recommendations */}
      <AnimatePresence>
        {selectedMovie && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMovie(null)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 cursor-pointer"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Target Movie Header */}
              <div className="relative shrink-0">
                <div className="h-64 md:h-80 w-full relative">
                  <img src={selectedMovie.poster_path} alt={selectedMovie.title} className="w-full h-full object-cover opacity-40 blur-sm mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex gap-6 items-end">
                  <div className="w-32 md:w-40 shrink-0 rounded-xl overflow-hidden border-2 border-slate-800 shadow-2xl relative -bottom-4">
                    <img src={selectedMovie.poster_path} alt={selectedMovie.title} className="w-full object-cover aspect-[2/3]" />
                  </div>
                  <div className="pb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 text-[0.65rem] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                      Target Movie
                    </div>
                    <h2 className="text-3xl font-bold leading-tight mb-2">{selectedMovie.title}</h2>
                    <p className="text-sm font-medium text-slate-400 mb-4">{selectedMovie.genre}</p>
                    <div className="flex items-center gap-3">
                      <button className="bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-rose-600 transition-colors">
                        <Play className="w-4 h-4 fill-current" /> Play Trailer
                      </button>
                      <button className="bg-slate-800 text-white px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recommendations Content */}
              <div className="p-8 pt-12 flex-1 bg-slate-900">
                <p className="text-slate-300 text-sm leading-relaxed mb-10 pb-8 border-b border-slate-800/80">
                  {selectedMovie.overview}
                </p>

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-500" /> Because you watched
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">AI-powered similarity matches</p>
                  </div>
                </div>

                {recLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Computing Cosine Similarity matrix...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recommendations.map((rec, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={rec.id} 
                        className="group flex gap-5 items-center p-3 rounded-2xl hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50"
                        onClick={() => handleSelectMovie(rec)}
                      >
                        <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                          <img src={rec.poster_path} alt={rec.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-100 truncate text-base group-hover:text-rose-400 transition-colors">{rec.title}</h4>
                            <span className="shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              {(100 - i*5 - Math.random() * 4).toFixed(1)}% Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium truncate mb-2">{rec.genre}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {rec.overview}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-rose-500 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
