'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  onSearch: (results: any[]) => void;
  onClearSearch: () => void;
}

export default function Navbar({ onSearch, onClearSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/tmdb/search?query=${query}`);
        const data = await response.json();
        onSearch(data.results);
      } catch (err) {
        console.error(err);
      }
    } else if (query.length === 0) {
      onClearSearch();
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 z-[100] flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12 lg:py-6',
        (isScrolled || isSearchActive) && 'glass-morphism bg-[#0f0f0f]'
      )}
    >
      <div className="flex items-center space-x-2 md:space-x-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-[#e50914] md:text-3xl">
          CINEPHILE
        </Link>

        {!isSearchActive && (
          <ul className="hidden space-x-4 md:flex">
            <li className="nav-link cursor-pointer font-medium text-white/90 hover:text-white">Home</li>
            <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">TV Shows</li>
            <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">Movies</li>
            <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">New & Popular</li>
            <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">My List</li>
          </ul>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm font-light text-white/80">
        <div className={cn(
          "flex items-center border border-white/0 transition-all duration-300 px-2 py-1",
          isSearchActive && "border-white/40 bg-black/40"
        )}>
          <Search className="h-6 w-6 cursor-pointer text-white" onClick={handleSearchToggle} />
          {isSearchActive && (
            <input
              autoFocus
              type="text"
              placeholder="Titles, people, genres"
              className="bg-transparent border-none outline-none text-white ml-2 w-48 lg:w-64"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
          {isSearchActive && searchQuery && (
             <X className="h-5 w-5 cursor-pointer ml-2" onClick={() => { setSearchQuery(''); onClearSearch(); }} />
          )}
        </div>
        
        <Bell className="h-6 w-6 cursor-pointer text-white" />
        <div className="group relative flex cursor-pointer items-center space-x-2">
          <div className="h-8 w-8 overflow-hidden rounded bg-gray-600">
            <User className="h-full w-full p-1" />
          </div>
        </div>
      </div>
    </nav>
  );
}
