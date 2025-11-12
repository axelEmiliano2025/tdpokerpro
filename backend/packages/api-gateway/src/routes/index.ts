/**
 * API Routes
 */

import { Router, Request, Response } from 'express';
import { createAuthRouter, UserRepository } from '@tdpokerpro/auth-service';
import { createUserRouter } from '@tdpokerpro/user-service';
import { createGameEngineRouter } from '@tdpokerpro/game-engine-service';
import { db } from '../config/database';
import { Pool } from 'pg';

const router = Router();

// Initialize pg.Pool for game-engine-service
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'tdpokerpro_dev',
    user: process.env.DB_USER || 'tdpokerpro_user',
    password: process.env.DB_PASSWORD || 'tdpokerpro_dev_password',
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Initialize repositories
const userRepository = new UserRepository(db);

// Mount service routes
router.use('/auth', createAuthRouter(userRepository));
router.use('/users', createUserRouter(db));
router.use('/game-engine', createGameEngineRouter(db, pool)); // FASE 5 - Tournament Management + Player Registration

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.API_VERSION || 'v1',
        },
    });
});

/**
 * API info endpoint
 */
router.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            name: 'TDPokerPro API Gateway',
            version: process.env.API_VERSION || 'v1',
            description: 'API Gateway for TDPokerPro Platform',
            endpoints: {
                health: '/health',
                auth: '/auth',
                users: '/users (integrated)',
                gameEngine: '/game-engine (integrated - FASE 5)',
                tournaments: '/game-engine/tournaments (integrated)',
                registration: '/game-engine/registration (integrated - MÓDULO 2)',
                games: '/games',
                social: '/social',
                payments: '/payments',
            },
        },
    });
});

// Service routes mounted:
// - /auth: Authentication Service
// - /users: User Management Service
// - /game-engine: Game Engine Service (FASE 5)
//   - /game-engine/tournaments: Tournament CRUD operations (MÓDULO 1)
//   - /game-engine/registration: Player Registration & Entry Management (MÓDULO 2)
// TODO: Add remaining service routes
// router.use('/games', gameRoutes);
// router.use('/social', socialRoutes);
// router.use('/payments', paymentRoutes);

export default router;
