exports.sanitizeNumbers = (req, res, next) => {
    if (req.body.amount) {
      // Remove all non-numeric characters except decimal point
      const sanitized = req.body.amount.toString()
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1'); // Remove multiple decimals
      
      req.body.amount = sanitized;
    }
    next();
  };