/**
 * API Routes
 */

import { Router, Request, Response } from 'express';
import { createAuthRouter, UserRepository } from '@tdpokerpro/auth-service';
import { createUserRouter } from '@tdpokerpro/user-service';
import { db } from '../config/database';

const router = Router();

// Initialize repositories
const userRepository = new UserRepository(db);

// Placeholder for game-engine routes (FASE 5)
const gameEngineRouter = Router();
gameEngineRouter.get('/health', (_req: Request, res: Response) => {
    res.json({ success: true, message: 'Game Engine Service - Coming in FASE 5' });
});

// Mount service routes
router.use('/auth', createAuthRouter(userRepository));
router.use('/users', createUserRouter(db));
router.use('/game-engine', gameEngineRouter); // FASE 5 placeholder

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
                gameEngine: '/game-engine (placeholder - FASE 5)',
                tournaments: '/tournaments',
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
// - /game-engine: Game Engine Service (placeholder - FASE 5)
// TODO: Add remaining service routes
// router.use('/tournaments', tournamentRoutes);
// router.use('/games', gameRoutes);
// router.use('/social', socialRoutes);
// router.use('/payments', paymentRoutes);

export default router;
