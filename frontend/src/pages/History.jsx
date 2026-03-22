import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, ChevronRight, ShieldAlert, CheckCircle, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_HISTORY = [
  { 
    id: 'REQ-0892', 
    disease: 'Tomato Early Blight', 
    confidence: 0.98, 
    crop: 'Tomato Plant', 
    date: 'Today, 10:45 AM', 
    status: 'Diseased',
    img: '/src/assets/placeholder.jpg', // Replace with proper image path
    description: 'Early blight is a common disease of tomatoes caused by the fungus Alternaria linariae. It primarily affects leaves, stems, and fruit, causing target-like spots. Immediate treatment is recommended.'
  },
  { 
    id: 'REQ-0891', 
    disease: 'Healthy Crop', 
    confidence: 0.99, 
    crop: 'Bell Pepper', 
    date: 'Yesterday, 04:20 PM', 
    status: 'Healthy',
    img: '/src/assets/placeholder.jpg',
    description: 'No diseases detected. The plant is displaying vibrant, strong leaves without deformations.'
  },
  { 
    id: 'REQ-0884', 
    disease: 'Powdery Mildew', 
    confidence: 0.91, 
    crop: 'Zucchini', 
    date: 'Mar 15, 2026', 
    status: 'Diseased',
    img: '/src/assets/placeholder.jpg',
    description: 'Identified white powdery spots on leaves indicative of Powdery Mildew. Requires fungicide application.'
  },
  { 
    id: 'REQ-0879', 
    disease: 'Septoria Leaf Spot', 
    confidence: 0.88, 
    crop: 'Tomato Plant', 
    date: 'Mar 10, 2026', 
    status: 'Diseased',
    img: '/src/assets/placeholder.jpg',
    description: 'Fungal disease that generally affects the lower foliage. Shows small, circular spots.'
  },
];

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = MOCK_HISTORY.filter(h => 
    h.disease.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const handleRowClick = (item) => {
    // Navigate to /result with the exact data needed by Result.jsx
    navigate('/result', {
      state: {
        resultData: {
          diseaseName: item.disease,
          confidence: item.confidence,
          status: item.status,
          description: item.description
        },
        image: item.img
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white', paddingBottom: '6rem', fontFamily: '"Outfit", "Inter", sans-serif', position: 'relative' }}>
      
      {/* Background Grid */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', backgroundImage: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 50%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '100% 100%, 40px 40px, 40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header Container */}
      <div style={{ padding: '4rem 2rem 4rem 2rem', position: 'relative', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '1rem' }}>
              <Leaf size={14} /> Scan History
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: 'white' }}>
              Crop Diagnostics Log
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', margin: 0 }}>Query past crop scans, disease identification metrics, and treatment history.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '500px', transition: 'all 0.3s' }}>
            <Search size={20} color="#64748B" />
            <input 
              type="text" 
              placeholder="Query by ID, crop, or disease..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'white', marginLeft: '1rem', fontFamily: 'monospace' }} 
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '900px', margin: '3rem auto 0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}
      >
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {filteredHistory.length > 0 ? filteredHistory.map((item) => {
              const isHealthy = item.status === 'Healthy';
              const statusColor = isHealthy ? '#34D399' : '#F87171';
              const statusBg = isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';

              return (
                <motion.div 
                  key={item.id} 
                  variants={itemVariants}
                  layoutId={item.id}
                  onClick={() => handleRowClick(item)}
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: 'pointer', 
                    border: '1px solid rgba(255,255,255,0.03)',
                    background: 'rgba(255,255,255,0.01)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} 
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }} 
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#0F172A', flexShrink: 0, opacity: 0.8 }}>
                      <img 
                        src={item.img} 
                        alt={item.crop} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={e => e.target.style.background = 'linear-gradient(45deg, #11231c, #163628)'}
                      />
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.1)' }}>{item.id}</span>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', margin: 0, fontFamily: 'monospace' }}>{item.disease}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 500, alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#94A3B8' }}>FIELD:</span> {item.crop}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ 
                        background: statusBg, 
                        color: statusColor, 
                        padding: '0.4rem 1rem', 
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontFamily: 'monospace',
                        border: `1px solid ${isHealthy ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                      }}>
                        {isHealthy ? <CheckCircle size={14} strokeWidth={3} /> : <ShieldAlert size={14} strokeWidth={3} />}
                        {item.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, fontFamily: 'monospace' }}>acc: {(item.confidence * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B', fontSize: '1.1rem', fontFamily: 'monospace' }}>
                $ grep: No search results found for "{searchTerm}".
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

