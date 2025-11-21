const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const generateUniqueAccountNumber = require('../utils/accountNumberGenerator');

const Account = sequelize.define('Account', {
    accountID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    accountType: {
        type: DataTypes.ENUM('savings', 'current'),
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    userID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

// Associations
Account.belongsTo(User, { foreignKey: 'userID' });
User.hasMany(Account, { foreignKey: 'userID' });

// Auto-generate unique account number before creating account
Account.beforeCreate(async (account) => {
    account.accountNumber = await generateUniqueAccountNumber();
    console.log(`api-project: generated account number -> ${account.accountNumber}`);
});

module.exports = Account;
