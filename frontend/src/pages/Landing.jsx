import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Scan, Leaf, ShieldCheck, Map, Camera, CheckCircle2, 
  Play, Users, BrainCircuit, Zap, Lock, LineChart, CloudRain, 
  Bell, Cpu, Smartphone, Monitor, Star, Server, Fingerprint,
  Activity, Database
} from 'lucide-react';

export default function Landing() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#020617', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navigation */}
      <nav 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
          padding: '1.25rem 2rem', 
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1280px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', borderRadius: '12px', padding: '0.5rem', display: 'flex', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}>
              <Leaf size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.4rem', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>AgriScan</span>
          </Link>

          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem' }}>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#model" className="nav-link">AI Model</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'white', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '0.5rem' }}>Log In</Link>
            <Link to="/login" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '12rem', paddingBottom: '6rem', minHeight: '100vh', zIndex: 10 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=2000")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to bottom, transparent 30%, #020617 100%)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1000px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div className="trust-badge"><BrainCircuit size={16} color="#4ADE80" /> Powered by AI</div>
              <div className="trust-badge"><ShieldCheck size={16} color="#3B82F6" /> Secure & Private</div>
              <div className="trust-badge"><Zap size={16} color="#F59E0B" /> Real-time Analysis</div>
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, lineHeight: 1.1, margin: '0 0 1.5rem 0', letterSpacing: '-0.03em' }}>
              Stop Plant Diseases <br />
              <span style={{ color: '#4ADE80' }}>Before They Spread.</span>
            </h1>
            
            <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2.5rem auto', color: '#94A3B8', lineHeight: 1.6 }}>
              Instant, military-grade AI crop scanning. Upload a leaf, get a diagnosis, and receive a professional treatment protocol instantly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' }}>
              <Link to="/upload" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                <Camera size={22} /> Scan Leaf Now (Free)
              </Link>
              <Link to="/demo" className="btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                <Play size={22} /> Try Live Demo
              </Link>
            </div>

            {/* Stats - Real World Feel */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', fontFamily: 'Space Grotesk' }}>95%</h4>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '1rem' }}>Detection Accuracy</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', fontFamily: 'Space Grotesk' }}>50K+</h4>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '1rem' }}>Images Trained</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white', fontFamily: 'Space Grotesk' }}>1,000+</h4>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '1rem' }}>Active Farmers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" style={{ padding: '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
           <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1rem 0' }}>How It Works</h2>
             <p style={{ color: '#94A3B8', fontSize: '1.2rem' }}>From field to treatment plan in under 3 seconds.</p>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="step-card">
               <div className="step-number">1</div>
               <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400&h=300" alt="Upload Leaf" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}/>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Upload Leaf Image</h3>
               <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>Take a clear picture of the diseased crop or upload from your gallery.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="step-card">
               <div className="step-number">2</div>
               <div style={{ width: '100%', height: '200px', background: 'rgba(34,197,94,0.1)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <Scan size={64} color="#4ADE80" />
               </div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>AI Detects Disease</h3>
               <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>Our deep-learning engine instantly identifies the pathogen with up to 95% accuracy.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="step-card">
               <div className="step-number">3</div>
                <div style={{ width: '100%', height: '200px', background: 'rgba(59,130,246,0.1)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <ShieldCheck size={64} color="#3B82F6" />
               </div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Get Treatment Plan</h3>
               <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>Receive immediate, actionable chemical and organic treatment steps.</p>
             </motion.div>
           </div>
        </div>
      </section>

      {/* 3. Feature Highlights Section */}
      <section id="features" style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1rem 0' }}>Powerful. Simple. Essential.</h2>
             <p style={{ color: '#94A3B8', fontSize: '1.2rem' }}>Everything you need to run a data-driven farm operation.</p>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="feature-highlight">
                 <div className="icon-wrapper bg-green"><BrainCircuit size={28}/></div>
                 <h4>AI Disease Detection</h4>
                 <p>Instant visual diagnosis of 1,200+ crop species.</p>
              </div>
              <div className="feature-highlight">
                 <div className="icon-wrapper bg-blue"><LineChart size={28}/></div>
                 <h4>Farm Analytics</h4>
                 <p>Track health trends across multiple farm sectors.</p>
              </div>
              <div className="feature-highlight">
                 <div className="icon-wrapper bg-cyan"><CloudRain size={28}/></div>
                 <h4>Weather Insights</h4>
                 <p>Micro-climate tracking synchronized with treatment plans.</p>
              </div>
              <div className="feature-highlight">
                 <div className="icon-wrapper bg-amber"><Map size={28}/></div>
                 <h4>Field Monitoring</h4>
                 <p>GPS-tagged outbreak tracking to prevent spread.</p>
              </div>
              <div className="feature-highlight">
                 <div className="icon-wrapper bg-red"><Bell size={28}/></div>
                 <h4>Smart Alerts</h4>
                 <p>Real-time SMS/Email alerts when disease risks spike.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Product Screens (Real Product) */}
      <section style={{ padding: '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1rem 0' }}>Institutional Grade Dashboard</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', marginBottom: '4rem' }}>Experience the power of real-time agricultural data on any device.</p>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', width: '80%', height: '80%', background: '#22C55E', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />
            
            {/* Desktop Mockup */}
            <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} style={{ width: '85%', maxWidth: '1000px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', zIndex: 2 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }} />
              </div>
              <div style={{ background: '#020617', borderRadius: '8px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <img src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, borderRadius: '8px' }} alt="Dashboard preview" />
                 <h2 style={{ position: 'absolute', fontFamily: 'Space Grotesk', fontSize: '2rem', textShadow: '0 4px 20px rgba(0,0,0,1)' }}><Activity color="#4ADE80" style={{ marginRight: '1rem' }}/> Live Tracking Engine</h2>
              </div>
            </motion.div>

            {/* Mobile Mockup */}
            <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ position: 'absolute', right: '5%', bottom: '-10%', width: '250px', height: '500px', background: '#0f172a', border: '8px solid #1e293b', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', zIndex: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#22C55E', padding: '2rem 1rem', textAlign: 'center' }}>
                 <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '12px', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scan size={32} color="#22C55E"/></div>
                 <h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>Leaf Scanned</h4>
              </div>
              <div style={{ padding: '1.5rem', background: '#0f172a', flex: 1 }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)' }}>POWDERY MILDEW - 94%</div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', width: '70%', borderRadius: '4px', marginBottom: '2rem' }} />
                <div style={{ width: '100%', height: '40px', background: '#3B82F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>View Plan</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. AI Accuracy / Model Section */}
      <section id="model" style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Cpu size={48} color="#4ADE80" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1rem 0' }}>Enterprise-Grade AI Architecture</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', marginBottom: '4rem', maxWidth: '700px' }}>Our proprietary Deep Learning model is trained specifically for agronomic environments, ensuring unmatched reliability in the field.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
            <div className="metric-box">
              <Database size={32} color="#4ADE80" />
              <h3>Trained on PlantVillage Dataset</h3>
              <p>Fine-tuned across 80,000+ peer-reviewed leaf pathogen images.</p>
            </div>
            <div className="metric-box">
              <BrainCircuit size={32} color="#3B82F6" />
              <h3>CNN-based Deep Learning Form</h3>
              <p>Utilizes custom ResNet-50 architecture optimized for edge resilience.</p>
            </div>
            <div className="metric-box">
              <Zap size={32} color="#F59E0B" />
              <h3>Real-time inference &lt; 3 sec</h3>
              <p>Edge-accelerated processing returns results almost instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section style={{ padding: '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 4rem 0', textAlign: 'center' }}>Trusted by Farmers Worldwide</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '1rem' }}>
                 <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#E2E8F0', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>"AgriScan detected early blight on my tomatoes three days before it was visible to the naked eye. It literally saved my entire summer crop."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Ramesh Reddy</h4>
                   <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Farmer, Andhra Pradesh</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '1rem' }}>
                 <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#E2E8F0', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>"The treatment plans are incredibly clear. I don't need to consult an agronomist for every spotting issue anymore. The app pays for itself."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Sarah Jenkins</h4>
                   <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Vineyard Owner, California</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '1rem' }}>
                 <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#E2E8F0', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>"Integrating their API into our drone scanning workflow was seamless. It flags problem sectors instantly."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Markus Thomsen</h4>
                   <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Agri-Tech Coop Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 4rem 0' }}>Simple, Transparent Pricing</h2>
          
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Free Plan */}
            <div style={{ flex: '1 1 400px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Free Plan</h3>
              <p style={{ color: '#94A3B8', margin: '0 0 2rem 0' }}>Perfect for individual farmers testing the system.</p>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 2rem 0', fontFamily: 'Space Grotesk' }}>$0<span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 400 }}>/mo</span></h1>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> 20 Basic Scans / Month</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Simple Treatment Plans</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Standard Security</li>
              </ul>
              <Link to="/register" className="btn-secondary" style={{ marginTop: 'auto', textAlign: 'center', width: '100%' }}>Start Free</Link>
            </div>
            
            {/* Pro Plan */}
            <div style={{ flex: '1 1 400px', background: 'rgba(15, 23, 42, 0.8)', border: '2px solid #22C55E', borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'column', textAlign: 'left', position: 'relative', boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '30px', background: '#22C55E', color: 'black', padding: '0.5rem 1rem', borderRadius: '99px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>Recommended</div>
              <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#4ADE80' }}>Pro Plan</h3>
              <p style={{ color: '#94A3B8', margin: '0 0 2rem 0' }}>For commercial farms requiring analytics & alerts.</p>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 2rem 0', fontFamily: 'Space Grotesk' }}>$29<span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 400 }}>/mo</span></h1>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Unlimited AI Scans</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Advanced Farm Analytics</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Weather Insights & Smart Alerts</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle2 size={20} color="#4ADE80"/> Early Action Outbreak Maps</li>
              </ul>
              <Link to="/register" className="btn-primary" style={{ marginTop: 'auto', textAlign: 'center', width: '100%' }}>Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Security Section */}
      <section style={{ padding: '8rem 2rem', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <Lock size={48} color="#94A3B8" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 4rem 0' }}>Enterprise-Grade Security</h2>
          
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Fingerprint size={32} color="#3B82F6" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Login</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Token-based JWT authentication via Firebase secures all sessions deeply.</p>
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ShieldCheck size={32} color="#4ADE80" />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Data Privacy</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Field data belongs to you. We strictly anonymize all metadata processed via AI.</p>
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Server size={32} color="#F59E0B" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Encrypted Storage</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>At-rest and in-transit SSL encryption protects farm coordinates and analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', background: 'radial-gradient(ellipse at bottom, rgba(34,197,94,0.15) 0%, #020617 70%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1.5rem 0', letterSpacing: '-0.02em', color: 'white' }}>Start Protecting Your Crops Today</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', marginBottom: '3rem' }}>Join the thousands of smart farmers who have modernized their operation.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>Get Started Free</Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} AgriScan Technologies. All rights reserved.
      </footer>

      {/* 10. Embedded CSS for UI Fixes (Animations, Spacing, Buttons) */}
      <style>
        {`
          .trust-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0.5rem 1rem;
            border-radius: 99px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #E2E8F0;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: #22C55E;
            color: #ffffff !important;
            padding: 0.8rem 1.8rem;
            border-radius: 99px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            background: #16A34A;
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
          }
          .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: rgba(255,255,255,0.05);
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0.8rem 1.8rem;
            border-radius: 99px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .btn-secondary:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.2);
          }
          .step-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            padding: 2.5rem;
            position: relative;
            text-align: left;
            transition: transform 0.3s ease;
          }
          .step-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255,255,255,0.1);
          }
          .step-number {
             width: 40px; height: 40px; border-radius: 50%;
             background: rgba(255,255,255,0.1); color: white;
             display: flex; align-items: center; justify-content: center;
             font-weight: 800; font-size: 1.2rem;
             margin-bottom: 1.5rem;
          }
          .feature-highlight {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 2rem;
            border-radius: 16px;
            transition: all 0.3s ease;
          }
          .feature-highlight:hover {
            background: rgba(255,255,255,0.04);
            transform: translateY(-3px);
          }
          .feature-highlight h4 {
            font-size: 1.2rem;
            margin: 1rem 0 0.5rem 0;
            font-family: 'Space Grotesk', sans-serif;
          }
          .feature-highlight p {
            color: #94A3B8;
            margin: 0;
            font-size: 0.95rem;
          }
          .icon-wrapper {
            width: 55px; height: 55px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
          }
          .icon-wrapper.bg-green { background: rgba(34, 197, 94, 0.1); color: #4ADE80; }
          .icon-wrapper.bg-blue { background: rgba(59, 130, 246, 0.1); color: #60A5FA; }
          .icon-wrapper.bg-cyan { background: rgba(6, 182, 212, 0.1); color: #22D3EE; }
          .icon-wrapper.bg-amber { background: rgba(245, 158, 11, 0.1); color: #FBBF24; }
          .icon-wrapper.bg-red { background: rgba(239, 68, 68, 0.1); color: #F87171; }
          
          .metric-box {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 2.5rem;
            border-radius: 20px;
            text-align: left;
          }
          .metric-box h3 {
            font-size: 1.2rem;
            margin: 1rem 0 0.5rem 0;
            font-family: 'Space Grotesk', sans-serif;
          }
          .metric-box p {
            color: #94A3B8;
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          .testimonial-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 2.5rem;
            text-align: left;
          }
          .nav-link {
            color: #94A3B8;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            transition: color 0.2s;
          }
          .nav-link:hover {
            color: white;
          }
             
          /* General UI Fixes */
          h1, h2, h3, h4, h5 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        `}
      </style>
    </div>
  );
}
