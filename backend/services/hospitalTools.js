const Patient = require('../models/Patient');

const patientFields = 'patientId name age gender department doctorAssigned roomNumber status admissionDate';

const tools = [
  {
    name: 'hospital_get_statistics',
    description: 'Get aggregate counts of patients by status and the departments in use. Does not return patient records.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'hospital_search_patients',
    description: 'Find up to 20 patient records by name, patient ID, department, assigned doctor, or status. Results omit contact details and diagnoses.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional name, patient ID, department, or doctor search term.' },
        department: { type: 'string', description: 'Optional exact department filter.' },
        status: {
          type: 'string',
          enum: ['Admitted', 'Outpatient', 'Discharged'],
          description: 'Optional patient status filter.',
        },
        limit: { type: 'integer', minimum: 1, maximum: 20, description: 'Maximum number of matches (default 10).' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'hospital_get_patient',
    description: 'Get a patient by their patient ID. Returns basic care coordination fields only; never returns contact details or diagnoses.',
    inputSchema: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', minLength: 1, description: 'Patient ID such as P-101.' },
      },
      required: ['patient_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'hospital_create_patient',
    description: 'Create a patient record in the hospital app. Claude Desktop should request user approval before calling this write tool. Returns basic fields only.',
    annotations: {
      title: 'Create patient record',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      properties: {
        patientId: { type: 'string', minLength: 1, maxLength: 100 },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        age: { type: 'integer', minimum: 0, maximum: 130 },
        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
        contact: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', maxLength: 254 },
        department: { type: 'string', minLength: 1, maxLength: 200 },
        doctorAssigned: { type: 'string', minLength: 1, maxLength: 200 },
        roomNumber: { type: 'string', maxLength: 100 },
        status: { type: 'string', enum: ['Admitted', 'Outpatient', 'Discharged'] },
        diagnosis: { type: 'string', maxLength: 2000 },
        admissionDate: { type: 'string', format: 'date-time' },
      },
      required: ['patientId', 'name', 'age', 'gender', 'contact', 'department', 'doctorAssigned'],
      additionalProperties: false,
    },
  },
  {
    name: 'hospital_update_patient',
    description: 'Update an existing patient record by patient ID. Claude Desktop should request user approval before calling this write tool. Patient IDs cannot be changed. Returns basic fields only.',
    annotations: {
      title: 'Update patient record',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', minLength: 1, maxLength: 100 },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        age: { type: 'integer', minimum: 0, maximum: 130 },
        gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
        contact: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', maxLength: 254 },
        department: { type: 'string', minLength: 1, maxLength: 200 },
        doctorAssigned: { type: 'string', minLength: 1, maxLength: 200 },
        roomNumber: { type: 'string', maxLength: 100 },
        status: { type: 'string', enum: ['Admitted', 'Outpatient', 'Discharged'] },
        diagnosis: { type: 'string', maxLength: 2000 },
        admissionDate: { type: 'string', format: 'date-time' },
      },
      required: ['patient_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'hospital_delete_patient',
    description: 'Permanently delete a patient record by patient ID. Claude Desktop should request user approval before calling this destructive tool.',
    annotations: {
      title: 'Delete patient record',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
    inputSchema: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', minLength: 1, maxLength: 100 },
      },
      required: ['patient_id'],
      additionalProperties: false,
    },
  },
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const writablePatientFields = [
  'name',
  'age',
  'gender',
  'contact',
  'email',
  'department',
  'doctorAssigned',
  'roomNumber',
  'status',
  'diagnosis',
  'admissionDate',
];
const requiredPatientFields = ['patientId', 'name', 'age', 'gender', 'contact', 'department', 'doctorAssigned'];
const patientStringLimits = {
  patientId: 100,
  name: 200,
  contact: 100,
  email: 254,
  department: 200,
  doctorAssigned: 200,
  roomNumber: 100,
  diagnosis: 2000,
};
const patientSummary = (patient) => ({
  patientId: patient.patientId,
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  department: patient.department,
  doctorAssigned: patient.doctorAssigned,
  roomNumber: patient.roomNumber,
  status: patient.status,
  admissionDate: patient.admissionDate,
});
const rejectUnknownFields = (input, allowedFields) => {
  const unknownFields = Object.keys(input).filter((field) => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    throw new Error(`Unsupported field(s): ${unknownFields.join(', ')}.`);
  }
};
const validatePatientFields = (input, fields) => {
  for (const field of fields) {
    const value = input[field];
    if (patientStringLimits[field] !== undefined) {
      if (typeof value !== 'string' || value.length > patientStringLimits[field]) {
        throw new Error(`${field} must be a string of at most ${patientStringLimits[field]} characters.`);
      }
      if (requiredPatientFields.includes(field) && value.trim().length === 0) {
        throw new Error(`${field} must not be empty.`);
      }
    } else if (field === 'age') {
      if (!Number.isInteger(value) || value < 0 || value > 130) {
        throw new Error('age must be an integer between 0 and 130.');
      }
    } else if (field === 'gender') {
      if (!['Male', 'Female', 'Other'].includes(value)) {
        throw new Error('gender must be Male, Female, or Other.');
      }
    } else if (field === 'status') {
      if (!['Admitted', 'Outpatient', 'Discharged'].includes(value)) {
        throw new Error('status must be Admitted, Outpatient, or Discharged.');
      }
    } else if (field === 'admissionDate') {
      if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime())) {
        throw new Error('admissionDate must be a valid date-time string.');
      }
    }
  }
};

