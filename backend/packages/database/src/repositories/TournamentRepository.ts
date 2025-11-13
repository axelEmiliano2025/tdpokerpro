import { Tournament } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * Tournament Repository
 * Tournament lifecycle and statistics management
 */
export class TournamentRepository extends BaseRepository<Tournament> {
    constructor() {
        super(Tournament);
    }

    async findByStatus(status: string): Promise<Tournament[]> {
        return this.repository.find({
            where: { status },
            order: { scheduled_start_time: 'DESC' },
        });
    }

    async findActiveByTd(tdId: string): Promise<Tournament[]> {
        return this.repository.find({
            where: {
                created_by: tdId,
                status: 'STARTED',
            },
            order: { scheduled_start_time: 'ASC' },
        });
    }

    async findUpcoming(limit: number = 10): Promise<Tournament[]> {
        return this.repository
            .createQueryBuilder('tournament')
            .where('tournament.status = :status', { status: 'REGISTRATION' })
            .andWhere('tournament.scheduled_start_time > :now', { now: new Date() })
            .orderBy('tournament.scheduled_start_time', 'ASC')
            .take(limit)
            .getMany();
    }

    async getTournamentStats(tournamentId: string) {
        const tournament = await this.findById(tournamentId);
        if (!tournament) return null;

        // Query player entries separately
        const totalPlayers = await this.repository.manager.count('player_entries', {
            where: { tournament_id: tournamentId },
        });

        const activePlayers = await this.repository.manager.count('player_entries', {
            where: { tournament_id: tournamentId, status: 'ACTIVE' },
        });

        return {
            id: tournament.id,
            name: tournament.name,
            status: tournament.status,
            totalPlayers,
            activePlayers,
            buyInCents: tournament.buy_in_cents,
            scheduledStartTime: tournament.scheduled_start_time,
        };
    }

    async updateStatus(tournamentId: string, status: string): Promise<Tournament | null> {
        await this.repository.update(tournamentId, { status });
        return this.findById(tournamentId);
    }
}
