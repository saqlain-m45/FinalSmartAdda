import { FaClock, FaShieldAlt, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const PendingApproval = () => {
  const { logout } = useAuth();
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh', 
      textAlign: 'center',
      padding: '40px'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        background: '#FEF3C7',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#D97706',
        fontSize: '50px',
        marginBottom: '30px',
        animation: 'pulse 2s infinite'
      }}>
        <FaClock />
      </div>
      
      <h2 style={{ fontSize: '32px', color: 'var(--dark)', marginBottom: '15px' }}>Registration Under Review</h2>
      <p style={{ maxWidth: '600px', color: 'var(--grey)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
        Thank you for joining <strong>Smart Adda</strong> as a Driver. Your documents (CNIC, License, and Coach details) have been submitted and are currently being verified by our administration team.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '500px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <FaShieldAlt style={{ color: 'var(--primary)', fontSize: '24px' }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '14px' }}>Security Check</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>Verifying credentials</p>
          </div>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <FaPhoneAlt style={{ color: 'var(--primary)', fontSize: '24px' }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '14px' }}>Support</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--grey)' }}>+92 300 1234567</p>
          </div>
        </div>
      </div>
      
      <p style={{ marginTop: '50px', fontSize: '14px', color: 'var(--grey)' }}>
        Most accounts are verified within 24-48 hours. You will gain access to your dashboard once approved.
      </p>

      <button
        onClick={() => logout()}
        style={{
          marginTop: '30px',
          background: '#FEE2E2', color: '#EF4444', border: 'none',
          padding: '12px 30px', borderRadius: '15px', fontWeight: 800,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PendingApproval;
