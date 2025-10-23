import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  return (
    <div style={{ 
      padding: '10px 20px', 
      backgroundColor: '#f8f9fa', 
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: 15 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
          Home
        </button>
        <button onClick={() => navigate('/weather')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
          Weather
        </button>
        {user && (
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
            Dashboard
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: '#495057' }}>
              Welcome, {user.firstname}!
            </span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
              Login
            </button>
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navigation;