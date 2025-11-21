const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authMiddleware');
const beneficiaryController = require('../controllers/beneficiaryController');

// Add a new beneficiary
router.post('/', authenticate, beneficiaryController.addBeneficiary);

// Get all beneficiaries for logged-in user
router.get('/', authenticate, beneficiaryController.getBeneficiaries);

// Delete a beneficiary by ID
router.delete('/:id', authenticate, beneficiaryController.deleteBeneficiary);

module.exports = router;
