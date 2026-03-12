import Joi from 'joi';

export const LoginAuthValidationSchema = Joi.object({
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
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'any.required': 'Password is required',
        }),
});