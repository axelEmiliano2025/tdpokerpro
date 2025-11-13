import { Router } from 'express';
import { Pool } from 'pg';
import { PenaltyController } from '../controllers/PenaltyController';

export const createPenaltyRoutes = (pool: Pool): Router => {
    const router = Router();
    const controller = new PenaltyController(pool);

    // POST /api/penalties - Impose a penalty
    router.post('/', controller.imposePenalty);

    // GET /api/penalties/player/:tournamentId/:playerEntryId - Get player penalty history
    router.get('/player/:tournamentId/:playerEntryId', controller.getPlayerPenaltyHistory);

    // GET /api/penalties/tournament/:tournamentId - Get all tournament penalties
    router.get('/tournament/:tournamentId', controller.getTournamentPenalties);

    // GET /api/penalties/status/:tournamentId/:playerEntryId - Get player penalty status
    router.get('/status/:tournamentId/:playerEntryId', controller.getPlayerPenaltyStatus);

    return router;
};
