import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { Database, UserPlus, Sparkles, ShieldCheck, DatabaseZap } from 'lucide-react';
import './AuthPages.css';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(formData);

      const res = await authAPI.login(formData.email, formData.password);
      localStorage.setItem('token', res.data.access_token);

      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-info-side">
        <div className="auth-brand">
          <Database size={28} color="var(--accent-cyan)" />
          <h2>QuerySense AI</h2>
        </div>

        <div className="auth-content">
          <h1>Launch your governed analytics workspace</h1>
          <p>Create an account to access secure AI query workflows with enterprise-ready controls and role-aware access.</p>

          <div className="auth-trust-bar">
            <span className="auth-trust-chip">Gemini AI</span>
            <span className="auth-trust-chip">Viewer by default</span>
            <span className="auth-trust-chip">Any connected data source</span>
          </div>

          <div className="feature-bullets" style={{ marginTop: '1.5rem' }}>
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><Sparkles size={20} /></div>
              <span>AI-powered query generation</span>
            </div>
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><ShieldCheck size={20} /></div>
              <span>Secure viewer role by default</span>
            </div>
            <div className="feature-bullet">
              <div className="feature-bullet-icon"><DatabaseZap size={20} /></div>
              <span>Connect to enterprise data sources</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Create account</h2>
            <p>Join the query studio</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="input-field"
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="input-field"
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="input-field"
                onChange={handleChange}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={loading}>
              {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Now</>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
