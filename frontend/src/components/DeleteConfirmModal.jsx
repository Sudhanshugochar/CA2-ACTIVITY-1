import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, patient, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !patient) return null;

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      await onConfirm(patient._id || patient.patientId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#dc2626' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.925rem', color: '#334155', marginBottom: '0.75rem' }}>
            Are you sure you want to permanently remove or discharge this patient record from MongoDB Atlas?
          </p>

          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.85rem',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontWeight: 700, color: '#991b1b' }}>{patient.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '2px' }}>
              Patient ID: <strong>{patient.patientId}</strong> • Department: {patient.department}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.75rem' }}>
            This action will execute a <code>DELETE /api/patients/{patient.patientId}</code> request to Render, deleting the document in MongoDB Atlas.
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting from DB...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
