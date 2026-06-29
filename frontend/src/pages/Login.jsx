import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { Database, LogIn, ShieldCheck, Zap, Key } from 'lucide-react';
import './AuthPages.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('token', res.data.access_token);
      
      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Side: Branding & Info */}
      <div className="auth-info-side">
        <div className="auth-brand">
          <Database size={28} color="var(--accent-cyan)" />
          <h2>NL2SQL</h2>
        </div>
        
        <div className="auth-content">
          <h1>Welcome Back</h1>
          <p>Sign in to continue exploring your database with the power of natural language. Safe, secure, and instantaneous.</p>
          
          <div className="feature-bullets">
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><Zap size={20} /></div>
              <span>Instant AI SQL Generation</span>
            </div>
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><ShieldCheck size={20} /></div>
              <span>Role-Based Access Control</span>
            </div>
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><Key size={20} /></div>
              <span>Secure Audited Execution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handlePasswordLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@company.com"
                required 
              />
            </div>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={loading}>
              {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>
          
          <div className="auth-footer" style={{ marginTop: '30px' }}>
            <p>Don't have an account? <Link to="/register" className="auth-link">Register Now</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
