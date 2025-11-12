import { Router } from 'express';
import { TournamentController } from '../controllers/TournamentController';
import { TournamentService } from '../services/TournamentService';
import { TournamentRepository } from '../repositories/TournamentRepository';
import { Knex } from 'knex';

export function createTournamentRoutes(db: Knex): Router {
    const router = Router();

    const repository = new TournamentRepository(db);
    const service = new TournamentService(repository);
    const controller = new TournamentController(service);

    // Routes
    router.post('/', controller.createTournament);
    router.get('/', controller.listTournaments);
    router.get('/:id', controller.getTournament);
    router.put('/:id', controller.updateTournament);
    router.delete('/:id', controller.deleteTournament);

    return router;
}
