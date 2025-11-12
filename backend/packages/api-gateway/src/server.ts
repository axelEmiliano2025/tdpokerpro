/**
 * Server Entry Point
 */

import { createApp } from './app';
import { testConnection, closeConnection } from './config/database';
import { logger } from '@tdpokerpro/shared-utils';
import config from './config';

/**
 * Start the server
 */
async function startServer(): Promise<void> {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            logger.warn('⚠️ Server starting without database connection');
        }

        // Create Express app
        const app = createApp();

        // Start HTTP server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 API Gateway running on port ${config.port}`);
            logger.info(`📍 Environment: ${config.nodeEnv}`);
            logger.info(`📡 API Version: ${config.apiVersion}`);
            logger.info(`🔗 Health check: http://localhost:${config.port}/api/v1/health`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await closeConnection();
                    logger.info('✅ Shutdown complete');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start server if running directly
if (require.main === module) {
    startServer();
}

export { startServer };
