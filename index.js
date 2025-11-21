const express = require('express');
require('dotenv').config();

const app = express();
const sequelize = require('./config/database');

// Routes
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transferRoutes = require('./routes/transferRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');

// Use environment port or fallback
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
};

app.use(logger);

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);

// Start server
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log('✅ Database connected successfully');
        console.log('✅ Tables synced');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error.message);
    }
});
