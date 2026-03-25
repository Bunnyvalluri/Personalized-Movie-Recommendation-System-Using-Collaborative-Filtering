import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Leaf, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const LANGS = { en: 'English', te: 'తెలుగు', hi: 'हिन्दी' };
const T = {
  en: { title: 'Welcome Back', sub: 'Sign in to your AgriScan farm account', email: 'Email Address', pass: 'Password', forgot: 'Forgot Password?', btn: 'Sign In to Dashboard', google: 'Continue with Google', github: 'Continue with GitHub', noAcc: "Don't have an account?", signup: 'Create Account', or: 'or' },
  te: { title: 'తిరిగి స్వాగతం', sub: 'మీ AgriScan ఖాతాలో సైన్ ఇన్ చేయండి', email: 'ఇమెయిల్ చిరునామా', pass: 'పాస్‌వర్డ్', forgot: 'పాస్‌వర్డ్ మర్చిపోయారా?', btn: 'డాష్‌బోర్డ్‌కు సైన్ ఇన్ చేయండి', google: 'Google తో కొనసాగించు', github: 'GitHub తో కొనసాగించు', noAcc: 'ఖాతా లేదా?', signup: 'ఖాతా సృష్టించు', or: 'లేదా' },
  hi: { title: 'वापस स्वागत है', sub: 'अपने AgriScan खाते में साइन इन करें', email: 'ईमेल पता', pass: 'पासवर्ड', forgot: 'पासवर्ड भूल गए?', btn: 'डैशबोर्ड में साइन इन करें', google: 'Google के साथ जारी रखें', github: 'GitHub के साथ जारी रखें', noAcc: 'खाता नहीं है?', signup: 'खाता बनाएं', or: 'या' },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const t = T[lang];

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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Outfit", "Inter", sans-serif' }}>

      {/* Left Panel – Farm visual */}
      <div className="login-visual-side" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#064E3B' }}>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
          alt="Farm field"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #064E3B 20%, transparent 100%)' }} />

        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#10B981', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 8px 20px rgba(16,185,129,0.4)' }}>
              <Leaf size={32} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>AgriScan</span>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', lineHeight: 1.15, margin: '0 0 1.25rem', letterSpacing: '-0.02em' }}>
            Detect. Protect.<br />
            <span style={{ color: '#6EE7B7' }}>Harvest More.</span>
          </h2>
          <p style={{ color: '#A7F3D0', fontSize: '1.2rem', lineHeight: 1.65, maxWidth: '460px', fontWeight: 500 }}>
            AI-powered plant disease detection trusted by over 4,000 farms. Get instant diagnosis with a single photo.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            {[['98.4%', 'Model Accuracy'], ['< 5s', 'Response Time'], ['50K+', 'Images Trained']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{val}</div>
                <div style={{ fontSize: '0.9rem', color: '#6EE7B7', fontWeight: 600 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', position: 'relative', overflowY: 'auto' }}>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '5px solid #E2E8F0', borderTopColor: '#10B981', animation: 'lspin 0.8s linear infinite', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700 }}>Signing you in...</h3>
              <style>{`@keyframes lspin { 100% { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1.5rem 2.5rem', gap: '0.5rem', alignItems: 'center' }}>
          <Globe size={16} color="#64748B" />
          {Object.entries(LANGS).map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ background: lang === code ? '#ECFDF5' : 'transparent', color: lang === code ? '#059669' : '#64748B', border: lang === code ? '1px solid #A7F3D0' : '1px solid transparent', padding: '0.35rem 0.9rem', borderRadius: '99px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '480px', width: '100%', margin: '0 auto', padding: '1rem 2rem 4rem' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 0.6rem' }}>{t.title}</h1>
              <p style={{ color: '#64748B', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>{t.sub}</p>
            </div>

            {errorMsg && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            {/* Social Login */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <button onClick={() => handleProviderLogin(googleProvider)} disabled={loading}
                style={{ width: '100%', background: 'white', color: '#1E293B', border: '1.5px solid #E2E8F0', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', fontFamily: 'inherit' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t.google}
              </button>

              <button onClick={() => handleProviderLogin(githubProvider)} disabled={loading}
                style={{ width: '100%', background: '#1E293B', color: 'white', border: 'none', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                onMouseOver={e => e.currentTarget.style.background = '#0F172A'}
                onMouseOut={e => e.currentTarget.style.background = '#1E293B'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                {t.github}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 600 }}>{t.or}</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151' }}>{t.email}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="farmer@heartland.ag"
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.2rem', borderRadius: '16px', border: '1.5px solid #E2E8F0', background: '#F8FAFC', fontSize: '1.05rem', color: '#0F172A', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151' }}>{t.pass}</label>
                  <span style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 700, cursor: 'pointer' }}>{t.forgot}</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3.2rem', borderRadius: '16px', border: '1.5px solid #E2E8F0', background: '#F8FAFC', fontSize: '1.05rem', color: '#0F172A', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#10B981'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ width: '100%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', padding: '1.25rem', borderRadius: '16px', fontSize: '1.15rem', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: loading ? 0.7 : 1, boxShadow: '0 12px 30px rgba(16,185,129,0.35)', fontFamily: 'inherit', marginTop: '0.5rem' }}>
                {t.btn} <ArrowRight size={20} strokeWidth={3} />
              </motion.button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748B', fontSize: '1rem', fontWeight: 500 }}>
              {t.noAcc}{' '}
              <Link to="/register" style={{ color: '#10B981', fontWeight: 800, textDecoration: 'none' }}>{t.signup}</Link>
            </div>

          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-visual-side { display: none !important; } }
      `}</style>
    </div>
  );
}
