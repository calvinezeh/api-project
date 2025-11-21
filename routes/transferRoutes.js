const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authMiddleware');
const transferController = require('../controllers/transferController');

// Perform a fund transfer
router.post('/', authenticate, transferController.transferFunds);

module.exports = router;
