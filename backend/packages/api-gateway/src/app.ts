/**
 * Express Application Setup
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import routes from './routes';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';

/**
 * Create and configure Express application
 */
export function createApp(): Express {
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors({
        origin: config.cors.origin,
        credentials: config.cors.credentials,
    }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.maxRequests,
        message: {
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests, please try again later',
            },
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api/', limiter);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    app.use(requestLogger);

    // API routes
    app.use('/api/v1', routes);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
}

export default createApp;
