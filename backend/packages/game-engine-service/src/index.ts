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
import { Pool } from 'pg';
import { createTournamentRoutes } from './routes/tournaments';
import { createRegistrationRoutes } from './routes/registration';
import { createSeatingRoutes } from './routes/seating';

export function createGameEngineRouter(db: Knex, pool: Pool): Router {
    const router = Router();

    // Mount tournament routes
    router.use('/tournaments', createTournamentRoutes(db));

    // Mount registration routes
    router.use('/registration', createRegistrationRoutes(db, pool));

    // Mount seating routes
    router.use('/seating', createSeatingRoutes(pool));

    // Health check
    router.get('/health', (_req, res) => {
        res.json({ success: true, service: 'game-engine-service', status: 'ok' });
    });

    return router;
}
