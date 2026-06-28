import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, Shield, BarChart3, ChevronRight, Code2 } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <Database size={28} className="text-accent" />
          <span className="logo-text">QuerySense AI</span>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">✨ Powered by Google Gemini AI</div>
        <h1 className="hero-title">
          Talk to your database in <span className="text-gradient">plain English</span>
        </h1>
        <p className="hero-subtitle">
          Instantly translate natural language into complex, optimized SQL queries. No SQL expertise required. Build dashboards, export data, and get insights faster than ever.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
            Start Generating Free <ChevronRight size={20} />
          </button>
          <button className="btn-secondary btn-large" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
            See How It Works
          </button>
        </div>
        
        {/* Mock UI Preview */}
        <div className="hero-preview-window">
          <div className="window-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="window-title">QuerySense Workspace</div>
          </div>
          <div className="window-body">
            <div className="prompt-mock">
              <span className="prompt-text">"Show me the top 5 students with the highest GPA"</span>
            </div>
            <div className="sql-mock">
              <code>SELECT first_name, last_name, gpa FROM students ORDER BY gpa DESC LIMIT 5;</code>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Everything you need to analyze data</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Lightning Fast AI</h3>
            <p>Our fine-tuned Gemini integration generates accurate SQL in milliseconds based on your database schema.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Role-Based Access</h3>
            <p>Enterprise-grade security. Restrict query execution based on user roles (Admin, Developer, Analyst).</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={24} /></div>
            <h3>Instant Visualizations</h3>
            <p>Don't just see the SQL. Execute it securely and instantly visualize the results in beautiful charts.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Code2 size={24} /></div>
            <h3>Schema Aware</h3>
            <p>QuerySense learns your exact database schema to ensure queries are accurate and error-free.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Database size={24} className="text-accent" />
            <span>QuerySense AI</span>
          </div>
          <p className="footer-text">© {new Date().getFullYear()} QuerySense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
