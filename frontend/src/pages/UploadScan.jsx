import React, { useState, useRef } from 'react';
import { Camera, ChevronLeft, ArrowRight, Zap, Image as ImageIcon, Leaf } from 'lucide-react';
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
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); 
    else if (e.type === "dragleave") setDragActive(false); 
  };
  
  const handleDrop = (e) => { 
    e.preventDefault(); e.stopPropagation(); 
    setDragActive(false); 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); 
  };
  
  const handleChange = (e) => { 
    e.preventDefault(); 
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); 
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
    } catch (error) {
      console.error("Analysis failed", error);
      setTimeout(() => {
        setLoading(false);
        navigate('/result', { state: { image: URL.createObjectURL(file) } });
      }, 1500);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} 
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, marginTop: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '4rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', color: 'white' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
            <ChevronLeft size={28} />
          </button>
          <div style={{ flex: 1, textAlign: 'center', paddingRight: '56px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>Upload Crop Image</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#4ADE80', fontSize: '1rem', fontWeight: 500, fontFamily: 'monospace' }}>AgriScan Diagnostic AI</p>
          </div>
        </div>

        {/* Main Scan Box */}
        <div 
          className="glass-panel"
          style={{
            width: '100%',
            aspectRatio: '3/4',
            background: file ? '#000' : 'rgba(15, 23, 42, 0.4)',
            border: file ? '1px solid rgba(255,255,255,0.1)' : `2px dashed ${dragActive ? '#4ADE80' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            padding: 0,
            boxShadow: file ? '0 40px 80px -20px rgba(0,0,0,0.8)' : '0 20px 40px rgba(0,0,0,0.4)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          {/* Top Bar for terminal feel on the box */}
          {!file && (
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}/>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}/>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}/>
                <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', color: '#64748B' }}>AgriScan / Interface</div>
             </div>
          )}

          {/* Futuristic Focus Brackets */}
          <div style={{ position: 'absolute', top: file ? '4%' : '15%', left: file ? '4%' : '8%', right: file ? '4%' : '8%', bottom: file ? '4%' : '8%', pointerEvents: 'none', transition: 'all 0.5s', opacity: file ? 1 : 0.4 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '3px solid #4ADE80', borderLeft: '3px solid #4ADE80', borderRadius: '12px 0 0 0', zIndex: 10, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.4))' }}></div>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '3px solid #4ADE80', borderRight: '3px solid #4ADE80', borderRadius: '0 12px 0 0', zIndex: 10, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.4))' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '3px solid #4ADE80', borderLeft: '3px solid #4ADE80', borderRadius: '0 0 0 12px', zIndex: 10, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.4))' }}></div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '3px solid #4ADE80', borderRight: '3px solid #4ADE80', borderRadius: '0 0 12px 0', zIndex: 10, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.4))' }}></div>
          </div>

          {!file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem', zIndex: 5 }}>
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(74, 222, 128, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '100px', height: '100px', background: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Leaf size={36} color="#4ADE80" strokeWidth={1.5} />
              </motion.div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', cursor: 'pointer', marginBottom: '1rem', letterSpacing: '-0.02em', fontFamily: 'monospace' }} onClick={() => fileInputRef.current?.click()}>
                Drop Leaf Image Here
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '1.15rem', fontWeight: 400, maxWidth: '320px', lineHeight: 1.6 }}>Insert a photo of the distressed plant or use the button below to browse.</p>
            </div>
          ) : (
            <>
              <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: loading ? 0.4 : 1, scale: 1 }} transition={{ duration: 0.5 }} src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Animated Scanning Line */}
              {loading && (
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, transparent 0%, #4ADE80 50%, transparent 100%)', boxShadow: '0 0 50px 15px rgba(74,222,128,0.6)', zIndex: 20 }}
                />
              )}
              
              <AnimatePresence>
                {loading && (
                   <motion.div 
                     initial={{ opacity: 0, y: 30, scale: 0.9 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 30, scale: 0.9 }}
                     style={{ position: 'absolute', background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)', padding: '1.25rem 2.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 30, border: '1px solid rgba(74, 222, 128, 0.4)', color: '#4ADE80', fontWeight: 600, fontFamily: 'monospace', fontSize: '1.1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.7)' }}
                   >
                      <Zap size={20} className="pulse-fast" fill="#4ADE80" /> <span style={{letterSpacing: '0.1em'}}>ANALYZING PATHOGENS...</span>
                   </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleChange} style={{ display: 'none' }} />
        <input ref={cameraInputRef} type="file" accept="image/jpeg, image/png, image/webp" capture="environment" onChange={handleChange} style={{ display: 'none' }} />

        {!file ? (
          <button 
            onClick={() => cameraInputRef.current?.click()}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: 'white', padding: '1.5rem', borderRadius: '20px', fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow='0 15px 40px rgba(0,0,0,0.3)';}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)';}}
          >
            <Camera size={24} /> Open Device Camera
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
            <button 
              onClick={() => setFile(null)} 
              disabled={loading}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '1.15rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: loading ? 0.5 : 1 }}
              onMouseOver={e=>!loading && (e.currentTarget.style.background='rgba(255,255,255,0.1)')} onMouseOut={e=>!loading && (e.currentTarget.style.background='rgba(255,255,255,0.05)')}
            >
              Abort
            </button>
            <button 
              onClick={handleAnalyze} 
              disabled={loading} 
              style={{ flex: 2, background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)', color: '#050505', padding: '1.5rem', border: 'none', borderRadius: '20px', fontSize: '1.15rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 15px 30px rgba(34, 197, 94, 0.3)' }}
              onMouseOver={e=>!loading && (e.currentTarget.style.transform='translateY(-2px)')} onMouseOut={e=>!loading && (e.currentTarget.style.transform='translateY(0)')}
            >
              {loading ? 'Analyzing...' : <>Diagnose Crop <ArrowRight size={20} strokeWidth={2.5} /></>}
            </button>
          </div>
        )}
        <style>{`
          .pulse-fast {
            animation: pulse-op 1s ease-in-out infinite alternate;
          }
          @keyframes pulse-op {
            0% { opacity: 0.5; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
