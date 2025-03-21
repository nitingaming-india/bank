const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Admin Dashboard
router.get('/dashboard', isAdmin, adminController.getDashboard);

// Add Employee
router.post('/add-employee', isAdmin, adminController.addEmployee);

// Remove Employee
router.get('/remove-employee/:id', isAdmin, adminController.removeEmployee);

module.exports = router;