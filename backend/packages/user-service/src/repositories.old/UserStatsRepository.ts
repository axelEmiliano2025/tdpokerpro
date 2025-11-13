/**
 * User Stats Repository
 */

import { Knex } from 'knex';
import { UserStats } from '@tdpokerpro/shared-types';

export class UserStatsRepository {
    constructor(private db: Knex) { }

    /**
     * Buscar estadísticas por user ID
     */
    async findByUserId(userId: string): Promise<UserStats | null> {
        const stats = await this.db('user_stats')
            .where({ user_id: userId })
            .first();

        return stats || null;
    }

    /**
     * Crear estadísticas de usuario
     */
    async create(userId: string): Promise<UserStats> {
        const [stats] = await this.db('user_stats')
            .insert({
                user_id: userId,
                total_tournaments: 0,
                tournaments_won: 0,
                total_games: 0,
                games_won: 0,
                total_hands: 0,
                hands_won: 0,
                biggest_win: 0,
                total_winnings: 0,
                total_buy_ins: 0,
                roi: 0,
                avg_finish_position: 0,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('*');

        return stats;
    }

    /**
     * Actualizar estadísticas después de un torneo
     */
    async updateAfterTournament(
        userId: string,
        data: {
            won: boolean;
            finishPosition: number;
            buyIn: number;
            winnings: number;
            hands: number;
            handsWon: number;
        }
    ): Promise<UserStats | null> {
        // Incrementar total tournaments
        await this.db('user_stats')
            .where({ user_id: userId })
            .increment('total_tournaments', 1);

        if (data.won) {
            await this.db('user_stats')
                .where({ user_id: userId })
                .increment('tournaments_won', 1);
        }

        // Actualizar manos
        await this.db('user_stats')
            .where({ user_id: userId })
            .increment('total_hands', data.hands)
            .increment('hands_won', data.handsWon);

        // Actualizar financiero
        await this.db('user_stats')
            .where({ user_id: userId })
            .increment('total_buy_ins', data.buyIn)
            .increment('total_winnings', data.winnings);

        // Actualizar biggest win si aplica
        const currentStats = await this.findByUserId(userId);
        if (currentStats && data.winnings > currentStats.biggestWin) {
            await this.db('user_stats')
                .where({ user_id: userId })
                .update({ biggest_win: data.winnings });
        }

        // Calcular ROI
        await this.calculateROI(userId);

        // Calcular average finish position
        await this.calculateAvgFinishPosition(userId);

        await this.db('user_stats')
            .where({ user_id: userId })
            .update({ updated_at: new Date() });

        return this.findByUserId(userId);
    }

    /**
     * Actualizar estadísticas después de un juego
     */
    async updateAfterGame(
        userId: string,
        data: {
            won: boolean;
            hands: number;
            handsWon: number;
        }
    ): Promise<UserStats | null> {
        await this.db('user_stats')
            .where({ user_id: userId })
            .increment('total_games', 1);

        if (data.won) {
            await this.db('user_stats')
                .where({ user_id: userId })
                .increment('games_won', 1);
        }

        await this.db('user_stats')
            .where({ user_id: userId })
            .increment('total_hands', data.hands)
            .increment('hands_won', data.handsWon)
            .update({ updated_at: new Date() });

        return this.findByUserId(userId);
    }

    /**
     * Calcular ROI
     */
    private async calculateROI(userId: string): Promise<void> {
        const stats = await this.findByUserId(userId);
        if (!stats || stats.totalBuyIns === 0) return;

        const roi = ((stats.totalWinnings - stats.totalBuyIns) / stats.totalBuyIns) * 100;

        await this.db('user_stats')
            .where({ user_id: userId })
            .update({ roi: Math.round(roi * 100) / 100 });
    }

    /**
     * Calcular posición promedio de finalización
     * (Requiere datos de tournament_players)
     */
    private async calculateAvgFinishPosition(userId: string): Promise<void> {
        const result = await this.db('tournament_players')
            .where({ user_id: userId })
            .whereNotNull('finish_position')
            .avg('finish_position as avg_position')
            .first();

        if (result && result.avg_position) {
            await this.db('user_stats')
                .where({ user_id: userId })
                .update({ avg_finish_position: Math.round(Number(result.avg_position) * 10) / 10 });
        }
    }
}
