#!/usr/bin/env node

/**
 * Database Seeder
 * Puebla la base de datos con datos de prueba
 */

const { Client } = require('pg');
require('dotenv').config({ path: '../../../.env' });

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'tdpokerpro_dev',
    user: process.env.DB_USER || 'tdpokerpro_user',
    password: process.env.DB_PASSWORD || 'tdpokerpro_dev_password',
};

async function seedDatabase() {
    const client = new Client(config);

    try {
        console.log('🌱 Iniciando seeding de la base de datos...\n');
        await client.connect();

        // TODO: Implementar seeds en fases posteriores
        console.log('✅ Seeding completado\n');
    } catch (error) {
        console.error('❌ Error al hacer seed:');
        console.error(error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

seedDatabase();
