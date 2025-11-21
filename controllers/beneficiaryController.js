const Beneficiary = require('../models/beneficiary');
const Account = require('../models/account');
const User = require('../models/user');


// Add a new beneficiary
exports.addBeneficiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { accountNumber, bankName, alias } = req.body;

        // Validate input
        if (!accountNumber || !bankName || !alias) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if account exists
        const account = await Account.findOne({ where: { accountNumber } });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        // Prevent adding own account
        if (account.userID === userId) {
            return res.status(400).json({ message: 'You cannot add your own account as a beneficiary' });
        }

        // Check if beneficiary already exists
        const exists = await Beneficiary.findOne({ where: { userID: userId, accountNumber } });
        if (exists) {
            return res.status(400).json({ message: 'Beneficiary already exists' });
        }

        // Create beneficiary
        const beneficiary = await Beneficiary.create({
            userID: userId,
            accountNumber,
            bankName,
            alias
        });

        return res.status(201).json({
            message: 'Beneficiary added successfully',
            beneficiary
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Get all beneficiaries for logged-in user
exports.getBeneficiaries = async (req, res) => {
    try {
        const userId = req.user.id;

        const beneficiaries = await Beneficiary.findAll({
            where: { userID: userId },
            attributes: ['beneficiaryID', 'alias', 'accountNumber', 'bankName', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            message: 'Beneficiaries fetched successfully',
            data: beneficiaries
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Delete a beneficiary
exports.deleteBeneficiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Destroy returns number of rows deleted
        const deleted = await Beneficiary.destroy({
            where: { beneficiaryID: id, userID: userId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Beneficiary not found' });
        }

        return res.status(200).json({ message: 'Beneficiary removed successfully' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
