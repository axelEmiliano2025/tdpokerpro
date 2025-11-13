import { PlayerEntry } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * PlayerEntry Repository
 * Tournament player registration & participation
 */
export class PlayerEntryRepository extends BaseRepository<PlayerEntry> {
    constructor() {
        super(PlayerEntry);
    }

    async findByTournament(tournamentId: string, status?: string) {
        const where: any = { tournament_id: tournamentId };
        if (status) {
            where.status = status;
        }

        return this.repository.find({
            where,
            relations: ['player', 'tournament'],
            order: { entry_number: 'ASC' },
        });
    }

    async findByPlayer(playerId: string) {
        return this.repository.find({
            where: { player_id: playerId },
            relations: ['tournament'],
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveInTournament(tournamentId: string) {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                status: 'ACTIVE',
            },
            relations: ['player'],
        });
    }

    async countRegistered(tournamentId: string): Promise<number> {
        return this.repository.count({
            where: {
                tournament_id: tournamentId,
                status: 'REGISTERED',
            },
        });
    }

    async countActive(tournamentId: string): Promise<number> {
        return this.repository.count({
            where: {
                tournament_id: tournamentId,
                status: 'ACTIVE',
            },
        });
    }

    async findEliminated(tournamentId: string) {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                status: 'ELIMINATED',
            },
            order: { finishing_position: 'ASC' },
            relations: ['player'],
        });
    }

    async updateStack(id: string, stackCents: number): Promise<void> {
        await this.repository.update(id, {
            current_stack: stackCents,
        });
    }

    async eliminatePlayer(id: string, position: number, prize: number): Promise<void> {
        await this.repository.update(id, {
            status: 'ELIMINATED',
            finishing_position: position,
            finishing_prize_cents: prize,
            busted_at: new Date(),
        });
    }
}
