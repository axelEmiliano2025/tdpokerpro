/**
 * Global Error Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@tdpokerpro/shared-utils';
import { AppError, ValidationError, NotFoundError, UnauthorizedError } from '@tdpokerpro/shared-utils';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log error
    logger.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });

    // Handle known error types
    if (error instanceof ValidationError) {
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: error.message,
                details: error.details,
            },
        });
        return;
    }

    if (error instanceof NotFoundError) {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: error.message,
            },
        });
        return;
    }

    if (error instanceof UnauthorizedError) {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: error.message,
            },
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code || 'APP_ERROR',
                message: error.message,
            },
        });
        return;
    }    // Handle unknown errors
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : error.message,
        },
    });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
}
