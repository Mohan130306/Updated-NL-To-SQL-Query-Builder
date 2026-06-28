import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LogOut, Database, User as UserIcon, TerminalSquare, ShieldAlert, Users, History } from 'lucide-react';
import QueryBuilder from '../components/QueryBuilder';
import HistorySidebar from '../components/HistorySidebar';
import UserManagement from '../components/UserManagement';

import './Dashboard.css';

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('query');

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
          <div 
            className={`nav-item ${activeTab === 'query' ? 'active' : ''}`}
            onClick={() => setActiveTab('query')}
          >
            <TerminalSquare size={18} />
            <span>Query Builder</span>
          </div>
          {(user.role_id === 1 || user.role_id === 4) && (
            <div 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={18} />
              <span>Global History</span>
            </div>
          )}
          {user.role_id === 1 && (
            <div 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>User Management</span>
            </div>
          )}
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
          <h1 className="text-gradient">Database Explorer</h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'query' ? (
            <>
              <div className="query-section">
                <QueryBuilder user={user} />
              </div>
              <div className="history-section">
                <HistorySidebar />
              </div>
            </>
          ) : activeTab === 'history' ? (
            <div style={{ flex: 1, padding: '2rem' }}>
              <HistorySidebar fullWidth={true} />
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <UserManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
