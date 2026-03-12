import Joi from 'joi';

export const RegisterAuthValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must be at most 50 characters long',
            'any.required': 'Name is required',
        }),

    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{7,14}$/)
        .required()
        .messages({
            'string.base': 'Phone must be a string',
            'string.pattern.base': 'Phone must be a valid phone number',
            'any.required': 'Phone is required',
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .min(8)
        .max(32)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 32 characters long',
            'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
            'any.required': 'Password is required',
        }),

    role: Joi.string()
        .valid('admin', 'user')
        .default('user')
        .messages({
            'string.base': 'Role must be a string',
            'any.only': 'Role must be one of: admin, user',
        }),
});