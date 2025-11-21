const sequelize = require('../config/database');
const Account = require('../models/account');
const Transaction = require('../models/transaction');


exports.transferFunds = async (req, res) => {
    const { senderAccount, receiverAccount, amount, description } = req.body;
    const userId = req.user.id;

    // Validate request body
    if (!senderAccount || !receiverAccount || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const transaction = await sequelize.transaction();

    try {
        // Validate sender's account
        const sender = await Account.findOne({
            where: { accountNumber: senderAccount, userID: userId }
        });

        if (!sender) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Sender account not found or unauthorized' });
        }

        // Validate receiver's account
        const receiver = await Account.findOne({
            where: { accountNumber: receiverAccount }
        });

        if (!receiver) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Receiver account not found' });
        }

        // Prevent self-transfer
        if (senderAccount === receiverAccount) {
            await transaction.rollback();
            return res.status(400).json({ message: 'You cannot transfer to the same account' });
        }

        // Minimum transfer amount
        if (amount <= 100) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Amount must be greater than ₦100' });
        }

        // Check user balance
        if (sender.balance < amount) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Update balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save({ transaction });
        await receiver.save({ transaction });

        // Log transaction for sender
        const senderLog = await Transaction.create({
            accountID: sender.accountID,
            type: 'debit',
            amount,
            description: description || `Transfer to ${receiverAccount}`
        }, { transaction });

        // Log transaction for receiver
        await Transaction.create({
            accountID: receiver.accountID,
            type: 'credit',
            amount,
            description: description || `Transfer from ${senderAccount}`
        }, { transaction });

        // Commit transaction
        await transaction.commit();

        return res.status(201).json({
            message: 'Transfer successful',
            details: {
                senderAccount,
                receiverAccount,
                amount,
                description: senderLog.description,
                createdAt: senderLog.createdAt
            }
        });

    } catch (err) {
        // Rollback in case of any failure
        await transaction.rollback();
        console.error('Transfer Error:', err);

        return res.status(500).json({
            message: 'Transfer failed',
            error: err.message
        });
    }
};
