import { PlayerStatistics } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * PlayerStatistics Repository
 * Player performance analytics
 */
export class PlayerStatisticsRepositoryTypeORM extends BaseRepository<PlayerStatistics> {
    constructor() {
        super(PlayerStatistics);
    }

    async findByPlayer(playerId: string): Promise<PlayerStatistics | null> {
        return this.repository.findOne({
            where: { player_id: playerId },
            relations: ['player'],
        });
    }

    async getTopByROI(limit = 10) {
        return this.repository.find({
            order: { roi: 'DESC' },
            relations: ['player'],
            take: limit,
        });
    }

    async getTopByWinRate(limit = 10) {
        return this.repository
            .createQueryBuilder('ps')
            .leftJoinAndSelect('ps.player', 'player')
            .where('ps.is_winner = :isWinner', { isWinner: true })
            .orderBy('ps.roi', 'DESC')
            .take(limit)
            .getMany();
    }

    async updateAfterTournament(
        playerId: string,
        tournamentId: string,
        buyin: number,
        prize: number,
        position: number
    ): Promise<void> {
        const roi = buyin > 0 ? ((prize - buyin) / buyin) * 100 : 0;

        await this.repository.save({
            player_id: playerId,
            tournament_id: tournamentId,
            entry_count: 1,
            buy_in_total: buyin,
            final_position: position,
            prize_earned: prize,
            roi,
            is_winner: position === 1,
            made_final_table: position <= 9,
        });
    }
}
