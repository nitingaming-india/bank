const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    // Fetch all employees (non-admin users)
    const employees = await User.find({ role: 'employee' });
    res.render('admin/dashboard', { user: req.user, employees, error: null });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const employees = await User.find({ role: 'employee' });
      return res.render('admin/dashboard', {
        user: req.user,
        employees,
        error: 'Username already exists',
      });
    }

    // Create a new employee
    const newEmployee = new User({
      username,
      password,
      role: 'employee',
    });

    // Save the employee to the database
    await newEmployee.save();
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.removeEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the employee by ID
    await User.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error removing employee:', err);
    res.status(500).send('Internal Server Error');
  }
};