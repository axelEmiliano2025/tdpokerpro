import { TournamentStatistics } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * TournamentStatistics Repository
 * Tournament performance analytics
 */
export class TournamentStatisticsRepositoryTypeORM extends BaseRepository<TournamentStatistics> {
    constructor() {
        super(TournamentStatistics);
    }

    async findByTournament(tournamentId: string): Promise<TournamentStatistics | null> {
        return this.repository.findOne({
            where: { tournament_id: tournamentId },
            relations: ['tournament'],
        });
    }

    async updateRegistration(tournamentId: string, delta: number): Promise<void> {
        await this.repository.increment(
            { tournament_id: tournamentId },
            'registered_players',
            delta
        );
    }

    async updateRebuys(tournamentId: string, rebuys: number): Promise<void> {
        await this.repository.increment(
            { tournament_id: tournamentId },
            'total_rebuys',
            rebuys
        );
    }

    async updatePrizePool(tournamentId: string, amount: number): Promise<void> {
        await this.repository.increment(
            { tournament_id: tournamentId },
            'total_prize_pool',
            amount
        );
    }

    async setFinalStats(
        tournamentId: string,
        registered: number,
        started: number,
        finished: number
    ): Promise<void> {
        await this.repository.update(
            { tournament_id: tournamentId },
            {
                registered_players: registered,
                started_players: started,
                finished_players: finished,
                is_completed: true,
            }
        );
    }
}
