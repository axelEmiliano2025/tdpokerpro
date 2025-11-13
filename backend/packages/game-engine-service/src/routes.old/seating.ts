import { Router } from 'express';
import { SeatingController } from '../controllers/SeatingController';
import { SeatingService } from '../services/SeatingService';
import { SeatingRepository } from '../repositories/SeatingRepository';
import { PlayerEntryRepository } from '../repositories/PlayerEntryRepository';
import { Pool } from 'pg';

export function createSeatingRoutes(pool: Pool): Router {
    const router = Router();

    const seatingRepository = new SeatingRepository(pool);
    const playerRepository = new PlayerEntryRepository(pool);
    const service = new SeatingService(seatingRepository, playerRepository);
    const controller = new SeatingController(service);

    // Routes
    router.post('/:tournament_id/initial', (req, res) => controller.performInitialSeating(req, res));
    router.post('/:tournament_id/late-reg/:player_entry_id', (req, res) => controller.seatLateRegistration(req, res));
    router.post('/:tournament_id/break-table/:table_number', (req, res) => controller.breakTable(req, res));
    router.post('/:tournament_id/balance', (req, res) => controller.balanceTables(req, res));
    router.get('/:tournament_id/halting-play', (req, res) => controller.checkHaltingPlay(req, res));
    router.get('/:tournament_id/player/:player_id', (req, res) => controller.getPlayerSeating(req, res));

    return router;
}
