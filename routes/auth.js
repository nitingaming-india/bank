const express = require('express');
const router = express.Router();
const passport = require('passport');

// GET /login - Render the login page
router.get('/login', (req, res) => {
  const role = req.query.role; // Get the role from the query parameter
  const error = req.query.error; // Get the error message from the query parameter
  res.render('login', { role, error });
});

// POST /login - Handle login form submission
router.post('/login', (req, res, next) => {
  const role = req.body.role; // Get the role from the form
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect(`/login?role=${role}&error=Invalid username or password`);
    }

    // Check if the user's role matches the selected role
    if (user.role !== role) {
      return res.redirect(`/login?role=${role}&error=Invalid role`);
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Redirect to the appropriate dashboard based on the role
      if (role === 'admin') return res.redirect('/admin/dashboard');
      if (role === 'employee') return res.redirect('/employee/dashboard');
    });
  })(req, res, next);
});

// GET /logout - Handle user logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;