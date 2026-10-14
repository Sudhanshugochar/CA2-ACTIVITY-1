const mongoose = require('mongoose');
const Patient = require('../models/Patient');

// Helper to determine query for _id or patientId
const buildIdentifierQuery = (idParam) => {
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return { _id: idParam };
  }
  return { patientId: idParam.toUpperCase() };
};

/**
 * @desc    Create / Register a new patient
 * @route   POST /api/patients
 * @access  Public
 */
const createPatient = async (req, res) => {
  try {
    const {
      patientId,
      name,
      age,
      gender,
      contact,
      email,
      department,
      doctorAssigned,
      roomNumber,
      status,
      diagnosis,
      admissionDate,
    } = req.body;

    // Basic validation
    if (!patientId || !name || age === undefined || !gender || !contact || !department || !doctorAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: patientId, name, age, gender, contact, department, and doctorAssigned.',
      });
    }

    // Check duplicate patientId
    const existingPatient = await Patient.findOne({ patientId: patientId.toUpperCase() });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: `Patient with ID "${patientId}" already exists. Please use a unique Patient ID.`,
      });
    }

    const newPatient = await Patient.create({
      patientId: patientId.toUpperCase(),
      name,
      age,
      gender,
      contact,
      email,
      department,
      doctorAssigned,
      roomNumber,
      status: status || 'Admitted',
      diagnosis,
      admissionDate: admissionDate || Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully in MongoDB Atlas.',
      data: newPatient,
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating patient record.',
    });
  }
};

/**
 * @desc    Get all patients with search & filtering
 * @route   GET /api/patients
 * @access  Public
 */
const getAllPatients = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const filter = {};

    // Search keyword across name, patientId, diagnosis, or doctorAssigned
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { patientId: regex },
        { department: regex },
        { doctorAssigned: regex },
        { diagnosis: regex },
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      filter.department = department;
    }

    // Filter by status (Admitted, Outpatient, Discharged)
    if (status && status !== 'All') {
      filter.status = status;
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving patient records.',
    });
  }
};

/**
 * @desc    Get single patient by MongoDB ID or patientId
 * @route   GET /api/patients/:id
 * @access  Public
 */
const getPatientById = async (req, res) => {
  try {
    const query = buildIdentifierQuery(req.params.id);
    const patient = await Patient.findOne(query);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with identifier "${req.params.id}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving patient record.',
    });
  }
};

/**
 * @desc    Update a patient record
 * @route   PUT /api/patients/:id
 * @access  Public
 */
const updatePatient = async (req, res) => {
  try {
    const query = buildIdentifierQuery(req.params.id);

    // Prevent overriding patientId to duplicate another
    if (req.body.patientId) {
      const duplicate = await Patient.findOne({
        patientId: req.body.patientId.toUpperCase(),
        ...(' _id' in query ? { _id: { $ne: query._id } } : {}),
      });

      if (duplicate && duplicate._id.toString() !== req.params.id) {
        return res.status(409).json({
          success: false,
          message: `Patient ID "${req.body.patientId}" is already taken by another record.`,
        });
      }
      req.body.patientId = req.body.patientId.toUpperCase();
    }

    const updatedPatient = await Patient.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: `Patient with identifier "${req.params.id}" not found for update.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient record updated successfully.',
      data: updatedPatient,
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating patient record.',
    });
  }
};

/**
 * @desc    Delete a patient record
 * @route   DELETE /api/patients/:id
 * @access  Public
 */
const deletePatient = async (req, res) => {
  try {
    const query = buildIdentifierQuery(req.params.id);
    const deletedPatient = await Patient.findOneAndDelete(query);

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: `Patient with identifier "${req.params.id}" not found for deletion.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Patient record for "${deletedPatient.name}" (${deletedPatient.patientId}) deleted successfully.`,
      deletedId: deletedPatient._id,
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting patient record.',
    });
  }
};

/**
 * @desc    Get summary statistics for dashboard
 * @route   GET /api/patients/stats
 * @access  Public
 */
const getStats = async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    const admitted = await Patient.countDocuments({ status: 'Admitted' });
    const outpatient = await Patient.countDocuments({ status: 'Outpatient' });
    const discharged = await Patient.countDocuments({ status: 'Discharged' });

    // Distinct departments
    const departments = await Patient.distinct('department');

    return res.status(200).json({
      success: true,
      data: {
        total,
        admitted,
        outpatient,
        discharged,
        departmentCount: departments.length,
        departments,
      },
    });
  } catch (error) {
    console.error('Error retrieving hospital statistics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while calculating statistics.',
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getStats,
};
