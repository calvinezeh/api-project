const express = require('express');
const router = express.Router();

const accountController = require('../controllers/accountController');
const authenticate = require('../middlewares/authMiddleware');

// Create a new account
router.post('/create', authenticate, accountController.createAccount);

// Get all accounts for logged-in user
router.get('/', authenticate, accountController.getAccounts);

// Get specific account by ID
router.get('/:accountID', authenticate, accountController.getAccountsById);

// Get all transactions for a specific account
router.get('/:accountID/transactions', authenticate, accountController.getTransactionByAccount);

module.exports = router;
