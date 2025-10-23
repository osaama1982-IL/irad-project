import './App.css'
import Login from './Login';
import Weather from './weather';
import Register from './register';
import Dashboard from './Dashboard';
import Navigation from './Navigation';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <img src="/vite.svg" alt="Weather Logo" className="logo" />
              <h1>Welcome to Weather Status</h1>
              <p>Get real-time weather updates and manage your account easily.</p>
              <div style={{ margin: '20px 0' }}>
                <Link to="/weather" style={{ marginRight: 20, color: '#007bff', textDecoration: 'none' }}>View Weather</Link>
                <Link to="/register" style={{ marginRight: 20, color: '#007bff', textDecoration: 'none' }}>Register</Link>
                <Link to="/login" style={{ marginRight: 20, color: '#007bff', textDecoration: 'none' }}>Login</Link>
                <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>Dashboard</Link>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
