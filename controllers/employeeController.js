const Account = require('../models/Account');

// Employee Dashboard
exports.getDashboard = (req, res) => {
  res.render('employee/dashboard', { user: req.user });
};

// Create Account - Render form
exports.getCreateAccount = (req, res) => {
  res.render('employee/createAccount', {
    success: false,
    accountNumber: null,
    customerId: null,
  });
};

// Create Account - Handle submission
exports.createAccount = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, adhaarNumber, dob, debitCard, initialDeposit } = req.body;

    if (!req.files || !req.files['accountOpeningFormImage'] || !req.files['customerPhoto']) {
      return res.status(400).send('Both documents must be uploaded');
    }

    const accountNumber = generateAccountNumber();
    const customerId = generateCustomerId();

    const newAccount = new Account({
      firstName,
      lastName,
      accountNumber,
      customerId,
      mobileNumber,
      adhaarNumber,
      dob: new Date(dob),
      accountOpeningFormImage: req.files['accountOpeningFormImage'][0].path,
      customerPhoto: req.files['customerPhoto'][0].path,
      balance: parseFloat(initialDeposit) || 0,
      debitCard: debitCard === 'yes' ? {
        cardNumber: generateDebitCardNumber(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
      } : null
    });

    await newAccount.save();

    res.render('employee/createAccount', {
      success: true,
      accountNumber: newAccount.accountNumber,
      customerId: newAccount.customerId
    });
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Manage Account - Display details
exports.getManageAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    res.render('employee/manageAccount', { 
      account,
      formatDate: (date) => date ? new Date(date).toLocaleDateString('en-IN') : 'N/A'
    });
  } catch (err) {
    console.error('Error fetching account:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Deposit Money
exports.deposit = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).send('Account not found');

    const amount = parseFloat(req.body.amount);
    if (amount <= 0) return res.status(400).send('Invalid deposit amount');

    account.balance += amount;
    await account.save();

    res.json({ message: `Deposited ₹${amount}`, balance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing deposit');
  }
};

// Withdraw Money
exports.withdraw = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).send('Account not found');

    const amount = parseFloat(req.body.amount);
    if (amount <= 0 || amount > account.balance) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    account.balance -= amount;
    await account.save();

    res.json({ message: `Withdrew ₹${amount}`, balance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing withdrawal');
  }
};

// Search Customer
exports.searchCustomer = async (req, res) => {
  try {
    const query = req.query.query || '';
    
    if (!query.trim()) {
      return res.render('employee/searchCustomer', {
        customers: [],
        message: 'Please enter a search term',
        query: '' // Add this line
      });
    }

    const customers = await Account.find({
      $or: [
        { accountNumber: query },
        { mobileNumber: query },
        { adhaarNumber: query },
        { firstName: new RegExp(query, 'i') },
        { lastName: new RegExp(query, 'i') }
      ]
    });

    res.render('employee/searchCustomer', {
      customers,
      query // This is already here
    });
    
  } catch (err) {
    console.error('Error searching customers:', err);
    res.status(500).render('employee/searchCustomer', {
      error: 'Error performing search',
      query: req.query.query || '' // Add this line
    });
  }
};
// Helper Functions
const generateAccountNumber = () => Math.random().toString().slice(2, 17);
const generateCustomerId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
const generateDebitCardNumber = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.render('employee/allAccounts', { accounts });
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).send('Internal Server Error');
  }
};
