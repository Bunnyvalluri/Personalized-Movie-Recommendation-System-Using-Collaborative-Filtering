import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, CheckCircle, Activity, Info, FileText, HeartPulse } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simulated data from prediction
  const data = location.state?.resultData || {
    diseaseName: 'Tomato Early Blight',
    confidence: 0.98,
    status: 'Diseased',
    description: 'Early blight is a common disease of tomatoes caused by the fungus Alternaria linariae. It primarily affects leaves, stems, and fruit, causing target-like spots. It can lead to severe defoliation and yield loss if left unmanaged.',
  };

  const isHealthy = data.status.toLowerCase() === 'healthy';
  const confidencePct = Math.round(data.confidence * 100);
  
  // Dynamic styling based on health status
  const statusColor = isHealthy ? '#10B981' : '#F43F5E';
  const statBg = isHealthy ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.05))';
  const gaugeColor = isHealthy ? '#10B981' : '#F43F5E';

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7F6', fontFamily: '"Outfit", sans-serif' }}>
      {/* Premium Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          padding: '1.25rem 2rem', 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50 
        }}
      >
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'white', 
            border: '1px solid rgba(0,0,0,0.05)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '0.6rem', 
            borderRadius: '50%', 
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowLeft size={20} color="#1E293B" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: '#1E293B', margin: 0, paddingRight: '2rem' }}>
          Analysis Report
        </h1>
      </motion.div>

      <div style={{ maxWidth: '850px', margin: '3rem auto', padding: '0 1.5rem' }}>
        
        {/* Main Result Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          style={{ 
            background: 'white', 
            borderRadius: '32px', 
            overflow: 'hidden', 
            boxShadow: '0 24px 50px -12px rgba(0,0,0,0.08)', 
            marginBottom: '2.5rem',
            border: '1px solid rgba(0,0,0,0.02)'
          }}
        >
          {/* Top image area with elegant gradient overlay */}
          <div style={{ width: '100%', height: '320px', position: 'relative', background: '#0F172A' }}>
            <img 
              src={location.state?.image || "/src/assets/placeholder.jpg"} 
              alt="Analyzed Plant" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
              onError={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #11231c, #163628)';
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
            
            {/* Elegant Status Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                background: 'rgba(255,255,255,0.95)', 
                color: statusColor, 
                padding: '0.6rem 1.25rem', 
                borderRadius: '999px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: 700, 
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              {isHealthy ? <CheckCircle size={18} strokeWidth={3} /> : <ShieldAlert size={18} strokeWidth={3} />}
              {data.status.toUpperCase()}
            </motion.div>

            {/* Title integrated into image */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', right: '2.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                Detected Condition
              </p>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', lineHeight: 1.1, margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {data.diseaseName}
              </h2>
            </div>
          </div>

          <div style={{ padding: '3rem 2.5rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              
              {/* Confidence Score Box */}
              <div style={{ background: '#F8FAFC', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', border: '1px solid #F1F5F9' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * confidencePct) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      cx="50" cy="50" r="42" 
                      fill="none" 
                      stroke={gaugeColor} 
                      strokeWidth="10" 
                      strokeDasharray="264" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#0F172A', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{confidencePct}%</span>
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Confidence</h4>
                  <p style={{ margin: 0, color: '#0F172A', fontSize: '1.2rem', fontWeight: 700 }}>High Precision</p>
                </div>
              </div>

              {/* Status Box */}
              <div style={{ background: statBg, borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'center', border: `1px solid ${isHealthy ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}` }}>
                 <div style={{ background: 'white', padding: '0.75rem', borderRadius: '14px', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <HeartPulse size={24} color={statusColor} />
                 </div>
                 <h4 style={{ margin: '0 0 0.25rem 0', color: isHealthy ? '#047857' : '#BE123C', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plant Status</h4>
                 <p style={{ margin: 0, color: statusColor, fontSize: '1.6rem', fontWeight: 800 }}>{data.status}</p>
              </div>

            </div>

            {/* Description Section */}
            <div style={{ background: '#F8FAFC', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3B82F6' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#DBEAFE', padding: '0.6rem', borderRadius: '12px' }}>
                  <FileText size={22} color="#2563EB" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Clinical Description</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, margin: 0, letterSpacing: '-0.01em' }}>
                {data.description}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Floating Action Buttons Area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button 
            style={{ 
              flex: 1, 
              background: 'white', 
              color: '#0F172A', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              fontWeight: 700, 
              fontSize: '1.05rem', 
              border: '1px solid #E2E8F0', 
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)' 
            }} 
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(0,0,0,0.1)';
            }} 
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.05)';
            }}
          >
            Save to History
          </button>
          <button 
            onClick={() => navigate('/treatment')}
            style={{ 
              flex: 2, 
              background: '#22c55e', 
              color: 'white', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              fontWeight: 700, 
              fontSize: '1.05rem', 
              border: 'none', 
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              boxShadow: '0 12px 24px -6px rgba(34, 197, 94, 0.4)' 
            }} 
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 30px -6px rgba(34, 197, 94, 0.5)';
              e.currentTarget.style.background = '#16a34a';
            }} 
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(34, 197, 94, 0.4)';
              e.currentTarget.style.background = '#22c55e';
            }}
          >
            View Treatment Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}
