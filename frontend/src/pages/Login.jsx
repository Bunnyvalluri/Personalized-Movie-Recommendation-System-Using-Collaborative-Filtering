import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Terminal, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message || 'Failed to sign in.');
    }
  };

  const handleProviderLogin = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch {
      setLoading(false);
      setErrorMsg('Sign-In failed or was cancelled.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712', fontFamily: '"Outfit", "Inter", sans-serif', color: 'white' }}>
      
      {/* Visual Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ flex: 1, display: 'none', background: '#0a0a0a', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)', '@media (minWidth: 768px)': { display: 'block' } }}
        className="login-visual-side"
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.15) 0%, transparent 50%)', zIndex: 1 }} />
        
        <div style={{ position: 'absolute', top: '4rem', left: '4rem', right: '4rem', zIndex: 10 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#4ADE80', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EAB308' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }}></div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#94A3B8' }}>&gt; Initializing secure connection...</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#94A3B8' }}>&gt; Authenticating via strict protocols...</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#34D399' }}>&gt; Handshake established.</p>
            <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#34D399', verticalAlign: 'middle' }} />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', zIndex: 10 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '16px', display: 'inline-flex', marginBottom: '1.5rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Terminal size={32} color="#4ADE80" />
          </div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
            SECURE<br />SESSION LOGIN.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '500px', fontFamily: 'monospace' }}>
            Access the diagnostic terminal. All queries are encrypted and logged for system integrity.
          </p>
        </div>
      </motion.div>

      {/* Form Right Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', background: '#030712', position: 'relative' }}>
        
        <AnimatePresence>
          {loading && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'absolute', inset: 0, background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(5px)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
             >
               <div className="spin-fast" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#10B981', marginBottom: '1rem' }} />
               <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>NEGOTIATING_AUTH...</h3>
             </motion.div>
          )}
        </AnimatePresence>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'white' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Terminal size={24} color="#10B981" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>SYS.AgriScan</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>AUTH_REQUIRED</h1>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'monospace' }}>Present credentials to initialize session.</p>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'monospace' }}>
                ERR: {errorMsg}
              </div>
            )}

            {/* SSO Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexDirection: 'column' }}>
              <button 
                onClick={() => handleProviderLogin(googleProvider)}
                disabled={loading}
                style={{ width: '100%', background: 'rgba(255,255,255,0.02)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'monospace' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                EXEC_GOOGLE_OAUTH
              </button>

              <button 
                onClick={() => handleProviderLogin(githubProvider)}
                disabled={loading}
                style={{ width: '100%', background: 'rgba(255,255,255,0.02)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'monospace' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <Github size={22} color="white" />
                EXEC_GITHUB_OAUTH
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>OR_REQ_BASIC_AUTH</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>USER_IDENTIFIER : EMAIL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={20} color="#64748B" style={{ position: 'absolute', left: '1rem' }} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@agriscan.ai" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'rgba(16, 185, 129, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>ACCESS_TOKEN : PASSWORD</label>
                  <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>RECOVER_TOKEN?</span>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={20} color="#64748B" style={{ position: 'absolute', left: '1rem' }} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', fontSize: '1rem', color: 'white', outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'rgba(16, 185, 129, 0.05)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(0,0,0,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: 'white', color: '#030712', padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', transition: 'all 0.2s', fontFamily: 'monospace' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                &gt; INITIALIZE_SESSION <ArrowRight size={20} />
              </button>

            </form>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem', paddingBottom: '3rem', fontFamily: 'monospace' }}>
              UNAUTHORIZED? <Link to="/register" style={{ color: '#10B981', fontWeight: 700, textDecoration: 'none' }}>REQ_ACCESS_KEY</Link>
            </div>
            
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .login-visual-side { display: none !important; }
        }
        .spin-fast {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
