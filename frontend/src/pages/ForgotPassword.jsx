import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { Database, ShieldCheck, Zap, Key } from 'lucide-react';
import './AuthPages.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Reset Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.requestOTP(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authAPI.resetPassword(email, otpCode, newPassword);
      setSuccess('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Check your OTP.');
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
          <h1>Reset Password</h1>
          <p>Securely regain access to your account using a one-time passcode sent directly to your email.</p>
          
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
            <h2>Recover Account</h2>
            <p>
              {step === 1 && 'Enter your email to receive a recovery code'}
              {step === 2 && 'Enter the 6-digit code and your new password'}
            </p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-error" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', color: '#6ee7b7' }}>{success}</div>}
          
          {step === 1 && (
            <form onSubmit={handleRequestOTP}>
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
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={loading}>
                {loading ? 'Sending Code...' : 'Send Recovery Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label className="input-label">6-Digit Recovery Code</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={otpCode} 
                  onChange={e => setOtpCode(e.target.value)} 
                  placeholder="123456"
                  maxLength={6}
                  required 
                  style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'monospace' }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                  minLength={6}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ fontSize: '0.9rem' }}>
                  Resend Code
                </button>
              </div>
            </form>
          )}
          
          <div className="auth-footer" style={{ marginTop: '30px' }}>
            <p>Remembered your password? <Link to="/login" className="auth-link">Back to Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
