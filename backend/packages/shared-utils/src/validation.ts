/**
 * Validation Utilities using Joi
 */

import Joi from 'joi';

// Common validation schemas
export const schemas = {
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),

    password: Joi.string().min(8).max(100).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must not exceed 100 characters',
        'any.required': 'Password is required',
    }),

    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must not exceed 30 characters',
        'any.required': 'Username is required',
    }),

    uuid: Joi.string().uuid().required().messages({
        'string.uuid': 'Must be a valid UUID',
        'any.required': 'ID is required',
    }),

    positiveNumber: Joi.number().positive().required().messages({
        'number.positive': 'Must be a positive number',
        'any.required': 'Value is required',
    }),

    pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().optional(),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    }),
};

/**
 * Validate data against a Joi schema
 */
export function validate<T>(
    schema: Joi.Schema,
    data: unknown,
    options?: Joi.ValidationOptions
): T {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        ...options,
    });

    if (error) {
        const errorDetails = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));

        throw new ValidationError('Validation failed', errorDetails);
    }

    return value as T;
}

/**
 * Custom Validation Error
 */
export class ValidationError extends Error {
    public details: Array<{ field: string; message: string }>;

    constructor(message: string, details: Array<{ field: string; message: string }>) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default { schemas, validate, ValidationError };
