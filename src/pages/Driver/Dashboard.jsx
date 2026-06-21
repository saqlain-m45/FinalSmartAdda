import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaPlay, FaStop, FaMapMarkerAlt, FaUsers, FaClock, FaRoute,
  FaCheckCircle, FaUserCheck, FaBus, FaHistory, FaStar, FaInfoCircle,
  FaPhoneAlt, FaEnvelope, FaTicketAlt, FaMoneyBillWave, FaChair,
  FaShieldAlt, FaTachometerAlt,
} from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom';
import coachDefault from '../../assets/images/coach_default.jpg';

// ═══════════════════════════════════════════════════════════════
// MAIN SERVICE FEED
// ═══════════════════════════════════════════════════════════════

const ServiceFeed = ({ userData, tripActive, toggleTrip, assignedBus, bookings, loadingBookings }) => {
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalSeats = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, #1A2535 100%)',
        borderRadius: 28, padding: '40px 45px', color: 'white',
        marginBottom: 30, boxShadow: '0 20px 50px rgba(10,15,29,0.3)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
            Captain Dashboard
          </div>
          <h1 style={{ fontSize: 36, margin: '0 0 6px', fontWeight: 900 }}>
            Welcome, {userData?.name?.split(' ')[0] || 'Captain'} 👋
          </h1>
          <p style={{ opacity: 0.65, margin: 0, fontSize: 15, fontWeight: 500 }}>
            {assignedBus.route !== 'No Bus Assigned' ? `Route: ${assignedBus.route}` : 'No route assigned yet. Contact admin.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '14px 22px', background: 'rgba(255,255,255,0.1)', borderRadius: 18, backdropFilter: 'blur(10px)' }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.7, fontWeight: 700, letterSpacing: 1 }}>TRIP STATUS</p>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: tripActive ? '#34D399' : '#F59E0B' }}>
              {tripActive ? '🟢 ON TRACK' : '🟡 STANDBY'}
            </p>
          </div>
          <button
            onClick={toggleTrip}
            style={{
              padding: '16px 32px', borderRadius: 18, border: 'none', cursor: 'pointer',
              background: tripActive ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              color: 'white', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: tripActive ? '0 8px 20px rgba(239,68,68,0.3)' : '0 8px 20px rgba(13,124,63,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {tripActive ? <><FaStop /> END TRIP</> : <><FaPlay /> START TRIP</>}
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        {[
          { icon: <FaUsers />, label: 'Passengers', val: bookings.length, color: '#4361EE', bg: '#EEF2FF' },
          { icon: <FaChair />, label: 'Seats Booked', val: totalSeats, color: '#0D7C3F', bg: '#D1FAE5' },
          { icon: <FaMoneyBillWave />, label: 'Revenue', val: `Rs. ${totalRevenue.toLocaleString()}`, color: '#F59E0B', bg: '#FEF3C7' },
          { icon: <FaTachometerAlt />, label: 'Avg. Speed', val: tripActive ? '82 km/h' : '—', color: '#8B5CF6', bg: '#EDE9FE' },
        ].map(({ icon, label, val, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 20, padding: '22px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: bg, color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                {icon}
              </div>
              <span style={{ fontSize: 13, color: 'var(--grey)', fontWeight: 600 }}>{label}</span>
            </div>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color: 'var(--dark)' }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>

        {/* Assigned Bus Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--dark)', borderRadius: 24, padding: 30, color: 'white', boxShadow: '0 15px 40px rgba(10,15,29,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                <img src={coachDefault} alt="Assigned Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, opacity: 0.5, fontSize: 11, letterSpacing: 1 }}>PLATE NUMBER</p>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 15 }}>{assignedBus.number}</p>
              </div>
            </div>

            <h2 style={{ fontSize: 22, margin: '0 0 8px', fontWeight: 900 }}>{assignedBus.route}</h2>
            <p style={{ opacity: 0.65, fontSize: 14, margin: '0 0 28px' }}>
              Departure: <strong style={{ color: 'var(--secondary)' }}>{assignedBus.departureTime}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <div>
                <p style={{ margin: '0 0 4px', opacity: 0.5, fontSize: 11, letterSpacing: 1 }}>PASSENGERS</p>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 26, color: 'var(--secondary)' }}>{bookings.length} / 40</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', opacity: 0.5, fontSize: 11, letterSpacing: 1 }}>STATUS</p>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 18, color: tripActive ? '#34D399' : '#F59E0B' }}>
                  {tripActive ? 'ON TRACK' : 'STANDBY'}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Stats */}
          <div style={{ background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800 }}>Live Trip Stats</h3>
            {[
              { label: 'Average Speed', val: tripActive ? '82 km/h' : '—' },
              { label: 'Distance Covered', val: tripActive ? '124 km' : '—' },
              { label: 'ETA Next Stop', val: tripActive ? '45 mins' : '—' },
              { label: 'Fuel Status', val: tripActive ? 'Good (78%)' : '—' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ color: 'var(--grey)', fontWeight: 600, fontSize: 14 }}>{label}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--dark)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Manifest */}
        <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>Passenger Manifest</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--grey)', fontWeight: 600 }}>Real-time boarding status</p>
            </div>
            <div style={{ padding: '6px 16px', background: bookings.length > 0 ? '#D1FAE5' : '#F3F4F6', borderRadius: 20, fontSize: 13, fontWeight: 800, color: bookings.length > 0 ? '#065F46' : 'var(--grey)' }}>
              {bookings.length} Booked
            </div>
          </div>

          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {loadingBookings ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--grey)' }}>
                Loading passengers...
              </div>
            ) : bookings.length > 0 ? bookings.map((booking, idx) => (
              <div key={booking.id || idx} style={{
                padding: '20px 28px', borderBottom: '1px solid #fafafa',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: `hsl(${(idx * 47) % 360}, 65%, 55%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 900, fontSize: 18, flexShrink: 0,
                  }}>
                    {(booking.userName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 15 }}>{booking.userName || 'Unknown Passenger'}</p>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--grey)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <FaEnvelope size={10} /> {booking.userEmail || booking.email || 'N/A'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: '#D1FAE5', padding: '2px 10px', borderRadius: 8 }}>
                        Seats: {booking.seats?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 900, fontSize: 16, color: 'var(--primary)' }}>
                    Rs. {booking.totalPrice?.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontWeight: 700, fontSize: 12, justifyContent: 'flex-end' }}>
                    <FaCheckCircle size={10} /> CONFIRMED
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                <FaUsers size={50} color="#E5E7EB" style={{ marginBottom: 16 }} />
                <h4 style={{ color: 'var(--grey)', fontWeight: 700, margin: '0 0 8px' }}>No bookings yet</h4>
                <p style={{ color: 'var(--grey)', fontSize: 14, margin: 0 }}>
                  {assignedBus.route === 'No Bus Assigned'
                    ? 'You have no bus assigned. Contact admin.'
                    : 'Passenger bookings will appear here in real-time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRIP HISTORY
// ═══════════════════════════════════════════════════════════════

const TripHistory = () => (
  <div style={{ maxWidth: 1000, animation: 'fadeIn 0.3s ease-out' }}>
    <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900 }}>Trip History</h1>
    <p style={{ margin: '0 0 30px', color: 'var(--grey)', fontWeight: 600 }}>Your completed journeys</p>
    <div style={{ display: 'grid', gap: 16 }}>
      {[
        { route: 'Islamabad ➔ Lahore', date: 'March 28, 2026 • 09:00 AM', passengers: 34, revenue: 56100, note: 'Fuel Efficient Run' },
        { route: 'Lahore ➔ Multan', date: 'March 25, 2026 • 02:30 PM', passengers: 28, revenue: 33600, note: 'On-time Arrival' },
        { route: 'Multan ➔ Karachi', date: 'March 20, 2026 • 06:00 PM', passengers: 38, revenue: 159600, note: 'Full Capacity' },
      ].map(({ route, date, passengers, revenue, note }) => (
        <div key={route} style={{
          background: 'white', borderRadius: 20, padding: '24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #D1FAE5, #6EE7B7)', color: 'var(--primary)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaRoute size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 16 }}>{route}</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--grey)' }}>{date}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase' }}>Passengers</p>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>{passengers}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase' }}>Revenue</p>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 16, color: 'var(--primary)' }}>Rs. {revenue.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ padding: '6px 14px', background: '#D1FAE5', color: '#065F46', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                ✓ Completed
              </span>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>{note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// CAPTAIN SCORE
// ═══════════════════════════════════════════════════════════════

const CaptainScore = () => (
  <div style={{ maxWidth: 800, animation: 'fadeIn 0.3s ease-out' }}>
    <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900 }}>Captain Score</h1>
    <p style={{ margin: '0 0 30px', color: 'var(--grey)', fontWeight: 600 }}>Your performance metrics and ratings</p>
    <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {[
        { label: 'Overall Rating', val: '4.8 / 5.0', icon: <FaStar />, color: '#F59E0B', bg: '#FEF3C7' },
        { label: 'Safety Score', val: '98%', icon: <FaShieldAlt />, color: '#0D7C3F', bg: '#D1FAE5' },
        { label: 'On-time Rate', val: '94%', icon: <FaClock />, color: '#4361EE', bg: '#EEF2FF' },
        { label: 'Total Trips', val: '127', icon: <FaRoute />, color: '#8B5CF6', bg: '#EDE9FE' },
      ].map(({ label, val, icon, color, bg }) => (
        <div key={label} style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, background: bg, color, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {icon}
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--grey)', fontWeight: 600 }}>{label}</p>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 26, color: 'var(--dark)' }}>{val}</p>
          </div>
        </div>
      ))}
    </div>
    <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN DRIVER DASHBOARD CONTROLLER
// ═══════════════════════════════════════════════════════════════

const DriverDashboard = () => {
  const { userData, currentUser } = useAuth();
  const [tripActive, setTripActive] = useState(false);
  const [locationState, setLocationState] = useState({ lat: 31.5204, lng: 74.3587 });
  const [busId, setBusId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [assignedBus, setAssignedBus] = useState({
    name: 'Not Assigned',
    number: '—',
    route: 'No Bus Assigned',
    departureTime: '—',
    passengers: 0,
  });

  // 1. Find the bus assigned to this driver
  useEffect(() => {
    if (!currentUser) return;
    const findBus = async () => {
      try {
        const q = query(collection(db, 'buses'), where('driverId', '==', currentUser.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const busDoc = snap.docs[0];
          const data = busDoc.data();
          setBusId(busDoc.id);
          setTripActive(data.status === 'on-track');
          if (data.status === 'on-track' && data.currentLocation) {
            setLocationState(data.currentLocation);
          }
          setAssignedBus({
            name: data.name,
            number: data.busNumber || '—',
            route: `${data.from} ➔ ${data.to}`,
            departureTime: data.time || '—',
            passengers: 0,
            from: data.from,
            to: data.to,
          });
        } else {
          setLoadingBookings(false);
        }
      } catch (err) {
        console.error('Bus find error:', err);
        setLoadingBookings(false);
      }
    };
    findBus();
  }, [currentUser]);

  // 2. Real-time bookings for this bus
  useEffect(() => {
    if (!busId) return;
    setLoadingBookings(true);
    const q = query(collection(db, 'bookings'), where('busId', '==', busId));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(data);
      setAssignedBus(prev => ({ ...prev, passengers: data.length }));
      setLoadingBookings(false);
    }, (err) => {
      console.error('Bookings snapshot error:', err);
      setLoadingBookings(false);
    });
    return () => unsub();
  }, [busId]);

  // 3. Toggle Trip (Start/End)
  const toggleTrip = async () => {
    if (!busId) return;

    if (!tripActive) {
      // START TRIP
      const originCity = assignedBus.from || 'Islamabad';
      const startCoord = { lat: 33.6844, lng: 73.0479 }; // Fallback before actual GPS kicks in

      setTripActive(true);
      const tripId = `trip-${Date.now()}`;
      const busRef = doc(db, 'buses', busId);

      try {
        await updateDoc(busRef, {
          status: 'on-track',
          activeTripId: tripId,
          currentLocation: startCoord,
          tripStartedAt: new Date().toISOString(),
        });
        setLocationState(startCoord);
      } catch (error) {
        console.error('Error starting trip:', error);
        setTripActive(false);
      }
    } else {
      // END TRIP
      setTripActive(false);
      const busRef = doc(db, 'buses', busId);
      try {
        await updateDoc(busRef, {
          status: 'standby',
          activeTripId: null,
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error ending trip:', error);
      }
    }
  };

  // 4. Location sync while trip is active (Simulator for Demo)
  useEffect(() => {
    if (!tripActive || !busId) return;
    const interval = setInterval(async () => {
      const step = 0.0015; 
      const newPos = {
        lat: locationState.lat + (Math.random() * 0.0002 - 0.0001), 
        lng: locationState.lng + step,
      };
      setLocationState(newPos);
      try {
        await updateDoc(doc(db, 'buses', busId), {
          currentLocation: newPos,
          currentSpeed: `${Math.floor(70 + Math.random() * 25)} km/h`,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Location sync error:', err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [tripActive, busId, locationState]);

  return (
    <Routes>
      <Route index element={
        <ServiceFeed
          userData={userData}
          tripActive={tripActive}
          toggleTrip={toggleTrip}
          assignedBus={assignedBus}
          bookings={bookings}
          loadingBookings={loadingBookings}
        />
      } />
      <Route path="history" element={<TripHistory />} />
      <Route path="performance" element={<CaptainScore />} />
      <Route path="help" element={
        <div style={{ background: 'white', borderRadius: 24, padding: 40, maxWidth: 700, boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: '0 0 20px' }}>Safety Guidelines & Emergency Protocols</h2>
          <p style={{ color: 'var(--grey)', lineHeight: 1.8 }}>
            Always check your vehicle before departure. Keep emergency contacts saved.
            In case of breakdown, call control center: <strong>+92 300 1234567</strong>
          </p>
        </div>
      } />
    </Routes>
  );
};

export default DriverDashboard;
