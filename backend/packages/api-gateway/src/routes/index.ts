/**
 * API Routes
 */

import { Router, Request, Response } from 'express';
import { createAuthRouter, UserRepository } from '@tdpokerpro/auth-service';
import { db } from '../config/database';

const router = Router();

// Initialize repositories
const userRepository = new UserRepository(db);

// Mount auth routes
router.use('/auth', createAuthRouter(userRepository));

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
                users: '/users',
                tournaments: '/tournaments',
                games: '/games',
                social: '/social',
                payments: '/payments',
            },
        },
    });
});

// TODO: Add service-specific routes
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/tournaments', tournamentRoutes);
// router.use('/games', gameRoutes);
// router.use('/social', socialRoutes);
// router.use('/payments', paymentRoutes);

export default router;
