'use client';

import { Github, Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-transparent pt-24 pb-12 px-6 lg:px-16 border-t border-white/5">
      <div className="max-w-[1920px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 space-y-6">
          <Link href="/" className="text-3xl font-black tracking-tighter text-[#e50914]">
            CINEPHILE<span className="text-white text-xs align-top ml-1 opacity-40 font-normal">AI</span>
          </Link>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            The world's most advanced cinematic discovery engine powered by hybrid collaborative filtering and the TMDB global matrix.
          </p>
          <div className="flex gap-4">
             <Twitter className="h-5 w-5 text-white/20 hover:text-white cursor-pointer transition" />
             <Github className="h-5 w-5 text-white/20 hover:text-white cursor-pointer transition" />
             <Instagram className="h-5 w-5 text-white/20 hover:text-white cursor-pointer transition" />
             <Youtube className="h-5 w-5 text-white/20 hover:text-white cursor-pointer transition" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Platform</h4>
          <ul className="space-y-4 text-sm text-white/40">
             <li className="hover:text-white cursor-pointer transition">Discovery Engine</li>
             <li className="hover:text-white cursor-pointer transition">Popular Matrix</li>
             <li className="hover:text-white cursor-pointer transition">Anime Central</li>
             <li className="hover:text-white cursor-pointer transition">API Documentation</li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Company</h4>
           <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer transition">About Engine</li>
              <li className="hover:text-white cursor-pointer transition">Terms of Access</li>
              <li className="hover:text-white cursor-pointer transition">Privacy Protocol</li>
              <li className="hover:text-white cursor-pointer transition">System Integrity</li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Support</h4>
           <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer transition">Help Center</li>
              <li className="hover:text-white cursor-pointer transition">Report Bug</li>
              <li className="hover:text-white cursor-pointer transition">Contact Matrix</li>
           </ul>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 font-bold tracking-[0.2em] uppercase">
         <p>© 2026 CINEPHILE AI PROTOCOL. ALL RIGHTS RESERVED.</p>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Globe className="h-3 w-3" />
               <span>SYSTEM STATUS: OPERATIONAL</span>
            </div>
            <span>v2.4.0-STABLE</span>
         </div>
      </div>
    </footer>
  );
}
