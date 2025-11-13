import { Router } from 'express';
import { RegistrationController } from '../controllers/RegistrationController';
import { RegistrationService } from '../services/RegistrationService';
import { PlayerEntryRepository } from '../repositories/PlayerEntryRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { Pool } from 'pg';
import { Knex } from 'knex';

export function createRegistrationRoutes(db: Knex, pool: Pool): Router {
    const router = Router();

    const entryRepository = new PlayerEntryRepository(pool);
    const tournamentRepository = new TournamentRepository(db);
    const service = new RegistrationService(entryRepository, tournamentRepository);
    const controller = new RegistrationController(service);

    // Routes
    router.post('/', (req, res) => controller.registerPlayer(req, res));
    router.get('/:tournament_id/:player_id', (req, res) => controller.getPlayerEntries(req, res));
    router.get('/:tournament_id/active', (req, res) => controller.getActivePlayers(req, res));
    router.put('/:entry_id/eliminate', (req, res) => controller.eliminatePlayer(req, res));
    router.post('/bounty', (req, res) => controller.recordBountyWon(req, res));

    return router;
}
