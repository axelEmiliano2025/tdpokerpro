/**
 * Database Configuration using Knex.js
 */

import knex, { Knex } from 'knex';
import { logger } from '@tdpokerpro/shared-utils';

const config: Knex.Config = {
    client: 'postgresql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'tdpokerpro_dev',
        user: process.env.DB_USER || 'tdpokerpro_user',
        password: process.env.DB_PASSWORD || 'tdpokerpro_dev_password',
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: {
        min: parseInt(process.env.DB_POOL_MIN || '2'),
        max: parseInt(process.env.DB_POOL_MAX || '10'),
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
    },
    acquireConnectionTimeout: 10000,
    debug: process.env.NODE_ENV === 'development',
};

// Create Knex instance
export const db = knex(config);

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        await db.raw('SELECT 1');
        logger.info('✅ Database connection successful');
        return true;
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        return false;
    }
}

/**
 * Close database connection
 */
export async function closeConnection(): Promise<void> {
    await db.destroy();
    logger.info('Database connection closed');
}

export default db;
