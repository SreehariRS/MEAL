import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="page">
      <div className="page-container" style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">My Profile</div>
          </div>
          <div className="form-row">
            <div className="badge"><strong>Name:</strong> {user?.name}</div>
            <div className="badge"><strong>Email:</strong> {user?.email}</div>
            <div className="badge"><strong>Role:</strong> {user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


