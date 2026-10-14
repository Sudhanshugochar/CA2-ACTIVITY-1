const express = require('express');
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getStats,
} = require('../controllers/patientController');

// Aggregate statistics route (must precede /:id)
router.get('/stats', getStats);

// Collection routes
router.route('/')
  .get(getAllPatients)
  .post(createPatient);

// Individual patient routes
router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router;
