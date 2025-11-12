/**
 * API Routes
 */

import { Router, Request, Response } from 'express';
import { createAuthRouter, UserRepository } from '@tdpokerpro/auth-service';
import { createUserRouter } from '@tdpokerpro/user-service';
import { createGameEngineRouter } from '@tdpokerpro/game-engine-service';
import { db } from '../config/database';

const router = Router();

// Initialize repositories
const userRepository = new UserRepository(db);

// Mount service routes
router.use('/auth', createAuthRouter(userRepository));
router.use('/users', createUserRouter(db));
router.use('/game-engine', createGameEngineRouter(db)); // FASE 5 - Tournament Management

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
// - /game-engine: Game Engine Service (FASE 5 - Tournament Management)
//   - /game-engine/tournaments: CRUD operations
// TODO: Add remaining service routes
// router.use('/games', gameRoutes);
// router.use('/social', socialRoutes);
// router.use('/payments', paymentRoutes);

export default router;
