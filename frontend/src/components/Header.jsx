import { Link, useLocation } from 'react-router-dom';
import { Camera, Key, Activity } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const navColor = '#94A3B8';
  const navActiveColor = '#f8fafc';
  const navActiveBg = 'rgba(255,255,255,0.08)';
  const headerBg = 'rgba(5, 5, 5, 0.7)';
  const borderColor = 'rgba(255,255,255,0.05)';
  const titleColor = 'white';

  const getStyle = (path) => ({
    color: location.pathname === path ? navActiveColor : navColor,
    display: 'flex', gap: '0.6rem', alignItems: 'center', 
    fontWeight: location.pathname === path ? '600' : '500',
    textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    padding: '0.6rem 1.4rem',
    borderRadius: '99px',
    background: location.pathname === path ? navActiveBg : 'transparent'
  });

  return (
    <header 
      style={{ background: headerBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: `1px solid ${borderColor}`, position: 'sticky', top: 0, zIndex: 100, padding: '1.25rem 0', fontFamily: '"Outfit", sans-serif', transition: 'all 0.3s' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #3B82F6 100%)', borderRadius: '14px', padding: '0.6rem', display: 'flex', boxShadow: '0 8px 16px rgba(74, 222, 128, 0.25)' }}>
            <Activity size={24} color="#050505" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.5rem', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, color: titleColor, letterSpacing: '-0.03em', transition: 'color 0.3s' }}>AgriScan</span>
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${borderColor}`, padding: '0.4rem', borderRadius: '99px', transition: 'all 0.3s' }}>
           <Link to="/dashboard" style={getStyle('/dashboard')} onMouseOver={e=>e.currentTarget.style.color = navActiveColor} onMouseOut={e=>e.currentTarget.style.color = location.pathname === '/dashboard' ? navActiveColor : navColor}>Dashboard</Link>
           <Link to="/upload" style={{ ...getStyle('/upload'), color: location.pathname === '/upload' ? '#050505' : '#4ADE80', background: location.pathname === '/upload' ? '#4ADE80' : 'transparent', fontWeight: 600, boxShadow: location.pathname === '/upload' ? '0 0 20px rgba(74,222,128,0.3)' : 'none' }} onMouseOver={e=>{if(location.pathname!=='/upload') e.currentTarget.style.background='rgba(74, 222, 128, 0.1)'}} onMouseOut={e=>{if(location.pathname!=='/upload') e.currentTarget.style.background='transparent'}}>
             <Camera size={18}/> Scan
           </Link>
           <Link to="/history" style={getStyle('/history')} onMouseOver={e=>e.currentTarget.style.color = navActiveColor} onMouseOut={e=>e.currentTarget.style.color = location.pathname === '/history' ? navActiveColor : navColor}>History</Link>
           <Link to="/profile" style={getStyle('/profile')} onMouseOver={e=>e.currentTarget.style.color = navActiveColor} onMouseOut={e=>e.currentTarget.style.color = location.pathname === '/profile' ? navActiveColor : navColor}>Profile</Link>
           <Link to="/admin" style={getStyle('/admin')} onMouseOver={e=>e.currentTarget.style.color = navActiveColor} onMouseOut={e=>e.currentTarget.style.color = location.pathname === '/admin' ? navActiveColor : navColor}><Key size={16} /> Admin</Link>
        </nav>
        
        <Link 
          to={location.pathname === '/' ? '/login' : '/profile'} 
          style={{ background: '#f8fafc', color: '#050505', padding: '0.8rem 2rem', borderRadius: '999px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}
          onMouseOver={e => {e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 15px 25px rgba(255,255,255,0.2)';}}
          onMouseOut={e => {e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(255,255,255,0.1)';}}
        >
          {location.pathname === '/' ? 'Sign In' : 'Account'}
        </Link>
      </div>
      <style>{`
        @media(max-width: 900px) {
          nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
