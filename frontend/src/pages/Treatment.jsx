import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Leaf, CheckCircle2, FlaskConical, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Treatment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simulated data
  const plan = location.state?.plan || {
    diseaseName: 'Tomato Early Blight',
    treatments: [
      'Prune and destroy infected leaves, especially the lower ones touching the soil.',
      'Water at the base of the plant to keep foliage dry.',
      'Ensure proper spacing between plants to improve air circulation.'
    ],
    chemicals: [
      { name: 'Chlorothalonil', type: 'Fungicide', dosage: '2 tsp per gallon of water', freq: 'Every 7-14 days' },
      { name: 'Copper Soap', type: 'Organic Fungicide', dosage: 'Ready to use spray', freq: 'After heavy rain' },
      { name: 'Balanced NPK Fertilizer', type: 'Fertilizer', dosage: 'Slow release granules', freq: 'Once a month' }
    ],
    prevention: [
      'Crop rotation: Do not plant tomatoes or potatoes in the same soil for 2-3 years.',
      'Mulch around the base of the plant to prevent soil splash.',
      'Use drip irrigation instead of overhead watering.',
      'Sanitize garden tools with a 10% bleach solution after use.'
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '6rem', fontFamily: '"Outfit", sans-serif' }}>
      {/* Premium Header Container */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          padding: '1.25rem 2rem', 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
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
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowLeft size={20} color="#1E293B" strokeWidth={2.5} />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0, paddingRight: '2.5rem', letterSpacing: '-0.01em' }}>
          Treatment Protocol
        </h1>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '850px', margin: '3rem auto 0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
      >
        {/* Title Section */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(90deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.05) 100%)', color: '#16A34A', padding: '0.6rem 1.25rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', border: '1px solid rgba(34,197,94,0.2)' }}>
              <Leaf size={16} /> Individualized Care Plan
           </div>
           <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em' }}>{plan.diseaseName}</h2>
           <p style={{ color: '#64748B', fontSize: '1.2rem', margin: 0, fontWeight: 400 }}>Follow this complete protocol to restore harvest health safely.</p>
        </motion.div>

        {/* 1. Recommended Treatment */}
        <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '32px', padding: '3rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
             <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.05) 100%)', padding: '1.25rem', borderRadius: '20px', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 10px 20px rgba(239,68,68,0.1)' }}>
               <AlertTriangle size={32} />
             </div>
             <div>
               <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>Immediate Actions</h3>
               <p style={{ color: '#64748B', fontSize: '1.05rem', margin: 0, fontWeight: 500 }}>Critical steps to halt disease progression.</p>
             </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {plan.treatments.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ background: '#0F172A', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(15,23,42,0.2)' }}>
                  {idx + 1}
                </div>
                <p style={{ color: '#334155', fontSize: '1.1rem', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2. Fertilizers & Pesticides (Chemicals) */}
        <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '32px', padding: '3rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
             <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(16,185,129,0.05) 100%)', padding: '1.25rem', borderRadius: '20px', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
               <FlaskConical size={32} />
             </div>
             <div>
               <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>Chemical Protocol</h3>
               <p style={{ color: '#64748B', fontSize: '1.05rem', margin: 0, fontWeight: 500 }}>Prescribed organic and synthetic applications.</p>
             </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {plan.chemicals.map((chem, idx) => (
              <div key={idx} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', overflow: 'hidden', background: '#F8FAFC', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(0,0,0,0.1)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(0,0,0,0.05)'}>
                <div style={{ background: 'white', padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', borderTop: (chem.type.includes('Fungicide') || chem.type.includes('Pesticide')) ? '4px solid #EF4444' : '4px solid #10B981' }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>{chem.name}</h4>
                  <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{chem.type}</span>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Dosage</span>
                    <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>{chem.dosage}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Frequency</span>
                    <span style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>{chem.freq}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Prevention Tips */}
        <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '32px', padding: '3rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
             <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.05) 100%)', padding: '1.25rem', borderRadius: '20px', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 10px 20px rgba(59,130,246,0.1)' }}>
               <ShieldCheck size={32} />
             </div>
             <div>
               <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>Prevention Strategy</h3>
               <p style={{ color: '#64748B', fontSize: '1.05rem', margin: 0, fontWeight: 500 }}>Proactive measures for future crop seasons.</p>
             </div>
          </div>
          <div style={{ position: 'relative' }}>
            {plan.prevention.map((tip, idx) => (
               <div key={idx} style={{ display: 'flex', gap: '1.25rem', marginBottom: idx !== plan.prevention.length - 1 ? '1.5rem' : '0' }}>
                  <div style={{ color: '#10B981', flexShrink: 0, marginTop: '2px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', padding: '0.2rem' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>{tip}</p>
               </div>
            ))}
          </div>
        </motion.div>
        
        {/* Actions */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '1.5rem 4rem', borderRadius: '999px', fontSize: '1.15rem', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.5)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -15px rgba(15,23,42,0.6)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(15,23,42,0.5)';
              }}
            >
              Complete Checklist <ArrowRight size={22} />
            </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
