exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.redirect('/login');
};

exports.isEmployee = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    return next();
  }
  res.redirect('/login');
};