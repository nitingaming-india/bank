const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');


// Load environment variables
require('dotenv').config();

// Import Passport configuration
require('./config/passport');

const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// Add these before routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from uploads directory


// Session configuration
app.use(session({
  secret: 'NITINKUMAR639638982007ISSECRETKODECODEKARKEBATAO',
  resave: false,
  saveUninitialized: false,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/employee', require('./routes/employee'));

// Home Route
app.get('/', (req, res) => {
  res.render('home');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
