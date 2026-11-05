'use strict';
const fs = require('fs');
const path = require('path');
const Patient = require('../models/Patient');

// ─── File Paths ───────────────────────────────────────────────────────────────
const CUSTOM_FIELDS_PATH = path.resolve(__dirname, 'customFields.json');
const CURRENT_THEME_PATH = path.resolve(__dirname, 'currentTheme.json');
const CSS_PATH           = path.resolve(__dirname, '../../frontend/src/index.css');
const PATIENT_MODEL_PATH = path.resolve(__dirname, '../models/Patient.js');

// ─── Custom Fields Helpers ────────────────────────────────────────────────────
function loadCustomFields() {
  try { return JSON.parse(fs.readFileSync(CUSTOM_FIELDS_PATH, 'utf8')).fields || []; }
  catch { return []; }
}
function saveCustomFields(fields) {
  fs.writeFileSync(CUSTOM_FIELDS_PATH, JSON.stringify({ fields }, null, 2), 'utf8');
}

// ─── Theme Helpers ────────────────────────────────────────────────────────────
function loadCurrentTheme() {
  try { return JSON.parse(fs.readFileSync(CURRENT_THEME_PATH, 'utf8')); }
  catch {
    return {
      name: 'teal',
      '--primary-500': '#14b8a6',
      '--primary-600': '#0d9488',
      '--primary-700': '#0f766e',
    };
  }
}
function saveCurrentTheme(data) {
  fs.writeFileSync(CURRENT_THEME_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Colour Theme Catalogue ───────────────────────────────────────────────────
const THEMES = {
  teal: {
    '--primary-50': '#f0fdfa', '--primary-100': '#ccfbf1',
    '--primary-500': '#14b8a6', '--primary-600': '#0d9488', '--primary-700': '#0f766e',
    '--border-focus': '#14b8a6',
    '--bg-page': '#f8fafc', '--bg-surface': '#ffffff', '--bg-subtle': '#f1f5f9',
    '--text-main': '#0f172a', '--text-muted': '#64748b', '--text-subtle': '#94a3b8',
    '--border-color': '#e2e8f0',
  },
  blue: {
    '--primary-50': '#eff6ff', '--primary-100': '#dbeafe',
    '--primary-500': '#3b82f6', '--primary-600': '#2563eb', '--primary-700': '#1d4ed8',
    '--border-focus': '#3b82f6',
    '--bg-page': '#f8fafc', '--bg-surface': '#ffffff', '--bg-subtle': '#eff6ff',
    '--text-main': '#0f172a', '--text-muted': '#64748b', '--text-subtle': '#94a3b8',
    '--border-color': '#bfdbfe',
  },
  purple: {
    '--primary-50': '#faf5ff', '--primary-100': '#f3e8ff',
    '--primary-500': '#a855f7', '--primary-600': '#9333ea', '--primary-700': '#7e22ce',
    '--border-focus': '#a855f7',
    '--bg-page': '#faf5ff', '--bg-surface': '#ffffff', '--bg-subtle': '#f3e8ff',
    '--text-main': '#1e1b4b', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#e9d5ff',
  },
  red: {
    '--primary-50': '#fef2f2', '--primary-100': '#fee2e2',
    '--primary-500': '#ef4444', '--primary-600': '#dc2626', '--primary-700': '#b91c1c',
    '--border-focus': '#ef4444',
    '--bg-page': '#fff8f8', '--bg-surface': '#ffffff', '--bg-subtle': '#fef2f2',
    '--text-main': '#1f2937', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#fecaca',
  },
  green: {
    '--primary-50': '#f0fdf4', '--primary-100': '#dcfce7',
    '--primary-500': '#22c55e', '--primary-600': '#16a34a', '--primary-700': '#15803d',
    '--border-focus': '#22c55e',
    '--bg-page': '#f0fdf4', '--bg-surface': '#ffffff', '--bg-subtle': '#dcfce7',
    '--text-main': '#0f172a', '--text-muted': '#374151', '--text-subtle': '#6b7280',
    '--border-color': '#bbf7d0',
  },
  orange: {
    '--primary-50': '#fff7ed', '--primary-100': '#ffedd5',
    '--primary-500': '#f97316', '--primary-600': '#ea580c', '--primary-700': '#c2410c',
    '--border-focus': '#f97316',
    '--bg-page': '#fff7ed', '--bg-surface': '#ffffff', '--bg-subtle': '#ffedd5',
    '--text-main': '#1f2937', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#fed7aa',
  },
  pink: {
    '--primary-50': '#fdf2f8', '--primary-100': '#fce7f3',
    '--primary-500': '#ec4899', '--primary-600': '#db2777', '--primary-700': '#be185d',
    '--border-focus': '#ec4899',
    '--bg-page': '#fdf2f8', '--bg-surface': '#ffffff', '--bg-subtle': '#fce7f3',
    '--text-main': '#1f2937', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#fbcfe8',
  },
  indigo: {
    '--primary-50': '#eef2ff', '--primary-100': '#e0e7ff',
    '--primary-500': '#6366f1', '--primary-600': '#4f46e5', '--primary-700': '#4338ca',
    '--border-focus': '#6366f1',
    '--bg-page': '#f8fafc', '--bg-surface': '#ffffff', '--bg-subtle': '#eef2ff',
    '--text-main': '#1e1b4b', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#c7d2fe',
  },
  dark: {
    '--primary-50': '#1e293b', '--primary-100': '#334155',
    '--primary-500': '#38bdf8', '--primary-600': '#0ea5e9', '--primary-700': '#0284c7',
    '--border-focus': '#38bdf8',
    '--bg-page': '#0f172a', '--bg-surface': '#1e293b', '--bg-subtle': '#334155',
    '--text-main': '#f1f5f9', '--text-muted': '#94a3b8', '--text-subtle': '#64748b',
    '--border-color': '#334155',
  },
  rose: {
    '--primary-50': '#fff1f2', '--primary-100': '#ffe4e6',
    '--primary-500': '#f43f5e', '--primary-600': '#e11d48', '--primary-700': '#be123c',
    '--border-focus': '#f43f5e',
    '--bg-page': '#fff1f2', '--bg-surface': '#ffffff', '--bg-subtle': '#ffe4e6',
    '--text-main': '#1f2937', '--text-muted': '#6b7280', '--text-subtle': '#9ca3af',
    '--border-color': '#fecdd3',
  },
  slate: {
    '--primary-50': '#f8fafc', '--primary-100': '#f1f5f9',
    '--primary-500': '#64748b', '--primary-600': '#475569', '--primary-700': '#334155',
    '--border-focus': '#64748b',
    '--bg-page': '#f1f5f9', '--bg-surface': '#ffffff', '--bg-subtle': '#e2e8f0',
    '--text-main': '#0f172a', '--text-muted': '#475569', '--text-subtle': '#94a3b8',
    '--border-color': '#cbd5e1',
  },
};

/**
 * Applies a theme object to raw CSS content.
 * Step 1: Replace CSS variable values inside :root {}
 * Step 2: Replace hardcoded hex colors from the OLD theme with new ones
 */
function applyThemeToCSS(cssContent, newTheme, oldTheme) {
  let css = cssContent;

  // Step 1 — update CSS variable declarations
  for (const [varName, newValue] of Object.entries(newTheme)) {
    const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped}\\s*:\\s*)([^;\\r\\n]+)(;)`, 'g');
    css = css.replace(regex, `$1${newValue}$3`);
  }

  // Step 2 — replace hardcoded occurrences of the old primary shades
  if (oldTheme) {
    const swaps = [
      [oldTheme['--primary-700'], newTheme['--primary-700']],
      [oldTheme['--primary-600'], newTheme['--primary-600']],
      [oldTheme['--primary-500'], newTheme['--primary-500']],
      [oldTheme['--primary-100'], newTheme['--primary-100']],
      [oldTheme['--primary-50'],  newTheme['--primary-50']],
    ];
    for (const [from, to] of swaps) {
      if (from && to && from !== to) {
        css = css.split(from).join(to);
      }
    }
  }

  return css;
}

// ─── Patient Schema File Helpers ──────────────────────────────────────────────
function addFieldToSchema(content, fieldName, fieldDef) {
  // Find insertion point right before the timestamps option block
  const markers = [
    '\n  },\n  {\n    timestamps: true,',
    '\r\n  },\r\n  {\r\n    timestamps: true,',
  ];
  let marker, markerIndex;
  for (const m of markers) {
    const idx = content.indexOf(m);
    if (idx !== -1) { marker = m; markerIndex = idx; break; }
  }
  if (markerIndex === undefined || markerIndex === -1) {
    throw new Error('Cannot find schema insertion point in Patient.js. The file may have been modified manually.');
  }

  const lf = content.includes('\r\n') ? '\r\n' : '\n';

  let fieldCode = `${lf}    ${fieldName}: {${lf}      type: ${fieldDef.type},${lf}`;

  if (fieldDef.required) {
    fieldCode += `      required: [true, '${fieldName} is required'],${lf}`;
  }
  if (fieldDef.enumValues && fieldDef.enumValues.length > 0) {
    fieldCode += `      enum: ${JSON.stringify(fieldDef.enumValues)},${lf}`;
  }
  if (fieldDef.type === 'String') {
    const dv = fieldDef.defaultValue !== undefined ? fieldDef.defaultValue : '';
    fieldCode += `      default: '${dv}',${lf}`;
    fieldCode += `      trim: true,${lf}`;
  } else if (fieldDef.type === 'Number') {
    const dv = fieldDef.defaultValue !== undefined ? (Number(fieldDef.defaultValue) || 0) : 0;
    fieldCode += `      default: ${dv},${lf}`;
  } else if (fieldDef.type === 'Boolean') {
    const dv = fieldDef.defaultValue === 'true';
    fieldCode += `      default: ${dv},${lf}`;
  } else if (fieldDef.type === 'Date') {
    fieldCode += `      default: Date.now,${lf}`;
  }

  fieldCode += `    },`;

  return content.slice(0, markerIndex) + fieldCode + content.slice(markerIndex);
}

function removeFieldFromSchema(content, fieldName) {
  const lines = content.split(/\r?\n/);
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();
    if (trimmed === `${fieldName}: {`) {
      // Skip all lines until depth returns to 0
      let depth = 0;
      while (i < lines.length) {
        const l = lines[i];
        depth += (l.match(/\{/g) || []).length;
        depth -= (l.match(/\}/g) || []).length;
        i++;
        if (depth <= 0) break;
      }
    } else {
      output.push(lines[i]);
      i++;
    }
  }

  const lf = content.includes('\r\n') ? '\r\n' : '\n';
  return output.join(lf);
}

// ─── Static field lists (base) ────────────────────────────────────────────────
const BASE_WRITABLE_FIELDS = [
  'name', 'age', 'gender', 'contact', 'email',
  'department', 'doctorAssigned', 'roomNumber', 'status', 'diagnosis', 'admissionDate',
];
const BASE_STRING_LIMITS = {
  patientId: 100, name: 200, contact: 100, email: 254,
  department: 200, doctorAssigned: 200, roomNumber: 100, diagnosis: 2000,
};
const BASE_REQUIRED_FIELDS = [
  'patientId', 'name', 'age', 'gender', 'contact', 'department', 'doctorAssigned',
];
const RESERVED_FIELDS = [
  ...BASE_REQUIRED_FIELDS, ...BASE_WRITABLE_FIELDS,
  '_id', '__v', 'createdAt', 'updatedAt',
];

const patientSummary = (p) => ({
  patientId: p.patientId, name: p.name, age: p.age, gender: p.gender,
  department: p.department, doctorAssigned: p.doctorAssigned,
  roomNumber: p.roomNumber, status: p.status, admissionDate: p.admissionDate,
});

const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── Build Tools Dynamically (called fresh on each ListTools request) ─────────
function getTools() {
  const customFields = loadCustomFields();
  const currentTheme = loadCurrentTheme();
  const availableThemes = Object.keys(THEMES);

  // Build JSON-schema properties for custom fields
  const customProps = {};
  for (const cf of customFields) {
    if (cf.type === 'Number') {
      customProps[cf.name] = { type: 'number', description: cf.description || `Patient ${cf.name}` };
    } else if (cf.type === 'Boolean') {
      customProps[cf.name] = { type: 'boolean', description: cf.description || `Patient ${cf.name}` };
    } else if (cf.enumValues && cf.enumValues.length > 0) {
      customProps[cf.name] = { type: 'string', enum: cf.enumValues, description: cf.description || `Patient ${cf.name}` };
    } else {
      customProps[cf.name] = { type: 'string', description: cf.description || `Patient ${cf.name}` };
    }
  }

  const basePatientProps = {
    patientId:      { type: 'string', minLength: 1, maxLength: 100 },
    name:           { type: 'string', minLength: 1, maxLength: 200 },
    age:            { type: 'integer', minimum: 0, maximum: 130 },
    gender:         { type: 'string', enum: ['Male', 'Female', 'Other'] },
    contact:        { type: 'string', minLength: 1, maxLength: 100 },
    email:          { type: 'string', maxLength: 254 },
    department:     { type: 'string', minLength: 1, maxLength: 200 },
    doctorAssigned: { type: 'string', minLength: 1, maxLength: 200 },
    roomNumber:     { type: 'string', maxLength: 100 },
    status:         { type: 'string', enum: ['Admitted', 'Outpatient', 'Discharged'] },
    diagnosis:      { type: 'string', maxLength: 2000 },
    admissionDate:  { type: 'string', format: 'date-time' },
    ...customProps,
  };

  return [
    // ── Existing hospital tools ──────────────────────────────────────────────
    {
      name: 'hospital_get_statistics',
      description: 'Get aggregate counts of patients by status and departments. Does not return patient records.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'hospital_search_patients',
      description: 'Find up to 20 patient records by name, patient ID, department, assigned doctor, or status.',
      inputSchema: {
        type: 'object',
        properties: {
          query:      { type: 'string', description: 'Search term (name, ID, department, or doctor).' },
          department: { type: 'string', description: 'Exact department filter.' },
          status:     { type: 'string', enum: ['Admitted', 'Outpatient', 'Discharged'] },
          limit:      { type: 'integer', minimum: 1, maximum: 20, description: 'Max results (default 10).' },
        },
        additionalProperties: false,
      },
    },
    {
      name: 'hospital_get_patient',
      description: 'Get a single patient by their patient ID (e.g. P-101).',
      inputSchema: {
        type: 'object',
        properties: { patient_id: { type: 'string', minLength: 1 } },
        required: ['patient_id'],
        additionalProperties: false,
      },
    },
    {
      name: 'hospital_create_patient',
      description: `Create a new patient record. Request user approval before calling. Custom fields available: ${customFields.length > 0 ? customFields.map(f => f.name).join(', ') : 'none yet — use update_patient_schema to add some'}.`,
      annotations: { title: 'Create patient record', readOnlyHint: false, destructiveHint: false, idempotentHint: false },
      inputSchema: {
        type: 'object',
        properties: basePatientProps,
        required: BASE_REQUIRED_FIELDS,
        additionalProperties: false,
      },
    },
    {
      name: 'hospital_update_patient',
      description: `Update an existing patient record by patient ID. Request user approval before calling. Custom fields available: ${customFields.length > 0 ? customFields.map(f => f.name).join(', ') : 'none yet'}.`,
      annotations: { title: 'Update patient record', readOnlyHint: false, destructiveHint: true, idempotentHint: false },
      inputSchema: {
        type: 'object',
        properties: { patient_id: { type: 'string', minLength: 1, maxLength: 100 }, ...basePatientProps },
        required: ['patient_id'],
        additionalProperties: false,
      },
    },
    {
      name: 'hospital_delete_patient',
      description: 'Permanently delete a patient record. Request user approval before calling.',
      annotations: { title: 'Delete patient record', readOnlyHint: false, destructiveHint: true, idempotentHint: false },
      inputSchema: {
        type: 'object',
        properties: { patient_id: { type: 'string', minLength: 1, maxLength: 100 } },
        required: ['patient_id'],
        additionalProperties: false,
      },
    },

    // ── New AI tools ─────────────────────────────────────────────────────────
    {
      name: 'change_website_theme',
      description: `Change the visual colour theme / appearance of the hospital management website. This edits the CSS file and immediately changes buttons, backgrounds, cards, borders, text colours, and all accent colours. Use whenever the user asks to change the website colour, make it blue, red, dark, etc. Currently active theme: "${currentTheme.name || 'teal'}". Available themes: ${availableThemes.join(', ')}.`,
      inputSchema: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            description: `Name of the theme to apply. Must be one of: ${availableThemes.join(', ')}`,
          },
        },
        required: ['theme'],
        additionalProperties: false,
      },
    },
    {
      name: 'update_patient_schema',
      description: 'Add or remove a custom field from the Patient MongoDB schema and the create/update tools. Use when user asks to add or remove fields like bloodGroup, phoneNumber2, emergencyContact, insuranceId, etc. After adding, restart Claude Desktop and the backend for full effect.',
      annotations: { title: 'Update Patient Schema', readOnlyHint: false, destructiveHint: false },
      inputSchema: {
        type: 'object',
        properties: {
          action:       { type: 'string', enum: ['add', 'remove'], description: '"add" to add a field, "remove" to delete it' },
          fieldName:    { type: 'string', minLength: 1, maxLength: 50, description: 'Field name, e.g. bloodGroup (camelCase, letters/numbers/underscore only)' },
          fieldType:    { type: 'string', enum: ['String', 'Number', 'Boolean', 'Date'], description: 'Mongoose data type (required when action is add)' },
          required:     { type: 'boolean', description: 'Whether the field is required (for add only)' },
          defaultValue: { type: 'string', description: 'Default value as a string (for add only)' },
          enumValues:   { type: 'array', items: { type: 'string' }, description: 'List of allowed values if the field is an enum, e.g. ["A+","A-","B+","B-","O+","O-","AB+","AB-"]' },
          description:  { type: 'string', description: 'Human-readable description of what this field stores' },
        },
        required: ['action', 'fieldName'],
        additionalProperties: false,
      },
    },
    {
      name: 'get_project_status',
      description: 'Get the current status of the MediPulse project — active theme, custom schema fields, available tools, file paths, and live Render URL. Use when user asks what is the current state of their project.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'test_render_cloud_api',
      description: 'Test the live Render cloud deployment (https://hospital-patient-api-t37k.onrender.com). Checks if Render is awake, verifies MongoDB Atlas connectivity on Render, tests response latency, and returns live cloud stats. Use whenever user asks to test Render or check their live hosted backend.',
      inputSchema: {
        type: 'object',
        properties: {
          endpoint: {
            type: 'string',
            enum: ['all', 'health', 'root', 'stats'],
            description: 'Which endpoint to probe on Render (default: "all")',
          },
        },
        additionalProperties: false,
      },
    },
  ];
}

// ─── Tool Execution ───────────────────────────────────────────────────────────
const executeTool = async (name, input = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Tool arguments must be an object.');
  }

  // Reload custom fields fresh on every call so schema changes are reflected immediately
  const customFields = loadCustomFields();
  const writablePatientFields = [...BASE_WRITABLE_FIELDS, ...customFields.map(f => f.name)];
  const patientStringLimits   = { ...BASE_STRING_LIMITS };
  for (const cf of customFields) {
    if (cf.type === 'String') patientStringLimits[cf.name] = 500;
  }

  const rejectUnknownFields = (inp, allowed) => {
    const unknown = Object.keys(inp).filter(f => !allowed.includes(f));
    if (unknown.length > 0) throw new Error(`Unsupported field(s): ${unknown.join(', ')}.`);
  };

  const validatePatientFields = (inp, fields) => {
    for (const field of fields) {
      const value = inp[field];
      if (patientStringLimits[field] !== undefined) {
        if (typeof value !== 'string' || value.length > patientStringLimits[field])
          throw new Error(`${field} must be a string of at most ${patientStringLimits[field]} characters.`);
        if (BASE_REQUIRED_FIELDS.includes(field) && value.trim().length === 0)
          throw new Error(`${field} must not be empty.`);
      } else if (field === 'age') {
        if (!Number.isInteger(value) || value < 0 || value > 130)
          throw new Error('age must be an integer between 0 and 130.');
      } else if (field === 'gender') {
        if (!['Male', 'Female', 'Other'].includes(value))
          throw new Error('gender must be Male, Female, or Other.');
      } else if (field === 'status') {
        if (!['Admitted', 'Outpatient', 'Discharged'].includes(value))
          throw new Error('status must be Admitted, Outpatient, or Discharged.');
      } else if (field === 'admissionDate') {
        if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime()))
          throw new Error('admissionDate must be a valid ISO date-time string.');
      } else {
        // Custom field validation
        const cf = customFields.find(f => f.name === field);
        if (cf) {
          if (cf.type === 'Number'  && typeof value !== 'number')  throw new Error(`${field} must be a number.`);
          if (cf.type === 'Boolean' && typeof value !== 'boolean') throw new Error(`${field} must be a boolean.`);
          if (cf.enumValues && cf.enumValues.length > 0 && !cf.enumValues.includes(value))
            throw new Error(`${field} must be one of: ${cf.enumValues.join(', ')}.`);
        }
      }
    }
  };

  const patientSelectFields = 'patientId name age gender department doctorAssigned roomNumber status admissionDate';

  // ── hospital_get_statistics ──────────────────────────────────────────────
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

  // ── hospital_search_patients ─────────────────────────────────────────────
  if (name === 'hospital_search_patients') {
    const { query, department, status, limit = 10 } = input;
    if (query !== undefined && (typeof query !== 'string' || query.length > 100))
      throw new Error('query must be a string of at most 100 characters.');
    if (department !== undefined && (typeof department !== 'string' || department.length > 100))
      throw new Error('department must be a string of at most 100 characters.');
    if (status !== undefined && !['Admitted', 'Outpatient', 'Discharged'].includes(status))
      throw new Error('status must be Admitted, Outpatient, or Discharged.');
    if (!Number.isInteger(limit) || limit < 1 || limit > 20)
      throw new Error('limit must be an integer between 1 and 20.');

    const filter = {};
    if (query && query.trim()) {
      const rx = new RegExp(escapeRegex(query.trim()), 'i');
      filter.$or = ['name', 'patientId', 'department', 'doctorAssigned'].map(f => ({ [f]: rx }));
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const patients = await Patient.find(filter).select(patientSelectFields).sort({ createdAt: -1 }).limit(limit).lean();
    return { count: patients.length, patients };
  }

  // ── hospital_get_patient ─────────────────────────────────────────────────
  if (name === 'hospital_get_patient') {
    const { patient_id: patientId } = input;
    if (typeof patientId !== 'string' || !patientId.trim() || patientId.length > 100)
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    const patient = await Patient.findOne({ patientId: patientId.trim().toUpperCase() })
      .select(patientSelectFields).lean();
    if (!patient) return { found: false, message: `No patient found with ID ${patientId.trim()}.` };
    return { found: true, patient };
  }

  // ── hospital_create_patient ──────────────────────────────────────────────
  if (name === 'hospital_create_patient') {
    rejectUnknownFields(input, ['patientId', ...writablePatientFields]);
    for (const field of BASE_REQUIRED_FIELDS) {
      if (input[field] === undefined) throw new Error(`${field} is required.`);
    }
    validatePatientFields(input, Object.keys(input));
    const normalizedId = input.patientId.trim().toUpperCase();
    if (await Patient.exists({ patientId: normalizedId }))
      throw new Error(`A patient with ID ${normalizedId} already exists.`);
    const data = { ...input, patientId: normalizedId };
    if (data.admissionDate) data.admissionDate = new Date(data.admissionDate);
    const patient = await Patient.create(data);
    return { created: true, patient: patientSummary(patient) };
  }

  // ── hospital_update_patient ──────────────────────────────────────────────
  if (name === 'hospital_update_patient') {
    rejectUnknownFields(input, ['patient_id', ...writablePatientFields]);
    const { patient_id: patientId, ...updates } = input;
    if (typeof patientId !== 'string' || !patientId.trim() || patientId.length > 100)
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    if (Object.keys(updates).length === 0)
      throw new Error('Provide at least one patient field to update.');
    validatePatientFields(updates, Object.keys(updates));
    if (updates.admissionDate) updates.admissionDate = new Date(updates.admissionDate);
    const patient = await Patient.findOne({ patientId: patientId.trim().toUpperCase() });
    if (!patient) return { updated: false, message: `No patient found with ID ${patientId.trim()}.` };
    Object.assign(patient, updates);
    await patient.save();
    return { updated: true, patient: patientSummary(patient) };
  }

  // ── hospital_delete_patient ──────────────────────────────────────────────
  if (name === 'hospital_delete_patient') {
    const { patient_id: patientId } = input;
    if (typeof patientId !== 'string' || !patientId.trim() || patientId.length > 100)
      throw new Error('patient_id must be a non-empty string of at most 100 characters.');
    const patient = await Patient.findOneAndDelete({ patientId: patientId.trim().toUpperCase() });
    if (!patient) return { deleted: false, message: `No patient found with ID ${patientId.trim()}.` };
    return { deleted: true, patientId: patient.patientId, name: patient.name };
  }

  // ── change_website_theme ─────────────────────────────────────────────────
  if (name === 'change_website_theme') {
    const { theme } = input;
    const themeLower = (theme || '').toLowerCase().trim();
    const newTheme = THEMES[themeLower];

    if (!newTheme) {
      throw new Error(
        `Unknown theme "${theme}". Available themes: ${Object.keys(THEMES).join(', ')}`
      );
    }
    if (!fs.existsSync(CSS_PATH)) {
      throw new Error(
        `CSS file not found at: ${CSS_PATH}\nMake sure your frontend folder is at the right path.`
      );
    }

    const oldTheme = loadCurrentTheme();
    let css = fs.readFileSync(CSS_PATH, 'utf8');

    css = applyThemeToCSS(css, newTheme, oldTheme.name && THEMES[oldTheme.name] ? THEMES[oldTheme.name] : null);

    fs.writeFileSync(CSS_PATH, css, 'utf8');
    saveCurrentTheme({ name: themeLower, ...newTheme });

    return {
      success: true,
      previousTheme: oldTheme.name || 'unknown',
      newTheme: themeLower,
      message: `✅ Website theme changed from "${oldTheme.name || 'unknown'}" → "${themeLower}"! Refresh your browser (Vite will auto-reload if running) to see the changes.`,
      tip: themeLower === 'dark' ? '⚠️ Dark mode changes CSS variables but some hardcoded white backgrounds in modals/navbar may remain. For a full dark mode, a deeper CSS refactor is needed.' : undefined,
      changedVariables: Object.keys(newTheme),
    };
  }

  // ── update_patient_schema ────────────────────────────────────────────────
  if (name === 'update_patient_schema') {
    const { action, fieldName, fieldType, description: fieldDesc } = input;

    // Validate field name format
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldName)) {
      throw new Error('fieldName must start with a letter and contain only letters, numbers, or underscore. E.g. bloodGroup, phoneNumber2');
    }
    if (RESERVED_FIELDS.includes(fieldName)) {
      throw new Error(`"${fieldName}" is a built-in field and cannot be managed here.`);
    }

    const fields = loadCustomFields();

    // ── REMOVE ──
    if (action === 'remove') {
      const idx = fields.findIndex(f => f.name === fieldName);
      if (idx === -1)
        throw new Error(`Field "${fieldName}" not found in custom fields. Current custom fields: ${fields.map(f => f.name).join(', ') || 'none'}.`);
      fields.splice(idx, 1);
      saveCustomFields(fields);

      // Remove from Patient.js
      if (fs.existsSync(PATIENT_MODEL_PATH)) {
        let modelContent = fs.readFileSync(PATIENT_MODEL_PATH, 'utf8');
        modelContent = removeFieldFromSchema(modelContent, fieldName);
        fs.writeFileSync(PATIENT_MODEL_PATH, modelContent, 'utf8');
      }

      return {
        success: true,
        action: 'remove',
        fieldName,
        remainingCustomFields: fields.map(f => f.name),
        message: `✅ Field "${fieldName}" removed from schema files. Restart your backend (npm start) and Claude Desktop to fully apply.`,
      };
    }

    // ── ADD ──
    if (action === 'add') {
      if (!fieldType)
        throw new Error('fieldType is required when action is "add". Use: String, Number, Boolean, or Date');
      if (!['String', 'Number', 'Boolean', 'Date'].includes(fieldType))
        throw new Error('fieldType must be String, Number, Boolean, or Date.');
      if (fields.some(f => f.name === fieldName))
        throw new Error(`Field "${fieldName}" already exists in custom fields.`);

      const newField = {
        name:         fieldName,
        type:         fieldType,
        required:     input.required  || false,
        defaultValue: input.defaultValue !== undefined ? String(input.defaultValue) : '',
        enumValues:   input.enumValues || [],
        description:  fieldDesc || `Patient ${fieldName}`,
      };

      fields.push(newField);
      saveCustomFields(fields);

      // Add to Patient.js model file
      if (fs.existsSync(PATIENT_MODEL_PATH)) {
        let modelContent = fs.readFileSync(PATIENT_MODEL_PATH, 'utf8');
        modelContent = addFieldToSchema(modelContent, fieldName, newField);
        fs.writeFileSync(PATIENT_MODEL_PATH, modelContent, 'utf8');
      }

      return {
        success: true,
        action: 'add',
        field: newField,
        allCustomFields: fields.map(f => f.name),
        message: `✅ Field "${fieldName}" (${fieldType}) successfully added to Patient.js model and customFields.json!`,
        nextSteps: [
          '1. Restart your backend server:  cd backend  →  npm start',
          '2. Quit and reopen Claude Desktop to reload MCP tools',
          `3. The "${fieldName}" field will now be available when creating or updating patients`,
        ],
      };
    }

    throw new Error('action must be "add" or "remove".');
  }

  // ── get_project_status ───────────────────────────────────────────────────
  if (name === 'get_project_status') {
    const currentTheme = loadCurrentTheme();
    const fields       = loadCustomFields();

    return {
      project: 'MediPulse Hospital Management System',
      version: '2.0.0',
      renderCloud: {
        url: 'https://hospital-patient-api-t37k.onrender.com',
        status: 'Configured on Render',
        healthCheck: 'https://hospital-patient-api-t37k.onrender.com/api/health',
      },
      currentTheme: {
        name:      currentTheme.name || 'teal',
        primary:   currentTheme['--primary-600'] || '#0d9488',
      },
      availableThemes: Object.keys(THEMES),
      customSchemaFields: fields.length > 0
        ? fields.map(f => ({ name: f.name, type: f.type, required: f.required, enum: f.enumValues?.length > 0 ? f.enumValues : undefined }))
        : 'None added yet',
      builtInFields: {
        required: BASE_REQUIRED_FIELDS,
        optional: BASE_WRITABLE_FIELDS.filter(f => !BASE_REQUIRED_FIELDS.includes(f)),
      },
      fileStatus: {
        cssFile:          fs.existsSync(CSS_PATH)           ? `✅ ${CSS_PATH}`           : '❌ Not found',
        patientModel:     fs.existsSync(PATIENT_MODEL_PATH) ? `✅ ${PATIENT_MODEL_PATH}` : '❌ Not found',
        customFieldsJSON: fs.existsSync(CUSTOM_FIELDS_PATH) ? `✅ ${CUSTOM_FIELDS_PATH}` : '❌ Not found',
      },
      howTo: {
        testRender:     'Say: "test my render backend" or "check render cloud status"',
        changeColour:   'Say: "change website colour to blue" or "make it dark" or "switch to purple theme"',
        addField:       'Say: "add a bloodGroup field to patients" or "add emergencyContact field"',
        removeField:    'Say: "remove bloodGroup field"',
        getStats:       'Say: "how many patients are admitted?"',
        createPatient:  'Say: "create a new patient named Rahul, age 30..."',
      },
    };
  }

  // ── test_render_cloud_api ────────────────────────────────────────────────
  if (name === 'test_render_cloud_api') {
    const renderBase = 'https://hospital-patient-api-t37k.onrender.com';
    const target = input.endpoint || 'all';

    const fetchEndpoint = async (url) => {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s for cold start
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json().catch(() => null);
        return {
          status: res.status,
          ok: res.ok,
          latencyMs: Date.now() - start,
          data,
        };
      } catch (err) {
        return {
          ok: false,
          error: err.name === 'AbortError' ? 'Timeout: Render is waking up (cold start)' : err.message,
          latencyMs: Date.now() - start,
        };
      }
    };

    const results = {
      renderUrl: renderBase,
      checkedAt: new Date().toISOString(),
    };

    if (target === 'health' || target === 'all') {
      results.healthEndpoint = await fetchEndpoint(`${renderBase}/api/health`);
    }
    if (target === 'root' || target === 'all') {
      results.rootEndpoint = await fetchEndpoint(`${renderBase}/`);
    }
    if (target === 'stats' || target === 'all') {
      results.statsEndpoint = await fetchEndpoint(`${renderBase}/api/patients/stats`);
    }

    const isHealthy = results.healthEndpoint?.data?.status === 'OK';
    results.summary = {
      renderStatus: isHealthy ? '🟢 ONLINE & HEALTHY' : '🟡 RESPONDING / WAKING UP',
      mongoStatusOnRender: results.healthEndpoint?.data?.database?.status || 'Unknown',
      databaseName: results.healthEndpoint?.data?.database?.name || 'hospitalDB',
      renderServiceTier: results.rootEndpoint?.data?.tier || 'Tier 2 Application Layer',
    };

    return results;
  }

  throw new Error(`Unknown tool: "${name}"`);
};

// Export both static (backward compat) and dynamic versions
const tools = getTools();
module.exports = { tools, getTools, executeTool };
