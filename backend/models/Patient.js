const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required (e.g., P-101)'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Patient Name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Patient Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [130, 'Age exceeds realistic limit'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not a valid gender option',
      },
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    department: {
      type: String,
      required: [true, 'Department is required (e.g., Cardiology, General Medicine, Orthopedics)'],
      trim: true,
    },
    doctorAssigned: {
      type: String,
      required: [true, 'Assigned Doctor is required'],
      trim: true,
    },
    roomNumber: {
      type: String,
      default: 'General Ward',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Admitted', 'Outpatient', 'Discharged'],
      default: 'Admitted',
    },
    diagnosis: {
      type: String,
      default: 'General Checkup',
      trim: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual or method if needed
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
