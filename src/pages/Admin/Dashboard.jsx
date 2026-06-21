import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FaUsers, FaBus, FaCalendarCheck, FaMoneyBillWave, FaArrowUp,
  FaPlus, FaCheckCircle, FaTimesCircle,
  FaUserCheck, FaIdCard, FaExclamationTriangle, FaShieldAlt
} from 'react-icons/fa';
import { Routes, Route, Link } from 'react-router-dom';
import terminalBanner from '../../assets/images/terminal.png';
import coachDefault from '../../assets/images/coach_default.jpg';
import { seedSampleData } from '../../utils/seedData';

// ─── Shared UI ─────────────────────────────────────────────────
const StatusChip = ({ status }) => {
  const cfg = {
    active:    { bg: '#D1FAE5', color: '#065F46', label: 'Active' },
    pending:   { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
    rejected:  { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
    confirmed: { bg: '#D1FAE5', color: '#065F46', label: 'Confirmed' },
  };
  const s = cfg[status] || cfg.pending;
  return <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', background: s.bg, color: s.color }}>{s.label}</span>;
};

const Avatar = ({ name, size = 42, bg = 'var(--primary)' }) => (
  <div style={{ width: size, height: size, background: bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: size * 0.35, flexShrink: 0 }}>
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

// ─── ANALYTICS ──────────────────────────────────────────────────
const Analytics = ({ stats, recentBookings, pendingDriverCount }) => {
  const handleSeed = async () => {
    try { const msg = await seedSampleData(); alert(msg); }
    catch { alert('Seeding failed. Check Firestore rules or console.'); }
  };

  const chartData = stats.chartData || [
    { name: 'Mon', bookings: 0 }, { name: 'Tue', bookings: 0 },
    { name: 'Wed', bookings: 0 }, { name: 'Thu', bookings: 0 },
    { name: 'Fri', bookings: 0 }, { name: 'Sat', bookings: 0 },
    { name: 'Sun', bookings: 0 },
  ];

  const StatBox = ({ title, value, icon, color, trend }) => (
    <div style={{ background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 20, transition: 'all .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 52, height: 52, background: `${color}18`, color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, background: '#F0FDF4', padding: '4px 10px', borderRadius: 20 }}>
          <FaArrowUp size={10} /> {trend}%
        </div>
      </div>
      <div>
        <p style={{ margin: '0 0 6px', color: 'var(--grey)', fontSize: 13, fontWeight: 600 }}>{title}</p>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: 'var(--dark)' }}>{typeof value === 'number' ? value.toLocaleString() : value}</h2>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn .3s ease-out' }}>
      <div style={{
        backgroundImage: `linear-gradient(135deg,rgba(9,89,45,.97) 0%,rgba(13,124,63,.85) 100%),url(${terminalBanner})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '45px 50px', borderRadius: 28, color: 'white',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 36, boxShadow: '0 20px 50px rgba(13,124,63,.25)',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.15)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14, backdropFilter: 'blur(10px)' }}>
            <div style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <FaShieldAlt size={11} /> ADMIN CONTROL CENTER (LIVE)
          </div>
          <h1 style={{ fontSize: 36, margin: '0 0 6px', fontWeight: 900 }}>Smart Adda Dashboard</h1>
          <p style={{ opacity: .85, fontWeight: 500, margin: 0 }}>Managing Pakistan's Premier Transport Network</p>
          <button onClick={handleSeed} style={{ marginTop: 18, padding: '10px 22px', background: 'var(--secondary)', color: 'var(--dark)', borderRadius: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 13 }}>
            🌱 Seed Demo Data
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255,255,255,.15)', borderRadius: 18, backdropFilter: 'blur(10px)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, opacity: .8, fontWeight: 700, letterSpacing: 1 }}>SYSTEM UPTIME</p>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 22 }}>99.9%</p>
          </div>
          {pendingDriverCount > 0 && (
            <Link to="/admin/approvals" style={{ textDecoration: 'none' }}>
              <div style={{ textAlign: 'center', padding: '16px 24px', background: 'var(--secondary)', borderRadius: 18, color: 'var(--dark)', cursor: 'pointer', animation: 'pulse 2s infinite' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PENDING DRIVERS</p>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 28 }}>{pendingDriverCount}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginBottom: 36 }}>
        <StatBox title="Total Users" value={stats.totalUsers} icon={<FaUsers size={22} />} color="#4361EE" trend={12} />
        <StatBox title="Active Buses" value={stats.activeBuses} icon={<FaBus size={22} />} color="#0D7C3F" trend={5} />
        <StatBox title="Total Bookings" value={stats.totalBookings} icon={<FaCalendarCheck size={22} />} color="#F4C430" trend={18} />
        <StatBox title="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon={<FaMoneyBillWave size={22} />} color="#E74C3C" trend={8} />
      </div>

      <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginBottom: 36 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 30, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 28px', fontSize: 18 }}>Booking Trends (Weekly)</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 13, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: 13 }} />
                <Tooltip contentStyle={{ borderRadius: 14, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="bookings" fill="var(--primary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ background: 'var(--dark)', borderRadius: 24, padding: 30, color: 'white' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>System Health</h3>
          <p style={{ opacity: .6, fontSize: 13, margin: '0 0 28px' }}>All services operational</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[['Firestore Latency', '24ms', true], ['Auth Service', 'Stable', true], ['Maps API', 'Active', true], ['Storage Service', 'Online', true]].map(([label, val, ok]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, opacity: .8 }}>{label}</span>
                <span style={{ fontWeight: 800, color: ok ? '#10B981' : '#EF4444', fontSize: 13 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>Recent Bookings</h3>
          <span style={{ fontSize: 13, color: 'var(--grey)', fontWeight: 600 }}>{recentBookings.length} records</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Passenger', 'Bus / Route', 'Seats', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '14px 22px', color: 'var(--grey)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? recentBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '16px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={b.userName} size={34} />
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{b.userName || 'Guest'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 22px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{b.busName}</div>
                    <div style={{ fontSize: 12, color: 'var(--grey)', marginTop: 2 }}>{b.from} ➔ {b.to}</div>
                  </td>
                  <td style={{ padding: '16px 22px', color: 'var(--primary)', fontWeight: 700 }}>{b.seats?.join(', ')}</td>
                  <td style={{ padding: '16px 22px', fontWeight: 800, fontSize: 15 }}>Rs. {b.totalPrice?.toLocaleString()}</td>
                  <td style={{ padding: '16px 22px' }}><StatusChip status={b.status || 'confirmed'} /></td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: 'var(--grey)' }}>No bookings yet. Seed some demo data first!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

// ─── DRIVER APPROVALS ──────────────────────────────────────────
const DriverApprovals = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');

    // Real-time listener for driver applications
    const unsubApps = onSnapshot(collection(db, 'driverApplications'), (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDrivers(prev => {
        const merged = [...apps];
        // Keep unique entries, favoring applications
        prev.forEach(p => {
          if (!merged.find(m => m.id === p.id)) merged.push(p);
        });
        return merged;
      });
      setLoading(false);
    }, (err) => {
      console.error('Apps snapshot error:', err);
      setError(`Apps load failed: ${err.message}`);
    });

    // Real-time listener for users with role 'driver'
    const q = query(collection(db, 'users'), where('role', '==', 'driver'));
    const unsubUsers = onSnapshot(q, (snap) => {
      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDrivers(prev => {
        const merged = [...prev];
        users.forEach(u => {
          const idx = merged.findIndex(m => m.id === u.id);
          if (idx > -1) {
            merged[idx] = { ...merged[idx], ...u };
          } else {
            merged.push(u);
          }
        });
        return merged;
      });
    }, (err) => {
      console.error('Users snapshot error:', err);
    });

    return () => { unsubApps(); unsubUsers(); };
  }, []);

  const handleApprove = async (driverId) => {
    setProcessing(driverId);
    try {
      await Promise.all([
        updateDoc(doc(db, 'driverApplications', driverId), { status: 'active' }),
        updateDoc(doc(db, 'users', driverId), { status: 'active' }).catch(() => {}), // update users too if accessible
      ]);
    } catch (err) {
      setError('Approve failed: ' + err.message);
    } finally { setProcessing(null); }
  };

  const handleReject = async (driverId) => {
    if (!window.confirm('Reject this driver registration?')) return;
    setProcessing(driverId);
    try {
      await Promise.all([
        updateDoc(doc(db, 'driverApplications', driverId), { status: 'rejected' }),
        updateDoc(doc(db, 'users', driverId), { status: 'rejected' }).catch(() => {}),
      ]);
    } catch (err) {
      setError('Reject failed: ' + err.message);
    } finally { setProcessing(null); }
  };

  const pending  = drivers.filter(d => !d.status || d.status === 'pending');
  const approved = drivers.filter(d => d.status === 'active');
  const rejected = drivers.filter(d => d.status === 'rejected');

  const DriverCard = ({ driver }) => {
    const isPending  = !driver.status || driver.status === 'pending';
    const isApproved = driver.status === 'active';
    const proc = processing === driver.id;

    return (
      <div style={{
        background: 'white', borderRadius: 24, padding: 28,
        border: isPending ? '2px solid #FEF3C7' : '1px solid #f0f0f0',
        boxShadow: isPending ? '0 8px 25px rgba(244,196,48,0.15)' : '0 4px 15px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18, fontSize: 22, fontWeight: 900,
              background: isPending ? 'linear-gradient(135deg,#FEF3C7,#FDE68A)' : isApproved ? 'linear-gradient(135deg,#D1FAE5,#6EE7B7)' : 'linear-gradient(135deg,#FEE2E2,#FCA5A5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isPending ? '#92400E' : isApproved ? '#065F46' : '#991B1B',
            }}>
              {driver.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{driver.name || 'Unknown Driver'}</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--grey)' }}>{driver.email}</p>
              {driver.appliedAt && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--grey)' }}>Applied: {new Date(driver.appliedAt).toLocaleDateString()}</p>}
            </div>
          </div>
          <StatusChip status={driver.status || 'pending'} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
          {[
            { icon: <FaIdCard />, label: 'CNIC', val: driver.cnicNumber || 'Not provided' },
            { icon: <FaShieldAlt />, label: 'License No.', val: driver.licenseNumber || 'Not provided' },
            { icon: <FaBus />, label: 'Coach/Bus', val: driver.coachModel || 'Not provided' },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{ padding: '12px 14px', background: '#F9FAFB', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--primary)', fontSize: 11, fontWeight: 800 }}>{icon} {label}</div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        {isPending && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => handleApprove(driver.id)} disabled={proc}
              style={{ flex: 1, padding: '13px 0', background: proc ? '#e0e0e0' : 'var(--primary)', color: 'white', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: proc ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <FaCheckCircle /> {proc ? 'Processing...' : '✅ Approve Driver'}
            </button>
            <button onClick={() => handleReject(driver.id)} disabled={proc}
              style={{ flex: 1, padding: '13px 0', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: proc ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <FaTimesCircle /> Reject
            </button>
          </div>
        )}
        {isApproved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: '#10B981', fontWeight: 700, fontSize: 14 }}>
            <FaCheckCircle /> Driver approved — can now log in
          </div>
        )}
        {driver.status === 'rejected' && (
          <button onClick={() => handleApprove(driver.id)}
            style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>
            Re-Approve
          </button>
        )}
      </div>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--grey)', fontWeight: 600 }}>Loading driver applications...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn .3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900 }}>Driver Approvals</h1>
          <p style={{ margin: 0, color: 'var(--grey)', fontWeight: 600 }}>Review and manage driver registration requests</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['PENDING', pending.length, '#FEF3C7', '#92400E'], ['APPROVED', approved.length, '#D1FAE5', '#065F46'], ['REJECTED', rejected.length, '#FEE2E2', '#991B1B']].map(([label, count, bg, color]) => (
            <div key={label} style={{ padding: '10px 20px', background: bg, borderRadius: 14, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color, letterSpacing: 1 }}>{label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color }}>{count}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px 20px', background: '#FEE2E2', borderRadius: 16, color: '#991B1B', fontWeight: 600, marginBottom: 20, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {pending.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 10, height: 10, background: '#F59E0B', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Awaiting Review ({pending.length})</h2>
          </div>
          <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 20 }}>
            {pending.map(d => <DriverCard key={d.id} driver={d} />)}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 18, fontWeight: 800, color: '#10B981' }}>Approved Drivers ({approved.length})</h2>
          <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 20 }}>
            {approved.map(d => <DriverCard key={d.id} driver={d} />)}
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 18, fontWeight: 800, color: '#EF4444' }}>Rejected ({rejected.length})</h2>
          <div className="dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: 20 }}>
            {rejected.map(d => <DriverCard key={d.id} driver={d} />)}
          </div>
        </div>
      )}

      {drivers.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: 24 }}>
          <FaUserCheck size={60} color="#E5E7EB" style={{ marginBottom: 20 }} />
          <h3 style={{ color: 'var(--grey)', fontWeight: 700 }}>No driver registrations yet</h3>
          <p style={{ color: 'var(--grey)', fontSize: 14 }}>When drivers register their accounts, they will appear here for review.</p>
          <p style={{ color: 'var(--grey)', fontSize: 12, marginTop: 8 }}>Make sure drivers register via the Register page and select "Bus Driver / Captain".</p>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.4)}}`}</style>
    </div>
  );
};

// ─── FLEET MANAGEMENT ──────────────────────────────────────────
const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [newBus, setNewBus] = useState({
    name: '', busNumber: '', time: '', from: '', to: '', price: '', luxuryClass: 'Flycoach', driverId: ''
  });

  // Real-time listener for buses & drivers
  useEffect(() => {
    const unsubBuses = onSnapshot(collection(db, 'buses'), (snap) => {
      setBuses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setFormError('');
    }, (err) => {
      console.error('Bus list error:', err);
      setFormError(`Critical Firestore Error: ${err.message}`);
    });

    const unsubDrivers = onSnapshot(query(collection(db, 'users'), where('role', '==', 'driver')), (snap) => {
      setDrivers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.status === 'active'));
    });

    return () => { unsubBuses(); unsubDrivers(); };
  }, []);

  const updateField = (key, val) => setNewBus(prev => ({ ...prev, [key]: val }));

  const handleAddBus = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newBus.name.trim() || !newBus.busNumber.trim() || !newBus.from.trim() || !newBus.to.trim() || !newBus.time.trim() || !newBus.price || !newBus.driverId) {
      setFormError('Please fill in all fields and assign a driver before saving.');
      return;
    }

    setSaving(true);
    setFormError('');
    
    // Safety timeout: if Firestore takes > 10s, it's likely a connection/rule issue
    const timeout = setTimeout(() => {
      if (saving) {
        setSaving(false);
        setFormError('Connection timeout. Please check your internet or Firebase rules.');
      }
    }, 10000);

    try {
      const busData = {
        name:             newBus.name.trim(),
        busNumber:        newBus.busNumber.trim(),
        time:             newBus.time.trim(),
        from:             newBus.from.trim(),
        to:               newBus.to.trim(),
        price:            Number(newBus.price),
        luxuryClass:      newBus.luxuryClass,
        driverId:         newBus.driverId,
        status:           'active',
        seats:            15,
        availableSeats:   15,
        currentLocation:  { lat: 30.3753, lng: 69.3451 },
        destinationCoords:{ lat: 31.5204, lng: 74.3587 },
        createdAt:        new Date().toISOString(),
        updatedAt:        new Date().toISOString(),
      };

      console.log('Attempting to add bus...', busData);
      const docRef = await addDoc(collection(db, 'buses'), busData);
      console.log('Bus added successfully with ID:', docRef.id);
      
      clearTimeout(timeout);
      setFormSuccess(`✅ "${busData.name}" added to the fleet!`);
      setNewBus({ name: '', busNumber: '', time: '', from: '', to: '', price: '', luxuryClass: 'Flycoach', driverId: '' });
      setTimeout(() => { setShowAddForm(false); setFormSuccess(''); }, 2500);
    } catch (err) {
      clearTimeout(timeout);
      console.error('Firestore Add Error:', err);
      setFormError(`Save failed: ${err.message}. ${err.code === 'permission-denied' ? 'Check your Firestore security rules.' : ''}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTime = async (busId) => {
    if (!newTime) return setEditingId(null);
    try {
      await updateDoc(doc(db, 'buses', busId), { time: newTime });
      setEditingId(null);
    } catch (err) {
      console.error('Update time error:', err);
      setFormError('Update failed: ' + err.message);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (!window.confirm('Permanently delete this bus from the fleet?')) return;
    try { await deleteDoc(doc(db, 'buses', busId)); }
    catch (err) { setFormError('Delete failed: ' + err.message); }
  };

  const fields = [
    { ph: 'Coach Name (e.g. Toyota Hiace)', key: 'name' },
    { ph: 'Bus Number (e.g. LEX-4580)', key: 'busNumber' },
    { ph: 'Departure Time (e.g. 09:00 PM)', key: 'time' },
    { ph: 'From City (e.g. Karachi)', key: 'from' },
    { ph: 'To City (e.g. Lahore)', key: 'to' },
    { ph: 'Price per Seat (PKR)', key: 'price', type: 'number' },
  ];

  return (
    <div style={{ animation: 'fadeIn .3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900 }}>Fleet Management</h1>
          <p style={{ margin: 0, color: 'var(--grey)', fontWeight: 600 }}>{buses.length} coaches registered</p>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setFormError(''); setFormSuccess(''); }}
          className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}>
          <FaPlus /> {showAddForm ? 'Cancel Form' : 'Add New Bus'}
        </button>
      </div>

      {formError && (
        <div style={{ padding: '14px 20px', background: '#FEE2E2', borderRadius: 14, color: '#991B1B', fontWeight: 600, marginBottom: 18, fontSize: 14 }}>
          ❌ {formError}
        </div>
      )}

      {showAddForm && (
        <div style={{ background: 'white', borderRadius: 24, padding: '28px 30px', marginBottom: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '2px solid rgba(13,124,63,0.2)' }}>
          <h3 style={{ margin: '0 0 22px', color: 'var(--primary)' }}>🚌 Register New Coach</h3>

          {formSuccess && (
            <div style={{ padding: '14px 20px', background: '#D1FAE5', borderRadius: 14, color: '#065F46', fontWeight: 700, marginBottom: 18 }}>
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleAddBus}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              {fields.map(({ ph, key, type = 'text' }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {ph.split('(')[0].trim()}
                  </label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={newBus[key]}
                    onChange={e => updateField(key, e.target.value)}
                    min={type === 'number' ? 1 : undefined}
                    style={{
                      padding: '13px 16px', borderRadius: 12,
                      border: '2px solid #F0F2F5', fontWeight: 600, fontSize: 14,
                      fontFamily: 'Poppins, sans-serif', outline: 'none',
                      transition: 'border-color .2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#F0F2F5'}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 14, alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: 1 }}>Assign Driver</label>
                <select value={newBus.driverId} onChange={e => updateField('driverId', e.target.value)}
                  style={{ padding: '13px 16px', borderRadius: 12, border: '2px solid #F0F2F5', fontWeight: 600, fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'white' }}>
                  <option value="" disabled>Select Driver</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.cnicNumber || 'No CNIC'})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: 1 }}>Luxury Class</label>
                <select value={newBus.luxuryClass} onChange={e => updateField('luxuryClass', e.target.value)}
                  style={{ padding: '13px 16px', borderRadius: 12, border: '2px solid #F0F2F5', fontWeight: 600, fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'white' }}>
                  {['Standard', 'Flycoach', 'Business', 'Executive', 'Luxury Gold'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving}
                style={{
                  padding: '13px 32px', background: saving ? '#ccc' : 'var(--primary)', color: 'white',
                  border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
                  cursor: saving ? 'not-allowed' : 'pointer', height: 50,
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
                }}>
                {saving ? '⏳ Saving...' : '💾 Save Coach'}
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setFormError(''); setFormSuccess(''); }}
                style={{ padding: '13px 22px', background: '#F3F4F6', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', height: 50 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {buses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: 24, color: 'var(--grey)' }}>
            <FaBus size={50} style={{ opacity: .2, marginBottom: 14, display: 'block', margin: '0 auto 14px' }} />
            <h3>No coaches registered yet.</h3>
            <p style={{ fontSize: 14 }}>Click <strong>"Add New Bus"</strong> above to register the first coach.<br />It will appear here and immediately on the passenger front page.</p>
          </div>
        ) : buses.map(bus => (
          <div key={bus.id} style={{
            background: 'white', borderRadius: 18, padding: '20px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', transition: 'all .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <img src={coachDefault} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800 }}>{bus.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--grey)', fontWeight: 600, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{bus.from}</span>
                  <span>➔</span>
                  <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{bus.to}</span>
                  <span style={{ opacity: .3 }}>|</span>
                  {editingId === bus.id ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input value={newTime} onChange={e => setNewTime(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdateTime(bus.id)}
                        autoFocus placeholder="09:30 PM"
                        style={{ width: 110, padding: '4px 10px', borderRadius: 8, border: '2px solid var(--primary)', fontSize: 12, fontWeight: 600 }}
                      />
                      <button onClick={() => handleUpdateTime(bus.id)} style={{ padding: '4px 12px', background: 'var(--primary)', color: 'white', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 800 }}>✓</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '4px 10px', background: '#f0f0f0', borderRadius: 8, border: 'none', fontSize: 11 }}>✕</button>
                    </div>
                  ) : (
                    <span onClick={() => { setEditingId(bus.id); setNewTime(bus.time); }}
                      style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, background: 'rgba(13,124,63,.08)', padding: '2px 10px', borderRadius: 8 }}>
                      ⏰ {bus.time}
                    </span>
                  )}
                  <span style={{ opacity: .3 }}>|</span>
                  <span style={{ fontWeight: 700 }}>Bus: {bus.busNumber}</span>
                  <span style={{ opacity: .3 }}>|</span>
                  <span style={{ fontWeight: 700, color: '#92400E' }}>Driver: {drivers.find(d => d.id === bus.driverId)?.name || 'Not Assigned'}</span>
                  <span style={{ padding: '2px 10px', background: '#EEF2FF', color: '#4361EE', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{bus.luxuryClass}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: 'var(--grey)', textTransform: 'uppercase' }}>Seat Price</p>
                <p style={{ margin: 0, fontWeight: 900, color: 'var(--primary)', fontSize: 16 }}>Rs. {bus.price?.toLocaleString()}</p>
              </div>
              <button onClick={() => { setEditingId(bus.id); setNewTime(bus.time); }}
                style={{ padding: '9px 16px', background: '#F3F4F6', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDeleteBus(bus.id)}
                style={{ padding: '9px 16px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

// ─── USER MANAGEMENT ──────────────────────────────────────────
const SystemUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    // Fetch from both collections for comprehensive user list
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.warn('Users collection error:', err.code);
      // Fallback: try driverApplications
      setError('Limited access: ' + err.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (uid) => {
    try {
      await Promise.all([
        updateDoc(doc(db, 'users', uid), { status: 'active' }),
        updateDoc(doc(db, 'driverApplications', uid), { status: 'active' }).catch(() => {}),
      ]);
    } catch (err) { setError('Failed: ' + err.message); }
  };

  const handleReject = async (uid) => {
    if (!window.confirm('Reject this user?')) return;
    try {
      await Promise.all([
        updateDoc(doc(db, 'users', uid), { status: 'rejected' }),
        updateDoc(doc(db, 'driverApplications', uid), { status: 'rejected' }).catch(() => {}),
      ]);
    } catch (err) { setError('Failed: ' + err.message); }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div style={{ animation: 'fadeIn .3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 900 }}>User Management</h1>
          <p style={{ margin: 0, color: 'var(--grey)', fontWeight: 600 }}>{users.length} total accounts</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'passenger', 'driver', 'admin'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              style={{ padding: '8px 16px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', background: filter === r ? 'var(--primary)' : '#F3F4F6', color: filter === r ? 'white' : 'var(--dark)' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {error && <div style={{ padding: '12px 18px', background: '#FEF3C7', borderRadius: 12, color: '#92400E', fontWeight: 600, marginBottom: 16, fontSize: 13 }}>⚠️ {error}</div>}
      <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['User', 'Role', 'Verification Info', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 22px', color: 'var(--grey)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}>Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center', color: 'var(--grey)' }}>No users found</td></tr>
                : filtered.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.name} size={36} bg={u.role === 'admin' ? '#4361EE' : u.role === 'driver' ? 'var(--primary)' : '#6B7280'} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 13 }}>{u.name || 'Unknown'}</p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--grey)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 22px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', background: u.role === 'admin' ? '#EEF2FF' : u.role === 'driver' ? '#D1FAE5' : '#F3F4F6', color: u.role === 'admin' ? '#4361EE' : u.role === 'driver' ? '#065F46' : '#374151' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 22px', fontSize: 12 }}>
                      {u.role === 'driver' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span><strong>CNIC:</strong> {u.cnicNumber || 'N/A'}</span>
                          <span><strong>License:</strong> {u.licenseNumber || 'N/A'}</span>
                          <span><strong>Coach:</strong> {u.coachModel || 'N/A'}</span>
                        </div>
                      ) : <span style={{ color: 'var(--grey)' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 22px' }}><StatusChip status={u.status || 'active'} /></td>
                    <td style={{ padding: '14px 22px' }}>
                      {u.role === 'driver' && u.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleApprove(u.id)} style={{ padding: '7px 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleReject(u.id)} style={{ padding: '7px 14px', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Reject</button>
                        </div>
                      ) : <span style={{ color: 'var(--grey)', fontSize: 13 }}>—</span>}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

// ─── SETTINGS ──────────────────────────────────────────────────
const SettingsManager = () => {
  const [wiping, setWiping] = useState(false);
  const [msg, setMsg] = useState('');

  const wipeCollection = async (col) => {
    if (!window.confirm(`⚠️ DANGER: Permanently delete ALL ${col} documents?`)) return;
    setWiping(true); setMsg('');
    try {
      const snap = await getDocs(collection(db, col));
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, col, d.id))));
      setMsg(`✅ ${col} wiped successfully.`);
    } catch (err) { setMsg('❌ Failed: ' + err.message); }
    finally { setWiping(false); }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 28, fontWeight: 900 }}>Global Settings</h1>
      <div style={{ background: 'white', borderRadius: 24, padding: 28, marginBottom: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 18px', color: 'var(--primary)' }}>System Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[['VERSION', '1.5.0 Production'], ['ENVIRONMENT', 'Stable – Localhost'], ['DATABASE', 'Firebase Firestore'], ['AUTH', 'Firebase Auth']].map(([l, v]) => (
            <div key={l} style={{ padding: 16, background: '#F9FAFB', borderRadius: 12 }}>
              <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 800, opacity: .6, letterSpacing: 1 }}>{l}</p>
              <p style={{ margin: 0, fontWeight: 700 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      {msg && <div style={{ padding: '14px 20px', background: msg.includes('✅') ? '#D1FAE5' : '#FEE2E2', borderRadius: 14, color: msg.includes('✅') ? '#065F46' : '#991B1B', fontWeight: 600, marginBottom: 18 }}>{msg}</div>}
      <div style={{ padding: 32, border: '2px dashed #FEE2E2', borderRadius: 24, background: '#FFF1F2' }}>
        <h3 style={{ color: '#991B1B', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}><FaExclamationTriangle /> Danger Zone</h3>
        <p style={{ color: '#B91C1C', fontSize: 14, margin: '0 0 22px' }}>Permanently wipe Firestore data. Cannot be undone.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Wipe All Buses', 'buses'], ['Wipe All Bookings', 'bookings'], ['Wipe Driver Apps', 'driverApplications'], ['Wipe User Profiles', 'users']].map(([label, col]) => (
            <button key={col} onClick={() => wipeCollection(col)} disabled={wiping}
              style={{ padding: 16, background: 'white', color: '#EF4444', border: '2px solid #EF4444', borderRadius: 14, fontWeight: 800, fontSize: 13, cursor: wiping ? 'not-allowed' : 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN CONTROLLER ───────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeBuses: 0, totalBookings: 0, totalRevenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingDriverCount, setPendingDriverCount] = useState(0);

  // Real-time pending driver badge
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'driverApplications'), snap => {
      setPendingDriverCount(snap.docs.filter(d => !d.data().status || d.data().status === 'pending').length);
    });
    return () => unsub();
  }, []);

  // Real-time stats & trends
  useEffect(() => {
    const unsubUsers    = onSnapshot(collection(db, 'users'),    snap => setStats(s => ({ ...s, totalUsers:    snap.size })), err => console.error('Stats Users Error:', err));
    const unsubBuses    = onSnapshot(collection(db, 'buses'),    snap => setStats(s => ({ ...s, activeBuses:   snap.size })), err => console.error('Stats Buses Error:', err));
    const unsubBookings = onSnapshot(collection(db, 'bookings'), snap => {
      let revenue = 0;
      const bks = [];
      const dailyCount = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      
      snap.forEach(d => { 
        const data = d.data(); 
        revenue += data.totalPrice || 0; 
        bks.push({ id: d.id, ...data });

        // Calculate daily trends for chart
        if (data.createdAt) {
          try {
            const date = new Date(data.createdAt);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (dailyCount[dayName] !== undefined) dailyCount[dayName]++;
          } catch (e) {}
        }
      });

      const chartData = Object.keys(dailyCount).map(day => ({
        name: day,
        bookings: dailyCount[day]
      }));

      // Re-order to start from Mon
      const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      chartData.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

      setStats(s => ({ 
        ...s, 
        totalBookings: snap.size, 
        totalRevenue: revenue,
        chartData 
      }));
      setRecentBookings(bks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6));
    }, err => console.error('Stats Bookings Error:', err));
    
    return () => { unsubUsers(); unsubBuses(); unsubBookings(); };
  }, []);

  return (
    <Routes>
      <Route index element={<Analytics stats={stats} recentBookings={recentBookings} pendingDriverCount={pendingDriverCount} />} />
      <Route path="buses" element={<BusList />} />
      <Route path="users" element={<SystemUsers />} />
      <Route path="approvals" element={<DriverApprovals />} />
      <Route path="settings" element={<SettingsManager />} />
    </Routes>
  );
};

export default AdminDashboard;
