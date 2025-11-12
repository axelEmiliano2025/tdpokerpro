/**
 * Request Logger Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@tdpokerpro/shared-utils';

/**
 * Log HTTP requests
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();

    // Log request
    logger.info(`→ ${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';

        logger[logLevel](`← ${req.method} ${req.path} ${res.statusCode}`, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
}
