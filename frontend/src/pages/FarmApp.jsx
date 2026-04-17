import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Target, Sprout, Settings, Bell, Search, MapPin, CloudRain, Wind, Droplets, Camera, CheckCircle2, AlertTriangle, ChevronRight, UploadCloud, Leaf, Activity, UserCircle, CheckSquare, Landmark, Plane, ArrowRight, Video, ShieldCheck, ShieldAlert, ShoppingCart, Share2, X, ExternalLink, FileText, Bot, Terminal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';

export default function FarmApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [role, setRole] = useState('Admin'); 

  const TABS = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'scanner', label: 'AI Disease Scanner', icon: Target, path: '/upload' },
    { id: 'telemetry', label: 'Sensor Telemetry', icon: Activity, path: '/history' },
  ];

  // Sync active tab with location
  useEffect(() => {
    if (location.pathname === '/upload') setActiveTab('scanner');
    else if (location.pathname === '/history') setActiveTab('telemetry');
    else setActiveTab('overview');
  }, [location]);

  return (
    <>
      <style>
        {`
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; height: 100%; background: #020617; color: #f8fafc; font-family: 'Outfit', sans-serif; }
            
            .app-wrapper {
              display: flex;
              width: 100vw;
              height: 100vh;
              background: #020617;
              position: relative;
              overflow: hidden;
            }

            .workspace-backdrop {
              position: absolute; inset: 0; z-index: 0;
              background-image: 
                radial-gradient(circle at 15% 50%, rgba(34, 197, 94, 0.08), transparent 40%),
                radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.05), transparent 40%);
            }

            .sidebar-glass {
              background: rgba(15, 23, 42, 0.6);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border-right: 1px solid rgba(255, 255, 255, 0.05);
            }

            .navbar-glass {
              background: rgba(15, 23, 42, 0.7);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .search-bar {
              background: rgba(2, 6, 23, 0.8);
              border: 1px solid rgba(255, 255, 255, 0.1);
              transition: all 0.3s ease;
            }
            .search-bar:focus-within {
              border-color: rgba(34, 197, 94, 0.5);
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
            }

            .nav-item {
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

             /* Premium Scrollbar */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `}
      </style>
      <div className="app-wrapper">
        <div className="workspace-backdrop" />
        
        {/* Premium Dark Sidebar */}
        <div className="sidebar-glass" style={{ width: '280px', display: 'flex', flexDirection: 'column', padding: '2rem 1.25rem', flexShrink: 0, zIndex: 50, position: 'relative' }}>
          
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', cursor: 'pointer', padding: '0 0.5rem' }} onClick={() => navigate('/')}>
            <div style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
              <Leaf size={24} color="#050505" strokeWidth={3} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', fontFamily: 'Space Grotesk' }}>AgriScan</h1>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#4ADE80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Pro Terminal</p>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: '#64748B', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, padding: '0 1rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Core Systems</p>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button 
                  key={tab.id}
                  className="nav-item"
                  whileHover={{ x: 4, background: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setActiveTab(tab.id); navigate(tab.path); }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
                    background: isActive ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.1), transparent)' : 'transparent', 
                    color: isActive ? '#4ADE80' : '#94A3B8',
                    borderLeft: isActive ? '3px solid #4ADE80' : '3px solid transparent',
                    fontSize: '0.95rem', fontWeight: isActive ? 700 : 500, textAlign: 'left',
                  }}
                >
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#4ADE80' : '#64748B' }} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* User Profile Card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(34,197,94,0.1)', color: '#4ADE80', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>V. Admin</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Access Level 4</p>
            </div>
          </div>
        </div>

        {/* Main App Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
          
          {/* Dynamic Top Navbar */}
          <div className="navbar-glass" style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
             <h2 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Activity size={20} color="#4ADE80" /> {TABS.find(t => t.id === activeTab)?.label}
             </h2>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div className="search-bar" style={{ padding: '0.75rem 1.25rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B', width: '280px' }}>
                 <Search size={16} /> 
                 <input type="text" placeholder="Search parameters..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', fontFamily: 'inherit', color: 'white' }} />
               </div>
               
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', cursor: 'pointer', color: '#94A3B8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Bell size={18} />
                 <div style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 10px rgba(239,68,68,0.8)' }} />
               </motion.button>
               
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ cursor: 'pointer', color: '#94A3B8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Settings size={18} />
               </motion.button>
             </div>
          </div>

          {/* Workspace Area */}
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                {/* Dynamically render the component directly in this workspace shell */}
                {activeTab === 'overview' && <Home />}
                
                {/* For other tabs, we will display a functional placeholder until implemented */}
                {activeTab !== 'overview' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                    <Target size={64} style={{ opacity: 0.2, marginBottom: '2rem' }} />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>{TABS.find(t => t.id === activeTab)?.label} Module</h3>
                    <p>This module is currently operating in headless mode.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
