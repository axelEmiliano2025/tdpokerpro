#!/usr/bin/env node

/**
 * Database Status Checker
 * Verifica el estado de la base de datos y las migraciones
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

async function checkDatabaseStatus() {
    const client = new Client(config);

    try {
        console.log('🔍 Conectando a la base de datos...\n');
        await client.connect();
        console.log('✅ Conexión exitosa\n');

        // Check database version
        const versionResult = await client.query('SELECT version()');
        console.log('📊 PostgreSQL Version:');
        console.log(versionResult.rows[0].version.split(',')[0]);
        console.log('');

        // Check extensions
        const extensionsResult = await client.query(
            "SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_trgm')"
        );
        console.log('🔌 Extensions instaladas:');
        extensionsResult.rows.forEach((row) => console.log(`  - ${row.extname}`));
        console.log('');

        // Check migrations table
        const migrationsCheck = await client.query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pgmigrations')"
        );

        if (migrationsCheck.rows[0].exists) {
            const migrationsResult = await client.query(
                'SELECT id, name, run_on FROM pgmigrations ORDER BY run_on DESC LIMIT 10'
            );
            console.log('📝 Últimas migraciones aplicadas:');
            if (migrationsResult.rows.length === 0) {
                console.log('  (ninguna migración aplicada aún)');
            } else {
                migrationsResult.rows.forEach((row) => {
                    console.log(`  - ${row.name} (${new Date(row.run_on).toLocaleString()})`);
                });
            }
        } else {
            console.log('⚠️  Tabla de migraciones no existe (ejecuta migrate:up primero)');
        }
        console.log('');

        // Check tables count
        const tablesResult = await client.query(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"
        );
        console.log(`📋 Tablas en la base de datos: ${tablesResult.rows[0].count}`);
        console.log('');

        console.log('✅ Estado de la base de datos verificado correctamente\n');
    } catch (error) {
        console.error('❌ Error al verificar la base de datos:');
        console.error(error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

checkDatabaseStatus();
