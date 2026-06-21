import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaBus, FaArrowRight, FaCouch, FaCalendarAlt, FaClock, FaInfoCircle, FaWhatsapp, FaPhoneAlt, FaUserCircle } from 'react-icons/fa';

// Premium Asset Imports
import coachInterior15 from '../../assets/images/coach_interior_15.png';
import coachDefault from '../../assets/images/coach_default.jpg';

const SAMPLE_BUSES = [
  { id: 'sample-1', name: 'Toyota Grand Cabin Gold', from: 'Karachi', to: 'Gwadar', time: '08:00 PM', price: 5500, luxuryClass: 'Luxury Gold', busNumber: 'GDR-101', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-2', name: 'Toyota Executive High-Roof', from: 'Islamabad', to: 'Gilgit', time: '07:00 AM', price: 3800, luxuryClass: 'Executive', busNumber: 'GLT-442', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-3', name: 'Toyota Royal Flycoach', from: 'Peshawar', to: 'Swat', time: '10:30 AM', price: 1200, luxuryClass: 'Flycoach', busNumber: 'SWT-889', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-4', name: 'Toyota Business Hi-Ace', from: 'Multan', to: 'Faisalabad', time: '02:00 PM', price: 1100, luxuryClass: 'Business', busNumber: 'FSD-221', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-5', name: 'Toyota Green Line Transit', from: 'Quetta', to: 'Chaman', time: '09:00 AM', price: 750, luxuryClass: 'Flycoach', busNumber: 'QTA-993', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-6', name: 'Toyota Valley Express', from: 'Muzaffarabad', to: 'Rawalpindi', time: '11:15 AM', price: 950, luxuryClass: 'Flycoach', busNumber: 'AJK-112', seats: 15, availableSeats: 15, isSample: true },
  { id: 'sample-7', name: 'Toyota Kohat Shuttle', from: 'Hangu', to: 'Kohat', time: '08:30 AM', price: 450, luxuryClass: 'Standard', busNumber: 'KHT-552', seats: 15, availableSeats: 15, isSample: true }
];

const BusDetails = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [bus, setBus] = useState(location.state?.bus || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState([2, 5, 9, 14]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pricePerSeat, setPricePerSeat] = useState(1650);

  useEffect(() => {
    // Priority 1: Navigation State (Instant)
    if (location.state?.bus) {
      setBus(location.state.bus);
      setPricePerSeat(location.state.bus.price || 1650);
      setLoading(false);
      return;
    }

    // Priority 2: Offline Sample IDs (Instant recovery on refresh)
    if (busId && busId.startsWith('sample-')) {
       const sample = SAMPLE_BUSES.find(b => b.id === busId);
       if (sample) {
         setBus(sample);
         setPricePerSeat(sample.price);
         setLoading(false);
         return;
       }
    }

    // Priority 3: Firestore Fetch
    const fetchBus = async () => {
      try {
        setLoading(true);
        const busDoc = await getDoc(doc(db, "buses", busId));
        if (busDoc.exists()) {
          const data = busDoc.data();
          const busData = { id: busDoc.id, ...data };
          setBus(busData);
          setPricePerSeat(data.price || 1650);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Bus fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [busId, location.state]);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const seats = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleBooking = () => {
    if (selectedSeats.length === 0) return alert('Please select at least one seat.');
    navigate('/booking-confirmation', { 
      state: { 
        bus, 
        selectedSeats, 
        totalPrice: selectedSeats.length * pricePerSeat 
      } 
    });
  };

  if (loading && !bus) return (
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }}></div>
        <p style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>SYNCHRONIZING JOURNEY...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
     </div>
  );

  if (error && !bus) return (
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh', flexDirection: 'column', gap: '20px' }}>
        <FaInfoCircle size={40} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>Journey Not Found</h3>
        <p style={{ color: 'var(--grey)', margin: 0 }}>The requested route is currently unavailable.</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 30px' }}>Return Home</button>
     </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bus-details-grid">
        
        {/* Left Side: Seat Map */}
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <div>
                <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Select Your Seats</h2>
                <p style={{ color: 'var(--grey)', fontWeight: 600 }}>{bus?.name} • {bus?.from} to {bus?.to}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>DRIVER SIDE</span>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
            {seats.map((seat) => {
              const isOccupied = occupiedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              
              return (
                <div 
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  style={{
                    height: '60px',
                    borderRadius: '12px',
                    background: isOccupied ? '#F3F4F6' : isSelected ? 'var(--primary)' : 'white',
                    border: '2px solid',
                    borderColor: isOccupied ? '#E5E7EB' : isSelected ? 'var(--primary)' : '#F0F2F5',
                    color: isOccupied ? '#9CA3AF' : isSelected ? 'white' : 'var(--dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                    fontWeight: 800,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <FaCouch size={18} style={{ opacity: 0.5, marginRight: '6px' }} /> {seat}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px', borderTop: '1px solid #f0f0f0', paddingTop: '30px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'white', border: '2px solid #F0F2F5' }}></div> Available
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--primary)' }}></div> Selected
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#F3F4F6', border: '2px solid #E5E7EB' }}></div> Occupied
             </div>
          </div>
        </div>

        {/* Right Side: Experience & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Passenger Perspective View */}
          <div style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', height: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img 
              src={coachInterior15} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Passenger Perspective" 
              loading="lazy"
            />
            <div style={{ position: 'absolute', top: 20, right: 20, width: 80, height: 80, borderRadius: 20, overflow: 'hidden', border: '3px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
               <img src={coachDefault} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Fleet Preview" />
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(13, 124, 63, 0.9))', padding: '30px', color: 'white' }}>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>Executive Class</h3>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', fontWeight: 500 }}>High-fidelity comfort for long journeys.</p>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', background: 'var(--dark)', color: 'white' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <FaInfoCircle color="var(--secondary)" /> Booking Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Coach</span>
                  <span style={{ fontWeight: 800 }}>{bus?.name}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Route</span>
                  <span style={{ fontWeight: 800 }}>{bus?.from} ➔ {bus?.to}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Departure</span>
                  <span style={{ fontWeight: 800 }}>{bus?.time}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Seats Selected</span>
                  <span style={{ fontWeight: 800 }}>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '10px' }}>
                  <span style={{ fontWeight: 600 }}>Total Fare</span>
                  <span style={{ fontWeight: 900, color: 'var(--secondary)' }}>Rs. {selectedSeats.length * pricePerSeat}</span>
               </div>
            </div>
            <button 
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="btn-primary" 
              style={{ width: '100%', height: '58px', fontSize: '16px' }}
            >
              PROCEED TO PAYMENT
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', opacity: 0.5, marginTop: '15px' }}>Taxes & fees included. Secure checkout.</p>
          </div>

          {/* Driver Contact Card */}
          <div className="card" style={{ padding: '24px', border: '1px solid rgba(13,124,63,0.1)' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Captain Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <FaUserCircle size={30} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '14px' }}>Captain {bus?.name?.split(' ')[0] || 'Malik'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)', fontWeight: 600 }}>Senior Executive Pilot</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a 
                href={`https://wa.me/923001234567?text=Hello Captain, I am interested in booking a seat on your coach from ${bus?.from} to ${bus?.to}.`}
                target="_blank"
                rel="noreferrer"
                style={{ 
                  textDecoration: 'none', background: '#25D366', color: 'white', 
                  padding: '12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <FaWhatsapp size={14} /> WhatsApp
              </a>
              <a 
                href="tel:+923001234567"
                style={{ 
                  textDecoration: 'none', background: 'var(--dark)', color: 'white', 
                  padding: '12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <FaPhoneAlt size={12} /> Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
