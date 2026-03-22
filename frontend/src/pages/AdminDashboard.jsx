import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Users, Activity, Target, ShieldCheck, ChevronUp, MoreVertical, Search, Shield, Terminal } from 'lucide-react';

export default function AdminDashboard() {

  const stats = [
    { title: 'Total Farms Active', value: '14,284', grow: '+12%', icon: Users, color: '#60A5FA' },
    { title: 'Total Crops Scanned', value: '89,431', grow: '+24%', icon: Activity, color: '#A78BFA' },
    { title: 'Field Sensors Online', value: '432/hr', grow: '+4%', icon: Target, color: '#4ADE80' },
    { title: 'Avg Diagnostic CONF', value: '96.2%', grow: '+0.5%', icon: ShieldCheck, color: '#FBBF24' },
  ];

  const recentUsers = [
    { name: 'US-East_Farm_Alpha', email: 'north-field@heartland.ag', location: 'California', status: 'Online' },
    { name: 'EU-West_Vineyards', email: 'grapes@globalvine.co', location: 'France', status: 'Online' },
    { name: 'Tractor_Mount_Cam_1', email: 'tractor-scan@local-farm.com', location: 'Texas', status: 'Offline' },
    { name: 'Automated_Drone_V3', email: 'drone-sys@agritech.com', location: 'Iowa', status: 'Online' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', position: 'relative' }}>
       {/* Background Grid */}
       <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', backgroundImage: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.05), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

       {/* Dashboard Header */}
       <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 2rem 4rem 2rem', position: 'relative', zIndex: 10 }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '1rem', fontFamily: 'monospace' }}>
                <Shield size={16} /> ENTERPRISE_CO-OP
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Terminal size={32} color="#4ADE80" /> Cooperative Network Health
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem', margin: 0, fontFamily: 'monospace' }}>Monitor global farm network usage, active sensors, and farm statuses.</p>
            </div>
            
            <button style={{ background: '#ffffff', color: '#030712', padding: '0.875rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
              &gt; EXPORT_METRICS
            </button>
         </div>
       </div>

       {/* Content */}
       <div style={{ maxWidth: '1200px', margin: '3rem auto 0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10 }}>
          
          {/* Top 4 Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
             {stats.map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', color: stat.color, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <stat.icon size={24} />
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#34D399', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <ChevronUp size={16} /> {stat.grow}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>{stat.value}</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#94A3B8', fontWeight: 500, fontFamily: 'monospace' }}>{stat.title.toUpperCase()}</p>
                  </div>
                </motion.div>
             ))}
          </div>

          {/* Users Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0, fontFamily: 'monospace' }}>ACTIVE_NODES</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Search size={18} color="#94A3B8" />
                <input type="text" placeholder="Grep nodes..." style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '0.75rem', color: 'white', fontSize: '0.9rem', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                    <th style={{ padding: '1rem 0', fontWeight: 600 }}>Object ID</th>
                    <th style={{ padding: '1rem 0', fontWeight: 600 }}>Region/Zone</th>
                    <th style={{ padding: '1rem 0', fontWeight: 600 }}>Pkt Status</th>
                    <th style={{ padding: '1rem 0', fontWeight: 600, textAlign: 'right' }}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1.25rem 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{user.name}</span>
                          <span style={{ fontSize: '0.85rem', color: '#64748B', fontFamily: 'monospace' }}>{user.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 0', color: '#94A3B8', fontWeight: 500, fontFamily: 'monospace' }}>{user.location}</td>
                      <td style={{ padding: '1.25rem 0' }}>
                        <span style={{ 
                          background: user.status === 'Online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: user.status === 'Online' ? '#34D399' : '#F87171', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          fontSize: '0.8rem', 
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          border: `1px solid ${user.status === 'Online' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}><MoreVertical size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
               <button style={{ background: 'transparent', color: '#4ADE80', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                 &gt; DUMP_ALL_NODES
               </button>
            </div>
          </motion.div>

       </div>
    </div>
  );
}
