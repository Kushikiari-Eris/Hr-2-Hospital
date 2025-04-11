// Add to your routes file
import express from 'express'
import {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getUserAssignments,
    getComplianceReport,
    getTrainingGapsReport,
    getCertificationExpiryReport  // Add this import
  } from '../../controllers/AdminControllers/trainingAssignment.controller.js';
  
  const router = express.Router();
  
  // Assignment CRUD routes
  router.get('/', getAllAssignments);
  router.get('/:id', getAssignmentById);
  router.post('/', createAssignment);
  router.put('/:id', updateAssignment);
  router.delete('/:id', deleteAssignment);
  
  // Additional assignment routes
  router.get('/user/:userId', getUserAssignments);
  router.get('/reports/compliance', getComplianceReport);
  router.get('/reports/gaps', getTrainingGapsReport);
  router.get('/reports/expiry', getCertificationExpiryReport);  // Add this route
  
  export default router;