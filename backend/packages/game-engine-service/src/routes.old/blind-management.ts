import { Router } from 'express';
import { Pool } from 'pg';
import { Knex } from 'knex';
import { BlindManagementController } from '../controllers/BlindManagementController';
import { BlindManagementService } from '../services/BlindManagementService';

export function createBlindManagementRoutes(pool: Pool, db: Knex): Router {
    const router = Router();

    const service = new BlindManagementService(pool, db);
    const controller = new BlindManagementController(service);

    // POST /blinds/:tournament_id/initialize - Initialize blind tracking
    router.post('/:tournament_id/initialize', controller.initializeBlindTracking);

    // POST /blinds/:tournament_id/advance-auto - Auto-advance to next level
    router.post('/:tournament_id/advance-auto', controller.autoAdvanceBlind);

    // POST /blinds/:tournament_id/advance-manual - Manual advance (TD override)
    router.post('/:tournament_id/advance-manual', controller.manualAdvanceBlind);

    // POST /blinds/:tournament_id/break - Start/end break
    router.post('/:tournament_id/break', controller.setBreak);

    // POST /blinds/:tournament_id/color-up - Create color-up race
    router.post('/:tournament_id/color-up', controller.createColorUp);

    // POST /blinds/:tournament_id/color-up/:color_up_id/execute - Execute color-up
    router.post('/:tournament_id/color-up/:color_up_id/execute', controller.executeColorUp);

    // GET /blinds/:tournament_id/status - Get current blind status
    router.get('/:tournament_id/status', controller.getBlindStatus);

    return router;
}
