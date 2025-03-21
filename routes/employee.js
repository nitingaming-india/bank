const express = require('express');
const router = express.Router();
const { isEmployee } = require('../middleware/roleMiddleware');
const employeeController = require('../controllers/employeeController');
const upload = require('../config/multer');

// Employee Dashboard
router.get('/dashboard', isEmployee, employeeController.getDashboard);

// Create Account
router.get('/create-account', isEmployee, employeeController.getCreateAccount);
router.post('/create-account', isEmployee, upload.fields([
  { name: 'accountOpeningFormImage', maxCount: 1 },
  { name: 'customerPhoto', maxCount: 1 }
]), employeeController.createAccount);

// All Accounts
router.get('/all-accounts', isEmployee, employeeController.getAllAccounts);

// Manage Account
router.get('/manage-account/:id', isEmployee, employeeController.getManageAccount);

// Deposit
router.post('/deposit/:id', isEmployee, employeeController.deposit);

// Withdraw
router.post('/withdraw/:id', isEmployee, employeeController.withdraw);

// Search Customer
router.get('/search-customer', isEmployee, employeeController.searchCustomer);



module.exports = router;
