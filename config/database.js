const Sequelize = require('sequelize');
require("dotenv").config();

const password = process.env.DB_PASSWORD;

if (typeof password !== 'string') {
    // This code line is usually fine, but confirms the issue
    console.error("Password is not a string:", password); 
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
});

module.exports = sequelize;