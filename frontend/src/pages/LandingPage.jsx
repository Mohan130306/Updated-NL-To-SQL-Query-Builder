import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, Shield, BarChart3, ChevronRight, Code2 } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
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

      <header className="hero-section">
        <div className="hero-badge">✨ Enterprise AI data intelligence platform</div>
        <h1 className="hero-title">
          Turn business questions into <span className="text-gradient">governed SQL workflows</span>
        </h1>
        <p className="hero-subtitle">
          Power secure, auditable analytics with AI-assisted query generation, role-based controls, and production-ready safeguards for modern teams across finance, healthcare, retail, and beyond.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
            Explore the platform <ChevronRight size={20} />
          </button>
          <button className="btn-secondary btn-large" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
            See platform capabilities
          </button>
        </div>
        <div className="hero-highlights">
          <div className="highlight-item">RBAC and SQL safety validation</div>
          <div className="highlight-item">Gemini-powered SQL generation</div>
          <div className="highlight-item">Audit-ready workspace history</div>
        </div>

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
              <span className="prompt-text">“Show me the top 5 active accounts by revenue this quarter.”</span>
            </div>
            <div className="sql-mock">
              <code>SELECT account_name, revenue FROM analytics_view ORDER BY revenue DESC LIMIT 5;</code>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2 className="section-title">Built for enterprise data teams</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>AI-assisted query execution</h3>
            <p>Translate natural-language requests into SQL with guardrails that fit your operating model and data governance standards.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Role-aware access controls</h3>
            <p>Protect sensitive workflows with permission-based access that is enforced consistently across the workspace.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={24} /></div>
            <h3>Operational analytics</h3>
            <p>Review results and activity in one place so teams can move from question to insight with confidence.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Code2 size={24} /></div>
            <h3>Schema-aware workflows</h3>
            <p>Support complex enterprise data environments with an interface that remains clear, collaborative, and secure.</p>
          </div>
        </div>
      </section>

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
