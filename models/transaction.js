const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Account = require('./account');

const Transaction = sequelize.define('Transaction', {
    transactionID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    accountID: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

// Associations
Transaction.belongsTo(Account, { foreignKey: 'accountID' });
Account.hasMany(Transaction, { foreignKey: 'accountID' });

module.exports = Transaction;
