import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Users,
  AlertCircle,
  Activity,
  HeartPulse,
  Database,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import PatientFormModal from './components/PatientFormModal';
import PatientDetailsModal from './components/PatientDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ArchitectureModal from './components/ArchitectureModal';
import NotificationToast from './components/NotificationToast';
import { apiService } from './services/api';

const DEPARTMENTS = [
  'All',
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

export default function App() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({
    status: 'Connecting',
    message: 'Testing API connectivity...',
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const [isArchOpen, setIsArchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check Backend & MongoDB Atlas Health
  const checkHealth = useCallback(async () => {
    try {
      const res = await apiService.checkHealth();
      if (res.status === 'OK') {
        setBackendStatus({
          status: 'Connected',
          message: `Connected to Render API & MongoDB Atlas (${res.database?.name || 'hospitalDB'})`,
        });
      } else {
        setBackendStatus({
          status: 'Connecting',
          message: `Backend running, MongoDB state: ${res.database?.status}`,
        });
      }
    } catch (err) {
      setBackendStatus({
        status: 'Offline',
        message: err.message || 'Cannot reach Render backend API. Ensure server is started.',
      });
    }
  }, []);

  // Fetch Patients List
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getPatients({
        search: searchTerm,
        department: selectedDept,
        status: selectedStatus,
      });

      if (res.success) {
        setPatients(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      addToast(err.message || 'Failed to retrieve patients from backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDept, selectedStatus]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await apiService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not load stats:', err);
    }
  }, []);

  // Combined refresh
  const handleFullRefresh = () => {
    checkHealth();
    fetchPatients();
    fetchStats();
  };

  useEffect(() => {
    checkHealth();
    fetchPatients();
    fetchStats();
  }, [checkHealth, fetchPatients, fetchStats]);

  // Handlers for CRUD
  const handleSavePatient = async (formData, id) => {
    if (id) {
      // Update (PUT)
      const res = await apiService.updatePatient(id, formData);
      addToast(res.message || 'Patient updated successfully!', 'success');
    } else {
      // Create (POST)
      const res = await apiService.createPatient(formData);
      addToast(res.message || 'Patient registered successfully in MongoDB Atlas!', 'success');
    }
    fetchPatients();
    fetchStats();
  };

  const handleDeletePatient = async (id) => {
    const res = await apiService.deletePatient(id);
    addToast(res.message || 'Patient record removed successfully.', 'success');
    fetchPatients();
    fetchStats();
  };

  // Seed sample data for quick demonstration
  const handleSeedSampleData = async () => {
    const samplePatients = [
      {
        patientId: 'P-101',
        name: 'Rahul Sharma',
        age: 34,
        gender: 'Male',
        contact: '9876543210',
        email: 'rahul.sharma@example.com',
        department: 'Cardiology',
        doctorAssigned: 'Dr. Priya Mehta',
        roomNumber: 'ICU-04',
        status: 'Admitted',
        diagnosis: 'Acute Myocardial Infarction - Stable observation',
      },
      {
        patientId: 'P-102',
        name: 'Ananya Verma',
        age: 28,
        gender: 'Female',
        contact: '9811223344',
        email: 'ananya.v@example.com',
        department: 'Neurology',
        doctorAssigned: 'Dr. Rajesh Nair',
        roomNumber: 'Ward 3B',
        status: 'Admitted',
        diagnosis: 'Persistent Migraine with Aura and Visual Disturbance',
      },
      {
        patientId: 'P-103',
        name: 'Suresh Patel',
        age: 52,
        gender: 'Male',
        contact: '9988776655',
        email: 'suresh.p@example.com',
        department: 'Orthopedics',
        doctorAssigned: 'Dr. Vikram Malhotra',
        roomNumber: 'General Ward',
        status: 'Outpatient',
        diagnosis: 'Right Knee Osteoarthritis - Physical Therapy consultation',
      },
      {
        patientId: 'P-104',
        name: 'Meera Iyer',
        age: 8,
        gender: 'Female',
        contact: '9845012345',
        email: 'parents.meera@example.com',
        department: 'Pediatrics',
        doctorAssigned: 'Dr. Sunita Rao',
        roomNumber: 'Pediatric Wing 12',
        status: 'Discharged',
        diagnosis: 'Seasonal Viral Bronchitis - Recovered and Discharged',
      },
    ];

    try {
      addToast('Populating sample hospital records to MongoDB Atlas...', 'info');
      for (const p of samplePatients) {
        try {
          await apiService.createPatient(p);
        } catch {
          // Ignore duplicates if already seeded
        }
      }
      addToast('Sample hospital records populated successfully!', 'success');
      handleFullRefresh();
    } catch (err) {
      addToast('Error seeding sample data: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Navbar with Tier Indicators */}
      <Navbar
        backendStatus={backendStatus}
        onRefresh={handleFullRefresh}
        onOpenArchitecture={() => setIsArchOpen(true)}
      />

      <main className="main-content">
        {/* Render Cold Start Banner if backend is connecting */}
        {backendStatus.status === 'Connecting' && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#92400e',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={18} className="animate-spin" />
              <span>
                <strong>Connecting to Render Backend:</strong> If your Render web service is on the free plan, it spins down during inactivity and takes ~45 seconds to wake up.
              </span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleFullRefresh}>
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Top Stats Overview */}
        <StatsCards stats={stats} loading={loading && !stats} />

        {/* Action / Control Bar */}
        <div className="control-bar">
          <div className="search-filter-group">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by Patient Name, ID, or Doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <select
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Quick Demo Seed */}
            <button
              className="btn btn-secondary"
              onClick={handleSeedSampleData}
              title="Populate 4 test patient records in MongoDB Atlas"
            >
              <Sparkles size={16} color="#0d9488" />
              <span>Seed Sample Records</span>
            </button>

            {/* Add Patient Button */}
            <button
              className="btn btn-primary"
              onClick={() => {
                setPatientToEdit(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={17} />
              <span>Register Patient</span>
            </button>

            {/* Refresh */}
            <button
              className="btn-icon"
              onClick={handleFullRefresh}
              title="Refresh Records & Connectivity"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {/* Patients Table Card */}
        <div className="table-card">
          <div className="table-header-panel">
            <div className="table-title">
              <Users size={18} color="#0d9488" />
              <span>Patient Directory ({patients.length})</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Tier 3 Database: MongoDB Atlas (<code>students</code> / <code>patients</code> collection)
            </div>
          </div>

          {loading ? (
            <div className="state-box">
              <RefreshCw size={36} className="animate-spin" color="#0d9488" />
              <div className="state-title">Retrieving Patient Records...</div>
              <p>Communicating via Render REST API to MongoDB Atlas cluster</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="state-box">
              <Activity size={40} color="#94a3b8" />
              <div className="state-title">No Patient Records Found</div>
              <p style={{ maxWidth: '420px', margin: '0.5rem auto 1.25rem' }}>
                {searchTerm || selectedDept !== 'All' || selectedStatus !== 'All'
                  ? 'No records match your active search filters. Try clearing filters.'
                  : 'Get started by registering a new patient or loading sample data into MongoDB Atlas.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleSeedSampleData}
                >
                  <Sparkles size={16} />
                  <span>Seed Test Records</span>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setPatientToEdit(null);
                    setIsFormOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Add First Patient</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Age & Gender</th>
                    <th>Department</th>
                    <th>Attending Doctor</th>
                    <th>Ward / Room</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id || patient.patientId}>
                      <td>
                        <span className="patient-id-badge">{patient.patientId}</span>
                      </td>
                      <td>
                        <div className="patient-name-cell">{patient.name}</div>
                        <div className="patient-meta-cell">{patient.contact}</div>
                      </td>
                      <td>
                        <div>{patient.age} yrs</div>
                        <div className="patient-meta-cell">{patient.gender}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#334155' }}>
                          {patient.department}
                        </span>
                      </td>
                      <td>
                        <div>{patient.doctorAssigned}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {patient.roomNumber || 'General Ward'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${patient.status?.toLowerCase() || 'admitted'}`}>
                          <span className="status-dot"></span>
                          <span>{patient.status}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon"
                            title="View Full Record"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye size={15} color="#0284c7" />
                          </button>
                          <button
                            className="btn-icon"
                            title="Edit Patient"
                            onClick={() => {
                              setPatientToEdit(patient);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit2 size={15} color="#0d9488" />
                          </button>
                          <button
                            className="btn-icon"
                            title="Discharge / Delete Record"
                            onClick={() => {
                              setPatientToDelete(patient);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 size={15} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <PatientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />

      <PatientDetailsModal
        isOpen={isDetailsOpen}
        patient={selectedPatient}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(p) => {
          setPatientToEdit(p);
          setIsFormOpen(true);
        }}
        onDelete={(p) => {
          setPatientToDelete(p);
          setIsDeleteOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        patient={patientToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeletePatient}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* Toast Feedback */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
