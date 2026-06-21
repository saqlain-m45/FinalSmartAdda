import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaTicketAlt, FaMapMarkerAlt, FaClock, FaBus, FaCheckCircle,
  FaRoute, FaCalendarAlt, FaChair, FaArrowRight, FaMoneyBillWave,
} from 'react-icons/fa';
import coachDefault from '../../assets/images/coach_default.jpg';

const MyBookings = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(data);
      setLoading(false);
    }, (err) => {
      console.error('My bookings error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  const statusColors = {
    confirmed: { bg: '#D1FAE5', color: '#065F46', label: 'Confirmed' },
    pending:   { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
    cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
    completed: { bg: '#EEF2FF', color: '#4361EE', label: 'Completed' },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 50, height: 50, border: '5px solid #f3f3f3', borderTop: '5px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: 700, color: 'var(--grey)' }}>Loading your trips...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 0', animation: 'fadeIn 0.4s ease-out' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, #1A2535 100%)',
        borderRadius: 28, padding: '40px 45px', color: 'white', marginBottom: 36,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 20px 50px rgba(10,15,29,0.2)',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', letterSpacing: 2, marginBottom: 10 }}>
            PASSENGER PORTAL
          </div>
          <h1 style={{ fontSize: 34, margin: '0 0 6px', fontWeight: 900 }}>My Trips</h1>
          <p style={{ opacity: 0.65, margin: 0, fontSize: 15 }}>All your booked journeys in one place</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ padding: '18px 28px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, opacity: 0.7, fontWeight: 700, letterSpacing: 1 }}>TOTAL TRIPS</p>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>{bookings.length}</p>
          </div>
          <div style={{ padding: '18px 28px', background: 'var(--secondary)', borderRadius: 20, textAlign: 'center', color: 'var(--dark)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>CONFIRMED</p>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <FaTicketAlt size={64} color="#E5E7EB" style={{ marginBottom: 20 }} />
          <h2 style={{ color: 'var(--dark)', margin: '0 0 10px' }}>No trips booked yet</h2>
          <p style={{ color: 'var(--grey)', margin: '0 0 30px', fontSize: 16 }}>Browse available coaches and book your first journey!</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
            Browse Coaches
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {bookings.map((booking, idx) => {
            const status = statusColors[booking.status] || statusColors.confirmed;
            const isExpanded = activeTicket === booking.id;

            return (
              <div key={booking.id} style={{
                background: 'white', borderRadius: 24, overflow: 'hidden',
                boxShadow: isExpanded ? '0 20px 50px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.06)',
                border: isExpanded ? '2px solid var(--primary)' : '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
              }}>
                {/* Card Top — always visible */}
                <div style={{ padding: '26px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Bus Icon */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                      overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}>
                      <img src={coachDefault} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900 }}>{booking.busName || 'Coach'}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700 }}>
                        <span>{booking.from}</span>
                        <FaArrowRight size={12} color="var(--primary)" />
                        <span>{booking.to}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: 11, color: 'var(--grey)', fontWeight: 700, textTransform: 'uppercase' }}>Seats</p>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'var(--primary)' }}>{booking.seats?.join(', ')}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: 11, color: 'var(--grey)', fontWeight: 700, textTransform: 'uppercase' }}>Fare</p>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: 18 }}>Rs. {booking.totalPrice?.toLocaleString()}</p>
                    </div>
                    <span style={{ padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    <button
                      onClick={() => setActiveTicket(isExpanded ? null : booking.id)}
                      style={{
                        padding: '10px 20px', borderRadius: 14, border: '2px solid',
                        borderColor: isExpanded ? 'var(--primary)' : '#E5E7EB',
                        background: isExpanded ? 'var(--primary)' : 'white',
                        color: isExpanded ? 'white' : 'var(--dark)',
                        fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? 'Close' : 'View Ticket'}
                    </button>
                  </div>
                </div>

                {/* Expanded Ticket View */}
                {isExpanded && (
                  <div className="dashboard-layout-grid" style={{
                    margin: '0 24px 24px',
                    background: 'linear-gradient(135deg, #0A0F1D 0%, #1A2535 100%)',
                    borderRadius: 24, padding: '36px 40px',
                    display: 'grid', gridTemplateColumns: '1.4fr 0.8fr',
                    gap: 40, color: 'white', position: 'relative',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                  }}>
                    {/* Ticket cut-out effects */}
                    <div style={{ position: 'absolute', width: 36, height: 36, background: '#F3F4F6', borderRadius: '50%', left: -18, top: '50%', transform: 'translateY(-50%)' }}></div>
                    <div style={{ position: 'absolute', width: 36, height: 36, background: '#F3F4F6', borderRadius: '50%', right: -18, top: '50%', transform: 'translateY(-50%)' }}></div>

                    <div style={{ borderRight: '2px dashed rgba(255,255,255,0.1)', paddingRight: 40 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                        <div>
                          <h2 style={{ margin: '0 0 4px', color: 'var(--secondary)', fontSize: 24, fontWeight: 900 }}>SMART ADDA</h2>
                          <p style={{ margin: 0, opacity: 0.5, fontSize: 10, letterSpacing: 3, fontWeight: 800 }}>PREMIUM TICKET</p>
                        </div>
                        <FaTicketAlt size={24} color="var(--secondary)" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {[
                          { label: 'PASSENGER', val: booking.userName || userData?.name },
                          { label: 'SEATS', val: booking.seats?.join(', '), gold: true },
                          { label: 'FROM / TO', val: `${booking.from} → ${booking.to}` },
                          { label: 'DEPARTURE', val: `${booking.date || 'Today'} • ${booking.time}` },
                          { label: 'BUS NO.', val: booking.busNumber || '—' },
                          { label: 'TOTAL FARE', val: `Rs. ${booking.totalPrice?.toLocaleString()}`, gold: true },
                        ].map(({ label, val, gold }) => (
                          <div key={label}>
                            <p style={{ fontSize: 10, opacity: 0.5, margin: '0 0 4px', letterSpacing: 1, fontWeight: 800 }}>{label}</p>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: gold ? 'var(--secondary)' : 'white' }}>{val}</p>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
                        <FaCheckCircle /> Digitally Verified & Secured
                      </div>
                    </div>

                    {/* QR Code */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <div style={{ padding: 16, background: 'white', borderRadius: 20, boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}>
                        <QRCodeSVG value={`SmartAdda-${booking.busId || 'BUS'}-${booking.seats?.join('-') || '0'}-${booking.id}`} size={130} fgColor="#0A0F1D" />
                      </div>
                      <p style={{ fontSize: 10, opacity: 0.5, fontWeight: 800, letterSpacing: 1, margin: 0 }}>
                        ID: SA-{booking.id?.slice(-8)?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons (always visible at bottom if expanded) */}
                {isExpanded && (
                  <div style={{ padding: '0 32px 24px', display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => navigate(`/track/${booking.busId || 'demo'}`)}
                      style={{ padding: '12px 24px', background: 'var(--secondary)', color: 'var(--dark)', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <FaMapMarkerAlt /> Track Bus
                    </button>
                    <button
                      onClick={() => window.print()}
                      style={{ padding: '12px 24px', background: '#F3F4F6', color: 'var(--dark)', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
                    >
                      Print Ticket
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {bookings.length > 0 && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            ← Book Another Trip
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default MyBookings;