const executeTool = async (name, input = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Tool arguments must be an object.');
  }

  if (name === 'hospital_get_statistics') {
    const [total, admitted, outpatient, discharged, departments] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'Admitted' }),
      Patient.countDocuments({ status: 'Outpatient' }),
      Patient.countDocuments({ status: 'Discharged' }),
      Patient.distinct('department'),
    ]);
    return { total, admitted, outpatient, discharged, departmentCount: departments.length, departments };
  }

  if (name === 'hospital_search_patients') {
    const { query, department, status, limit = 10 } = input;
    if (query !== undefined && (typeof query !== 'string' || query.length > 100)) {
      throw new Error('query must be a string of at most 100 characters.');
    }
    if (department !== undefined && (typeof department !== 'string' || department.length > 100)) {
      throw new Error('department must be a string of at most 100 characters.');
    }
    if (status !== undefined && !['Admitted', 'Outpatient', 'Discharged'].includes(status)) {
      throw new Error('status must be Admitted, Outpatient, or Discharged.');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      throw new Error('limit must be an integer between 1 and 20.');
    }

    const filter = {};
    if (query && query.trim()) {
      const search = new RegExp(escapeRegex(query.trim()), 'i');
      filter.$or = ['name', 'patientId', 'department', 'doctorAssigned'].map((field) => ({ [field]: search }));
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const patients = await Patient.find(filter).select(patientFields).sort({ createdAt: -1 }).limit(limit).lean();
    return { count: patients.length, patients };
  }

  if (name === 'hospital_get_patient') {
    const { patient_id: patientId } = input;
    if (typeof patientId !== 'string' || patientId.trim().length === 0 || patientId.length > 100) {
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    }
    const patient = await Patient.findOne({ patientId: patientId.trim().toUpperCase() })
      .select(patientFields)
      .lean();
    if (!patient) return { found: false, message: `No patient found with ID ${patientId.trim()}.` };
    return { found: true, patient };
  }

  if (name === 'hospital_create_patient') {
    rejectUnknownFields(input, ['patientId', ...writablePatientFields]);
    for (const field of requiredPatientFields) {
      if (input[field] === undefined) throw new Error(`${field} is required.`);
    }
    validatePatientFields(input, Object.keys(input));
    const patientId = input.patientId;
    const normalizedPatientId = patientId.trim().toUpperCase();
    if (await Patient.exists({ patientId: normalizedPatientId })) {
      throw new Error(`A patient with ID ${normalizedPatientId} already exists.`);
    }

    const patientData = { ...input, patientId: normalizedPatientId };
    if (patientData.admissionDate !== undefined) {
      patientData.admissionDate = new Date(patientData.admissionDate);
    }
    const patient = await Patient.create(patientData);
    return { created: true, patient: patientSummary(patient) };
  }

  if (name === 'hospital_update_patient') {
    rejectUnknownFields(input, ['patient_id', ...writablePatientFields]);
    const { patient_id: patientId, ...updates } = input;
    if (typeof patientId !== 'string' || patientId.trim().length === 0 || patientId.length > 100) {
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    }
    if (Object.keys(updates).length === 0) {
      throw new Error('Provide at least one patient field to update.');
    }
    validatePatientFields(updates, Object.keys(updates));
    if (updates.admissionDate !== undefined) {
      updates.admissionDate = new Date(updates.admissionDate);
    }

    const patient = await Patient.findOne({ patientId: patientId.trim().toUpperCase() });
    if (!patient) return { updated: false, message: `No patient found with ID ${patientId.trim()}.` };
    Object.assign(patient, updates);
    await patient.save();
    return { updated: true, patient: patientSummary(patient) };
  }

  if (name === 'hospital_delete_patient') {
    const { patient_id: patientId } = input;
    if (typeof patientId !== 'string' || patientId.trim().length === 0 || patientId.length > 100) {
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    }
    const patient = await Patient.findOneAndDelete({ patientId: patientId.trim().toUpperCase() });
    if (!patient) return { deleted: false, message: `No patient found with ID ${patientId.trim()}.` };
    return { deleted: true, patientId: patient.patientId, name: patient.name };
  }

  throw new Error(`Unknown hospital tool: ${name}`);
};

module.exports = { tools, executeTool };
