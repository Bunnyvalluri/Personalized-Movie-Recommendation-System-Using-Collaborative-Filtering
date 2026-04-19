import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, ChevronRight, ShieldAlert, CheckCircle2, Leaf, Activity, Filter, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_HISTORY = [
  { id: 'REQ-0892', disease: 'Tomato Early Blight', confidence: 0.98, crop: 'Tomato Plant', date: 'Today, 10:45 AM', status: 'Diseased', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=120&q=80', description: 'Early blight is a common disease of tomatoes caused by the fungus Alternaria linariae. Immediate treatment is recommended.' },
  { id: 'REQ-0891', disease: 'Healthy Crop', confidence: 0.99, crop: 'Bell Pepper', date: 'Yesterday, 04:20 PM', status: 'Healthy', img: 'https://images.unsplash.com/photo-1518972559570-7ac3f2951dc8?w=120&q=80', description: 'No diseases detected. The plant is displaying vibrant, strong leaves without deformations.' },
  { id: 'REQ-0884', disease: 'Powdery Mildew', confidence: 0.91, crop: 'Zucchini', date: 'Mar 15, 2026', status: 'Diseased', img: 'https://images.unsplash.com/photo-1595841696677-6489af3f2740?w=120&q=80', description: 'White powdery spots on leaves indicative of Powdery Mildew. Requires fungicide application.' },
  { id: 'REQ-0879', disease: 'Septoria Leaf Spot', confidence: 0.88, crop: 'Tomato Plant', date: 'Mar 10, 2026', status: 'Diseased', img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=120&q=80', description: 'Fungal disease that generally affects lower foliage. Shows small, circular spots with dark borders.' },
  { id: 'REQ-0871', disease: 'Healthy Crop', confidence: 0.97, crop: 'Grape Vine', date: 'Mar 5, 2026', status: 'Healthy', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=120&q=80', description: 'No pathogens detected. Vine shows excellent vitality. Maintain current irrigation plan.' },
];

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredHistory = MOCK_HISTORY.filter(h => {
    const matchesSearch = h.disease.toLowerCase().includes(searchTerm.toLowerCase()) || h.id.toLowerCase().includes(searchTerm.toLowerCase()) || h.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || h.status === filter;
    return matchesSearch && matchesFilter;
  });

  const diseased = MOCK_HISTORY.filter(h => h.status === 'Diseased').length;
  const healthy = MOCK_HISTORY.filter(h => h.status === 'Healthy').length;

  const handleRowClick = (item) => {
    navigate('/result', { state: { resultData: { diseaseName: item.disease, confidence: item.confidence, status: item.status, description: item.description }, image: item.img } });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', background: '#020617', color: '#f8fafc' }}>

      {/* Sticky Top Bar */}
      <div style={{ padding: '1.1rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} color="#60A5FA" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>Sensor Telemetry</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>Crop diagnostics log · {MOCK_HISTORY.length} total scans</p>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.55rem 1rem', color: '#475569' }}>
            <Search size={14} />
            <input type="text" placeholder="Search scans..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', fontFamily: 'inherit', color: '#cbd5e1', width: '180px' }} />
          </div>
          {/* Filter tabs */}
          {['All', 'Diseased', 'Healthy'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', background: filter === f ? (f === 'Healthy' ? 'rgba(74,222,128,0.1)' : f === 'Diseased' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.08)') : 'transparent', color: filter === f ? (f === 'Healthy' ? '#4ADE80' : f === 'Diseased' ? '#F87171' : '#f8fafc') : '#475569', borderColor: filter === f ? (f === 'Healthy' ? 'rgba(74,222,128,0.2)' : f === 'Diseased' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.1)') : 'transparent' }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Scans', value: MOCK_HISTORY.length, icon: <Leaf size={16} color="#4ADE80" />, color: '#4ADE80' },
          { label: 'Diseased', value: diseased, icon: <ShieldAlert size={16} color="#F87171" />, color: '#F87171' },
          { label: 'Healthy', value: healthy, icon: <CheckCircle2 size={16} color="#4ADE80" />, color: '#4ADE80' },
          { label: 'Avg Accuracy', value: `${(MOCK_HISTORY.reduce((a, h) => a + h.confidence, 0) / MOCK_HISTORY.length * 100).toFixed(1)}%`, icon: <TrendingUp size={16} color="#60A5FA" />, color: '#60A5FA' },
        ].map(stat => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}20`, borderRadius: '8px', padding: '0.5rem' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Space Grotesk', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '2rem 2.5rem' }}>
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {filteredHistory.length > 0 ? filteredHistory.map(item => {
              const isHealthy = item.status === 'Healthy';
              const statusColor = isHealthy ? '#4ADE80' : '#F87171';
              const statusBg = isHealthy ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
              const statusBorder = isHealthy ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)';

              return (
                <motion.div key={item.id}
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                  onClick={() => handleRowClick(item)}
                  style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s ease' }}
                  whileHover={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', x: 4 }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#0f172a' }}>
                    <img src={item.img} alt={item.crop} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.background = 'linear-gradient(135deg,#11231c,#163628)'; }}
                    />
                  </div>

                  {/* ID + Name */}
                  <div style={{ minWidth: '80px', flexShrink: 0 }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', display: 'block', marginBottom: '0.3rem' }}>{item.id}</span>
                  </div>

                  {/* Disease + Crop */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.3rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.disease}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Leaf size={12} />{item.crop}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={12} />{item.date}</span>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Space Grotesk' }}>{(item.confidence * 100).toFixed(1)}%</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>accuracy</div>
                  </div>

                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: statusBg, border: `1px solid ${statusBorder}`, padding: '0.4rem 0.9rem', borderRadius: '8px', flexShrink: 0 }}>
                    {isHealthy ? <CheckCircle2 size={14} color={statusColor} /> : <ShieldAlert size={14} color={statusColor} />}
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: statusColor }}>{item.status.toUpperCase()}</span>
                  </div>

                  <ChevronRight size={18} color="#475569" style={{ flexShrink: 0 }} />
                </motion.div>
              );
            }) : (
              <div style={{ padding: '5rem', textAlign: 'center', color: '#475569' }}>
                <Search size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>No results for "{searchTerm}"</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
