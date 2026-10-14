import React, { useState } from 'react';
import { Activity, Server, Database, Globe, Layers, CheckCircle2, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { apiService } from '../services/api';

export default function Navbar({ backendStatus, onRefresh, onOpenArchitecture }) {
  const [showConfig, setShowConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState(apiService.getBaseUrl());

  const handleSaveBackendUrl = (e) => {
    e.preventDefault();
    apiService.setCustomBackendUrl(tempUrl.trim());
    setShowConfig(false);
    onRefresh();
  };

  const handleResetBackendUrl = () => {
    apiService.setCustomBackendUrl('');
    setTempUrl(apiService.getBaseUrl());
    setShowConfig(false);
    onRefresh();
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand */}
          <div className="brand-section">
            <div className="brand-logo-icon">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="brand-title">MediPulse Hospital</div>
              <div className="brand-subtitle">Patient Information Management System</div>
            </div>
          </div>

          {/* Architecture Badges */}
          <div className="architecture-badges">
            <span className="tier-badge netlify" title="Tier 1: Presentation Layer">
              <Globe size={13} />
              <span>Netlify: Frontend</span>
            </span>
            <span className="tier-badge render" title="Tier 2: Application / API Layer">
              <Server size={13} />
              <span>Render: Backend API</span>
            </span>
            <span className="tier-badge mongo" title="Tier 3: Database Layer">
              <Database size={13} />
              <span>MongoDB Atlas: DB</span>
            </span>
          </div>

          {/* Actions & Health Status */}
          <div className="nav-actions">
            <button
              className={`api-badge ${
                backendStatus.status === 'Connected'
                  ? 'online'
                  : backendStatus.status === 'Connecting'
                  ? 'connecting'
                  : 'offline'
              }`}
              onClick={() => setShowConfig(true)}
              title="Click to check or configure Render backend URL"
            >
              {backendStatus.status === 'Connected' ? (
                <CheckCircle2 size={13} />
              ) : (
                <AlertCircle size={13} />
              )}
              <span>API: {backendStatus.status}</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenArchitecture}
              title="View Three-Tier Cloud Architecture Breakdown"
            >
              <Layers size={14} />
              <span>Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cloud Architecture Flow Ribbon */}
      <div className="arch-banner">
        <span>End-to-End Flow:</span>
        <div className="arch-step">
          <Globe size={13} color="#38bdf8" />
          <span>User Browser / Netlify</span>
        </div>
        <span className="arch-arrow">&rarr; HTTPS REST &rarr;</span>
        <div className="arch-step">
          <Server size={13} color="#f472b6" />
          <span>Render Express API</span>
        </div>
        <span className="arch-arrow">&rarr; Mongoose / TLS &rarr;</span>
        <div className="arch-step">
          <Database size={13} color="#4ade80" />
          <span>MongoDB Atlas (hospitalDB)</span>
        </div>
      </div>

      {/* Backend URL Config Modal */}
      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <Settings size={18} />
                <span>Backend Connection Settings</span>
              </div>
              <button className="btn-icon" onClick={() => setShowConfig(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveBackendUrl}>
              <div className="modal-body">
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                  Connect your deployed Netlify frontend to your live Render backend API URL.
                </p>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Active Backend API Endpoint</label>
                  <input
                    type="url"
                    className="form-input"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://hospital-api.onrender.com/api"
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Default local: <code>http://localhost:5000/api</code> | Render example: <code>https://your-service.onrender.com/api</code>
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Current Connectivity:</div>
                  <div style={{ color: backendStatus.status === 'Connected' ? '#166534' : '#991b1b', marginTop: '2px' }}>
                    {backendStatus.message || 'Ready'}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleResetBackendUrl}>
                  Reset to Default
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Reconnect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
