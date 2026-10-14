import React from 'react';
import { Layers, X, Globe, Server, Database, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Layers size={22} color="#0d9488" />
            <span>Three-Tier Cloud Architecture Specification</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh' }}>
          {/* Architecture Visual */}
          <div
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              ARCHITECTURE TOPOLOGY & DATA FLOW
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'stretch',
              }}
            >
              {/* Tier 1 */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
                  <Globe size={18} />
                  <span>TIER 1: FRONTEND</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>Netlify</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  • React (Vite) UI<br />
                  • Static CDN Edge Hosting<br />
                  • HTTPS / Client-side Validation<br />
                  • Zero DB Credentials
                </div>
              </div>

              {/* Tier 2 */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontWeight: 700 }}>
                  <Server size={18} />
                  <span>TIER 2: BACKEND</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>Render</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  • Node.js & Express REST API<br />
                  • Web Service on Linux<br />
                  • CORS & Input Sanitization<br />
                  • Secure Mongoose Bridge
                </div>
              </div>

              {/* Tier 3 */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700 }}>
                  <Database size={18} />
                  <span>TIER 3: DATABASE</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>MongoDB Atlas</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  • Fully Managed Cloud Cluster<br />
                  • Database: <code>hospitalDB</code><br />
                  • Collection: <code>patients</code><br />
                  • Encrypted TLS Connection
                </div>
              </div>
            </div>
          </div>

          {/* CRUD REST API Endpoints Specification */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              REST API Endpoints Specification
            </h3>
            <table className="patients-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                  <th>Layer Target</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#16a34a' }}>POST</span></td>
                  <td><code>/api/patients</code></td>
                  <td>Create / Register a new patient document</td>
                  <td>Render &rarr; MongoDB Atlas</td>
                </tr>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#0284c7' }}>GET</span></td>
                  <td><code>/api/patients</code></td>
                  <td>Retrieve all patient records with filters</td>
                  <td>Render &larr; MongoDB Atlas</td>
                </tr>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#0284c7' }}>GET</span></td>
                  <td><code>/api/patients/:id</code></td>
                  <td>Find a single patient by ID or _id</td>
                  <td>Render &larr; MongoDB Atlas</td>
                </tr>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#d97706' }}>PUT</span></td>
                  <td><code>/api/patients/:id</code></td>
                  <td>Update patient details (e.g. status, ward)</td>
                  <td>Render &rarr; MongoDB Atlas</td>
                </tr>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#dc2626' }}>DELETE</span></td>
                  <td><code>/api/patients/:id</code></td>
                  <td>Remove / discharge patient record</td>
                  <td>Render &rarr; MongoDB Atlas</td>
                </tr>
                <tr>
                  <td><span style={{ fontWeight: 700, color: '#6366f1' }}>GET</span></td>
                  <td><code>/api/health</code></td>
                  <td>Backend service & MongoDB ping health status</td>
                  <td>Render Monitoring</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Security & Deployment Principles */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Security & Isolation Principles Applied
            </h3>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 }}>
              <li>
                <strong>Zero Database Exposure in Frontend:</strong> Netlify only hosts HTML/CSS/JS and never stores the MongoDB Atlas connection URI or database credentials.
              </li>
              <li>
                <strong>Encrypted Environment Variables:</strong> The database URI is stored as <code>MONGODB_URI</code> exclusively inside Render's protected environment settings.
              </li>
              <li>
                <strong>CORS Whitelisting:</strong> The Render backend restricts cross-origin HTTP requests strictly to authorized Netlify URLs.
              </li>
              <li>
                <strong>Input Validation:</strong> All patient data is validated both client-side in React and server-side in Mongoose before writing to MongoDB Atlas.
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
}
