import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartPie, FaBus, FaUsers, FaCog, FaChartLine, FaHistory,
  FaPhoneAlt, FaStar, FaInfoCircle, FaUserCheck, FaExternalLinkAlt, FaSignOutAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const Sidebar = () => {
  const { userData, logout } = useAuth();
  const role = userData?.role || 'passenger';
  const [pendingCount, setPendingCount] = useState(0);

  // Real-time pending driver count for admins
  useEffect(() => {
    if (role !== 'admin') return;
    const unsub = onSnapshot(collection(db, 'driverApplications'), snap => {
      setPendingCount(snap.docs.filter(d => !d.data().status || d.data().status === 'pending').length);
    });
    return () => unsub();
  }, [role]);

  const menuItems = {
    admin: [
      { path: '/admin', icon: <FaChartPie />, label: 'Analytics', exact: true },
      { path: '/admin/approvals', icon: <FaUserCheck />, label: 'Driver Approvals', badge: pendingCount },
      { path: '/admin/buses', icon: <FaBus />, label: 'Fleet Management' },
      { path: '/admin/users', icon: <FaUsers />, label: 'User Management' },
      { path: '/admin/settings', icon: <FaCog />, label: 'Global Settings' },
    ],
    driver: [
      { path: '/driver', icon: <FaChartPie />, label: 'Service Feed', exact: true },
      { path: '/driver/history', icon: <FaHistory />, label: 'Trip History' },
      { path: '/driver/performance', icon: <FaStar />, label: 'Captain Score' },
      { path: '/driver/help', icon: <FaInfoCircle />, label: 'Safety Guidelines' },
    ],
  };

  const currentMenu = menuItems[role] || [];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button - Visible only on mobile screens */}
      <button 
        className="mobile-only"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed', top: 15, left: 15, zIndex: 999,
          background: 'var(--primary)', color: 'white',
          border: 'none', borderRadius: 8, padding: 10,
          cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      {/* Overlay to close sidebar on mobile */}
      {mobileOpen && (
        <div 
          className="mobile-only"
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)' }}
        />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{
        width: 280,
        backgroundColor: 'white',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        padding: '32px 20px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '10px 0 30px rgba(0,0,0,0.03)',
        flexShrink: 0,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button className="mobile-only" onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--grey)' }}>✕</button>
        </div>

        {/* ── Visit Website Button ── */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 20 }} onClick={() => setMobileOpen(false)}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 16,
            background: 'rgba(13, 124, 63, 0.08)',
            border: '1px dashed var(--primary)',
            color: 'var(--primary)', fontWeight: 800, fontSize: 13,
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13, 124, 63, 0.08)'; e.currentTarget.style.color = 'var(--primary)'; }}
          >
            <FaExternalLinkAlt size={12} />
            Visit Passenger Side
          </div>
        </Link>

        {/* Role Badge */}
        <div style={{
          padding: '14px 18px', borderRadius: 18, marginBottom: 28,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          color: 'white',
        }}>
          <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 800, opacity: 0.7, letterSpacing: 2, textTransform: 'uppercase' }}>
            {role === 'admin' ? 'Admin Panel' : 'Driver Panel'}
          </p>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>
            {userData?.name || 'Welcome'}
          </p>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
            {userData?.email}
          </p>
        </div>

        {/* Menu Label */}
        <p style={{ fontSize: 10, color: 'var(--grey)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, paddingLeft: 14, marginBottom: 10 }}>
          MAIN MENU
        </p>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {currentMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 16px',
                borderRadius: 16,
                color: isActive ? 'white' : '#374151',
                background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
                fontWeight: 700,
                fontSize: 14,
                transition: 'all 0.25s ease',
                boxShadow: isActive ? '0 8px 20px rgba(13,124,63,0.25)' : 'none',
                position: 'relative',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes('gradient')) {
                  e.currentTarget.style.background = '#F9FAFB';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.background.includes('gradient')) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: '#EF4444', color: 'white',
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, flexShrink: 0,
                  animation: 'pulse 2s infinite',
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Support Card */}
        <div style={{
          padding: '18px 16px', borderRadius: 18,
          background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
          border: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: 14,
          marginTop: 20
        }}>
          <div style={{ width: 40, height: 40, background: 'var(--secondary)', color: 'var(--dark)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaPhoneAlt size={16} />
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: 1 }}>Help Desk</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>+92 300 1234567</p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{
            marginTop: 15,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px', borderRadius: 16,
            background: '#FEE2E2', color: '#EF4444',
            border: 'none', fontWeight: 800, fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FCA5A5'}
          onMouseLeave={e => e.currentTarget.style.background = '#FEE2E2'}
        >
          <span style={{ fontSize: 18 }}><FaSignOutAlt /></span>
          Logout
        </button>

        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
