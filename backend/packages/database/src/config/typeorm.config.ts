import { DataSource } from 'typeorm';
import * as path from 'path';

/**
 * TypeORM Data Source Configuration
 * Unified ORM for all game engine services
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tdpokerpro',

    // Entities
    entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],

    // Migrations
    migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],

    // Subscribers
    subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],

    // Options
    synchronize: false, // Use migrations instead
    logging: process.env.NODE_ENV === 'development',
    logger: 'advanced-console',

    // Timezone
    extra: {
        timezone: 'UTC',
    },
});

export default AppDataSource;
