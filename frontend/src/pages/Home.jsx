import React from 'react';
import { Camera, ChevronRight, Wind, Droplets, MapPin, Sun, Activity, CheckCircle2, AlertTriangle, Leaf, Tractor, TrendingUp, Thermometer, Shield, Bell, Search, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  const MOCK_FIELDS = [
    { id: 1, name: 'North Field – Tomatoes', date: 'Oct 24, 2026', status: 'Requires Attention', healthy: false, img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 2, name: 'East Sector – Potato', date: 'Oct 23, 2026', status: '98% Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1518972559570-7ac3f2951dc8?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 3, name: 'Main Vineyard Beta', date: 'Oct 20, 2026', status: '99% Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1595841696677-6489af3f2740?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] } })
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', padding: '2rem 2.5rem', gap: '2rem' }}>

      {/* ── Sticky Top Bar ── 3-column: [Brand] [Search] [Actions] */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', gap: '1.5rem',
        marginLeft: '-2.5rem', marginRight: '-2.5rem', marginTop: '-2rem',
        padding: '0.85rem 2.5rem',
        marginBottom: '2rem',
      }}>

        {/* LEFT: Brand + LIVE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(34,197,94,0.25)' }}>
            <Leaf size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>Farm Dashboard</h2>
            <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0, fontWeight: 500 }}>Command Center · Live Monitoring</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '99px', padding: '0.25rem 0.7rem', marginLeft: '0.25rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.68rem', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
          </div>
        </div>

        {/* CENTER: Wide search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.65rem 1.25rem', width: '340px' }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.35)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <Search size={15} color="#475569" />
          <input type="text" placeholder="Search crops, diseases, field IDs..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.875rem', fontFamily: 'inherit', color: '#cbd5e1', width: '100%' }}
          />
          <kbd style={{ fontSize: '0.68rem', color: '#334155', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '0.1rem 0.4rem', fontFamily: 'monospace', flexShrink: 0 }}>⌘K</kbd>
        </div>

        {/* RIGHT: Quick actions + profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end' }}>

          {/* Quick Scan CTA */}
          <button onClick={() => navigate('/upload')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80', padding: '0.55rem 1.1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.18)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)'; }}
          >
            <Camera size={15} /> Scan Crop
          </button>

          {/* Notifications */}
          <button style={{ position: 'relative', cursor: 'pointer', color: '#64748B', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748B'; }}
          >
            <Bell size={16} />
            <div style={{ position: 'absolute', top: '8px', right: '9px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid rgba(2,6,23,1)', boxShadow: '0 0 8px rgba(239,68,68,0.8)' }} />
          </button>

          {/* Settings */}
          <button style={{ cursor: 'pointer', color: '#64748B', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748B'; }}
          >
            <Settings size={16} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

          {/* Profile avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.4rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>VA</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>V. Admin</div>
              <div style={{ fontSize: '0.68rem', color: '#475569' }}>Access L4</div>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'Overall Health', value: '94%', color: '#4ADE80', bg: 'rgba(34,197,94,0.08)', icon: <TrendingUp size={20} color="#4ADE80" />, change: '+2.1%' },
          { label: 'Soil Moisture', value: '87%', color: '#60A5FA', bg: 'rgba(59,130,246,0.08)', icon: <Droplets size={20} color="#60A5FA" />, change: 'Optimal' },
          { label: 'Temperature', value: '24°C', color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', icon: <Thermometer size={20} color="#FBBF24" />, change: 'Normal' },
          { label: 'Wind Speed', value: '12 km/h', color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', icon: <Wind size={20} color="#94A3B8" />, change: 'Calm' },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
            style={{ background: stat.bg, border: `1px solid ${stat.color}20`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {stat.icon}
              <span style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 700, background: `${stat.color}15`, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>{stat.change}</span>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.3rem', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem', flex: 1, minHeight: 0 }}>

        {/* Left: Scan CTA Card */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible"
          onClick={() => navigate('/upload')}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '2.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
          whileHover={{ borderColor: 'rgba(74, 222, 128, 0.35)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(34,197,94,0.08)', y: -4 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Glow */}
          <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
          {/* Background Tractor */}
          <div style={{ position: 'absolute', right: '-5%', bottom: '-10%', opacity: 0.07, transform: 'rotate(-5deg)', pointerEvents: 'none' }}>
            <Tractor size={200} color="#4ADE80" />
          </div>

          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: '#4ADE80' }}>
            <Camera size={28} />
          </div>

          <div style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>AI Powered Analysis</div>
          <h3 style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 1rem 0', lineHeight: 1.1, color: '#f8fafc' }}>
            Scan New Crop
          </h3>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: '0 0 2.5rem 0', lineHeight: 1.6, maxWidth: '280px' }}>
            Instantly identify plant diseases and receive actionable treatment plans.
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#22C55E', color: '#050505', padding: '1rem 1.75rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', alignSelf: 'flex-start', pointerEvents: 'none' }}>
            Start Scan <ChevronRight size={18} strokeWidth={3} />
          </div>
        </motion.div>

        {/* Right: Recent Crop Scans */}
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={20} color="#60A5FA" /> Recent Crop Scans
            </h3>
            <Link to="/history"
              style={{ color: '#60A5FA', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
            >View All →</Link>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['All Fields', 'Critical', 'Healthy'].map((f, i) => (
              <div key={f} style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: i === 0 ? '#f8fafc' : 'rgba(255,255,255,0.04)', color: i === 0 ? '#050505' : '#64748B', border: '1px solid transparent' }}>
                {f}
              </div>
            ))}
          </div>

          {/* Scan List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {MOCK_FIELDS.map((field, i) => (
              <motion.div key={field.id} custom={6 + i} variants={cardVariants} initial="hidden" animate="visible"
                onClick={() => navigate('/result', { state: { resultData: { diseaseName: field.healthy ? 'Healthy Crop' : 'Early Blight Detected', status: field.healthy ? 'Healthy' : 'Diseased', confidence: 0.96, description: field.healthy ? 'This field is showing vibrant health metrics.' : 'Identified dangerous pathogen patterns requiring immediate pruning and fungicide.' }, image: field.img } })}
                style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.25s ease' }}
                whileHover={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', x: 4 }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, background: '#1E293B' }}>
                  <img src={field.img} alt={field.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.3rem 0', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.name}</h5>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>{field.date}</div>
                </div>
                <div style={{ background: field.healthy ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: field.healthy ? '#4ADE80' : '#F87171', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', border: `1px solid ${field.healthy ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, flexShrink: 0 }}>
                  {field.healthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {field.healthy ? 'HEALTHY' : 'ALERT'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={18} color="#4ADE80" />
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>3 of 3 fields monitored. Next auto-scan in <span style={{ color: '#4ADE80', fontWeight: 700 }}>2h 14m</span></span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
