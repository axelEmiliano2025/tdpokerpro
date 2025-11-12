/**
 * Validation Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '@tdpokerpro/shared-utils';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Create validation middleware for request data
 */
export function validate(schema: ObjectSchema, target: ValidationTarget = 'body') {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const dataToValidate = req[target];

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const details = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            next(new ValidationError('Validation failed', details));
            return;
        }

        // Replace request data with validated and sanitized data
        req[target] = value;
        next();
    };
}
