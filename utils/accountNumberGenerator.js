const Account = require('../models/account');

async function generateUniqueAccountNumber() {
    let accountNumber;
    let exists = true;

    while (exists) {
        const year = new Date().getFullYear().toString().slice(-2);
        const randomDigits = Math.floor(100000 + Math.random() * 5000000);
        accountNumber = `10${23}${randomDigits}`;

        // Check if account number already exists
        const existingAccount = await Account.findOne({ where: { accountNumber } });
        if (!existingAccount) exists = false;
    }

    console.log('Generated unique accountNumber:', accountNumber);
    return accountNumber;
}

module.exports = generateUniqueAccountNumber;
