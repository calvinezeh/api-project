const User = require('../models/user');
const Account = require('../models/account');
const { userSchema, loginSchema } = require('../validators/userValidate');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/token');
const generateUniqueAccountNumber = require('../utils/accountNumberGenerator');


// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['userID', 'name', 'email', 'phoneNumber', 'createdAt']
        });

        return res.status(200).json({ message: 'Users fetched successfully', data: users });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Create a new user
exports.createUser = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const { name, email, phoneNumber, password, address, dateOfBirth } = value;

        // Check for duplicate email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            address,
            dateOfBirth
        });

        // Optionally, create a default account for the user
        // const accountNumber = await generateUniqueAccountNumber();
        // const account = await Account.create({
        //     userID: newUser.userID,
        //     accountType: 'savings',
        //     accountNumber,
        //     balance: 0.0
        // });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.userID,
                name: newUser.name,
                email: newUser.email
            },
            // account: { accountNumber: account.accountNumber, balance: account.balance }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// User login
exports.loginUser = async (req, res) => {
    try {
        // Validate login request
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const { email, password } = value;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = generateToken(user);

        return res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Get logged-in user's profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: { userID: userId },
            attributes: ['userID', 'name', 'email', 'createdAt']
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        return res.status(200).json({ profile: user });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
