/**
 * API Gateway Entry Point
 */

export { createApp } from './app';
export { startServer } from './server';
export { db, testConnection, closeConnection } from './config/database';
export * from './middleware';
