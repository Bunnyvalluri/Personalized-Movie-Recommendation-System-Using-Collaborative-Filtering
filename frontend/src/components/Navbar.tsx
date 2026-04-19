'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onSearch, onClearSearch }: { onSearch: (results: any[]) => void; onClearSearch: () => void; }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
      onClearSearch();
    }
  };

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-500 px-6 lg:px-16 ${
      isScrolled ? 'py-4 glass-effect' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-3xl font-black tracking-tighter text-[#e50914] hover:brightness-110 transition">
            CINEPHILE<span className="text-white text-xs align-top ml-1 opacity-40 font-normal">AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide text-white/60">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors duration-200">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center rounded-full transition-all duration-300 px-4 py-1.5 ${
            isSearchActive ? 'bg-white/5 ring-1 ring-white/20' : ''
          }`}>
            <Search 
              className="h-5 w-5 cursor-pointer text-white/80 hover:text-white transition" 
              onClick={handleSearchToggle} 
            />
            <AnimatePresence>
              {isSearchActive && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  autoFocus
                  type="text"
                  placeholder="Titles, people, genres..."
                  className="bg-transparent border-none outline-none text-white text-sm ml-3 w-full"
                  value={searchQuery}
                  onChange={async (e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (q.length > 2) {
                      const res = await fetch(`http://127.0.0.1:5000/api/tmdb/search?query=${q}`);
                      const data = await res.json();
                      onSearch(data.results);
                    } else if (q.length === 0) onClearSearch();
                  }}
                />
              )}
            </AnimatePresence>
            {isSearchActive && searchQuery && (
               <X className="h-4 w-4 cursor-pointer ml-2 text-white/40 hover:text-white" onClick={() => { setSearchQuery(''); onClearSearch(); }} />
            )}
          </div>
          
          <div className="relative cursor-pointer group">
            <Bell className="h-5 w-5 text-white/80 group-hover:text-white transition" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#e50914] rounded-full animate-pulse" />
          </div>

          <div className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center cursor-pointer overflow-hidden">
            <User className="h-5 w-5 text-white/80" />
          </div>
        </div>
      </div>
    </nav>
  );
}
