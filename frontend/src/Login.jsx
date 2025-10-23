import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        navigate('/weather');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Login</h2>
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: 10, marginBottom: 10, borderRadius: 4 }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email">Email:</label><br />
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ width: "100%", padding: 8, fontSize: 14 }}
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password">Password:</label><br />
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ width: "100%", padding: 8, fontSize: 14 }}
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: 10, 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: 15, textAlign: 'center' }}>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;
