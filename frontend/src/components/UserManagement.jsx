import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api';
import { Users, ShieldAlert, Check } from 'lucide-react';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await usersAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users. Ensure you have admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRoleName) => {
    setError('');
    setSuccess('');
    try {
      await usersAPI.updateRole(userId, newRoleName);
      setSuccess('User role updated successfully!');
      fetchUsers(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update role');
    }
  };

  const getRoleBadgeClass = (roleId) => {
    if (roleId === 1) return 'badge-danger'; // Admin
    if (roleId === 2) return 'badge-primary'; // Data Engineer
    if (roleId === 3) return 'badge-success'; // Power User
    if (roleId === 4) return 'badge-warning'; // Auditor
    return 'badge-secondary'; // Viewer
  };

  const getRoleName = (roleId) => {
    if (roleId === 1) return 'Admin';
    if (roleId === 2) return 'Data Engineer';
    if (roleId === 3) return 'Power User';
    if (roleId === 4) return 'Auditor';
    return 'Viewer';
  };

  if (loading) return <div className="glass-panel" style={{ padding: '2rem' }}>Loading users...</div>;

  return (
    <div className="user-management glass-panel">
      <div className="um-header">
        <h2><Users size={24} color="var(--accent-primary)" /> User & Access Management</h2>
        <p>Grant developers and analysts permissions across the system.</p>
      </div>

      {error && <div className="qb-error" style={{ margin: '0 2rem' }}><ShieldAlert size={18} /> {error}</div>}
      {success && <div className="qb-error" style={{ margin: '0 2rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}><Check size={18} /> {success}</div>}

      <div className="table-container" style={{ margin: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Grant New Permission</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(u.role_id)}`}>
                    {getRoleName(u.role_id)}
                  </span>
                </td>
                <td>
                  <select 
                    className="role-select" 
                    value={getRoleName(u.role_id).toLowerCase().replace(' ', '_')}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="viewer">Viewer (Default)</option>
                    <option value="auditor">Auditor</option>
                    <option value="power_user">Power User</option>
                    <option value="data_engineer">Data Engineer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
