import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Globe, Bell, Moon, Sun, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);

  const TABS = [
    { id: 'account', label: 'Farm Account', icon: User },
    { id: 'preferences', label: 'Dashboard Config', icon: Settings }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#030712', paddingBottom: '6rem', fontFamily: '"Outfit", "Inter", sans-serif', color: 'white' }}>
      
      {/* Background Grid */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0, maskImage: 'linear-gradient(to bottom, black, transparent)' }} />

      {/* Header Container */}
      <div style={{ padding: '4rem 2rem 6rem 2rem', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '24px', background: 'linear-gradient(135deg, #10B981, #047857)', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white' }}>
            JS
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'white' }}>John Smith</h1>
            <p style={{ color: '#94A3B8', fontSize: '1.2rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}><Mail size={18} /> john.smith@heartlandag.com</p>
            <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', color: '#34D399', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              FARM_OWNER
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '900px', margin: '-2rem auto 0 auto', padding: '0 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
        
        {/* Sidebar Nav */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '280px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', width: '100%', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'monospace',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#94A3B8',
                  border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <tab.icon size={20} color={activeTab === tab.id ? '#4ADE80' : '#64748B'} />
                  {tab.label.toUpperCase()}
                </div>
                {activeTab === tab.id && <ChevronRight size={18} color="#4ADE80" />}
              </button>
            ))}
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1rem 0' }} />

            <button 
              onClick={() => navigate('/login')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', width: '100%', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', transition: 'all 0.2s', fontFamily: 'monospace' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              <LogOut size={20} /> LOG_OUT
            </button>
          </div>
        </motion.div>

        {/* Dynamic Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
        >
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Administrator Profile</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>FULL_NAME</label>
                  <input type="text" defaultValue="John Smith" style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace' }}>CONTACT_EMAIL</label>
                  <input type="email" defaultValue="john.smith@heartlandag.com" style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none' }} />
                </div>
                <button style={{ alignSelf: 'flex-start', background: '#ffffff', color: '#030712', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
                  Commit Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '2rem', letterSpacing: '-0.02em' }}>System Config</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>LOCALE_REGION</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8', fontFamily: 'monospace' }}>Set interface language</p>
                    </div>
                  </div>
                  <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '0.95rem', fontWeight: 600, color: 'white', outline: 'none', cursor: 'pointer', fontFamily: 'monospace' }}
                  >
                    <option>EN_US</option>
                    <option>ES_ES</option>
                    <option>FR_FR</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <Bell size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>PUSH_ALERTS</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8', fontFamily: 'monospace' }}>Async event notifications</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setNotifications(!notifications)}
                    style={{ width: '56px', height: '32px', background: notifications ? '#22C55E' : 'rgba(255,255,255,0.1)', borderRadius: '99px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <motion.div 
                      layout
                      initial={false}
                      animate={{ x: notifications ? 26 : 4 }}
                      style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#A78BFA', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                      {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>UI_THEME</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8', fontFamily: 'monospace' }}>Interface variable overrides</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '0.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => setTheme('light')} style={{ background: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'transparent', color: theme === 'light' ? 'white' : '#64748B', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>LGT</button>
                    <button onClick={() => setTheme('dark')} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent', color: theme === 'dark' ? 'white' : '#64748B', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>DRK</button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </motion.div>
      </div>

    </div>
  );
}

