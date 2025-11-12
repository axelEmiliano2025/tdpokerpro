/**
 * Application Configuration
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    // Application
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
    apiVersion: process.env.API_VERSION || 'v1',

    // Database
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'tdpokerpro_dev',
        user: process.env.DB_USER || 'tdpokerpro_user',
        password: process.env.DB_PASSWORD || 'tdpokerpro_dev_password',
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
        credentials: process.env.CORS_CREDENTIALS === 'true',
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
} as const;

export default config;
