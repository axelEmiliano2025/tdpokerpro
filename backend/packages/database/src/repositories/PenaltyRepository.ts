import { Penalty } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * Penalty Repository
 * Tournament penalties and escalation tracking
 */
export class PenaltyRepository extends BaseRepository<Penalty> {
    constructor() {
        super(Penalty);
    }

    async findByTournament(tournamentId: string): Promise<Penalty[]> {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            relations: { playerEntry: true, imposedBy: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findEscalationChain(tournamentId: string, playerEntryId: string): Promise<Penalty[]> {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                player_entry_id: playerEntryId,
            },
            order: { createdAt: 'ASC' },
        });
    }

    async getPlayerPenaltyHistory(playerEntryId: string, limit: number = 50): Promise<Penalty[]> {
        return this.repository.find({
            where: { player_entry_id: playerEntryId },
            relations: { tournament: true, imposedBy: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async countActivePenalties(tournamentId: string, playerEntryId: string): Promise<number> {
        return this.repository.count({
            where: {
                tournament_id: tournamentId,
                player_entry_id: playerEntryId,
                removal_from_tournament: false,
            },
        });
    }

    async getNextEscalationLevel(tournamentId: string, playerEntryId: string): Promise<number> {
        const count = await this.repository.count({
            where: {
                tournament_id: tournamentId,
                player_entry_id: playerEntryId,
            },
        });

        // 1st = warning, 2nd = 1 round, 3rd = 2 rounds, 4th+ = disqualification
        return Math.min(count + 1, 4);
    }
}
