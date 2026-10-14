import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, X, Save, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Emergency Care',
  'Oncology',
  'Dermatology',
  'Pulmonology',
];

export default function PatientFormModal({ isOpen, onClose, onSave, patientToEdit }) {
  const isEditMode = Boolean(patientToEdit);

  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    email: '',
    department: 'Cardiology',
    doctorAssigned: '',
    roomNumber: 'General Ward',
    status: 'Admitted',
    diagnosis: '',
    admissionDate: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        patientId: patientToEdit.patientId || '',
        name: patientToEdit.name || '',
        age: patientToEdit.age ?? '',
        gender: patientToEdit.gender || 'Male',
        contact: patientToEdit.contact || '',
        email: patientToEdit.email || '',
        department: patientToEdit.department || 'Cardiology',
        doctorAssigned: patientToEdit.doctorAssigned || '',
        roomNumber: patientToEdit.roomNumber || 'General Ward',
        status: patientToEdit.status || 'Admitted',
        diagnosis: patientToEdit.diagnosis || '',
        admissionDate: patientToEdit.admissionDate
          ? new Date(patientToEdit.admissionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        patientId: `P-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        email: '',
        department: 'Cardiology',
        doctorAssigned: '',
        roomNumber: 'General Ward',
        status: 'Admitted',
        diagnosis: '',
        admissionDate: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.patientId.trim()) {
      return setError('Patient ID is mandatory (e.g. P-101).');
    }
    if (!formData.name.trim()) {
      return setError('Patient full name is mandatory.');
    }
    if (formData.age === '' || formData.age < 0 || formData.age > 130) {
      return setError('Please enter a valid age between 0 and 130.');
    }
    if (!formData.contact.trim()) {
      return setError('Contact telephone number is mandatory.');
    }
    if (!formData.department.trim()) {
      return setError('Department selection is mandatory.');
    }
    if (!formData.doctorAssigned.trim()) {
      return setError('Assigned doctor name is mandatory.');
    }

    try {
      setSubmitting(true);
      await onSave(formData, patientToEdit?._id || patientToEdit?.patientId);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save patient record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEditMode ? <Edit3 size={20} color="#0d9488" /> : <UserPlus size={20} color="#0d9488" />}
            <span>{isEditMode ? 'Update Patient Record' : 'Register New Patient'}</span>
          </div>
          <button className="btn-icon" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Patient ID */}
              <div className="form-group">
                <label className="form-label">
                  Patient ID <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="patientId"
                  className="form-input"
                  placeholder="e.g. P-101"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Patient Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Age */}
              <div className="form-group">
                <label className="form-label">
                  Age <span className="req">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder="e.g. 35"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="130"
                  required
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">
                  Gender <span className="req">*</span>
                </label>
                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact */}
              <div className="form-group">
                <label className="form-label">
                  Contact Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Specialty Department <span className="req">*</span>
                </label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Assigned */}
              <div className="form-group">
                <label className="form-label">
                  Assigned Doctor <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="doctorAssigned"
                  className="form-input"
                  placeholder="e.g. Dr. Priya Mehta"
                  value={formData.doctorAssigned}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Room / Ward */}
              <div className="form-group">
                <label className="form-label">Room / Ward</label>
                <input
                  type="text"
                  name="roomNumber"
                  className="form-input"
                  placeholder="e.g. ICU-02 or Ward 3"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">
                  Admission Status <span className="req">*</span>
                </label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              {/* Admission Date */}
              <div className="form-group col-span-2">
                <label className="form-label">Admission / Checkup Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  className="form-input"
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>

              {/* Diagnosis / Notes */}
              <div className="form-group col-span-2">
                <label className="form-label">Preliminary Diagnosis & Clinical Notes</label>
                <textarea
                  name="diagnosis"
                  className="form-textarea"
                  placeholder="Enter medical symptoms, preliminary diagnosis, or clinical notes..."
                  value={formData.diagnosis}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} />
              <span>{submitting ? 'Saving to MongoDB...' : isEditMode ? 'Update Record' : 'Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
