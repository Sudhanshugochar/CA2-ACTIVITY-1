import React from 'react';
import { FileText, X, Edit, Trash2, Calendar, Phone, Mail, Stethoscope, User, MapPin } from 'lucide-react';

export default function PatientDetailsModal({ patient, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !patient) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={20} color="#0284c7" />
            <span>Patient Medical Record</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="patient-id-badge" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                {patient.patientId}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{patient.name}</h2>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                {patient.gender} • {patient.age} years old
              </div>
            </div>

            <span className={`status-pill ${patient.status?.toLowerCase() || 'admitted'}`}>
              <span className="status-dot"></span>
              <span>{patient.status}</span>
            </span>
          </div>

          {/* Details Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stethoscope size={15} color="#0d9488" />
                {patient.department}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Attending Physician</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="#0284c7" />
                {patient.doctorAssigned}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Ward / Bed Allocation</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#6366f1" />
                {patient.roomNumber || 'General Ward'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Admission Date</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#64748b" />
                {formatDate(patient.admissionDate)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Contact Telephone</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="#64748b" />
                {patient.contact}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="#64748b" />
                {patient.email || 'Not provided'}
              </span>
            </div>
          </div>

          {/* Diagnosis section */}
          <div style={{ marginTop: '1.25rem' }}>
            <span className="detail-label">Diagnosis & Clinical Observation</span>
            <div
              style={{
                background: '#fafafa',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.9rem',
                color: '#334155',
                marginTop: '0.25rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {patient.diagnosis || 'No clinical notes recorded.'}
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
            }}
          >
            MongoDB _id: {patient._id} | Last Updated: {formatDate(patient.updatedAt)}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onEdit(patient);
            }}
          >
            <Edit size={15} />
            <span>Edit Record</span>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onClose();
              onDelete(patient);
            }}
          >
            <Trash2 size={15} />
            <span>Discharge / Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
