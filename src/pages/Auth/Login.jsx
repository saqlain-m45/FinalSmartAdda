import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaEnvelope, FaLock, FaArrowRight, FaUserShield, FaSignOutAlt } from 'react-icons/fa';

// Asset Imports
import terminalImg from '../../assets/images/terminal.png';
import coachLogin from '../../assets/images/coach_login.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, currentUser, logout, userData } = useAuth();
  const navigate = useNavigate();

  // Automatic redirect if already logged in (WOW factor: no manual clicking)
  React.useEffect(() => {
    if (currentUser && userData) {
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'driver') navigate('/driver');
      else navigate('/');
    }
  }, [currentUser, userData, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      // Hard redirect if admin email is used to prevent any race conditions with Firestore
      if (email === 'admin@gmail.com' || user?.role === 'admin') {
        window.location.href = '/admin';
      } else if (user?.role === 'driver') {
        navigate('/driver');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login detail error:", err);
      // Map common Firebase errors to user-friendly messages
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please register first.');
      } else {
        setError(err.message || 'Failed to login. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function initializeAdmin() {
    try {
      setError('');
      setLoading(true);

      // 1. Try to Login First (Most common case after initialization)
      try {
        const user = await login('admin@gmail.com', 'admin123');
        if (user?.role === 'admin') {
          navigate('/admin');
          return;
        }
        
        // If logged in but role is wrong, fix it
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
          alert("Account role repaired! Redirecting to Admin Panel...");
          window.location.href = '/admin';
          return;
        }
      } catch (loginErr) {
        console.log("Quick login failed, attempting signup initialization...", loginErr.message);
      }

      // 2. Try to Signup (If account doesn't exist)
      try {
        await signup('admin@gmail.com', 'admin123', 'System Admin', 'admin');
        alert("Admin account created and initialized!");
        navigate('/admin');
      } catch (signupErr) {
        if (signupErr.code === 'auth/email-already-in-use') {
           setError('Account exists with a different password. Use the correct password or reset it.');
        } else {
           setError('Initialization failed: ' + signupErr.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', gap: '20px' }}>
         <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
         <p style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>RESTORING YOUR SESSION...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '20px' }}>
      <div className="card auth-card" style={{ maxWidth: '1000px', width: '100%', padding: 0, borderRadius: '32px', overflow: 'hidden', display: 'flex', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
        
        {/* Left Side: Visual Experience */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
           <img src={coachLogin} alt="Log In" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(13, 124, 63, 0.95))', padding: '40px', color: 'white' }}>
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Your journey starts here.</h2>
              <p style={{ opacity: 0.9, lineHeight: '1.6' }}>Access Pakistan's largest bus booking network and travel with comfort, safety, and real-time tracking.</p>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={{ flex: 1, padding: '60px', background: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--grey)' }}>Log in to access your account.</p>
          </div>

          {error && <div style={{ color: 'var(--danger)', background: '#FEE2E2', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--grey)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '1px solid #E0E0E0' }} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--grey)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: '1px solid #E0E0E0' }} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button disabled={loading} type="submit" className="btn-primary" style={{ height: '52px', marginTop: '10px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {loading ? 'Logging in...' : <>Log In <FaArrowRight /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px' }}>
            <span style={{ color: 'var(--grey)' }}>Don't have an account?</span>{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
          </div>

          {/* Quick Admin Access */}
          <div style={{ marginTop: '40px', padding: '20px', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
             <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 800, color: 'var(--grey)', letterSpacing: '1px' }}>SYSTEM ACCESS</p>
             <button 
                onClick={initializeAdmin}
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'var(--dark)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <FaUserShield /> INITIALIZE & LOGIN AS ADMIN
             </button>
             <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--grey)' }}>Login: admin@gmail.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
