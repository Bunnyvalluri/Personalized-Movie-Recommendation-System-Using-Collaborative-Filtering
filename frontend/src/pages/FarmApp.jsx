import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Target, Sprout, Settings, Bell, Search, MapPin, CloudRain, Wind, Droplets, Camera, CheckCircle2, AlertTriangle, ChevronRight, UploadCloud, X, Leaf, Activity, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Scanner State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  const TABS = [
    { id: 'overview', label: 'Farm Overview', icon: LayoutDashboard },
    { id: 'scanner', label: 'Disease Scanner', icon: Target },
    { id: 'fields', label: 'Field History', icon: Sprout },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setScanResult({
        disease: 'Tomato Early Blight',
        confidence: '98%',
        recommendation: 'Immediate action required. Prune lower diseased leaves, implement drip irrigation, and apply a targeted copper-based fungicide protocol within 24 hours to prevent full crop yield loss.',
        status: 'critical'
      });
    }, 2500);
  };

  const clearScan = () => {
    setFile(null);
    setScanResult(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: '"Outfit", "Inter", sans-serif' }}>
      
      {/* Premium Sidebar */}
      <div style={{ width: '300px', background: 'white', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', flexShrink: 0, borderRight: '1px solid #E2E8F0', zIndex: 50 }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem', cursor: 'pointer', padding: '0 0.5rem' }} onClick={() => navigate('/')}>
          <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '0.6rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)' }}>
            <Leaf size={28} color="white" strokeWidth={2.5} />
          </div>
          <div>
             <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: '#0F172A' }}>AgriScan</h1>
             <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#10B981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pro Network</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '1rem' }}>Dashboard Menu</p>
          
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setScanResult(null); setFile(null); }}
                whileHover={{ scale: isActive ? 1 : 1.02, x: isActive ? 0 : 5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.25rem', width: '100%',
                  background: isActive ? '#F1F5F9' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  border: 'none', borderRadius: '16px', cursor: 'pointer',
                  fontSize: '1.05rem', fontWeight: isActive ? 700 : 600, transition: 'background 0.2s', textAlign: 'left'
                }}
              >
                <div style={{ color: isActive ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* User Profile Card inside Sidebar */}
        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'border 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
          <div style={{ width: '42px', height: '42px', background: '#DBEAFE', color: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            <UserCircle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>John Smith</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Global Co-Op Lead</p>
          </div>
        </div>
      </div>

      {/* Main App Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Dynamic Top Navbar */}
        <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
             {TABS.find(t => t.id === activeTab)?.label}
           </h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.75rem 1.25rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B', width: '250px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
               <Search size={18} /> 
               <input type="text" placeholder="Search fields, crops..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.95rem', fontFamily: 'inherit' }} />
             </div>
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', cursor: 'pointer', color: '#64748B', background: 'white', border: '1px solid #E2E8F0', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
               <Bell size={20} />
               <div style={{ position: 'absolute', top: '10px', right: '12px', width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
             </motion.button>
           </div>
        </div>

        {/* Workspace */}
        <div style={{ padding: '3rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                
                {/* Epic Top Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                   {[
                     { title: 'Temperature & Weather', value: '24°C', sub: 'Partly Cloudy, 20% precipitation chance', icon: CloudRain, color: '#3B82F6', bg: '#EFF6FF' },
                     { title: 'Average Soil Moisture', value: '87%', sub: 'Optimal levels across Sector 7 & 8', icon: Droplets, color: '#10B981', bg: '#ECFDF5' },
                     { title: 'Wind & Humidity', value: '12 km/h', sub: 'North-East draft, 60% Humidity', icon: Wind, color: '#F59E0B', bg: '#FEF3C7' }
                   ].map((stat, i) => (
                     <motion.div key={i} whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} style={{ background: 'white', borderRadius: '28px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', transition: 'all 0.3s' }}>
                       <div style={{ background: stat.bg, padding: '1.25rem', borderRadius: '20px', color: stat.color }}>
                         <stat.icon size={32} />
                       </div>
                       <div style={{ flex: 1 }}>
                         <p style={{ margin: '0 0 0.5rem 0', color: '#64748B', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</p>
                         <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{stat.value}</h3>
                         <p style={{ margin: '0.5rem 0 0 0', color: '#94A3B8', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>{stat.sub}</p>
                       </div>
                     </motion.div>
                   ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '2rem' }}>
                  
                  {/* Field Status Widget */}
                  <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <MapPin color="#10B981" /> Tracked Fields
                      </h3>
                      <button style={{ background: '#F8FAFC', border: 'none', color: '#10B981', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '99px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#ECFDF5'} onMouseOut={e=>e.currentTarget.style.background='#F8FAFC'}>View Topography Map</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {[
                        { name: 'North Field (Tomatoes)', desc: 'High risk of Blight detected manually yesterday.', status: 'Critical', healthy: false, img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80' },
                        { name: 'East Sector (Potatoes)', desc: 'Routine systemic checks passed. Optimal growth.', status: 'Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1518972559570-7ac3f2951dc8?auto=format&fit=crop&w=400&q=80' },
                        { name: 'South Slope (Corn)', desc: 'Crop progressing nicely into late vegetative stages.', status: 'Healthy', healthy: true, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
                        { name: 'Greenhouse 3 (Peppers)', desc: 'Humidity sensors indicate high mildew risk.', status: 'Warning', healthy: false, img: 'https://images.unsplash.com/photo-1595841696677-6489af3f2740?auto=format&fit=crop&w=400&q=80' },
                        { name: 'Vineyard Alpha', desc: 'Slight discoloration noticed on outer vines.', status: 'Warning', healthy: false, img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=80' }
                      ].map((field, i) => (
                        <motion.div 
                          key={i} 
                          onClick={() => {
                            setActiveTab('scanner');
                            setScanResult({
                              disease: field.healthy ? 'Healthy Crop Profile' : (field.status === 'Critical' ? 'Pathology Identified' : 'Early Warning Signs'),
                              confidence: field.healthy ? '99%' : (field.status === 'Critical' ? '98%' : '85%'),
                              recommendation: field.healthy ? 'No action required. Plant shows excellent vitality, optimal chlorophyll levels, and no signs of pathogen distress.' : (field.status === 'Critical' ? 'Immediate action required. Implement drip irrigation and apply a targeted copper-based fungicide protocol within 24 hours.' : 'Monitor closely. Apply preventative organic fungicide spray and ensure optimal airflow between plants.'),
                              status: field.healthy ? 'healthy' : field.status.toLowerCase(),
                              field: field.name
                            });
                          }}
                          whileHover={{ scale: 1.01, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)' }} 
                          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', border: '1px solid #F1F5F9', borderRadius: '24px', transition: 'all 0.2s', cursor: 'pointer', background: 'white' }}
                        >
                          <img src={field.img} alt={field.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>{field.name}</h4>
                            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem', lineHeight: 1.5 }}>{field.desc}</p>
                          </div>
                          <div style={{ background: field.healthy ? '#ECFDF5' : '#FEF2F2', color: field.healthy ? '#059669' : '#DC2626', padding: '0.6rem 1.25rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${field.healthy ? '#A7F3D0' : '#FECACA'}` }}>
                            {field.healthy ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />} 
                            {field.status}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Primary Action Block */}
                    <motion.div 
                      onClick={() => setActiveTab('scanner')}
                      style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '32px', padding: '3rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(16,185,129,0.4)', position: 'relative', overflow: 'hidden' }}
                      whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.5)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', transform: 'translate(20%, -20%)', borderRadius: '50%', pointerEvents: 'none' }} />
                      <div style={{ background: 'white', color: '#10B981', padding: '1.25rem', borderRadius: '20px', marginBottom: '2rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <Camera size={36} strokeWidth={2.5} />
                      </div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Scan Crop Disease</h3>
                      <p style={{ margin: 0, color: '#D1FAE5', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '280px' }}>Access your camera to diagnose crop illness on the field immediately.</p>
                      
                      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, background: 'rgba(0,0,0,0.15)', padding: '0.85rem 1.75rem', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Start Inference <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </motion.div>

                    {/* Minimal Log Block */}
                    <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', border: '1px solid #F1F5F9', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)' }}>
                       <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Activity color="#3B82F6" /> Recent Co-Op Activity
                       </h4>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                         <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                           <div style={{ background: '#FEF2F2', padding: '0.6rem', borderRadius: '50%', color: '#DC2626' }}><AlertTriangle size={18} /></div>
                           <div>
                             <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>Fungicide applied to North Field</p>
                             <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Completed by John.S • 2 hours ago</p>
                           </div>
                         </div>
                         <div style={{ height: '1px', background: '#F1F5F9', width: '100%' }} />
                         <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                           <div style={{ background: '#ECFDF5', padding: '0.6rem', borderRadius: '50%', color: '#059669' }}><Droplets size={18} /></div>
                           <div>
                             <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>Irrigation systems activated</p>
                             <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Automated Schedule • 5 hours ago</p>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCANNER PANEL */}
            {activeTab === 'scanner' && (
              <motion.div key="scanner" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ECFDF5', color: '#10B981', padding: '0.75rem', borderRadius: '20px', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(16,185,129,0.15)' }}>
                    <Target size={36} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>AgriScan AI Diagnostics</h2>
                  <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Upload a clear photo of the distressed plant leaf. Our neural network will instantly identify the pathogen and generate a protocol.</p>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {!scanResult ? (
                    <motion.div 
                      style={{ background: 'white', borderRadius: '36px', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', outline: file ? '4px solid #10B981' : 'none', outlineOffset: '-4px', transition: 'outline 0.3s' }}
                    >
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                          width: '100%', height: '400px', border: file ? 'none' : '3px dashed #CBD5E1', borderRadius: '24px', background: file ? '#F8FAFC' : '#F8FAFC',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s',
                          overflow: 'hidden', position: 'relative'
                        }}
                        onMouseOver={e=>!file && (e.currentTarget.style.borderColor='#10B981')}
                        onMouseOut={e=>!file && (e.currentTarget.style.borderColor='#CBD5E1')}
                      >
                        {file ? (
                          <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '50%', boxShadow: '0 8px 16px rgba(0,0,0,0.06)', marginBottom: '1.5rem', color: '#10B981' }}>
                              <UploadCloud size={48} strokeWidth={2} />
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>Select or Drop File</h3>
                            <p style={{ margin: 0, color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Supports high-resolution JPG & PNG imagery.</p>
                          </>
                        )}

                        {loading && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="custom-loader" style={{ width: '60px', height: '60px', border: '5px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', marginBottom: '1.5rem' }} />
                            <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }}>ANALYZING PATHOGEN...</h3>
                          </div>
                        )}
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                      </div>

                      <input ref={fileInputRef} type="file" onChange={(e) => { if(e.target.files[0]) setFile(e.target.files[0]) }} style={{ display: 'none' }} accept="image/*" />

                      {file && (
                        <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0.5rem 0.5rem 0.5rem' }}>
                          <button onClick={() => setFile(null)} style={{ flex: 1, padding: '1.5rem', background: '#F1F5F9', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.15rem', color: '#475569', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#E2E8F0'} onMouseOut={e=>e.currentTarget.style.background='#F1F5F9'}>Abort Scan</button>
                          <button onClick={handleScan} disabled={loading} style={{ flex: 2, padding: '1.5rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.15rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: loading ? 0.7 : 1, transition: 'background 0.2s', boxShadow: '0 10px 20px rgba(16,185,129,0.3)' }} onMouseOver={e=>!loading && (e.currentTarget.style.background='#059669')} onMouseOut={e=>!loading && (e.currentTarget.style.background='#10B981')}>
                            {loading ? 'Processing Image...' : 'Diagnose Plant Pathology'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'white', borderRadius: '36px', padding: '3.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', overflow: 'hidden', position: 'relative' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: scanResult.status === 'healthy' ? '#10B981' : (scanResult.status === 'warning' ? '#F59E0B' : '#EF4444') }} />
                       
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                           <div style={{ 
                             background: scanResult.status === 'healthy' ? '#ECFDF5' : (scanResult.status === 'warning' ? '#FEF3C7' : '#FEF2F2'), 
                             padding: '1.25rem', borderRadius: '20px', 
                             color: scanResult.status === 'healthy' ? '#059669' : (scanResult.status === 'warning' ? '#D97706' : '#DC2626'), 
                             border: `1px solid ${scanResult.status === 'healthy' ? '#A7F3D0' : (scanResult.status === 'warning' ? '#FDE68A' : '#FECACA')}` 
                           }}>
                             {scanResult.status === 'healthy' ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <AlertTriangle size={40} strokeWidth={2.5} />}
                           </div>
                           <div>
                             <p style={{ margin: '0 0 0.25rem 0', color: scanResult.status === 'healthy' ? '#059669' : (scanResult.status === 'warning' ? '#D97706' : '#DC2626'), fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                               {scanResult.field ? `Report: ${scanResult.field}` : (scanResult.status === 'healthy' ? 'Optimal Health' : (scanResult.status === 'warning' ? 'Attention Needed' : 'Crucial Warning Level'))}
                             </p>
                             <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>{scanResult.disease}</h3>
                           </div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Model Confidence</p>
                            <h4 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{scanResult.confidence}</h4>
                         </div>
                       </div>

                       <div style={{ background: '#F8FAFC', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', marginBottom: '3rem' }}>
                         <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <CheckCircle2 color="#10B981" size={28} /> Complete Treatment Protocol
                         </h4>
                         <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.7, color: '#475569', fontWeight: 500 }}>
                           {scanResult.recommendation}
                         </p>
                       </div>

                       <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <button onClick={clearScan} style={{ flex: 1, padding: '1.5rem', background: '#F1F5F9', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1.15rem', color: '#475569', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.background='#E2E8F0'} onMouseOut={e=>e.currentTarget.style.background='#F1F5F9'}><X size={20} /> Close Report</button>
                          <button style={{ flex: 2, padding: '1.5rem', background: '#0F172A', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(15,23,42,0.2)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 15px 30px rgba(15,23,42,0.3)';}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(15,23,42,0.2)';}}>Save to Field Master Record</button>
                       </div>
                    </motion.div>
                  )}
                </div>

              </motion.div>
            )}

            {/* PREFERENCES / SETTINGS PANEL */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  
                  <div style={{ background: 'white', borderRadius: '36px', padding: '3.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                      <div style={{ background: '#F1F5F9', padding: '0.75rem', borderRadius: '16px', color: '#64748B' }}><Settings size={28} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Platform Configuration</h3>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>Manage your AgriScan operator details and system alert preferences.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operator Name</label>
                        <input type="text" defaultValue="John Smith" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '1.1rem', color: '#0F172A', outline: 'none', background: '#F8FAFC', fontWeight: 600, transition: 'all 0.2s' }} onFocus={e=>e.currentTarget.style.borderColor='#10B981'} onBlur={e=>e.currentTarget.style.borderColor='#E2E8F0'} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Communication Email</label>
                        <input type="email" defaultValue="john.smith@heartland.ag" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '1.1rem', color: '#0F172A', outline: 'none', background: '#F8FAFC', fontWeight: 600, transition: 'all 0.2s' }} onFocus={e=>e.currentTarget.style.borderColor='#10B981'} onBlur={e=>e.currentTarget.style.borderColor='#E2E8F0'} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Farm Location / Geographic Sector</label>
                        <input type="text" defaultValue="Sector 7 & 8, Heartland Valley, Iowa" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '1.1rem', color: '#0F172A', outline: 'none', background: '#F8FAFC', fontWeight: 600, transition: 'all 0.2s' }} onFocus={e=>e.currentTarget.style.borderColor='#10B981'} onBlur={e=>e.currentTarget.style.borderColor='#E2E8F0'} />
                    </div>

                    <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '3.5rem' }} />

                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '2rem' }}>Notification Logistics</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {[
                        { title: 'Critical Disease Alerts', desc: 'Receive immediate push notifications when pathogens are identified on your fields.' },
                        { title: 'Weather & Frost Warnings', desc: 'Alerts for sudden temperature shifts affecting crop viability in tracked sectors.' },
                        { title: 'Monthly Agronomy Reports', desc: 'AgriScan AI summary of your tracked fields sent directly via email.' }
                      ].map((pref, i) => (
                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem', border: '1px solid #E2E8F0', borderRadius: '24px', background: '#F8FAFC' }}>
                           <div style={{ paddingRight: '2rem' }}>
                             <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{pref.title}</h4>
                             <p style={{ margin: 0, fontSize: '1rem', color: '#64748B', lineHeight: 1.5, fontWeight: 500 }}>{pref.desc}</p>
                           </div>
                           <div style={{ width: '56px', height: '32px', background: i === 1 ? '#CBD5E1' : '#10B981', borderRadius: '99px', display: 'flex', alignItems: 'center', padding: '4px', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}>
                              <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', transform: i === 1 ? 'translateX(0px)' : 'translateX(24px)', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                           </div>
                         </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('overview')} style={{ background: '#1E293B', color: 'white', padding: '1.25rem 3rem', borderRadius: '20px', fontWeight: 800, fontSize: '1.15rem', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px -10px rgba(15,23,42,0.4)' }}>
                         Submit Configuration
                       </motion.button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* FIELD HISTORY PANEL */}
            {activeTab === 'fields' && (
              <motion.div key="fields" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sprout color="#10B981" size={36} strokeWidth={2.5} /> Master Field History
                      </h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#64748B', fontSize: '1.15rem', fontWeight: 500 }}>Comprehensive log of all AI diagnostics and treatments applied across your cooperative.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                      <button style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.85rem 1.75rem', borderRadius: '99px', fontWeight: 700, fontSize: '1.05rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 6px 12px rgba(0,0,0,0.02)', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F8FAFC'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                        <CloudRain size={20} /> Filter by Weather
                      </button>
                      <button style={{ background: '#1E293B', border: 'none', padding: '0.85rem 2rem', borderRadius: '99px', fontWeight: 800, fontSize: '1.05rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 15px 30px -10px rgba(15,23,42,0.5)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}>
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 2fr) minmax(250px, 2.5fr) minmax(250px, 2.5fr) minmax(130px, 1.5fr)', gap: '1.5rem', background: '#F8FAFC', padding: '1.75rem 2.5rem', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <div>Date</div>
                      <div>Sector / Crop</div>
                      <div>Diagnostic Event</div>
                      <div>Action Taken</div>
                      <div>Status</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {[
                        { date: 'Oct 24, 2026', field: 'North Field (Tomatoes)', event: 'Early Blight Pathogen Detected', action: 'Copper Fungicide Protocol', status: 'Critical' },
                        { date: 'Oct 20, 2026', field: 'East Sector (Potatoes)', event: 'Routine Growth Scan', action: 'None required', status: 'Healthy' },
                        { date: 'Oct 15, 2026', field: 'South Slope (Corn)', event: 'Routine Growth Scan', action: 'Irrigation increased +10%', status: 'Healthy' },
                        { date: 'Oct 12, 2026', field: 'North Field (Tomatoes)', event: 'Aphid Swarm Trajectory Match', action: 'Organic Neem Oil Sprayed', status: 'Warning' },
                        { date: 'Oct 02, 2026', field: 'Vineyard Alpha', event: 'Powdery Mildew Risk 80%', action: 'Preventative Sulphur Application', status: 'Warning' },
                        { date: 'Sep 28, 2026', field: 'East Sector (Potatoes)', event: 'Soil Depletion Detected', action: 'Nitrogen Fertilizer Added', status: 'Warning' },
                        { date: 'Sep 15, 2026', field: 'Main Operations', event: 'Firmware Update', action: 'Tractor Mount Cams calibrated', status: 'System' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 2fr) minmax(250px, 2.5fr) minmax(250px, 2.5fr) minmax(130px, 1.5fr)', gap: '1.5rem', padding: '1.5rem 2.5rem', borderBottom: i !== 6 ? '1px solid #F1F5F9' : 'none', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#F8FAFC'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                           <div style={{ color: '#64748B', fontWeight: 600, fontSize: '1rem' }}>{item.date}</div>
                           <div style={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>{item.field}</div>
                           
                           <div style={{ color: '#1E293B', fontWeight: 500, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.status === 'Critical' ? '#DC2626' : item.status === 'Warning' ? '#F59E0B' : item.status === 'Healthy' ? '#10B981' : '#64748B' }} />
                              {item.event}
                           </div>
                           
                           <div style={{ color: '#64748B', fontWeight: 500, fontSize: '1.05rem' }}>{item.action}</div>
                           
                           <div>
                              <div style={{ display: 'inline-flex', padding: '0.5rem 1.25rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: item.status === 'Critical' ? '#FEF2F2' : item.status === 'Warning' ? '#FEF3C7' : item.status === 'Healthy' ? '#ECFDF5' : '#F1F5F9', color: item.status === 'Critical' ? '#DC2626' : item.status === 'Warning' ? '#D97706' : item.status === 'Healthy' ? '#059669' : '#475569', border: `1px solid ${item.status === 'Critical' ? '#FECACA' : item.status === 'Warning' ? '#FDE68A' : item.status === 'Healthy' ? '#A7F3D0' : '#E2E8F0'}` }}>
                                {item.status}
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
