import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast, { Toaster } from 'react-hot-toast';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: me } = useAuth();

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/users/${id}`);
      setUser(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const onDelete = () => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this user?</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await api.delete(`/users/${id}`);
                  toast.dismiss(t.id);
                  toast.success('User deleted successfully');
                  navigate('/users');
                } catch (error) {
                  toast.error('Failed to delete user');
                }
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          minWidth: '300px',
        },
      }
    );
  };

  if (loading) return <div className="page"><div className="page-container"><div className="card"><div className="muted">Loading…</div></div></div></div>;
  if (!user) return <div className="page"><div className="page-container"><div className="card"><div className="muted">Not found</div></div></div></div>;

  return (
    <div className="page">
      <Toaster />
      <div className="page-container" style={{ maxWidth: 720 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">User Details</div>
            <div className="toolbar-actions">
              <Link className="btn btn-secondary" to="/users">Back</Link>
              <Link className="btn btn-primary" to={`/users/${id}/edit`}>Edit</Link>
              {me?.role === 'admin' && (
                <button className="btn btn-danger" onClick={onDelete}>Delete</button>
              )}
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 4 }}>
            <div className="form-field">
              <label>Name</label>
              <div className="input" style={{ borderStyle: 'dashed' }}>{user.name}</div>
            </div>
            <div className="form-field">
              <label>Email</label>
              <div className="input" style={{ borderStyle: 'dashed' }}>{user.email}</div>
            </div>
            <div className="form-field">
              <label>Role</label>
              <span className={user.role === 'admin' ? 'badge badge-success' : 'badge'}>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}