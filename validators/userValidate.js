const Joi = require('joi');

// Validation schema for user registration
const userSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required'
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10-15 digits',
        'string.empty': 'Phone number is required'
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password must be at most 30 characters',
        'string.empty': 'Password is required'
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required'
    }),
    dateOfBirth: Joi.string().required().messages({
        'string.empty': 'Date of birth is required'
    }),
});

// Validation schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required'
    }),
});

module.exports = { userSchema, loginSchema };
