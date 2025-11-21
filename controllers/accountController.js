const Account = require('../models/account');
const Transaction = require('../models/transaction');

// Generates a fresh unique account number
const generateAccNumber = async () => {
    let isTaken = true;
    let accountNumber;

    while (isTaken) {
        const yy = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(100000 + Math.random() * 5000000);
        accountNumber = `10${23}${random}`;

        const foundAccount = await Account.findOne({ where: { accountNumber } });
        if (!foundAccount) isTaken = false;
    }

    return accountNumber;
};

exports.createAccount = async (req, res) => {
    try {
        const { userID, accountType, balance } = req.body;

        const accountNumber = await generateAccNumber();

        const newAccount = await Account.create({
            userID,
            accountType,
            accountNumber,
            balance,
        });

        return res.status(201).json({
            message: "Account created successfully",
            data: newAccount,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();

        return res.status(200).json({
            message: "Accounts fetched successfully",
            data: accounts
        });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getAccountsById = async (req, res) => {
    try {
        const { accountID } = req.params;

        const fetchedAccount = await Account.findOne({
            where: { accountID }
        });

        if (!fetchedAccount) {
            return res.status(404).json({
                message: 'Account not found'
            });
        }

        return res.status(200).json({
            message: "Account details fetched successfully",
            data: fetchedAccount
        });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getTransactionByAccount = async (req, res) => {
    try {
        const { accountID } = req.params;

        const accountExists = await Account.findOne({
            where: { accountID }
        });

        if (!accountExists) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const accountTransactions = await Transaction.findAll({
            where: { accountID },
            attributes: ['transactionID', 'type', 'amount', 'description', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        if (!accountTransactions.length) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        return res.status(200).json({
            message: `Transactions for account ${accountID} fetched successfully`,
            total: accountTransactions.length,
            data: accountTransactions
        });

    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
};
