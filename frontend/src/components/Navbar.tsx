'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav
      className={cn(
        'fixed top-0 z-[100] flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-12 lg:py-6',
        isScrolled && 'glass-morphism bg-[#0f0f0f]'
      )}
    >
      <div className="flex items-center space-x-2 md:space-x-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-[#e50914] md:text-3xl">
          CINEPHILE
        </Link>

        <ul className="hidden space-x-4 md:flex">
          <li className="nav-link cursor-pointer font-medium text-white/90 hover:text-white">Home</li>
          <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">TV Shows</li>
          <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">Movies</li>
          <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">New & Popular</li>
          <li className="nav-link cursor-pointer font-light text-white/70 hover:text-white">My List</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light text-white/80">
        <Search className="h-6 w-6 cursor-pointer text-white" />
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
