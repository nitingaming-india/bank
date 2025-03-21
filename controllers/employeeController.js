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
// exports.getManageAccount = async (req, res) => {
//   try {
//     const account = await Account.findById(req.params.id);
//     res.render('employee/manageAccount', { 
//       account,
//       formatDate: (date) => date ? new Date(date).toLocaleDateString('en-IN') : 'N/A'
//     });
//   } catch (err) {
//     console.error('Error fetching account:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };
exports.getManageAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate({
        path: 'transactions',
        populate: {
          path: 'initiator',
          select: 'name'
        }
      });

    res.render('employee/manageAccount', {
      account,
      formatDate: (date) => date.toLocaleDateString('en-IN')
    });
  } catch (err) {
    console.error('Error fetching account:', err);
    res.status(500).send('Internal Server Error');
  }
};
// Add proper error handling to deposit
const validateAmount = (amount) => {
  const numericAmount = parseFloat(amount);
  return !isNaN(numericAmount) && numericAmount > 0;
};

// exports.deposit = async (req, res) => {
//   try {

//     console.log('Deposit Request Body:', req.body); // Add this line
//     const account = await Account.findById(req.params.id);
//     console.log('Raw Amount:', req.body.amount); 
   
//     if (!account) return res.status(404).json({ error: "Account not found" });

//     if (!validateAmount(req.body.amount)) {
//       return res.status(400).json({ error: "Invalid amount. Please enter a positive number" });
//     }

//     const amount = parseFloat(req.body.amount);
//     account.balance += amount;
//     await account.save();

//     res.json({ 
//       success: true,
//       message: `Deposited ₹${amount.toFixed(2)}`,
//       balance: account.balance.toFixed(2)
//     });
//   } catch (error) {
//     console.error("Deposit error:", error);
//     res.status(500).json({ error: "Server error during deposit" });
//   }
// };

// exports.withdraw = async (req, res) => {
//   try {
//     const account = await Account.findById(req.params.id);
//     if (!account) return res.status(404).json({ error: "Account not found" });

//     if (!validateAmount(req.body.amount)) {
//       return res.status(400).json({ error: "Invalid amount. Please enter a positive number" });
//     }

//     const amount = parseFloat(req.body.amount);
//     if (amount > account.balance) {
//       return res.status(400).json({ 
//         error: `Insufficient funds. Available: ₹${account.balance.toFixed(2)}`
//       });
//     }

//     account.balance -= amount;
//     await account.save();

//     res.json({ 
//       success: true,
//       message: `Withdrew ₹${amount.toFixed(2)}`,
//       balance: account.balance.toFixed(2)
//     });
//   } catch (error) {
//     console.error("Withdrawal error:", error);
//     res.status(500).json({ error: "Server error during withdrawal" });
//   }
// };


const Transaction = require('../models/Transaction');

// Helper function to create transaction
const createTransaction = async (type, amount, initiator, account) => {
  const transaction = new Transaction({
    type,
    amount,
    initiator,
    account: account._id
  });
  await transaction.save();
  return transaction;
};

exports.deposit = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    const amount = parseFloat(req.body.amount);

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }

    // Perform transaction
    const transaction = await createTransaction(
      'deposit',
      amount,
      req.user._id,  // Assuming employee is authenticated
      account
    );

    // Update account
    account.balance += amount;
    account.transactions.push(transaction._id);
    await account.save();

    res.json({
      success: true,
      transactionId: transaction.transactionId,
      newBalance: account.balance.toFixed(2),
      timestamp: transaction.timestamp.toLocaleString('en-IN')
    });

  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ error: "Server error during deposit" });
  }
};

// Similar implementation for withdrawal
exports.withdraw = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    const amount = parseFloat(req.body.amount);

    // Validate amount and balance
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }
    if (amount > account.balance) {
      return res.status(400).json({ 
        error: `Insufficient funds. Available: ₹${account.balance.toFixed(2)}`
      });
    }

    // Perform transaction
    const transaction = await createTransaction(
      'withdrawal',
      amount,
      req.user._id,
      account
    );

    // Update account
    account.balance -= amount;
    account.transactions.push(transaction._id);
    await account.save();

    res.json({
      success: true,
      transactionId: transaction.transactionId,
      newBalance: account.balance.toFixed(2),
      timestamp: transaction.timestamp.toLocaleString('en-IN')
    });

  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ error: "Server error during withdrawal" });
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





