import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, CheckCircle2, Activity, FileText, HeartPulse, ArrowRight, RotateCcw, Leaf } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state?.resultData || {
    diseaseName: 'Tomato Early Blight',
    confidence: 0.98,
    status: 'Diseased',
    description: 'Early blight is a common disease of tomatoes caused by the fungus Alternaria linariae. It primarily affects leaves, stems, and fruit, causing target-like spots. It can lead to severe defoliation and yield loss if left unmanaged.',
    treatment: ['Prune infected areas using sterilized shears.', 'Apply copper-based fungicide immediately.', 'Improve airflow by removing dense foliage.'],
  };

  const isHealthy = data.status?.toLowerCase() === 'healthy';
  const confidencePct = Math.round((data.confidence ?? 0.98) * 100);
  const statusColor = isHealthy ? '#4ADE80' : '#F87171';
  const statusBg = isHealthy ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
  const statusBorder = isHealthy ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)';

  const treatments = data.treatment || [
    'Prune infected areas using sterilized shears.',
    'Apply copper-based fungicide to lower canopy immediately.',
    'Increase airflow by removing dense foliage within 48h.',
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', background: '#020617', color: '#f8fafc' }}>

      {/* Top Bar */}
      <div style={{ padding: '1.1rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', flexShrink: 0, transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8'; }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>Analysis Report</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>Diagnostic results · AI confidence scored</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '99px', padding: '0.3rem 0.9rem' }}>
          {isHealthy ? <CheckCircle2 size={13} color={statusColor} /> : <ShieldAlert size={13} color={statusColor} />}
          <span style={{ fontSize: '0.72rem', color: statusColor, fontWeight: 700 }}>{data.status?.toUpperCase()}</span>
        </div>
      </div>

      {/* Main split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>

        {/* Left: Image + Disease Title */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          {/* Image */}
          <div style={{ position: 'relative', height: '320px', overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={location.state?.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80'}
              alt="Analyzed Plant"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80'; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,1) 0%, rgba(2,6,23,0.3) 50%, transparent 100%)' }} />
            {/* Corner brackets */}
            {['tl','tr','bl','br'].map(pos => (
              <div key={pos} style={{
                position: 'absolute', width: '28px', height: '28px',
                ...(pos === 'tl' ? { top: 16, left: 16, borderTop: '2px solid #4ADE80', borderLeft: '2px solid #4ADE80', borderRadius: '4px 0 0 0' } : {}),
                ...(pos === 'tr' ? { top: 16, right: 16, borderTop: '2px solid #4ADE80', borderRight: '2px solid #4ADE80', borderRadius: '0 4px 0 0' } : {}),
                ...(pos === 'bl' ? { bottom: 16, left: 16, borderBottom: '2px solid #4ADE80', borderLeft: '2px solid #4ADE80', borderRadius: '0 0 0 4px' } : {}),
                ...(pos === 'br' ? { bottom: 16, right: 16, borderBottom: '2px solid #4ADE80', borderRight: '2px solid #4ADE80', borderRadius: '0 0 4px 0' } : {}),
                filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.5))',
              }} />
            ))}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
              <p style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem 0' }}>Detected Condition</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data.diseaseName}</h2>
            </div>
          </div>

          {/* Description + treatment */}
          <div style={{ padding: '2rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Description */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#3B82F6', borderRadius: '2px 0 0 2px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                  <FileText size={18} color="#60A5FA" />
                </div>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>Clinical Description</h4>
              </div>
              <p style={{ margin: 0, color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem' }}>{data.description}</p>
            </div>

            {/* Treatment steps */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(74,222,128,0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                  <Activity size={18} color="#4ADE80" />
                </div>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>Treatment Protocol</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {treatments.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats Panel */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>

            {/* Confidence gauge */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={statusColor} strokeWidth="10"
                    strokeDasharray="314" strokeLinecap="round"
                    initial={{ strokeDashoffset: 314 }}
                    animate={{ strokeDashoffset: 314 - (314 * confidencePct) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    style={{ filter: `drop-shadow(0 0 8px ${statusColor}60)` }}
                  />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Space Grotesk', lineHeight: 1 }}>{confidencePct}%</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>ACCURACY</span>
                </div>
              </div>
              <h4 style={{ margin: '0 0 0.3rem 0', color: '#f8fafc', fontWeight: 700 }}>AI Confidence Score</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>High precision detection</p>
            </div>

            {/* Status box */}
            <div style={{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: `${statusColor}15`, padding: '0.75rem', borderRadius: '12px' }}>
                <HeartPulse size={24} color={statusColor} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plant Status</p>
                <h3 style={{ margin: 0, color: statusColor, fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Space Grotesk' }}>{data.status}</h3>
              </div>
            </div>

            {/* Stat pills */}
            {[
              { label: 'Scan ID', value: `#${Math.floor(Math.random() * 9000) + 1000}`, icon: <Leaf size={14} color="#4ADE80" /> },
              { label: 'Pathogen Class', value: isHealthy ? 'None' : 'Fungal', icon: <Activity size={14} color="#60A5FA" /> },
              { label: 'Risk Level', value: isHealthy ? 'None' : 'High', icon: <ShieldAlert size={14} color="#F87171" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', fontSize: '0.85rem' }}>
                  {icon} {label}
                </div>
                <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>{value}</span>
              </div>
            ))}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => navigate('/treatment')}
                style={{ width: '100%', padding: '1rem', background: '#22C55E', color: '#050505', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 8px 20px rgba(34,197,94,0.2)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#16A34A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#22C55E'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                View Treatment Plan <ArrowRight size={18} strokeWidth={2.5} />
              </button>
              <button onClick={() => navigate('/upload')}
                style={{ width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.03)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <RotateCcw size={16} /> Scan Another Crop
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
