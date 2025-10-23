import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    city: '',
    role: 'user'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful');
        navigate('/login');
        return;
      }
      alert(data.error || 'Registration failed');
    } catch {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>First name</label><br />
        <input id="firstname" value={form.firstname} onChange={handleChange} required />
        <br />
        <label>Last name</label><br />
        <input id="lastname" value={form.lastname} onChange={handleChange} required />
        <br />
        <label>Email</label><br />
        <input id="email" type="email" value={form.email} onChange={handleChange} required />
        <br />
        <label>Password</label><br />
        <input id="password" type="password" value={form.password} onChange={handleChange} required />
        <br />
        <label>City</label><br />
        <input id="city" value={form.city} onChange={handleChange} required />
        <br />
        <label>Role</label><br />
        <select id="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
