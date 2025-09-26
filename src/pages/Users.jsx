import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: me, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.get('/users', { params: query ? { q: query } : {} });
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  const filteredUsers = useMemo(() => users, [users]);

  return (
    <div className="page">
      <div className="page-container">
        <div className="card">
          <div className="toolbar">
            <div className="card-title">Users</div>
            <div className="toolbar-actions">
              <span className="badge">{me?.email}</span>
              <button className="btn btn-primary" onClick={() => navigate('/users/new')}>Add User</button>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: 12 }}>
            <input
              className="search"
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="muted" style={{ marginTop: 12 }}>Loading…</div>
          ) : (
            <div className="table-wrap" style={{ marginTop: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th align="left">Name</th>
                    <th align="left">Email</th>
                    <th align="left">Role</th>
                    <th align="left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id || u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.role === 'admin' ? 'badge badge-success' : 'badge'}>{u.role}</span>
                      </td>
                      <td>
                        <div className="toolbar-actions">
                          <Link className="link" to={`/users/${u._id || u.id}`}>View</Link>
                          {me?.role === 'admin' && (
                            <Link className="link" to={`/users/${u._id || u.id}/edit`}>Edit</Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


