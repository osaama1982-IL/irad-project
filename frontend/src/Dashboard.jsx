import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout, logoutFromAllDevices } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to home
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutFromAllDevices = async () => {
    if (window.confirm('Are you sure you want to logout from all devices? You will need to login again on all your devices.')) {
      setIsLoggingOut(true);
      try {
        await logoutFromAllDevices();
        navigate('/');
      } catch (error) {
        console.error('Logout from all devices failed:', error);
        navigate('/');
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>Please log in to access the dashboard</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: 20, 
        borderRadius: 8, 
        marginBottom: 20,
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ marginTop: 0, color: '#495057' }}>Welcome, {user.firstname}!</h2>
        <div style={{ marginBottom: 10 }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>City:</strong> {user.city}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Role:</strong> {user.role}
        </div>
        <div>
          <strong>User ID:</strong> {user.userId || user.id}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <button
          onClick={() => navigate('/weather')}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          View Weather
        </button>

        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '12px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Register New User
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: 20, 
        borderRadius: 8,
        border: '1px solid #ffeaa7',
        marginBottom: 20
      }}>
        <h3 style={{ marginTop: 0, color: '#856404' }}>Session Management</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 10
        }}>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '10px 16px',
              backgroundColor: isLoggingOut ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>

          <button
            onClick={handleLogoutFromAllDevices}
            disabled={isLoggingOut}
            style={{
              padding: '10px 16px',
              backgroundColor: isLoggingOut ? '#6c757d' : '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout All Devices'}
          </button>
        </div>

        <div style={{ marginTop: 15, fontSize: 14, color: '#856404' }}>
          <p><strong>Logout:</strong> Ends your session on this device only.</p>
          <p><strong>Logout All Devices:</strong> Ends your session on all devices where you're logged in.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#6c757d', fontSize: 14 }}>
        <p>Session is secure and will automatically expire in 24 hours.</p>
      </div>
    </div>
  );
}

export default Dashboard;