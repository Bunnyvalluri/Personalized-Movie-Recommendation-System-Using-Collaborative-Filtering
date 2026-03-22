import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Sprout, Activity, Database, Sun, Droplets, Leaf, ShieldCheck, Map, Camera, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#020617' }}>
      
      {/* Marketing Navbar */}
      <nav 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
          padding: '1.25rem 2rem', 
          background: yBg.get() === '0%' ? 'transparent' : 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: yBg.get() === '0%' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease',
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

          <div className="desktop-nav">
            <a href="#features" style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94A3B8'}>Capabilities</a>
            <a href="#how-it-works" style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94A3B8'}>How It Works</a>
            <a href="#pricing" style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='white'} onMouseOut={e=>e.currentTarget.style.color='#94A3B8'}>Plans</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'white', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '0.5rem 1rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#22C55E'} onMouseOut={e=>e.currentTarget.style.color='white'}>Log In</Link>
            <Link to="/login" style={{ background: '#22C55E', color: '#ffffff', padding: '0.7rem 1.75rem', borderRadius: '99px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#16A34A'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#22C55E'}}>Start Scanning</Link>
          </div>
        </div>
      </nav>

      {/* Hero Background Image & Gradient */}
      <div 
        style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '110vh', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.25, zIndex: 0, pointerEvents: 'none'
        }} 
      />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '110vh', background: 'linear-gradient(to bottom, transparent 40%, #020617 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Hero Section */}
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '14rem', paddingBottom: '8rem', minHeight: '100vh', zIndex: 10 }}>
        
        <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem' }}>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '999px', padding: '0.4rem 1.25rem', marginBottom: '2.5rem', color: '#4ADE80', fontSize: '0.9rem', fontWeight: 600, backdropFilter: 'blur(12px)' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#22C55E', color: '#ffffff', padding: '0.15rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, marginRight: '0.25rem' }}>UPDATE</span>
              AgriScan AI is now 98.4% accurate on Tomato Blight <ArrowRight size={14} style={{ marginLeft: '4px' }}/>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, lineHeight: 1.05, margin: '0 0 1.5rem 0', letterSpacing: '-0.03em', textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            Empowering farms with <br />
            <span style={{ color: '#4ADE80' }}>Precision Intelligence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            style={{ fontSize: '1.25rem', maxWidth: '760px', margin: '0 auto 3rem auto', color: '#E2E8F0', lineHeight: 1.7, fontWeight: 400, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            Identify crop diseases instantly, optimize your treatments, and maximize your farm's yield. The most advanced agricultural AI—right in your pocket.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#22C55E', color: '#ffffff', padding: '1.2rem 2.8rem', borderRadius: '99px', fontSize: '1.15rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 10px 30px rgba(34,197,94,0.3)' }} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#16A34A'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#22C55E'}}>
               Scan Your Crops <Camera size={20} />
            </Link>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1.2rem 2.8rem', borderRadius: '99px', fontSize: '1.15rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(20px)' }} onMouseOver={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';}} onMouseOut={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';}}>
              Create Farm Account
            </Link>
          </motion.div>
        </div>

        {/* Real-world UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, type: 'spring', damping: 25 }}
          style={{ width: '100%', maxWidth: '1000px', margin: '7rem auto 0 auto', position: 'relative', padding: '0 2rem' }}
        >
          {/* Glowing Aura behind mockup */}
          <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', background: 'linear-gradient(90deg, #22C55E, #10B981)', filter: 'blur(100px)', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} />
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              
              {/* Image Scan Area */}
              <div style={{ flex: '1 1 500px', position: 'relative', minHeight: '400px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                 <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80" alt="Scanning Leaf" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                 
                 {/* Bounding Box Mockup */}
                 <div style={{ position: 'absolute', top: '30%', left: '30%', width: '150px', height: '150px', border: '2px solid #4ADE80', borderRadius: '12px', boxShadow: '0 0 20px rgba(34,197,94,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.5rem' }}>
                    <div style={{ background: '#4ADE80', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, alignSelf: 'flex-start' }}>EARLY BLIGHT 98%</div>
                 </div>

                 <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Tomato Scan #A491</h3>
                    <p style={{ margin: 0, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Map size={16}/> Sector 4, Northern High Tunnel</p>
                 </div>
              </div>

              {/* Treatment Panel */}
              <div style={{ flex: '1 1 350px', padding: '3rem', display: 'flex', flexDirection: 'column', background: 'rgba(2, 6, 23, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                   <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '16px' }}><Activity size={24} color="#EF4444"/></div>
                   <div>
                     <h4 style={{ margin: 0, color: '#EF4444', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pathogen Detected</h4>
                     <h2 style={{ margin: 0, color: 'white', fontSize: '1.6rem', fontWeight: 800 }}>Alternaria Solani</h2>
                   </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#94A3B8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Action</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 color="#4ADE80" size={20} style={{ flexShrink: 0 }}/>
                      <span style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.5 }}>Apply copper-based fungicide to lower canopy immediately.</span>
                    </li>
                    <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <CheckCircle2 color="#4ADE80" size={20} style={{ flexShrink: 0 }}/>
                      <span style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.5 }}>Prune lower leaves to improve air circulation within 48h.</span>
                    </li>
                  </ul>
                </div>

                <button style={{ background: '#22C55E', color: 'white', border: 'none', padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  Begin Treatment Plan <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By - Agricultural Marquee */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '5rem 0', background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '3.5rem' }}>Trusted by over 4,000 commercial farms and cooperatives</p>
          <div className="marquee-wrapper">
             {[...Array(2)].map((_, index) => (
                <div key={index} className="marquee-content" aria-hidden={index === 1}>
                  <div className="client-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Deere_%26_Company_logo.svg" alt="Deere" style={{ height: '30px', filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                  <div className="client-logo"><Sprout size={36} color="#ffffff" /> Heartland Ag</div>
                  <div className="client-logo"><Map size={36} color="#ffffff" /> Global Vineyards</div>
                  <div className="client-logo"><Leaf size={36} color="#ffffff" /> Sustainable Farms Co</div>
                  <div className="client-logo"><Sun size={36} color="#ffffff" /> SunGro Cooperative</div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" style={{ maxWidth: '1280px', margin: '10rem auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: '6rem', "textAlign": "center" }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: '0 0 1.5rem 0' }}>Farming, elevated.<br/><span style={{ color: '#94A3B8' }}>Everything you need to thrive.</span></h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>We combine cutting-edge artificial intelligence with agronomic science to provide actionable insights for every acre of your land.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', autoRows: 'minmax(300px, auto)' }}>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} style={{ gridColumn: 'span 8', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'url("https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1000") cover right/center', opacity: 0.1, zIndex: 0 }}/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Scan size={40} color="#4ADE80" style={{ marginBottom: '2rem' }}/>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Space Grotesk' }}>Real-time Disease Detection</h3>
              <p style={{ color: '#E2E8F0', fontSize: '1.15rem', maxWidth: '450px', lineHeight: 1.7, margin: 0 }}>Simply snap a photo of any distressed plant. Our AI instantly references over 1,200 known pathogens and nutrient deficiencies to give you an accurate diagnosis on the spot.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.1 }} style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3.5rem', display: 'flex', flexDirection: 'column' }}>
            <ShieldCheck size={40} color="#3B82F6" style={{ marginBottom: '2rem' }}/>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Space Grotesk' }}>Integrated Action Plans</h3>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>Don't just diagnose. We provide immediate, organic and chemical treatment options tailored to your specific crop and region.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.2 }} style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3.5rem', display: 'flex', flexDirection: 'column' }}>
            <Map size={40} color="#F59E0B" style={{ marginBottom: '2rem' }}/>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Space Grotesk' }}>Field Mapping</h3>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>Log outbreaks via GPS. Track disease spread across your fields over time directly from our interactive dashboards.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.3 }} style={{ gridColumn: 'span 8', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Droplets size={40} color="#06B6D4" style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}/>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Space Grotesk', position: 'relative', zIndex: 1 }}>Weather & Micro-climate</h3>
            <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '450px', lineHeight: 1.7, margin: 0, position: 'relative', zIndex: 1 }}>Combine disease risk forecasts with local weather. Know exactly when heavy rains are coming, so you never waste a fungicide application again.</p>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000") cover left/center', opacity: 0.1, zIndex: 0 }}/>
          </motion.div>

        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ maxWidth: '1280px', margin: '14rem auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: '0 0 1rem 0' }}>Three steps to healthier crops.</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '600px' }}>You don't need a Ph.D. in agronomy. AgriScan puts expert knowledge directly in your hands.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', counterReset: 'step' }}>
          {[
            { title: '1. Scan Crops', desc: 'Walk your fields and snap a picture of concerning symptoms right from your phone.', img: '/step1.png' },
            { title: '2. AI Analysis', desc: 'Our remote servers process the image against millions of data points instantly.', img: '/step2.png' },
            { title: '3. Treatment', desc: 'Receive tailored protocols, dosage amounts, and safe handling procedures.', img: '/step3.png' }
          ].map((step, idx) => (
            <motion.div 
              key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} 
              style={{ 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end',
                height: '460px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e=>{e.currentTarget.style.transform='translateY(-10px)'; e.currentTarget.children[0].style.transform='scale(1.05)'}}
              onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.children[0].style.transform='scale(1)'}}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${step.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.3) 60%, transparent 100%)', zIndex: 1 }} />
              
              <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22C55E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(34,197,94,0.4)' }}>{idx + 1}</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1rem 0', color: 'white', fontFamily: 'Space Grotesk' }}>{step.title.split('. ')[1]}</h3>
                <p style={{ color: '#E2E8F0', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: '1280px', margin: '14rem auto 8rem auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: '0 0 1rem 0' }}>Simple plans for any farm.</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '600px' }}>Whether you have an indoor greenhouse or a 5,000-acre corn operation, we have you covered.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Small Farm */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'white' }}>Small Farm</h3>
            <p style={{ color: '#94A3B8', margin: '0 0 2rem 0', minHeight: '48px', fontSize: '1.05rem' }}>Perfect for homesteaders and local greenhouses.</p>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 2.5rem 0', color: 'white' }}>
              $0<span style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: 600 }}>/mo</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#E2E8F0', fontWeight: 500 }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#22C55E"/> 50 AI Scans per month</li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#22C55E"/> Basic Treatment Plans</li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#22C55E"/> Community Forum Access</li>
            </ul>
            <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1.1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>Start Free</button>
          </div>

          {/* Commercial */}
          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid #22C55E', borderRadius: '24px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 40px rgba(34, 197, 94, 0.15)', transform: 'scale(1.03)', zIndex: 5 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#22C55E', color: '#050505', fontSize: '0.8rem', fontWeight: 800, padding: '0.5rem 3rem', transform: 'translate(25%, 50%) rotate(45deg)', textTransform: 'uppercase' }}>Most Popular</div>
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#4ADE80' }}>Commercial</h3>
            <p style={{ color: '#94A3B8', margin: '0 0 2rem 0', minHeight: '48px', fontSize: '1.05rem' }}>For active farms producing cash crops at scale.</p>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 2.5rem 0', color: 'white' }}>
              $39<span style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: 600 }}>/mo</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#E2E8F0', fontWeight: 500 }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#4ADE80"/> Unlimited AI Scans</li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#4ADE80"/> Premium Weather Sync</li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#4ADE80"/> Yield Protection Alerts</li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#4ADE80"/> Field Mapping Tools</li>
            </ul>
            <button style={{ background: '#22C55E', color: '#ffffff', padding: '1.1rem', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 800, border: 'none', marginTop: 'auto', transition: 'all 0.2s', cursor: 'pointer', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.25)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>Upgrade to Commercial</button>
          </div>

          {/* Co-op / Enterprise */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'white' }}>Cooperatives</h3>
            <p style={{ color: '#94A3B8', margin: '0 0 2rem 0', minHeight: '48px', fontSize: '1.05rem' }}>For agricultural co-ops and enterprise networks.</p>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 2.5rem 0', color: 'white' }}>
              Custom
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#E2E8F0', fontWeight: 500 }}>
               <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#3B82F6"/> Multi-Farm Management</li>
               <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#3B82F6"/> API Access for Tractors/Drones</li>
               <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><CheckCircle2 size={20} color="#3B82F6"/> Dedicated Agronomist Support</li>
            </ul>
            <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '1.1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'radial-gradient(ellipse at bottom, rgba(34,197,94,0.1), transparent 70%)', pointerEvents: 'none', zIndex: 0 }}/>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.02em', color: 'white' }}>Protect your harvest.</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', marginBottom: '3rem' }}>Join thousands of farmers already maximizing their yield.</p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/login" style={{ background: '#22C55E', color: 'white', padding: '1.1rem 3rem', borderRadius: '99px', fontSize: '1.15rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(34,197,94,0.3)' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#16A34A'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#22C55E'}}>Start Scanning Free</Link>
          </div>
        </div>
      </section>

      {/* Embedded CSS for this component */}
      <style>
        {`
          .client-logo {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1.8rem;
            font-weight: 800;
            font-family: 'Space Grotesk', sans-serif;
            color: #E2E8F0;
            letter-spacing: -0.02em;
            white-space: nowrap;
            transition: all 0.4s ease;
            opacity: 0.5;
            filter: grayscale(100%);
            cursor: default;
          }
          .client-logo:hover {
            opacity: 1;
            filter: grayscale(0%);
            transform: scale(1.05);
            text-shadow: 0 0 20px rgba(255,255,255,0.2);
          }
          .desktop-nav {
            display: none;
            gap: 2rem;
            align-items: center;
          }
          .marquee-wrapper {
            display: flex;
            overflow: hidden;
            user-select: none;
            gap: 4rem;
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          }
          .marquee-content {
            display: flex;
            flex-shrink: 0;
            gap: 4rem;
            align-items: center;
            animation: infinite-scroll 30s linear infinite;
          }
          .marquee-wrapper:hover .marquee-content {
            animation-play-state: paused;
          }
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% - 4rem)); }
          }
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex;
            }
          }
        `}
      </style>
    </div>
  );
}
