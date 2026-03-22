import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Terminal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712', fontFamily: '"Outfit", "Inter", sans-serif', color: 'white' }}>
      
      {/* Visual Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ flex: 1, display: 'none', background: '#0a0a0a', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)', '@media (minWidth: 768px)': { display: 'block' } }}
        className="register-visual-side"
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.15) 0%, transparent 50%)', zIndex: 1 }} />
        
        <div style={{ position: 'absolute', top: '4rem', left: '4rem', right: '4rem', zIndex: 10 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#60A5FA', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EAB308' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6' }}></div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#94A3B8' }}>&gt; Checking user registry...</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#94A3B8' }}>&gt; Allocating namespace...</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#60A5FA' }}>&gt; Ready for profile creation.</p>
            <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#60A5FA', verticalAlign: 'middle' }} />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', zIndex: 10 }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '16px', display: 'inline-flex', marginBottom: '1.5rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Terminal size={32} color="#60A5FA" />
          </div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
            GENERATE<br />ACCESS KEY.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '500px', fontFamily: 'monospace' }}>
            Register to join the global sensor network and run inferences on targeted payloads.
          </p>
        </div>
      </motion.div>

      {/* Form Right Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', background: '#030712', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', paddingTop: '4rem' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', color: 'white' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Terminal size={24} color="#10B981" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>SYS.AgriScan</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>BUILD_PROFILE</h1>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '3rem', fontFamily: 'monospace' }}>Specify parameters to instantiate your node.</p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>OBJECT_ID : NAME</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={20} color="#64748B" style={{ position: 'absolute', left: '1rem' }} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="E.g. Primary System" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'rgba(16, 185, 129, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>ROUTING_ADDR : EMAIL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={20} color="#64748B" style={{ position: 'absolute', left: '1rem' }} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="node@network.local" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'rgba(16, 185, 129, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>SECURE_HASH : PASSWORD</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={20} color="#64748B" style={{ position: 'absolute', left: '1rem' }} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'rgba(16, 185, 129, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: 'white', color: '#030712', padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', transition: 'all 0.2s', fontFamily: 'monospace' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                &gt; COMMIT_NEW_USER <ArrowRight size={20} />
              </button>

            </form>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem', paddingBottom: '3rem', fontFamily: 'monospace' }}>
              HAS_ACCESS_KEY? <Link to="/login" style={{ color: '#10B981', fontWeight: 700, textDecoration: 'none' }}>INIT_LOGIN</Link>
            </div>
            
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .register-visual-side { display: none !important; }
        }
      `}</style>
    </div>
  );
}
