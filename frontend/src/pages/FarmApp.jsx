import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Target, Sprout, Settings, Bell, Search, MapPin, CloudRain, Wind, Droplets, Camera, CheckCircle2, AlertTriangle, ChevronRight, UploadCloud, Leaf, Activity, UserCircle, CheckSquare, Landmark, Plane, ArrowRight, Video, ShieldCheck, ShieldAlert, ShoppingCart, Share2, X, ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import Webcam from 'react-webcam';

export default function FarmApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Scanner State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  const [weatherData, setWeatherData] = useState({ temp: '24°C', wind: '12 km/h', humidity: '72%', risk: 'High', forecast: [] });
  const [useWebcam, setUseWebcam] = useState(false);
  const [role, setRole] = useState('Admin'); 
  const [iotSensors, setIotSensors] = useState({ moisture: '87%', nitrogen: 'Optimal', ph: '6.5' });
  const webcamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIotSensors(prev => ({
        ...prev,
        moisture: `${(Math.random() * 5 + 85).toFixed(1)}%`,
        ph: (Math.random() * 0.2 + 6.4).toFixed(2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const captureWebcam = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
       fetch(imageSrc).then(res => res.blob()).then(blob => {
          const newFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setFile(newFile);
          setUseWebcam(false);
       });
    }
  };

  useEffect(() => {
    // Fetch real weather data from a free public API (Open-Meteo) for a demo location with 7-day forecast
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=41.5&longitude=-93.6&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=relative_humidity_2m&timezone=auto')
      .then(res => {
         const { temperature, windspeed } = res.data.current_weather;
         const currentHumidity = res.data.hourly.relative_humidity_2m[0] || 60;
         const riskLevel = currentHumidity > 70 ? 'High Fungal Risk' : 'Low Risk';
         
         const forecast = res.data.daily.time.slice(0, 5).map((time, idx) => ({
             day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
             temp: res.data.daily.temperature_2m_max[idx],
             rainProb: res.data.daily.precipitation_probability_max[idx]
         }));

         setWeatherData({ 
            temp: `${temperature}°C`, 
            wind: `${windspeed} km/h`,
            humidity: `${currentHumidity}%`,
            risk: riskLevel,
            forecast
         });
      })
      .catch(err => console.error('Failed to fetch weather', err));
  }, []);

  const TABS = [
    { id: 'overview', label: 'Farm Overview', icon: LayoutDashboard },
    { id: 'scanner', label: 'Disease Scanner', icon: Target },
    { id: 'fields', label: 'Field History', icon: Sprout },
    { id: 'planner', label: 'Treatment Planner', icon: CheckSquare },
    { id: 'compliance', label: 'Govt & Compliance', icon: Landmark },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Call the actual backend proxy endpoint
      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setScanResult({
        disease: response.data.disease,
        confidence: `${(response.data.confidence * 100).toFixed(1)}%`,
        recommendation: response.data.treatment.join(' '),
        regulatory: response.data.regulatory_warning,
        status: response.data.disease?.toLowerCase().includes('healthy') ? 'healthy' : 'critical'
      });
    } catch (error) {
      console.error("Scan error:", error);
      // Fallback for demo purposes if backend fails
      setScanResult({
        disease: 'Tomato Early Blight (Mock)',
        confidence: '98%',
        recommendation: 'Immediate action required. Prune lower diseased leaves, implement drip irrigation.',
        regulatory: '[EPA 40 CFR 131] Copper-based fungicides must be logged within 48 hours.',
        status: 'critical'
      });
    } finally {
      setLoading(false);
    }
  };

  const clearScan = () => {
    setFile(null);
    setScanResult(null);
  };

  return (
    <>
      <style>
        {`            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; height: 100%; }
            @keyframes meshFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .app-wrapper {
              display: flex;
              width: 100vw;
              height: 100vh;
              color: #0F172A;
              font-family: 'Outfit', 'Inter', sans-serif;
              background: linear-gradient(-45deg, #e0f2fe, #dcfce7, #fce7f3, #e0e7ff);
              background-size: 400% 400%;
              animation: meshFlow 20s ease infinite;
              position: relative;
              overflow: hidden;
            }
            .ambient-orb {
              position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.6;
            }
            .workspace-backdrop {
              position: absolute; inset: 0; z-index: -1;
              background-image: radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px);
              background-size: 40px 40px;
              opacity: 0.4;
            }
            @keyframes pulse-emerald {
              0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
              70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
              100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            .telemetry-pulse {
              width: 10px; height: 10px; background: #10B981; border-radius: 50%;
              animation: pulse-emerald 2s infinite;
            }
            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .data-ticker-container {
               overflow: hidden; white-space: nowrap; padding: 1rem; background: rgba(255,255,255,0.4); backdrop-filter: blur(20px); border-top: 1px solid rgba(0,0,0,0.05); position: sticky; bottom: 0; z-index: 99; margin: 0 -4rem -2rem -4rem;
            }
            .data-ticker-track {
               display: inline-flex; animation: ticker 40s linear infinite; gap: 4rem;
            }
            @keyframes scan-glow {
              0% { box-shadow: 0 0 0px rgba(16, 185, 129, 0.2); }
              50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
              100% { box-shadow: 0 0 0px rgba(16, 185, 129, 0.2); }
            }
            .scan-card-active { animation: scan-glow 2s infinite ease-in-out; }
        `}
      </style>
      <div className="app-wrapper">
        <div className="workspace-backdrop" />
        
      {/* Premium Sidebar */}
      <div style={{ width: '300px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.4)', zIndex: 50 }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem', cursor: 'pointer', padding: '0 0.5rem' }} onClick={() => navigate('/')}>
          <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '0.6rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)' }}>
            <Leaf size={28} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>AgriScan</h1>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRO NETWORK</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ color: '#94A3B8', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 800, padding: '0 1rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Dashboard Menu</p>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button 
                key={tab.id}
                whileHover={{ x: 5, background: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: 'none', borderRadius: '16px', cursor: 'pointer',
                  background: isActive ? 'white' : 'transparent', color: isActive ? '#10B981' : '#64748B',
                  fontSize: '1rem', fontWeight: isActive ? 800 : 600, transition: 'all 0.2s', textAlign: 'left',
                  boxShadow: isActive ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Role Switcher */}
        <div style={{ marginBottom: '2rem', background: '#F1F5F9', padding: '0.4rem', borderRadius: '16px', display: 'flex', gap: '0.4rem' }}>
          {['Farmer', 'Admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '0.5rem', borderRadius: '12px', border: 'none', background: role === r ? 'white' : 'transparent', color: role === r ? '#0F172A' : '#64748B', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', boxShadow: role === r ? '0 4px 6px rgba(0,0,0,0.05)' : 'none' }}>{r}</button>
          ))}
        </div>

        {/* User Profile Card inside Sidebar */}
        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
          <div style={{ width: '42px', height: '42px', background: '#DBEAFE', color: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            {role === 'Admin' ? <ShieldCheck size={24} /> : <UserCircle size={24} />}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{role === 'Admin' ? 'Director Valuri' : 'Farmer John'}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{role} Access</p>
          </div>
        </div>
      </div>

      {/* Main App Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
        <div className="workspace-backdrop" />
        
        {/* Dynamic Top Navbar */}
        <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.4)', padding: '0.75rem 3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, width: '100%' }}>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
             {TABS.find(t => t.id === activeTab)?.label}
           </h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '0.85rem 1.5rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748B', width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
               <Search size={18} /> 
               <input type="text" placeholder="Search systems..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '1rem', fontFamily: 'inherit' }} />
             </div>
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ position: 'relative', cursor: 'pointer', color: '#64748B', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Bell size={20} />
               <div style={{ position: 'absolute', top: '10px', right: '12px', width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
             </motion.button>
           </div>
        </div>

        {/* Workspace */}
        <div style={{ padding: '2rem 4rem', maxWidth: '1600px', width: '100%', margin: '0 auto', flex: 1 }}>
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                
                 {/* Epic Top Metrics */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[
                      { title: 'Air Temp', value: weatherData.temp, sub: 'Partly Cloudy', icon: CloudRain, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
                      { title: 'Soil Moisture', value: iotSensors.moisture, sub: 'IoT Level: Optimal', icon: Droplets, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
                      { title: 'Soil PH', value: iotSensors.ph, sub: 'Ideal (6.4 - 6.6)', icon: Activity, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
                      { title: 'Risk Forecast', value: weatherData.risk.split(' ')[0], sub: weatherData.risk, icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
                    ].map((stat, i) => (
                      <motion.div key={i} whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }} style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid rgba(255,255,255,0.4)', transition: 'all 0.3s' }}>
                        <div style={{ background: stat.bg, padding: '0.85rem', borderRadius: '18px', color: stat.color }}>
                          <stat.icon size={26} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 0.3rem 0', color: '#64748B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</p>
                          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.04em' }}>{stat.value}</h3>
                          <p style={{ margin: '0.3rem 0 0 0', color: stat.title === 'Risk Forecast' && weatherData.risk.includes('High') ? '#EF4444' : stat.color, fontSize: '0.75rem', fontWeight: 700 }}>{stat.sub}</p>
                        </div>
                      </motion.div>
                    ))}
                 </div>

                 {/* 5-Day Weather Forecast Strip */}
                 <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
                    {weatherData.forecast.map((d, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', padding: '1.75rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.4)', minWidth: '180px', flex: 1, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 800, color: '#64748B', fontSize: '0.9rem', textTransform: 'uppercase' }}>{d.day}</p>
                            <CloudRain size={32} color="#3B82F6" style={{ margin: '0 auto 1rem auto' }} />
                            <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#1E293B' }}>{d.temp}°C</h4>
                            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.95rem', color: '#10B981', fontWeight: 800 }}>{d.rainProb}% Rain</p>
                        </motion.div>
                    ))}
                 </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '4rem' }}>
                  
                  {/* GPS & MAP MODULE */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(30px)', borderRadius: '40px', padding: '3rem', boxShadow: '0 25px 50px -15px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                      <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '-0.02em' }}>
                         <MapPin size={32} color="#10B981" /> Live Field Mapping
                      </h3>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ECFDF5', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                            <div className="telemetry-pulse" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669' }}>Live GPS Link</span>
                         </div>
                         <button onClick={()=>alert('Syncing live telemetry...')} style={{ background: '#10B981', border: 'none', color: 'white', fontWeight: 800, padding: '0.85rem 1.75rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 32px rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}><Activity size={18} /> Re-Sync</button>
                      </div>
                    </div>
                    
                    <div style={{ width: '100%', height: '400px', borderRadius: '32px', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', background: '#F8FAFC', position: 'relative', zIndex: 1 }}>
                      <MapContainer center={[38.5, -121.7]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                        
                        <Polygon pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.5, weight: 3 }} positions={[
                          [38.505, -121.71], [38.51, -121.72], [38.515, -121.69], [38.50, -121.68]
                        ]}>
                           <Popup>
                              <b style={{ color: '#DC2626' }}>North Sector (Tomatoes)</b><br/>High Risk: Early Blight Detected<br/>
                              <button onClick={()=>alert('Dispatching Drone')} style={{ marginTop: '5px', padding: '5px', width: '100%', background: '#EF4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Deploy Spray Drone</button>
                           </Popup>
                        </Polygon>

                        <Polygon pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.5, weight: 3 }} positions={[
                          [38.495, -121.70], [38.490, -121.71], [38.48, -121.69], [38.485, -121.68]
                        ]}>
                           <Popup>
                              <b style={{ color: '#059669' }}>South Sector (Corn)</b><br/>Optimal Growth Detected
                           </Popup>
                        </Polygon>
                      </MapContainer>
                    </div>

                    <div style={{ marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                           <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.25rem', fontWeight: 800 }}>Yield Prediction Analytics</h4>
                           <span style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 800, background: '#ECFDF5', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>+14% Expected YoY</span>
                        </div>
                        <div style={{ height: '220px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { month: 'Apr', yield: 4000 },
                                    { month: 'May', yield: 3000 },
                                    { month: 'Jun', yield: 5500 },
                                    { month: 'Jul', yield: 4500 },
                                    { month: 'Aug', yield: 6800 },
                                    { month: 'Sep', yield: 8200 },
                                    { month: 'Oct', yield: 9500 }
                                ]}>
                                  <defs>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                                  <Area type="monotone" dataKey="yield" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorYield)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Primary Action Block */}
                    <motion.div 
                      onClick={() => setActiveTab('scanner')}
                      className="scan-card-active"
                      style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '40px', padding: '3rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', boxShadow: '0 20px 40px -10px rgba(16,185,129,0.3)', position: 'relative', overflow: 'hidden' }}
                      whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(16,185,129,0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', transform: 'translate(20%, -20%)', borderRadius: '50%', pointerEvents: 'none' }} />
                      <div style={{ background: 'white', color: '#10B981', padding: '1.25rem', borderRadius: '24px', marginBottom: '2rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <Camera size={40} strokeWidth={2.5} />
                      </div>
                      <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Scan Crop Disease</h3>
                      <p style={{ margin: 0, color: '#D1FAE5', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '280px' }}>Access terminal vision to diagnose pathogen distress in real-time.</p>
                      
                      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, background: 'white', color: '#10B981', padding: '0.85rem 1.75rem', borderRadius: '99px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s', fontSize: '1rem' }}>
                        Start Inference <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </motion.div>

                    {/* Minimal Log Block */}
                    <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(30px)', borderRadius: '40px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)' }}>
                       <div style={{ margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <Activity color="#3B82F6" /> Co-Op Activity
                         </h4>
                         <button onClick={()=>setActiveTab('fields')} style={{ fontSize: '0.9rem', color: '#3B82F6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View History <ArrowRight size={14}/></button>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                         <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                           <div style={{ background: '#FEF2F2', padding: '0.6rem', borderRadius: '14px', color: '#DC2626' }}><AlertTriangle size={18} /></div>
                           <div>
                             <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>Fungicide Applied: North Field</p>
                             <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>Completed by John.S • 2h ago</p>
                           </div>
                         </div>
                         <div style={{ height: '1px', background: '#F1F5F9', width: '100%' }} />
                         <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                           <div style={{ background: '#ECFDF5', padding: '0.6rem', borderRadius: '14px', color: '#059669' }}><Droplets size={18} /></div>
                           <div>
                             <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>Irrigation Sync: ACTIVE</p>
                             <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>Automated Schedule • 5h ago</p>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Market Data Ticker */}
                  <div className="data-ticker-container">
                    <div className="data-ticker-track">
                      {[
                        { crop: 'Corn (H24)', price: '4.32', change: '+0.04' },
                        { crop: 'Soybeans (K24)', price: '11.85', change: '-0.12' },
                        { crop: 'Wheat (N24)', price: '5.62', change: '+0.15' },
                        { crop: 'Cotton (Z24)', price: '0.82', change: '-0.01' },
                        { crop: 'Canola', price: '612.40', change: '+4.20' },
                        { crop: 'Fertilizer (Nitrogen)', price: '$480/ton', change: '-2.00' }
                      ].concat([
                        { crop: 'Corn (H24)', price: '4.32', change: '+0.04' },
                        { crop: 'Soybeans (K24)', price: '11.85', change: '-0.12' },
                        { crop: 'Wheat (N24)', price: '5.62', change: '+0.15' },
                        { crop: 'Cotton (Z24)', price: '0.82', change: '-0.01' },
                        { crop: 'Canola', price: '612.40', change: '+4.20' },
                        { crop: 'Fertilizer (Nitrogen)', price: '$480/ton', change: '-2.00' }
                      ]).map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#64748B' }}>{m.crop}:</span>
                           <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#0F172A' }}>{m.price}</span>
                           <span style={{ fontWeight: 800, fontSize: '0.85rem', color: m.change.startsWith('+') ? '#10B981' : '#EF4444' }}>{m.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCANNER PANEL */}
            {activeTab === 'scanner' && (
              <motion.div key="scanner" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '0.75rem', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Target size={36} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', margin: '0 0 1rem 0', letterSpacing: '-0.04em' }}>AgriScan AI Diagnostics</h2>
                  <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>Upload a clear photo of the distressed plant leaf. Our neural network will instantly identify the pathogen and generate a protocol.</p>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {!scanResult ? (
                    <motion.div 
                      style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(30px)', borderRadius: '36px', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.4)', outline: file ? '4px solid #10B981' : 'none', outlineOffset: '-4px', transition: 'outline 0.3s' }}
                    >
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                          width: '100%', height: '400px', border: file ? 'none' : '3px dashed rgba(255,255,255,0.1)', borderRadius: '24px', background: file ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s',
                          overflow: 'hidden', position: 'relative'
                        }}
                      >
                        {!file && !useWebcam ? (
                          <>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', color: '#10B981' }}>
                              <UploadCloud size={64} strokeWidth={2} />
                            </div>
                            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '2rem', fontWeight: 900, color: 'white' }}>Select Sector Imagery</h3>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontWeight: 600 }}>Ready for high-resolution pathogen inference.</p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setUseWebcam(true); }}
                              style={{ marginTop: '2.5rem', background: '#10B981', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '18px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}
                            >
                              <Video size={22} /> Switch to Live Camera
                            </button>
                          </>
                        ) : useWebcam ? (
                           <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                             <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             <button onClick={(e) => { e.stopPropagation(); captureWebcam(); }} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#EF4444', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '99px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.4)' }}>CAPTURE & SCAN</button>
                           </div>
                        ) : (
                          <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                         {scanResult.regulatory && (
                           <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                             <ShieldAlert color="#DC2626" size={24} style={{ flexShrink: 0 }} />
                             <div>
                               <h5 style={{ margin: '0 0 0.25rem 0', color: '#B91C1C', fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regulatory Notice</h5>
                               <p style={{ margin: 0, color: '#7F1D1D', fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>{scanResult.regulatory}</p>
                             </div>
                           </div>
                         )}

                         <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <button style={{ flex: 1, padding: '1.25rem', background: '#0F172A', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(15,23,42,0.2)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}} onClick={()=>alert('Telemetry Sync: Connecting to DJI Agras API...')}>
                                <Plane size={18} /> Deploy DJI Agras Spray Drone
                            </button>
                            <button style={{ flex: 1, padding: '1.25rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(59,130,246,0.2)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}} onClick={()=>alert('ERP Connect: Initiating PO for Treatment Stock...')}>
                                <ShoppingCart size={18} /> Auto-Procure Stock via API
                            </button>
                            <button style={{ padding: '1.25rem', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.background='#F8FAFC'}} onMouseOut={e=>{e.currentTarget.style.background='white'}} onClick={()=>alert('Secure Link Generated for Consulting Agronomist.')}>
                                <Share2 size={18} /> Share w/ Agronomist
                            </button>
                         </div>
                       </div>

                       <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <button onClick={clearScan} style={{ flex: 1, padding: '1.5rem', background: '#F1F5F9', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1.15rem', color: '#475569', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.background='#E2E8F0'} onMouseOut={e=>e.currentTarget.style.background='#F1F5F9'}><X size={20} /> Close Report</button>
                          <button onClick={() => window.print()} style={{ flex: 1, padding: '1.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}>Export as PDF</button>
                          <button style={{ flex: 1.5, padding: '1.5rem', background: '#0F172A', color: 'white', border: 'none', borderRadius: '24px', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(15,23,42,0.2)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 15px 30px rgba(15,23,42,0.3)';}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 20px rgba(15,23,42,0.2)';}}>Save Record</button>
                       </div>
                    </motion.div>
                  )}
                </div>

              </motion.div>
            )}

            {/* GOVT & COMPLIANCE PANEL */}
            {activeTab === 'compliance' && (
              <motion.div key="compliance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                 <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Landmark color="#10B981" size={36} strokeWidth={2.5} /> Government & Compliance Hub
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#64748B', fontSize: '1.15rem', fontWeight: 500 }}>Track USDA compliance, EPA pesticide logs, and available federal subsidies.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={()=>alert('Executing Full USDA Compliance Audit...')} style={{ background: '#1E293B', color: 'white', padding: '0.85rem 1.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}><ShieldCheck size={20} /> Run Full Audit</button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                          {/* Compliance Status */}
                          <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '2.5rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)' }}>
                              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle2 color="#10B981" /> Official Compliance Logs
                              </h4>
                              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                 <div style={{ background: '#ECFDF5', padding: '1.5rem', borderRadius: '20px', flex: 1, border: '1px solid #A7F3D0' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', color: '#059669', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Est. USDA Organic Status</p>
                                    <h2 style={{ margin: 0, color: '#064E3B', fontSize: '2.5rem', fontWeight: 800 }}>98%</h2>
                                    <p style={{ margin: '0.5rem 0 0 0', color: '#059669', fontSize: '0.95rem', fontWeight: 500 }}>Next audit: Nov 15</p>
                                 </div>
                                 <div style={{ background: '#FEF2F2', padding: '1.5rem', borderRadius: '20px', flex: 1, border: '1px solid #FECACA' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', color: '#DC2626', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>EPA Use Reports Due</p>
                                    <h2 style={{ margin: 0, color: '#7F1D1D', fontSize: '2.5rem', fontWeight: 800 }}>2 Action(s)</h2>
                                    <p style={{ margin: '0.5rem 0 0 0', color: '#DC2626', fontSize: '0.95rem', fontWeight: 500 }}>Submit logs within 7 days</p>
                                 </div>
                              </div>
                              <button onClick={()=>alert('Generating WPS 170 Export Data...')} style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', padding: '1.25rem', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(59,130,246,0.2)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}><FileText size={20} /> Generate EPA Pesticide Export (WPS 170)</button>
                          </div>

                          {/* Grants and Subsidies */}
                          <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '2.5rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)' }}>
                              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Landmark color="#3B82F6" /> Available Programs & Relief
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                 {[
                                   { title: 'USDA Emergency Relief Fund (ERF)', value: 'Up to $15,000', tag: 'Drought Relief', color: '#F59E0B', bg: '#FEF3C7', action: 'Claim Fund' },
                                   { title: 'Organic Transition Cost Share (OCCSP)', value: '$750 limit per scope', tag: 'Organic', color: '#10B981', bg: '#ECFDF5', action: 'Apply Now' },
                                   { title: 'EQIP Conservation Grant', value: '75% Cost Match', tag: 'Conservation', color: '#3B82F6', bg: '#EFF6FF', action: 'Check Details' }
                                 ].map((grant, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderRadius: '20px', border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#F1F5F9'}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', background: grant.bg, color: grant.color, marginBottom: '0.5rem' }}>{grant.tag}</div>
                                            <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{grant.title}</h5>
                                        </div>
                                        <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                                           <p style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Potential Value</p>
                                           <h4 style={{ margin: 0, color: '#1E293B', fontSize: '1.15rem', fontWeight: 800 }}>{grant.value}</h4>
                                        </div>
                                        <button onClick={()=>alert(`Redirecting to ${grant.title} application gateway...`)} style={{ background: '#F8FAFC', color: '#10B981', border: '1px solid #E2E8F0', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.background='#ECFDF5'} onMouseOut={e=>e.currentTarget.style.background='#F8FAFC'}>{grant.action} <ExternalLink size={16} /></button>
                                    </div>
                                 ))}
                              </div>
                          </div>
                       </div>

                       <div style={{ background: '#1E293B', borderRadius: '32px', padding: '3rem', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.4)' }}>
                          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, pointerEvents: 'none', transform: 'rotate(15deg)' }}><Landmark size={300} /></div>
                          <h3 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>Market Price Oracle</h3>
                          <p style={{ margin: '0 0 2rem 0', color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>Current federal spot prices and insurance indices for tracked commodities in your sector.</p>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1, flex: 1 }}>
                             {[
                               { crop: 'Corn (Yellow)', price: '$4.32 / bu', change: '+0.04' },
                               { crop: 'Soybeans', price: '$11.85 / bu', change: '-0.12' },
                               { crop: 'Tomatoes (Processing)', price: '$104.50 / ton', change: '+1.20' }
                             ].map((mkt, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                   <div style={{ flex: 1 }}>
                                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mkt.crop}</span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                                         <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{mkt.price}</span>
                                         <span style={{ fontSize: '0.9rem', fontWeight: 700, color: mkt.change.startsWith('+') ? '#4ADE80' : '#F87171' }}>{mkt.change}</span>
                                      </div>
                                   </div>
                                   <button onClick={()=>alert(`Hedge position opened for ${mkt.crop}.`)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.65rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>Hedge Risk</button>
                                </div>
                             ))}
                          </div>
                          
                          <button onClick={()=>alert('Navigating to Crop Insurance Claim Gateway...')} style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', padding: '1.25rem', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}><AlertTriangle size={20} /> File Initial Crop Loss Claim</button>
                       </div>
                       
                    </div>
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

            {/* TREATMENT PLANNER PANEL */}
            {activeTab === 'planner' && (
              <motion.div key="planner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckSquare color="#10B981" size={36} strokeWidth={2.5} /> Treatment Planner
                      </h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#64748B', fontSize: '1.15rem', fontWeight: 500 }}>Manage and execute active AI protocols and field tasks requiring attention.</p>
                    </div>
                    <div>
                      <button style={{ background: '#10B981', color: 'white', padding: '0.85rem 1.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16,185,129,0.3)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'}}>
                        + Add Custom Task
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {[
                        { title: 'Apply Copper-based Fungicide Spray', field: 'North Field (Tomatoes)', status: 'Pending', priority: 'High', date: 'Today, 2:00 PM' },
                        { title: 'Prune Lower Diseased Foliage', field: 'North Field (Tomatoes)', status: 'Pending', priority: 'High', date: 'Today, 4:00 PM' },
                        { title: 'Reduce Irrigation Volume by 15%', field: 'Greenhouse 3 (Peppers)', status: 'In Progress', priority: 'Medium', date: 'Tomorrow' },
                        { title: 'Preventative Sulphur Dusting', field: 'Vineyard Alpha', status: 'Pending', priority: 'Medium', date: 'Oct 26' },
                      ].map((task, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #F1F5F9', borderRadius: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#F1F5F9'}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E1'}>
                            </div>
                            <div>
                               <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>{task.title}</h4>
                               <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>{task.field} • Due {task.date}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span style={{ padding: '0.5rem 1.25rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', background: task.priority === 'High' ? '#FEF2F2' : '#FEF3C7', color: task.priority === 'High' ? '#DC2626' : '#D97706' }}>{task.priority} Priority</span>
                            <button onClick={()=>alert(`Automated Task Triggered: ${task.title}`)} style={{ background: '#1E293B', color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>Execute Auto-Sequence</button>
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
    </>
  );
}
