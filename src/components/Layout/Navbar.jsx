import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBusAlt, FaUserCircle, FaSignOutAlt, FaMapMarkerAlt, FaTicketAlt, FaChartPie, FaTachometerAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (!userData) return null;
    if (userData.role === 'admin') return { to: '/admin', label: 'Admin Panel', icon: <FaChartPie size={13} /> };
    if (userData.role === 'driver') return { to: '/driver', label: 'My Dashboard', icon: <FaTachometerAlt size={13} /> };
    return null;
  };

  const dashLink = getDashboardLink();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav style={{
        height: 85,
        backgroundColor: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 50px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }} className="navbar-container">

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }} onClick={closeMobileMenu}>
          <div style={{
            width: 46, height: 46,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 8px 18px rgba(13,124,63,0.25)',
          }}>
            <FaBusAlt size={24} />
          </div>
          <div className="navbar-brand-text">
            <h2 style={{ fontSize: 21, color: 'var(--primary)', margin: 0, fontWeight: 900, letterSpacing: -0.5 }}>SMART ADDA</h2>
            <p style={{ fontSize: 10, color: 'var(--grey)', margin: 0, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>Royal Fleet Network</p>
          </div>
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="desktop-only" style={{ gap: 36, alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--dark)', fontWeight: 700, fontSize: 15 }}>
            Home
          </Link>
          <Link to="/track-bus" style={{ textDecoration: 'none', color: 'var(--dark)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'liveping 2s infinite' }}></span>
            Live Tracking
          </Link>

          {/* Passenger: My Trips link */}
          {currentUser && userData?.role === 'passenger' && (
            <Link to="/my-bookings" style={{ textDecoration: 'none', color: 'var(--dark)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaTicketAlt size={14} color="var(--primary)" /> My Trips
            </Link>
          )}

          {/* Admin/Driver: Dashboard link */}
          {currentUser && dashLink && (
            <Link to={dashLink.to} style={{ textDecoration: 'none', color: 'var(--dark)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              {dashLink.icon} {dashLink.label}
            </Link>
          )}
        </div>

        {/* Right Section - Desktop Only */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: 16 }}>
          {currentUser ? (
            <>
              {/* User Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: userData?.role === 'admin' ? '#EEF2FF' : userData?.role === 'driver' ? '#D1FAE5' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: userData?.role === 'admin' ? '#4361EE' : userData?.role === 'driver' ? 'var(--primary)' : 'var(--grey)',
                  fontSize: 20,
                }}>
                  <FaUserCircle />
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 900, fontSize: 13, color: 'var(--dark)' }}>
                    {userData?.name?.split(' ')[0] || 'User'}
                  </p>
                  <div style={{
                    padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: 1, display: 'inline-block',
                    background: userData?.role === 'admin' ? '#EEF2FF' : userData?.role === 'driver' ? '#D1FAE5' : '#F3F4F6',
                    color: userData?.role === 'admin' ? '#4361EE' : userData?.role === 'driver' ? 'var(--primary)' : 'var(--grey)',
                  }}>
                    {userData?.role || 'Passenger'}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  background: '#FEE2E2', color: '#DC2626', padding: '10px 18px',
                  borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer',
                  opacity: loggingOut ? 0.6 : 1, transition: 'all 0.2s ease',
                }}
              >
                <FaSignOutAlt /> {loggingOut ? '...' : 'Logout'}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'none', color: 'var(--dark)', padding: '11px 22px', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', borderRadius: 12 }}>
                  Sign In
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '11px 26px', fontSize: 15, boxShadow: '0 8px 20px rgba(13,124,63,0.2)' }}>
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="mobile-only flex" style={{ alignItems: 'center' }}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', fontSize: 24, color: 'var(--primary)', cursor: 'pointer', padding: '10px' }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <style>{`
          @keyframes liveping {
            0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
            50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
          }
        `}</style>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/track-bus" onClick={closeMobileMenu}>
            Live Tracking
          </Link>
          {currentUser && userData?.role === 'passenger' && (
            <Link to="/my-bookings" onClick={closeMobileMenu}>
              <FaTicketAlt color="var(--primary)" /> My Trips
            </Link>
          )}
          {currentUser && dashLink && (
            <Link to={dashLink.to} onClick={closeMobileMenu}>
              {dashLink.icon} {dashLink.label}
            </Link>
          )}
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 30 }}>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: userData?.role === 'admin' ? '#EEF2FF' : userData?.role === 'driver' ? '#D1FAE5' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: userData?.role === 'admin' ? '#4361EE' : userData?.role === 'driver' ? 'var(--primary)' : 'var(--grey)',
                  fontSize: 24,
                }}>
                  <FaUserCircle />
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 900, fontSize: 16, color: 'var(--dark)' }}>
                    {userData?.name || 'User'}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--grey)' }}>{userData?.role || 'Passenger'}</p>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                disabled={loggingOut}
                style={{
                  background: '#FEE2E2', color: '#DC2626', padding: '14px',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
                  width: '100%'
                }}
              >
                <FaSignOutAlt /> {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/login" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', background: '#F3F4F6', color: 'var(--dark)', padding: '14px', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', borderRadius: 12 }}>
                  Sign In
                </button>
              </Link>
              <Link to="/register" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
