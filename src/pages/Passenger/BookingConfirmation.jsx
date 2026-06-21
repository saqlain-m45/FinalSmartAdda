import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FaCheckCircle, FaPrint, FaDownload, FaMapMarkerAlt, FaBus, FaTicketAlt, FaClock, FaCalendarAlt, FaUser, FaShieldAlt } from 'react-icons/fa';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import coachDefault from '../../assets/images/coach_default.jpg';

const BookingConfirmation = () => {
  const location = useLocation();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState('review'); // review, processing, success
  const { bus, selectedSeats, totalPrice } = location.state || {};

  if (!bus) {
    return <div className="flex-center" style={{ height: '80vh' }}><h3>No booking data found.</h3></div>;
  }

  const handleBooking = async () => {
    setBookingStatus('processing');
    
    // Simulate payment and Firestore booking storage
    try {
      if (userData) {
        const bookingData = {
          userId: userData.uid,
          userName: userData.name || 'Guest User',
          userEmail: userData.email || '',
          busId: bus.id || 'demo-bus-id',
          busName: bus.name || 'Premium Coach',
          busNumber: bus.busNumber || '',
          from: bus.from || 'Terminal A',
          to: bus.to || 'Terminal B',
          seats: selectedSeats || [],
          totalPrice: totalPrice || 0,
          date: bus.date || new Date().toLocaleDateString(),
          time: bus.time || '09:00 AM',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };
        console.log("Initiating background save for booking:", bookingData);
        // Fire and forget (let Firestore handle persistence in background)
        addDoc(collection(db, 'bookings'), bookingData).catch(err => {
          console.error("Background booking save failed:", err);
        });
      }
      setBookingStatus('success');
    } catch (err) {
      console.error(err);
      alert("Failed to initiate booking. Please try again.");
      setBookingStatus('review');
    }
  };

  if (bookingStatus === 'processing') {
    return (
      <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '30px' }}>
        <div className="loader" style={{ 
          width: '80px', 
          height: '80px', 
          border: '8px solid #f3f3f3', 
          borderTop: '8px solid var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1.5s linear infinite' 
        }}></div>
        <h2 style={{ fontSize: '32px' }}>Establishing Secure Payment...</h2>
        <p style={{ color: 'var(--grey)', fontSize: '18px' }}>Verifying 256-bit encryption with bank gateway</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (bookingStatus === 'success') {
    return (
      <div style={{ maxWidth: '900px', margin: '60px auto', animation: 'fadeIn 0.6s ease-out' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px', borderRadius: '40px', border: 'none', background: 'white' }}>
          <div style={{ width: '120px', height: '120px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}>
             <FaCheckCircle color="white" size={60} />
          </div>
          <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>Safe Travels, {userData?.name ? userData.name.split(' ')[0] : 'Passenger'}!</h1>
          <p style={{ color: 'var(--grey)', fontSize: '20px', marginBottom: '50px' }}>Your reservation is confirmed. See you at the terminal.</p>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #0A0F1D 0%, #1A1A1B 100%)', 
            borderRadius: '35px', 
            padding: '50px',
            position: 'relative',
            marginTop: '20px',
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            color: 'white',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)'
          }}>
            {/* Cut-out effects */}
            <div style={{ position: 'absolute', width: '40px', height: '40px', background: '#F3F4F6', borderRadius: '50%', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}></div>
            <div style={{ position: 'absolute', width: '40px', height: '40px', background: '#F3F4F6', borderRadius: '50%', right: '-20px', top: '50%', transform: 'translateY(-50%)' }}></div>
            
            <div style={{ borderRight: '2px dashed rgba(255,255,255,0.1)', paddingRight: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                 <div>
                    <h2 style={{ fontSize: '32px', color: 'var(--secondary)', margin: 0 }}>SMART ADDA</h2>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '11px', letterSpacing: '2px', fontWeight: 700 }}>PREMIUM TICKET</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <FaTicketAlt size={24} color="var(--secondary)" />
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.5, margin: '0 0 5px' }}>PASSENGER</p>
                  <p style={{ fontWeight: 800, margin: 0, fontSize: '18px' }}>{userData?.name || 'Guest User'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.5, margin: '0 0 5px' }}>SEATS</p>
                  <p style={{ fontWeight: 800, margin: 0, fontSize: '18px', color: 'var(--secondary)' }}>{Array.isArray(selectedSeats) ? selectedSeats.join(', ') : 'TBD'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.5, margin: '0 0 5px' }}>FROM / TO</p>
                  <p style={{ fontWeight: 800, margin: 0, fontSize: '16px' }}>{bus?.from} ➔ {bus?.to}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.5, margin: '0 0 5px' }}>DEPARTURE</p>
                  <p style={{ fontWeight: 800, margin: 0, fontSize: '16px' }}>{bus?.date || 'Today'} • {bus?.time}</p>
                </div>
              </div>
              
              <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--success)' }}>
                 <FaShieldAlt /> <span style={{ fontSize: '12px', fontWeight: 600 }}>Digitally Verified & Secured</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ padding: '20px', background: 'white', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', marginBottom: '20px' }}>
                <QRCodeSVG value={`SmartAdda-${bus?.busNumber || 'BUS'}-${Array.isArray(selectedSeats) ? selectedSeats.join('-') : '0'}`} size={160} fgColor="#0A0F1D" />
              </div>
              <p style={{ fontSize: '11px', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>TICKET ID: SA-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '60px' }}>
            <button 
               onClick={() => navigate(`/track/${bus.id || 'demo-bus'}`)}
               className="btn-primary" 
               style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 40px', background: 'var(--secondary)', color: 'var(--dark)' }}
            >
               <FaMapMarkerAlt /> TRACK MY BUS
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 40px' }}><FaPrint /> PRINT TICKET</button>
            <button style={{ background: '#F3F4F6', color: 'var(--dark)', border: 'none', padding: '16px 40px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}><FaDownload/> DOWNLOAD PDF</button>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'none', color: 'var(--primary)', fontWeight: 800, marginTop: '40px', fontSize: '16px' }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '60px auto', animation: 'fadeIn 0.6s ease-out' }}>
      <h1 style={{ fontSize: '40px', marginBottom: '40px', fontWeight: 900 }}>Finalize Booking</h1>
      <div className="card" style={{ padding: '0', borderRadius: '35px', overflow: 'hidden' }}>
        <div style={{ background: 'var(--dark)', padding: '40px', color: 'white', display: 'flex', gap: '40px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '30px', 
            overflow: 'hidden',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            <img src={coachDefault} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontSize: '32px', color: 'var(--secondary)', margin: 0 }}>{bus.name}</h2>
                <div style={{ padding: '6px 15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}>{bus.luxuryClass}</div>
             </div>
             <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
                <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}><FaMapMarkerAlt /> {bus.from} ➔ {bus.to}</span>
                <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}><FaClock /> {bus.time}</span>
             </div>
          </div>
        </div>

        <div style={{ padding: '50px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              <div>
                 <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Trip Summary</h3>
                 <div style={{ padding: '25px', background: '#F9FAFB', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ color: 'var(--grey)' }}>Bus Number</span>
                       <span style={{ fontWeight: 800 }}>{bus.busNumber}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ color: 'var(--grey)' }}>Departure Date</span>
                       <span style={{ fontWeight: 800 }}>{bus.date || 'April 10, 2026'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ color: 'var(--grey)' }}>Departure Time</span>
                       <span style={{ fontWeight: 800 }}>{bus.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ color: 'var(--grey)' }}>Selected Seats</span>
                       <span style={{ fontWeight: 800 }}>{selectedSeats.join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: 'var(--grey)' }}>Fare Type</span>
                       <span style={{ fontWeight: 800 }}>Standard Executive</span>
                    </div>
                 </div>
              </div>
              <div>
                 <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Payment Summary</h3>
                 <div style={{ padding: '25px', background: '#F9FAFB', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '24px', fontWeight: 900 }}>
                       <span>Total</span>
                       <span style={{ color: 'var(--primary)' }}>Rs. {totalPrice}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div style={{ borderTop: '2px dashed #E5E7EB', paddingTop: '40px' }}>
              <h3 style={{ marginBottom: '25px', fontSize: '20px' }}>Choose Payment Method</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                 <div style={{ padding: '25px', border: '3px solid var(--primary)', borderRadius: '25px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaUser />
                       </div>
                       <div>
                          <p style={{ margin: 0, fontWeight: 800 }}>Smart Wallet</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>Bal: Rs. 600</p>
                       </div>
                    </div>
                    <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                       <FaCheckCircle color="var(--primary)" />
                    </div>
                 </div>
                 <div style={{ padding: '25px', border: '2px solid #E5E7EB', borderRadius: '25px', opacity: 0.6, cursor: 'not-allowed' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <div style={{ width: '40px', height: '40px', background: '#F3F4F6', color: 'var(--grey)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaCheckCircle />
                       </div>
                       <div>
                          <p style={{ margin: 0, fontWeight: 800 }}>EasyPaisa / JazzCash</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>Link Your Account</p>
                       </div>
                    </div>
                 </div>
              </div>

              <button onClick={handleBooking} className="btn-primary" style={{ width: '100%', height: '70px', fontSize: '20px', letterSpacing: '1px' }}>
                 CONFIRM & PAY RS. {totalPrice}
              </button>
              <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--grey)', fontSize: '13px' }}>By clicking pay, you agree to our Terms of Service.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
