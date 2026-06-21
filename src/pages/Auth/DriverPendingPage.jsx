import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaShieldAlt, FaPhoneAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const DriverPendingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '620px',
        width: '100%',
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-out',
      }}>
        {/* Icon */}
        <div style={{
          width: '120px', height: '120px',
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 30px',
          boxShadow: '0 20px 40px rgba(217,119,6,0.2)',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          <FaClock size={50} color="#D97706" />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '36px', color: 'var(--dark)', marginBottom: '15px', fontWeight: 900 }}>
          Application Submitted! 🎉
        </h1>
        <p style={{ color: 'var(--grey)', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
          Thank you for joining <strong>Smart Adda</strong> as a Driver Captain. Your documents have been submitted and are currently under review by our administration team.
        </p>

        {/* Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '22px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '44px', height: '44px', background: '#D1FAE5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCheckCircle color="#10B981" size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--dark)' }}>Documents Saved</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>License & CNIC recorded</p>
            </div>
          </div>
          <div style={{ padding: '22px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '44px', height: '44px', background: '#FEF3C7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaClock color="#D97706" size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--dark)' }}>Pending Review</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>24-48 hour turnaround</p>
            </div>
          </div>
          <div style={{ padding: '22px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaShieldAlt color="#3B82F6" size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--dark)' }}>Security Check</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>Verifying credentials</p>
            </div>
          </div>
          <div style={{ padding: '22px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #f0f0f0' }}>
            <div style={{ width: '44px', height: '44px', background: '#F0FDF4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaPhoneAlt color="#22C55E" size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--dark)' }}>Support</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>+92 300 1234567</p>
            </div>
          </div>
        </div>

        {/* Info note */}
        <p style={{ fontSize: '14px', color: 'var(--grey)', marginBottom: '30px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          ✅ Your account has been created. Once our admin approves your application, you'll be able to <strong>log in</strong> and access your Driver Dashboard.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/login')}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 36px', fontSize: '16px' }}
        >
          Go to Login <FaArrowRight />
        </button>

        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        `}</style>
      </div>
    </div>
  );
};

export default DriverPendingPage;
