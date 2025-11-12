/**
 * @tdpokerpro/game-engine-service
 * 
 * Motor de juegos - Lógica de torneos y cash games
 * 
 * Responsabilidades:
 * - Tournament engine
 * - Cash game engine
 * - Table management
 * - Blind structure calculator
 * - Hand evaluator
 * - Chip tracking
 * - Prize distribution
 */

import { Router } from 'express';
import { Knex } from 'knex';
import { createTournamentRoutes } from './routes/tournaments';

export function createGameEngineRouter(db: Knex): Router {
    const router = Router();

    // Mount tournament routes
    router.use('/tournaments', createTournamentRoutes(db));

    // Health check
    router.get('/health', (_req, res) => {
        res.json({ success: true, service: 'game-engine-service', status: 'ok' });
    });

    return router;
}
