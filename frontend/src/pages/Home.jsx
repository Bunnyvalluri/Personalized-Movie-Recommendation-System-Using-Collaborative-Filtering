import React from 'react';
import { Camera, ChevronRight, Wind, Droplets, MapPin, Sun, Activity, CheckCircle2, AlertTriangle, Leaf, Tractor } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  const MOCK_FIELDS = [
    { id: 1, name: 'North Field - Tomatoes', date: 'Oct 24, 2026', status: 'Requires Attention', healthy: false, img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 2, name: 'East Sector - Potato', date: 'Oct 23, 2026', status: '98% Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1518972559570-7ac3f2951dc8?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 3, name: 'Main Vineyard Beta', date: 'Oct 20, 2026', status: '99% Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1595841696677-6489af3f2740?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  return (
    <div style={{ paddingBottom: '6rem', position: 'relative' }}>
      
      {/* Dynamic Glow */}
      <div style={{ position: 'fixed', top: '10%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(74, 222, 128, 0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0, borderRadius: '50%' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '3rem', width: '100%', paddingLeft: '2rem', paddingRight: '2rem', position: 'relative', zIndex: 10 }}
      >
        {/* Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.02em' }}>
              <Leaf size={32} color="#4ADE80" /> Farm Dashboard
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', margin: 0, fontWeight: 400 }}>Monitor live crop health and environmental data from your fields.</p>
          </div>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem 0.75rem 0.75rem 2rem', borderRadius: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}>Sector 7</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Sun size={20} color="#FBBF24" />
                    <h4 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: 0 }}>24°C</h4>
                 </div>
               </div>
             </div>
             <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050505', fontWeight: 800, fontSize: '1.25rem', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)' }}>
               FA
             </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Main Call to Action Header */}
            <motion.div 
              onClick={() => navigate('/upload')}
              className="glass-panel"
              style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              whileHover={{ y: -5, borderColor: 'rgba(74, 222, 128, 0.4)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 60%)', transform: 'translate(30%, -30%)', borderRadius: '50%', pointerEvents: 'none' }} />
              
              <div style={{ position: 'absolute', right: '-5%', bottom: '-15%', opacity: 0.15, transform: 'rotate(-10deg)' }}>
                <Tractor size={250} color="#4ADE80" />
              </div>

              <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '1.25rem', borderRadius: '20px', marginBottom: '2.5rem', color: '#4ADE80', boxShadow: '0 10px 25px rgba(74, 222, 128, 0.2)' }}>
                 <Camera size={36} />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 1.25rem 0', lineHeight: 1.1 }}>Scan<br/>New Crop</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', margin: '0 0 3rem 0', maxWidth: '340px', lineHeight: 1.6 }}>Instantly identify plant diseases and get treatment recommendations.</p>
              
              <div style={{ background: '#f8fafc', color: '#050505', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', pointerEvents: 'none', boxShadow: '0 10px 20px rgba(255, 255, 255, 0.1)' }}>
                Start Scan <ChevronRight size={20} strokeWidth={3} />
              </div>
            </motion.div>

            {/* Environmental Sensors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '16px', color: '#60A5FA' }}><Droplets size={28} /></div>
                  <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600, fontFamily: 'monospace' }}>Soil Moisture</h4>
                </div>
                <h1 style={{ margin: 0, fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em' }}>87<span style={{ fontSize: '1.5rem', color: '#64748B', fontWeight: 600, marginLeft: '0.2rem' }}>%</span></h1>
              </div>
              
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(148,163,184,0.1)', padding: '1rem', borderRadius: '16px', color: '#94A3B8' }}><Wind size={28} /></div>
                  <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600, fontFamily: 'monospace' }}>Wind Speed</h4>
                </div>
                <h1 style={{ margin: 0, fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.02em' }}>12<span style={{ fontSize: '1.5rem', color: '#64748B', fontWeight: 600, marginLeft: '0.2rem' }}>km/h</span></h1>
              </div>
            </div>
          </div>

          {/* Right Column (Recent Scans) */}
          <div className="glass-panel" style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Activity size={28} color="#60A5FA" /> Recent Crop Scans
              </h3>
              <Link to="/history" style={{ color: '#60A5FA', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '0.6rem 1.25rem', borderRadius: '10px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(59,130,246,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(59,130,246,0.1)'}>View All</Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              <div style={{ padding: '0.6rem 1.5rem', background: '#f8fafc', color: '#050505', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}>All Fields</div>
              <div style={{ padding: '0.6rem 1.5rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border-light)' }}>Critical</div>
              <div style={{ padding: '0.6rem 1.5rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border-light)' }}>Healthy</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              {MOCK_FIELDS.map((field) => (
                <div 
                  key={field.id} 
                  onClick={() => navigate('/result', { state: { resultData: { diseaseName: field.healthy ? 'Healthy Crop' : 'Early Blight Detected', status: field.healthy ? 'Healthy' : 'Diseased', confidence: 0.96, description: field.healthy ? 'This field is showing vibrant health metrics.' : 'Identified dangerous pathogen patterns requiring immediate pruning and fungicide.' }, image: field.img } })}
                  style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.02)' }} 
                  onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateX(5px)';}} 
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.03)'; e.currentTarget.style.transform='translateX(0)';}}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', background: '#1E293B', flexShrink: 0, opacity: 0.9 }}>
                    <img src={field.img} alt="Recent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.4rem 0', fontFamily: 'monospace' }}>{field.name}</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {field.date}
                    </div>
                  </div>
                  <div style={{ background: field.healthy ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: field.healthy ? '#4ADE80' : '#F87171', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${field.healthy ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                    {field.healthy ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span style={{ fontFamily: 'monospace' }}>{field.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
