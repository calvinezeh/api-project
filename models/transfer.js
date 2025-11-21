const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Account = require('./account');

const Transfer = sequelize.define('Transfer', {
    transferID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    senderAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Account,
            key: 'accountID',
        },
    },
    receiverAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Account,
            key: 'accountID',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),   // safer for money
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'successful', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

// Associations
Transfer.belongsTo(Account, {
    as: 'senderAccount',
    foreignKey: 'senderAccountId',
});

Transfer.belongsTo(Account, {
    as: 'receiverAccount',
    foreignKey: 'receiverAccountId',
});

module.exports = Transfer;
