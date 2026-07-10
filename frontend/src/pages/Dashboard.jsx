import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LogOut, Database, User as UserIcon, TerminalSquare, ShieldAlert, Users, History, LayoutDashboard, FileClock, KeyRound, Settings } from 'lucide-react';
import QueryBuilder from '../components/QueryBuilder';
import HistorySidebar from '../components/HistorySidebar';
import UserManagement from '../components/UserManagement';
import SchemaReference from '../components/SchemaReference';
import EnterpriseViews from '../components/EnterpriseViews';

import './Dashboard.css';

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [rightPanel, setRightPanel] = useState('history'); // 'history' or 'schema'

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const getRoleName = () => {
    if (user.role_id === 1) return 'Admin';
    if (user.role_id === 2) return 'Data Engineer';
    if (user.role_id === 3) return 'Power User';
    if (user.role_id === 4) return 'Auditor';
    return 'Viewer';
  };

  const pageTitles = { overview: 'Overview', query: 'AI Query Studio', explorer: 'Data Explorer', history: 'Query History', audit: 'Audit & Governance', users: 'User Management', access: 'Access Control', profile: 'Profile & Security' };

  const getRoleColor = () => {
    if (user.role_id === 1) return 'var(--danger)';
    if (user.role_id === 2) return 'var(--accent-primary)';
    if (user.role_id === 3) return 'var(--success)';
    if (user.role_id === 4) return 'var(--warning)';
    return 'var(--text-secondary)';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-brand">
          <Database size={24} color="var(--accent-primary)" />
          <h2>NL2SQL</h2>
        </div>
        
        <div className="user-profile">
          <div className="avatar flex-center">
            <UserIcon size={20} />
          </div>
          <div className="user-info">
            <h4>{user.first_name} {user.last_name}</h4>
            <span className="role-badge" style={{ borderColor: getRoleColor(), color: getRoleColor() }}>
              <ShieldAlert size={12} /> {getRoleName()}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">WORKSPACE</p>
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /><span>Overview</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'query' ? 'active' : ''}`}
            onClick={() => setActiveTab('query')}
          >
            <TerminalSquare size={18} />
            <span>AI Query Studio</span>
          </div>
          <div className={`nav-item ${activeTab === 'explorer' ? 'active' : ''}`} onClick={() => setActiveTab('explorer')}>
            <Database size={18} /><span>Data Explorer</span>
          </div>
          <p className="nav-section-label">GOVERNANCE</p>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <History size={18} /><span>Query History</span>
          </div>
          {(user.role_id === 1 || user.role_id === 4) && (
            <div 
              className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <FileClock size={18} />
              <span>Audit Logs</span>
            </div>
          )}
          <p className="nav-section-label">ADMINISTRATION</p>
          {user.role_id === 1 && (
            <div 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>User Management</span>
            </div>
          )}
          <div className={`nav-item ${activeTab === 'access' ? 'active' : ''}`} onClick={() => setActiveTab('access')}>
            <KeyRound size={18} /><span>Access Control</span>
          </div>
          <p className="nav-section-label">ACCOUNT</p>
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <Settings size={18} /><span>Profile & Security</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <p className="eyebrow">Secure data workspace</p>
          <h1 className="text-gradient">{pageTitles[activeTab]}</h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'overview' ? <EnterpriseViews type="overview" user={user} onOpenStudio={() => setActiveTab('query')} /> : activeTab === 'query' ? (
            <>
              <div className="query-section">
                <QueryBuilder user={user} />
              </div>
              <div className="history-section">
                {rightPanel === 'history' ? (
                  <HistorySidebar onToggleSchema={() => setRightPanel('schema')} />
                ) : (
                  <SchemaReference onToggleHistory={() => setRightPanel('history')} />
                )}
              </div>
            </>
          ) : activeTab === 'explorer' ? <EnterpriseViews type="explorer" /> : activeTab === 'history' ? (
            <div style={{ flex: 1, padding: '2rem' }}>
              <HistorySidebar fullWidth={true} />
            </div>
          ) : activeTab === 'audit' ? <EnterpriseViews type="audit" /> : activeTab === 'access' ? <EnterpriseViews type="access" /> : activeTab === 'profile' ? <EnterpriseViews type="profile" user={user} role={getRoleName()} /> : (
            <div style={{ flex: 1 }}>
              <UserManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
