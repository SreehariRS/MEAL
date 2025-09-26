import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isEdit) return;
      const { data } = await api.get(`/users/${id}`);
      setForm({ name: data.name, email: data.email, role: data.role, password: '' });
    }
    load();
  }, [id, isEdit]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${id}`, payload);
      } else {
        await api.post('/users', form);
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-container" style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">{isEdit ? 'Edit User' : 'Add User'}</div>
          </div>
          <form onSubmit={onSubmit} className="form">
            <div className="form-field">
              <label>Name</label>
              <input className="input" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input className="input" name="email" value={form.email} onChange={onChange} type="email" required />
            </div>
            <div className="form-field">
              <label>Role</label>
              <select className="select" name="role" value={form.role} onChange={onChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-field">
              <label>Password {isEdit && <span className="muted">(leave blank to keep)</span>}</label>
              <input className="input" name="password" value={form.password} onChange={onChange} type="password" placeholder={isEdit ? 'Leave blank to keep' : ''} />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Saving…' : 'Save'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}


