import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('Registered successfully. You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-container" style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Register</div>
          </div>
          <form onSubmit={onSubmit} className="form">
            <div className="form-field">
              <label>Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
            </div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Registering…' : 'Register'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}


