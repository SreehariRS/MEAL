import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const current = await login(email, password);
      if (current.role === 'admin') {
        navigate('/users');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="page">
      <div className="page-container" style={{ maxWidth: 480 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Login</div>
          </div>
          <form onSubmit={onSubmit} className="form">
            <div className="form-field">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? 'Signing in…' : 'Login'}
            </button>
            
            {/* Register button */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleRegisterRedirect}
                style={{ width: '100%' }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}