// routes/dashboardRoutes.js
import express from 'express';
import { 
  getDashboardStats, 
  getCourseAnalytics,
  getSuccessionPlanningAnalytics
} from '../../controllers/AdminControllers/adminDashboard.controller.js';
import { protectRoute } from '../../middleware/auth.middleware.js';

const router = express.Router();



// Main dashboard stats
router.get('/stats', getDashboardStats);

// Course analytics
router.get('/course-analytics', getCourseAnalytics);

// Succession planning analytics
router.get('/succession-analytics', protectRoute, getSuccessionPlanningAnalytics);

export default router;

// -----------------
// In your main app.js or server.js file, include:
// -----------------
// import dashboardRoutes from './routes/dashboardRoutes.js';
// app.use('/api/dashboard', dashboardRoutes);