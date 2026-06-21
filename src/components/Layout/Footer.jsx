import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBusAlt, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaFacebook, FaTwitter, FaInstagram, FaWhatsapp,
  FaShieldAlt, FaStar, FaTicketAlt, FaRoute,
} from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0B1120 0%, #0D1F2D 60%, #091A0E 100%)',
      color: 'white',
      marginTop: 80,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -80, left: -80,
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(13,124,63,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: -60,
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(244,196,48,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top CTA Banner */}
      <div className="footer-top-banner" style={{
        background: 'linear-gradient(135deg, rgba(13,124,63,0.9) 0%, rgba(8,92,45,0.95) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '36px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaBusAlt size={24} color="#F4C430" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Travel Smart Across Pakistan</h3>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 3 }}>
              Book your next journey in seconds — 50+ cities, 1000+ daily routes
            </p>
          </div>
        </div>
        <div className="footer-top-banner-buttons" style={{ display: 'flex', gap: 12 }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '13px 28px', background: '#F4C430', color: '#0B1120',
              border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get Started Free
            </button>
          </Link>
          <Link to="/track-bus" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '13px 28px', background: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              Live Tracking
            </button>
          </Link>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="footer-main-grid" style={{
        padding: '64px 60px 40px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.3fr',
        gap: 48,
        position: 'relative', zIndex: 1,
      }}>

        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'linear-gradient(135deg, #0D7C3F, #085C2D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(13,124,63,0.4)',
            }}>
              <FaBusAlt size={22} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: -0.5 }}>
                SMART ADDA
              </h2>
              <p style={{ margin: 0, fontSize: 9, color: '#F4C430', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
                Royal Fleet Network
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.65, marginBottom: 24, maxWidth: 300 }}>
            Pakistan's most trusted intercity bus booking platform. Connecting communities
            from Karachi to Khyber with comfort, safety, and reliability.
          </p>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {[
              { icon: <FaShieldAlt size={11} />, label: 'Verified Safe' },
              { icon: <FaStar size={11} />, label: '4.9 Rating' },
              { icon: <FaTicketAlt size={11} />, label: '50K+ Bookings' },
            ].map(badge => (
              <div key={badge.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 20,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
              }}>
                <span style={{ color: '#F4C430' }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: <FaFacebook size={16} />, href: '#', color: '#1877F2' },
              { icon: <FaTwitter size={16} />, href: '#', color: '#1DA1F2' },
              { icon: <FaInstagram size={16} />, href: '#', color: '#E4405F' },
              { icon: <FaWhatsapp size={16} />, href: '#', color: '#25D366' },
            ].map((s, i) => (
              <a key={i} href={s.href} style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = s.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ margin: '0 0 22px', fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: '#F4C430' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/track-bus', label: 'Live Tracking' },
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Register Now' },
              { to: '/my-bookings', label: 'My Bookings' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} style={{
                  color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                  fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#F4C430'; e.currentTarget.style.paddingLeft = '6px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.paddingLeft = '0'; }}
                >
                  <span style={{ width: 4, height: 4, background: '#0D7C3F', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Routes */}
        <div>
          <h4 style={{ margin: '0 0 22px', fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: '#F4C430' }}>
            Popular Routes
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Lahore → Islamabad',
              'Karachi → Lahore',
              'Peshawar → Islamabad',
              'Multan → Lahore',
              'Hangu → Kohat',
            ].map(route => (
              <li key={route} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 14, color: 'rgba(255,255,255,0.65)',
              }}>
                <FaRoute size={11} color="#0D7C3F" />
                {route}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ margin: '0 0 22px', fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: '#F4C430' }}>
            Contact Us
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                icon: <FaMapMarkerAlt size={14} />,
                label: 'Head Office',
                value: 'Rawalpindi Terminal, GT Road, Punjab, Pakistan',
              },
              {
                icon: <FaPhoneAlt size={14} />,
                label: '24/7 Helpline',
                value: '+92 300 1234567',
              },
              {
                icon: <FaEnvelope size={14} />,
                label: 'Email Support',
                value: 'support@smartadda.pk',
              },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(13,124,63,0.3)', border: '1px solid rgba(13,124,63,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#4ADE80',
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {item.label}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, lineHeight: 1.5 }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              marginTop: 24, padding: '12px 16px', borderRadius: 14,
              background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.12)'}
            >
              <FaWhatsapp size={18} color="#25D366" />
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#4ADE80' }}>Chat on WhatsApp</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Instant response</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 60px' }} />

      {/* Bottom Bar */}
      <div className="footer-bottom-bar" style={{
        padding: '22px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          © {year} <span style={{ color: '#F4C430', fontWeight: 800 }}>Smart Adda</span>. All rights reserved.
          Pakistan's Premier Bus Booking Platform.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
            <a key={item} href="#" style={{
              fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              fontWeight: 600, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#F4C430'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
