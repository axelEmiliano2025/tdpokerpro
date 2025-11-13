import { PlayerEntry } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * PlayerEntry Repository
 * Tournament player registrations and eliminations
 */
export class PlayerEntryRepository extends BaseRepository<PlayerEntry> {
    constructor() {
        super(PlayerEntry);
    }

    async findByTournament(tournamentId: string): Promise<PlayerEntry[]> {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            relations: { player: true },
            order: { createdAt: 'ASC' },
        });
    }

    async findActiveInTournament(tournamentId: string): Promise<PlayerEntry[]> {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                status: 'ACTIVE',
            },
            relations: { player: true },
        });
    }

    async eliminatePlayer(entryId: string, position: number): Promise<PlayerEntry | null> {
        const entry = await this.findById(entryId);
        if (!entry) return null;

        await this.repository.update(entryId, {
            status: 'ELIMINATED',
            finishing_position: position,
            busted_at: new Date(),
        });

        return this.findById(entryId);
    }

    async getPlayerPosition(tournamentId: string, playerId: string): Promise<number | null> {
        const entry = await this.repository.findOne({
            where: { tournament_id: tournamentId, player_id: playerId },
        });

        return entry?.finishing_position || null;
    }

    async countActiveEntries(tournamentId: string): Promise<number> {
        return this.repository.count({
            where: {
                tournament_id: tournamentId,
                status: 'ACTIVE',
            },
        });
    }
}
