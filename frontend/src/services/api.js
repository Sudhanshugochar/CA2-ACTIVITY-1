/**
 * API Service for communicating with the Render Backend (Tier 2)
 */

// Allow override via localStorage so the evaluator can test different backend URLs in the browser
const getBaseUrl = () => {
  const customUrl = localStorage.getItem('medi_pulse_custom_backend');
  if (customUrl) return customUrl.replace(/\/$/, '') + '/api';

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '') + (envUrl.endsWith('/api') ? '' : '/api');

  // Fallback for local development
  return 'http://localhost:5000/api';
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid JSON response from backend server.',
  }));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const apiService = {
  getBaseUrl,

  setCustomBackendUrl(url) {
    if (!url) {
      localStorage.removeItem('medi_pulse_custom_backend');
    } else {
      localStorage.setItem('medi_pulse_custom_backend', url);
    }
  },

  // Health check to verify Render backend & MongoDB Atlas connectivity
  async checkHealth() {
    const base = getBaseUrl();
    const url = `${base}/health`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout for cold start detection

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeout);
      return await handleResponse(response);
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error('Backend is waking up (Render free tier cold start). Please wait ~45 seconds.');
      }
      throw err;
    }
  },

  async getAssistantStatus() {
    const response = await fetch(`${getBaseUrl()}/assistant/status`);
    return await handleResponse(response);
  },

  async chatWithAssistant(messages) {
    const response = await fetch(`${getBaseUrl()}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    return await handleResponse(response);
  },

  // Get statistics
  async getStats() {
    const response = await fetch(`${getBaseUrl()}/patients/stats`);
    return await handleResponse(response);
  },

  // Read: Get all patients with search & filter
  async getPatients({ search = '', department = '', status = '' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department && department !== 'All') params.append('department', department);
    if (status && status !== 'All') params.append('status', status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${getBaseUrl()}/patients${queryString}`);
    return await handleResponse(response);
  },

  // Read: Get single patient by ID
  async getPatientById(id) {
    const response = await fetch(`${getBaseUrl()}/patients/${encodeURIComponent(id)}`);
    return await handleResponse(response);
  },

  // Create: Add new patient
  async createPatient(patientData) {
    const response = await fetch(`${getBaseUrl()}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    return await handleResponse(response);
  },

  // Update: Modify patient record
  async updatePatient(id, patientData) {
    const response = await fetch(`${getBaseUrl()}/patients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    return await handleResponse(response);
  },

  // Delete: Remove patient record
  async deletePatient(id) {
    const response = await fetch(`${getBaseUrl()}/patients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  },
};
