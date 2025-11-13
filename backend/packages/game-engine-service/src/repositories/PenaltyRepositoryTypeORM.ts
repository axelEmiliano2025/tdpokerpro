import { Penalty } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * Penalty Repository
 * TDA infraction tracking
 */
export class PenaltyRepositoryTypeORM extends BaseRepository<Penalty> {
    constructor() {
        super(Penalty);
    }

    async findByTournament(tournamentId: string) {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            relations: ['playerEntry', 'imposedBy'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByPlayer(playerEntryId: string) {
        return this.repository.find({
            where: { player_entry_id: playerEntryId },
            order: { createdAt: 'DESC' },
        });
    }

    async findByInfractionType(tournamentId: string, type: string) {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                infraction_type: type,
            },
            relations: ['playerEntry'],
        });
    }

    async countByPenaltyLevel(tournamentId: string, level: string): Promise<number> {
        return this.repository.count({
            where: {
                tournament_id: tournamentId,
                penalty_level: level,
            },
        });
    }

    async findDisqualifications(tournamentId: string) {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                penalty_level: 'DISQUALIFICATION',
            },
            relations: ['playerEntry', 'imposedBy'],
        });
    }

    async findEscalationChain(penaltyId: string): Promise<Penalty[]> {
        const penalty = await this.repository.findOne({
            where: { id: penaltyId },
        });

        if (!penalty || !penalty.previous_penalty_id) return penalty ? [penalty] : [];

        const previous = await this.findEscalationChain(penalty.previous_penalty_id);
        return [...previous, penalty];
    }

    async getPlayerPenaltyHistory(playerEntryId: string) {
        return this.repository.find({
            where: { player_entry_id: playerEntryId },
            order: { createdAt: 'ASC' },
        });
    }
}
