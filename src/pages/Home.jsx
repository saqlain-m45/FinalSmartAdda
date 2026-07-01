import React, { useState, useEffect, memo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaClock, FaCheckCircle, FaStar, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// High-Fidelity Asset Imports
import heroBanner from '../assets/images/hero_banner.png';
import islTerminal from '../assets/images/islamabad_terminal.png';
import lhrTerminal from '../assets/images/lahore_terminal.png';
import truckArt from '../assets/images/truck_art.png';
import routeKhiHyd from '../assets/images/route_khi_hyd.png';
import routePshIsl from '../assets/images/route_psh_isl.png';
import routeMulLhr from '../assets/images/route_mul_lhr.png';
import hiaceLux from '../assets/images/hiace_lux.png';
import hiaceExec from '../assets/images/hiace_exec.png';
import hiaceStd from '../assets/images/hiace_std.png';
import hiaceArt from '../assets/images/hiace_art.png';
import hanguKohatScenic from '../assets/images/hangu_kohat_scenic.png';
import coachDefault from '../assets/images/coach_default.jpg';
import coachGold from '../assets/images/coach_gold.png';
import heroV2 from '../assets/images/hero_v2.png';
import heroV3 from '../assets/images/hero_v3.png';
import coachExt1 from '../assets/images/coach_ext_1.png';
import coachExt2 from '../assets/images/coach_ext_2.png';

const POPULAR_ROUTES = [
  { from: 'Lahore', to: 'Islamabad', image: heroV3, label: 'Lahore ⇄ Islamabad', info: 'Premium M-2 Express', price: 'Rs. 1,650+', time: '4.5 hrs' },
  { from: 'Karachi', to: 'Lahore', image: coachExt1, label: 'Karachi ⇄ Lahore', info: 'Executive Sleepers', price: 'Rs. 4,200+', time: '16 hrs' },
  { from: 'Multan', to: 'Lahore', image: coachExt2, label: 'Multan ⇄ Lahore', info: 'Direct Trade Route', price: 'Rs. 1,200+', time: '4 hrs' },
  { from: 'Peshawar', to: 'Islamabad', image: coachDefault, label: 'Peshawar ⇄ Islamabad', info: 'Fast Fly-Coach', price: 'Rs. 950+', time: '2.5 hrs' },
  { from: 'Hangu', to: 'Kohat', image: coachGold, label: 'Hangu ⇄ Kohat', info: 'Frequent Scenic Shuttle', price: 'Rs. 450+', time: '1.5 hrs' }
];

const Home = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [allBuses, setAllBuses] = useState([]);       // full live list from Firestore
  const [buses, setBuses] = useState([]);              // filtered display list
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // ── Real-time Firestore listener ─────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'buses'),
      (snap) => {
        const live = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllBuses(live);
        // Only update displayed list if user hasn't searched yet
        if (!hasSearched) setBuses(live);
        setLoading(false);
      },
      (err) => {
        console.error('Live bus fetch error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Quick-select from popular route cards ────────────────────
  const handleRouteSelect = (from, to) => {
    setSearchParams(p => ({ ...p, from, to }));
    setHasSearched(true);
    const results = allBuses.filter(b =>
      (b.from || '').toLowerCase().includes(from.toLowerCase().trim()) &&
      (b.to   || '').toLowerCase().includes(to.toLowerCase().trim())
    );
    setBuses(results);
    setTimeout(() => {
      document.getElementById('coaches-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ── Search form submit ───────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    let results = [...allBuses];
    if (searchParams.from) {
      results = results.filter(b => (b.from || '').toLowerCase().includes(searchParams.from.toLowerCase().trim()));
    }
    if (searchParams.to) {
      results = results.filter(b => (b.to || '').toLowerCase().includes(searchParams.to.toLowerCase().trim()));
    }
    setBuses(results);
    setTimeout(() => {
      document.getElementById('coaches-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Advanced Visual Mapping for Pakistani Context
  const getBusImage = (from, to, name, luxClass) => {
    return coachDefault;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Hero Section - FULL WIDTH */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '90vh',
        minHeight: '700px',
        background: `linear-gradient(rgba(10, 15, 29, 0.7), rgba(10, 15, 29, 0.4)), url(${heroV3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div className="hero-content" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '30px', fontSize: '14px', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)' }}>
            <FaStar color="#F4C430" /> PAKISTAN'S #1 ROYAL FLEET NETWORK
          </div>
          <h1 style={{ fontSize: '72px', lineHeight: 1.05, fontWeight: 950, marginBottom: '25px', letterSpacing: '-2px' }}>
            Elevate Your <br />
            <span style={{ color: 'var(--secondary)' }}>Travel Experience.</span>
          </h1>
          <p style={{ fontSize: '22px', opacity: 0.9, marginBottom: '45px', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Book premium executive coaches with real-time GPS tracking across 50+ major cities in Pakistan. Luxury meets reliability.
          </p>
          <div className="hero-features" style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(13, 124, 63, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FaCheckCircle /></div>
               <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '15px' }}>SAFE TRAVEL</p>
                  <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>Verified Captains</p>
               </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(244, 196, 48, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4C430' }}><FaStar /></div>
               <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '15px' }}>PREMIUM CLASS</p>
                  <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>Executive Comfort</p>
               </div>
            </div>
          </div>
        </div>
        {/* Animated Gradient Overlay for depth */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(transparent, #f8fafc)' }} />
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Floating Search Bar */}
        <div className="card glass search-card" style={{
          marginTop: '-80px', margin: '0 auto 100px', maxWidth: '1100px', padding: '40px',
          borderRadius: '35px', boxShadow: '0 40px 80px rgba(0, 0, 0, 0.15)', position: 'relative', zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)', border: '1px solid white'
        }}>
          <form onSubmit={handleSearch} className="search-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr)) 180px', gap: '30px', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '2px' }}>Leaving From</label>
              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '18px' }} />
                <input type="text" placeholder="e.g. Karachi" style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '18px', border: '2px solid #F0F2F5', fontWeight: 700, fontSize: '15px' }} value={searchParams.from} onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '2px' }}>Going To</label>
              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)', fontSize: '18px' }} />
                <input type="text" placeholder="e.g. Islamabad" style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '18px', border: '2px solid #F0F2F5', fontWeight: 700, fontSize: '15px' }} value={searchParams.to} onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '2px' }}>Travel Date</label>
              <div style={{ position: 'relative' }}>
                <FaCalendarAlt style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)', fontSize: '18px' }} />
                <input type="date" style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '18px', border: '2px solid #F0F2F5', fontWeight: 700, fontSize: '15px' }} value={searchParams.date} onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '16px', fontWeight: 900, borderRadius: '18px', boxShadow: '0 10px 20px rgba(13,124,63,0.3)' }}>
              <FaSearch size={18} /> FIND JOURNEY
            </button>
          </form>
        </div>

        {/* Core Value Props */}
        <section className="why-smart-adda" style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--dark)', marginBottom: '15px' }}>Why Smart Adda?</h2>
             <p style={{ color: 'var(--grey)', fontSize: '18px', fontWeight: 500 }}>Redefining the standard of public transport in Pakistan</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {[
              { icon: <FaClock size={28} />, title: 'Punctuality Guaranteed', desc: 'Our schedules are monitored via satellite to ensure 99% on-time departure and arrival.' },
              { icon: <FaShieldAlt size={28} />, title: 'Advanced Security', desc: 'Live GPS tracking and 24/7 route monitoring for every single journey.' },
              { icon: <FaStar size={28} />, title: 'Executive Comfort', desc: 'Premium seats, climate control, and on-board entertainment for a superior experience.' },
              { icon: <FaMapMarkerAlt size={28} />, title: 'Vast Network', desc: 'Connecting the most remote corners of Pakistan with central metropolitan hubs.' }
            ].map((feature, idx) => (
              <div key={idx} className="card" style={{ padding: '45px 35px', textAlign: 'center', borderRadius: '30px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: 'all 0.3s ease' }}>
                <div style={{ width: '70px', height: '70px', background: 'var(--primary)', color: 'white', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(13,124,63,0.2)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '15px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--grey)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet Showcase */}
        <section className="fleet-showcase-section" style={{ marginBottom: '120px', background: 'var(--dark)', borderRadius: '45px', padding: '80px', color: 'white', position: 'relative', overflow: 'hidden' }}>
           <div className="fleet-showcase-grid" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
              <div>
                 <span style={{ color: 'var(--secondary)', fontWeight: 900, letterSpacing: '2px', fontSize: '13px' }}>ELITE FLEET</span>
                 <h2 style={{ fontSize: '48px', fontWeight: 950, margin: '15px 0 25px', lineHeight: 1.1 }}>The Safar <br/> Gold Collection.</h2>
                 <p style={{ opacity: 0.7, fontSize: '18px', lineHeight: 1.7, marginBottom: '35px' }}>
                   Experience the pinnacle of luxury with our Gold Collection. Featuring fully reclining Italian leather seats, individual charging ports, and high-speed Wi-Fi.
                 </p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                       <h4 style={{ margin: '0 0 5px', color: 'var(--secondary)' }}>40+</h4>
                       <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>Daily Departures</p>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                       <h4 style={{ margin: '0 0 5px', color: 'var(--secondary)' }}>100%</h4>
                       <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>GPS Coverage</p>
                    </div>
                 </div>
              </div>
              <div style={{ position: 'relative' }}>
                 <img src={coachGold} alt="Fleet" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: 'rotate(2deg)' }} />
                 <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', background: 'var(--primary)', padding: '25px', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>ROYAL FLEET</p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Standard of Excellence</p>
                 </div>
              </div>
           </div>
        </section>

      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '32px', color: 'var(--dark)', marginBottom: '30px' }}>Popular Routes</h2>
        <div className="popular-routes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {POPULAR_ROUTES.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handleRouteSelect(route.from, route.to)}
              style={{
                height: '180px',
                borderRadius: '25px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}
            >
              <img src={route.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} alt={route.label} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9))', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 800, letterSpacing: '1px', background: 'rgba(13, 124, 63, 0.2)', padding: '4px 8px', borderRadius: '4px', marginBottom: '8px', display: 'inline-block' }}>{route.info.toUpperCase()}</span>
                    <h3 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '22px', fontWeight: 900 }}>{route.label}</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}><FaClock size={10} /> {route.time}</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>Available Daily</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--secondary)', margin: 0, fontSize: '16px', fontWeight: 900 }}>{route.price}</p>
                    <p style={{ color: 'white', opacity: 0.6, margin: 0, fontSize: '10px', fontWeight: 700 }}>Starting Price</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div id="coaches-section" style={{ paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--dark)', marginBottom: '8px' }}>Available Coaches</h2>
            <p style={{ color: 'var(--grey)', fontWeight: 600 }}>Explore coach routes across all corners of Pakistan</p>
          </div>
          {/* Live count badge */}
          {allBuses.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: '#D1FAE5', borderRadius: 20 }}>
              <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#065F46' }}>{allBuses.length} Coaches Live</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '30vh', background: 'white', borderRadius: '30px' }}><div className="loading-spinner"></div></div>
        ) : (
          <div className="grid-cols-auto">
            {buses.length > 0 ? buses.map((bus) => (
              <div key={bus.id} className="card bus-card-hover" style={{ padding: 0, overflow: 'hidden', borderRadius: '30px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* Visual Header */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img src={getBusImage(bus.from, bus.to, bus.name, bus.luxuryClass)} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} loading="lazy" alt={bus.name} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 16px', background: 'rgba(10, 15, 29, 0.8)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '30px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                    {bus.luxuryClass?.toUpperCase()}
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '6px 12px', background: 'var(--secondary)', color: 'var(--dark)', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>
                    {bus.busNumber || 'LEX-4581'}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '30px' }}>
                  {/* Route - IMPROVED INLINE LAYOUT */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase' }}>From</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)' }}>{bus.from}</span>
                    </div>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #ddd, transparent)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaBus size={14} color="var(--primary)" style={{ background: 'white', padding: '0 8px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase' }}>To</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark)' }}>{bus.to}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--dark)', opacity: 0.8 }}>{bus.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--grey)', fontWeight: 600 }}>
                        <FaClock /> {bus.time} • <span style={{ color: 'var(--success)' }}>On Time</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '24px', fontWeight: 950, color: 'var(--primary)', display: 'block' }}>Rs. {bus.price}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--grey)' }}>Per Seat</span>
                    </div>
                  </div>

                  {/* Actions & Meta */}
                  <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>
                      <span style={{ color: 'var(--primary)' }}>{bus.availableSeats || 15} Seats</span> Left
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
                      <button onClick={() => navigate(`/bus/${bus.id}`, { state: { bus } })} className="btn-primary" style={{ padding: '12px 25px', fontSize: '13px', borderRadius: '14px', width: '100%', maxWidth: '140px' }}>
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : <div style={{ textAlign: 'center', padding: '60px' }}><h3>No buses found for this route.</h3></div>}
          </div>
        )}
      </div>
      </div>

      {/* App Download Section */}
      <section className="app-download-section" style={{ background: 'var(--primary)', padding: '100px 0', color: 'white' }}>
         <div className="app-download-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>
            <div style={{ maxWidth: '500px' }}>
               <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '25px', lineHeight: 1.1 }}>The Smart Adda App is almost here.</h2>
               <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', lineHeight: 1.6 }}>
                 Get real-time trip notifications, manage your bookings on the go, and unlock exclusive app-only discounts.
               </p>
               <div className="app-download-buttons" style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ background: 'var(--dark)', padding: '15px 30px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                     <FaBus size={24} color="var(--secondary)" />
                     <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.6 }}>PRE-ORDER ON</p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '15px' }}>App Store</p>
                     </div>
                  </div>
                  <div style={{ background: 'var(--dark)', padding: '15px 30px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                     <FaBus size={24} color="var(--secondary)" />
                     <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '10px', opacity: 0.6 }}>GET IT ON</p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '15px' }}>Google Play</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="app-download-image" style={{ position: 'relative', width: '400px', height: '500px', background: 'rgba(255,255,255,0.1)', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <FaBus size={120} color="var(--secondary)" style={{ animation: 'float 4s ease-in-out infinite' }} />
               <div style={{ position: 'absolute', top: '40px', right: '-20px', background: 'white', padding: '15px 25px', borderRadius: '20px', color: 'var(--dark)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 800 }}>LIVE TRACKING</p>
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--grey)' }}>Enabled for all routes</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Buffer */}
      <div style={{ height: '100px', background: '#f8fafc' }} />

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .bus-card-hover:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important; }
      `}</style>
    </div>
  );
};

export default memo(Home);
