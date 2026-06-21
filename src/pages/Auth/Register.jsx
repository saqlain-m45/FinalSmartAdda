import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaArrowRight, FaShieldAlt, FaIdCard, FaBus, FaAddressCard, FaCloudUploadAlt } from 'react-icons/fa';

// Asset Imports
import heroBanner from '../../assets/images/banner.png';
import coachSignup from '../../assets/images/coach_signup.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('passenger');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [coachModel, setCoachModel] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, logout } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    try {
      setError('');
      setLoading(true);
      
      const extraDetails = {
        profilePicFile: profilePic,
        ...(role === 'driver' ? {
          licenseNumber,
          cnicNumber,
          coachModel,
        } : {})
      };

      const user = await signup(email, password, name, role, extraDetails);
      
      // The AuthContext will trigger a global state change, but we manually navigate 
      // as a backup to ensure the user isn't stuck on the loading state.
      if (user) {
        if (user.role === 'driver') {
          // Sign out the driver immediately — they must wait for admin approval
          // They should NOT be auto-logged in as a passenger
          await logout();
          navigate('/driver-pending');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message?.includes('auth/email-already-in-use') 
        ? 'This email is already registered. Please login instead.' 
        : 'Failed to create an account. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '20px' }}>
      <div className="card auth-card" style={{ maxWidth: '1100px', width: '100%', padding: 0, borderRadius: '40px', overflow: 'hidden', display: 'flex', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}>
        
        {/* Left Side: Visual Welcome */}
        <div style={{ flex: 0.9, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
           <img src={coachSignup} alt="Register" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(13, 124, 63, 0.95))', padding: '60px', color: 'white' }}>
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'inline-block', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>JOIN THE NETWORK</div>
              <h1 style={{ fontSize: '42px', lineHeight: 1.1, marginBottom: '20px' }}>Travel with <br/> Confidence.</h1>
              <p style={{ opacity: 0.9, fontSize: '18px', lineHeight: 1.6 }}>Create your account today and enjoy the most reliable bus booking system in Pakistan.</p>
              
              <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px', fontWeight: 800, fontSize: '24px' }}>50K+</p>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '11px', fontWeight: 700 }}>USERS</p>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px', fontWeight: 800, fontSize: '24px' }}>120+</p>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '11px', fontWeight: 700 }}>ROUTES</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Register Form */}
        <div style={{ flex: 1.1, padding: '70px', background: 'white' }}>
          <div style={{ textAlign: 'left', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '10px', color: 'var(--dark)' }}>Create Account</h2>
            <p style={{ color: 'var(--grey)', fontSize: '17px' }}>Join Pakistan's most trusted travel network.</p>
          </div>

          {error && <div style={{ color: 'var(--danger)', background: '#FEE2E2', padding: '15px', borderRadius: '15px', marginBottom: '25px', fontSize: '14px', fontWeight: 600 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Bilal Ahmed" 
                      style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>I AM A</label>
                  <div style={{ position: 'relative' }}>
                    <FaUserTag style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                    <select 
                      style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', background: 'white', fontWeight: 600 }} 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="passenger">Passenger</option>
                      <option value="driver">Bus Driver / Captain</option>
                    </select>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>PROFILE PICTURE</label>
              <div style={{ 
                border: '2px dashed #F0F2F5', 
                borderRadius: '16px', 
                padding: '20px', 
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                background: profilePicPreview ? '#F8FAFC' : 'transparent',
                transition: 'all 0.3s ease'
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#F0F2F5'; }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setProfilePic(file);
                  setProfilePicPreview(URL.createObjectURL(file));
                }
              }}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfilePic(file);
                      setProfilePicPreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                {profilePicPreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <img src={profilePicPreview} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'var(--dark)' }}>{profilePic?.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Click to change photo</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--grey)' }}>
                    <FaCloudUploadAlt size={24} />
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Click or Drag to Upload Avatar</p>
                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>JPG, PNG or WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>SECURE PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {role === 'driver' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px' }}>DRIVER VERIFICATION DETAILS</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>LICENSE NUMBER</label>
                    <div style={{ position: 'relative' }}>
                      <FaIdCard style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                      <input 
                        type="text" 
                        placeholder="e.g. PK-123456" 
                        style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>CNIC NUMBER</label>
                    <div style={{ position: 'relative' }}>
                      <FaAddressCard style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                      <input 
                        type="text" 
                        placeholder="35201-XXXXXXX-X" 
                        style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                        value={cnicNumber}
                        onChange={(e) => setCnicNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--grey)' }}>COACH / BUS DETAILS (MODEL & NUMBER)</label>
                  <div style={{ position: 'relative' }}>
                    <FaBus style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Yutong 2023 - LED-1234" 
                      style={{ width: '100%', padding: '16px 18px 16px 50px', borderRadius: '16px', border: '2px solid #F0F2F5', fontWeight: 600 }} 
                      value={coachModel}
                      onChange={(e) => setCoachModel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--grey)', fontStyle: 'italic' }}>* Your details will be manually verified by our administration team before activation.</p>
              </div>
            )}

            <button disabled={loading} type="submit" className="btn-primary" style={{ height: '62px', marginTop: '10px', fontSize: '18px', letterSpacing: '1px' }}>
              {loading ? 'INITIALIZING...' : <>CREATE ACCOUNT <FaArrowRight size={16} /></>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--grey)', marginTop: '5px' }}><FaShieldAlt /> Your data is protected with end-to-end encryption</p>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '16px' }}>
            <span style={{ color: 'var(--grey)' }}>Already have an account?</span>{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
