import React, { useState, useRef } from 'react';
import { Camera, ChevronLeft, ArrowRight, Zap, Leaf, UploadCloud, X, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function UploadScan() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/result', { state: { resultData: response.data, image: URL.createObjectURL(file) } });
      }, 1500);
    } catch {
      setTimeout(() => {
        setLoading(false);
        navigate('/result', { state: { image: URL.createObjectURL(file) } });
      }, 1500);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', background: '#020617' }}>

      {/* Top Bar */}
      <div style={{ padding: '1.25rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', flexShrink: 0, transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8'; }}
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>AI Disease Scanner</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>Upload or capture a leaf image for instant diagnosis</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '99px', padding: '0.3rem 0.9rem' }}>
          <Scan size={13} color="#4ADE80" />
          <span style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 700 }}>DIAGNOSTIC MODE</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, minHeight: 0 }}>

        {/* Left: Drop Zone */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              style={{
                flex: 1, borderRadius: '24px', border: file ? '1px solid rgba(255,255,255,0.1)' : `2px dashed ${dragActive ? '#4ADE80' : 'rgba(255,255,255,0.12)'}`,
                background: file ? '#000814' : dragActive ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)',
                position: 'relative', overflow: 'hidden', cursor: file ? 'default' : 'pointer',
                transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '400px',
              }}
            >
              {/* Scan bracket corners */}
              {['tl','tr','bl','br'].map(pos => (
                <div key={pos} style={{
                  position: 'absolute', width: '32px', height: '32px', zIndex: 10,
                  ...(pos === 'tl' ? { top: 16, left: 16, borderTop: '2px solid #4ADE80', borderLeft: '2px solid #4ADE80', borderRadius: '6px 0 0 0' } : {}),
                  ...(pos === 'tr' ? { top: 16, right: 16, borderTop: '2px solid #4ADE80', borderRight: '2px solid #4ADE80', borderRadius: '0 6px 0 0' } : {}),
                  ...(pos === 'bl' ? { bottom: 16, left: 16, borderBottom: '2px solid #4ADE80', borderLeft: '2px solid #4ADE80', borderRadius: '0 0 0 6px' } : {}),
                  ...(pos === 'br' ? { bottom: 16, right: 16, borderBottom: '2px solid #4ADE80', borderRight: '2px solid #4ADE80', borderRadius: '0 0 6px 0' } : {}),
                  filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.5))',
                }} />
              ))}

              {!file ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <motion.div whileHover={{ scale: 1.05 }} style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                    <UploadCloud size={40} color="#4ADE80" strokeWidth={1.5} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.75rem 0', fontFamily: 'Space Grotesk' }}>
                    {dragActive ? 'Drop it here!' : 'Drop Leaf Image'}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto 2rem auto' }}>
                    Drag & drop a photo of the distressed plant, or click to browse
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.3rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', color: '#64748B' }}>JPG</span>
                    <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.3rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', color: '#64748B' }}>PNG</span>
                    <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.3rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', color: '#64748B' }}>WEBP</span>
                  </div>
                </div>
              ) : (
                <>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loading ? 0.4 : 0.9, transition: 'opacity 0.3s' }} />
                  {/* Clear button */}
                  {!loading && (
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ position: 'absolute', top: '1rem', right: '1rem', width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', zIndex: 20 }}>
                      <X size={16} />
                    </button>
                  )}
                  {/* Scan line */}
                  {loading && (
                    <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #4ADE80, transparent)', boxShadow: '0 0 30px 10px rgba(74,222,128,0.4)', zIndex: 20 }}
                    />
                  )}
                  {/* Loading overlay */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(4px)', zIndex: 30 }}
                      >
                        <div style={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '16px', padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Zap size={20} color="#4ADE80" fill="#4ADE80" style={{ animation: 'pulse 1s infinite' }} />
                          <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', fontFamily: 'monospace' }}>ANALYZING PATHOGENS...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* File input hidden */}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} style={{ display: 'none' }} />
            <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleChange} style={{ display: 'none' }} />
          </motion.div>
        </div>

        {/* Right: Control Panel */}
        <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>

            {/* File info */}
            {file ? (
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Leaf size={18} color="#4ADE80" />
                  <span style={{ fontWeight: 700, color: '#4ADE80', fontSize: '0.9rem' }}>Image Ready</span>
                </div>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.85rem', wordBreak: 'break-all' }}>{file.name}</p>
                <p style={{ margin: '0.25rem 0 0', color: '#64748B', fontSize: '0.8rem' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>No image selected. Upload or capture a photo to begin.</p>
              </div>
            )}

            {/* AI Features list */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>What our AI detects</p>
              {['Fungal diseases (blight, mildew)', 'Bacterial leaf infections', 'Nutrient deficiencies', 'Pest damage patterns', 'Healthy crop confirmation'].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!file ? (
                <>
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{ width: '100%', padding: '1rem', background: '#22C55E', color: '#050505', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#16A34A'} onMouseOut={e => e.currentTarget.style.background = '#22C55E'}
                  >
                    <UploadCloud size={20} /> Upload Image
                  </button>
                  <button onClick={() => cameraInputRef.current?.click()}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    <Camera size={20} /> Open Camera
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleAnalyze} disabled={loading}
                    style={{ width: '100%', padding: '1.1rem', background: loading ? 'rgba(34,197,94,0.5)' : 'linear-gradient(135deg, #4ADE80, #22C55E)', color: '#050505', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 8px 20px rgba(34,197,94,0.25)', transition: 'all 0.2s' }}
                    onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {loading ? <><Zap size={20} fill="currentColor" /> Analyzing...</> : <>Diagnose Crop <ArrowRight size={20} strokeWidth={2.5} /></>}
                  </button>
                  <button onClick={() => setFile(null)} disabled={loading}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.5 : 1 }}
                    onMouseOver={e => !loading && (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    Clear & Start Over
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
