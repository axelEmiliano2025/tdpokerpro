import { Pool } from 'pg';
import {
    ImposePenaltyDTO,
    PenaltyDTO
} from '@tdpokerpro/shared-types';

export class PenaltyRepository {
    constructor(private pool: Pool) { }

    /**
     * Impose a penalty on a player
     * Returns the created penalty record
     */
    async imposePenalty(
        data: ImposePenaltyDTO,
        penaltyLevel: number,
        isAutoEscalation: boolean,
        previousPenaltyId: number | null,
        missedHands: number,
        removeFromTournament: boolean
    ): Promise<PenaltyDTO> {
        const query = `
            INSERT INTO penalties_log (
                tournament_id,
                player_entry_id,
                infraction_type,
                penalty_level,
                description,
                imposed_by,
                previous_penalty_id,
                is_automatic_escalation,
                missed_hands_count,
                removal_from_tournament
            )
            VALUES ($1, $2, $3::infraction_type_enum, $4::penalty_level_enum, $5, $6, $7, $8, $9, $10)
            RETURNING
                id,
                tournament_id,
                player_entry_id,
                infraction_type,
                penalty_level::text AS penalty_level,
                description,
                imposed_by,
                previous_penalty_id,
                is_automatic_escalation,
                missed_hands_count,
                removal_from_tournament,
                imposed_at
        `;

        const values = [
            data.tournament_id,
            data.player_entry_id,
            data.infraction_type,
            this.getLevelEnum(penaltyLevel),
            data.description,
            data.imposed_by,
            previousPenaltyId,
            isAutoEscalation,
            missedHands,
            removeFromTournament
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Get all penalties for a player in a specific tournament
     */
    async getPlayerPenalties(
        tournamentId: number,
        playerEntryId: number
    ): Promise<PenaltyDTO[]> {
        const query = `
            SELECT
                id,
                tournament_id,
                player_entry_id,
                infraction_type,
                penalty_level::text AS penalty_level,
                description,
                imposed_by,
                previous_penalty_id,
                is_automatic_escalation,
                missed_hands_count,
                removal_from_tournament,
                imposed_at
            FROM penalties_log
            WHERE tournament_id = $1 AND player_entry_id = $2
            ORDER BY imposed_at DESC
        `;

        const result = await this.pool.query(query, [tournamentId, playerEntryId]);
        return result.rows;
    }

    /**
     * Get all penalties for a tournament
     */
    async getTournamentPenalties(tournamentId: number): Promise<PenaltyDTO[]> {
        const query = `
            SELECT
                id,
                tournament_id,
                player_entry_id,
                infraction_type,
                penalty_level::text AS penalty_level,
                description,
                imposed_by,
                previous_penalty_id,
                is_automatic_escalation,
                missed_hands_count,
                removal_from_tournament,
                imposed_at
            FROM penalties_log
            WHERE tournament_id = $1
            ORDER BY imposed_at DESC
        `;

        const result = await this.pool.query(query, [tournamentId]);
        return result.rows;
    }

    /**
     * Get latest penalty for a player in a tournament
     */
    async getLatestPenalty(
        tournamentId: number,
        playerEntryId: number
    ): Promise<PenaltyDTO | null> {
        const query = `
            SELECT
                id,
                tournament_id,
                player_entry_id,
                infraction_type,
                penalty_level::text AS penalty_level,
                description,
                imposed_by,
                previous_penalty_id,
                is_automatic_escalation,
                missed_hands_count,
                removal_from_tournament,
                imposed_at
            FROM penalties_log
            WHERE tournament_id = $1 AND player_entry_id = $2
            ORDER BY imposed_at DESC
            LIMIT 1
        `;

        const result = await this.pool.query(query, [tournamentId, playerEntryId]);
        return result.rows[0] || null;
    }

    /**
     * Get count of penalties for a player in a tournament
     */
    async getPenaltyCount(
        tournamentId: number,
        playerEntryId: number
    ): Promise<number> {
        const query = `
            SELECT COUNT(*) AS count
            FROM penalties_log
            WHERE tournament_id = $1 AND player_entry_id = $2
        `;

        const result = await this.pool.query(query, [tournamentId, playerEntryId]);
        return parseInt(result.rows[0].count, 10);
    }

    /**
     * Get highest penalty level for a player in a tournament
     */
    async getHighestPenaltyLevel(
        tournamentId: number,
        playerEntryId: number
    ): Promise<number> {
        const query = `
            SELECT
                CASE penalty_level::text
                    WHEN 'VERBAL_WARNING' THEN 0
                    WHEN 'MINOR_PENALTY' THEN 1
                    WHEN 'MAJOR_PENALTY' THEN 2
                    WHEN 'DISQUALIFICATION' THEN 3
                    ELSE 0
                END AS level
            FROM penalties_log
            WHERE tournament_id = $1 AND player_entry_id = $2
            ORDER BY level DESC
            LIMIT 1
        `;

        const result = await this.pool.query(query, [tournamentId, playerEntryId]);
        return result.rows[0]?.level ?? 0;
    }

    /**
     * Log infraction statistics
     */
    async logInfractionStatistic(
        playerId: number,
        tournamentId: number,
        isPenalty: boolean,
        isDisqualification: boolean
    ): Promise<void> {
        const query = `
            INSERT INTO infraction_statistics (
                player_id,
                tournament_id,
                total_infractions,
                total_penalties,
                disqualifications
            )
            VALUES ($1, $2, 1, $3, $4)
            ON CONFLICT (player_id, tournament_id)
            DO UPDATE SET
                total_infractions = infraction_statistics.total_infractions + 1,
                total_penalties = infraction_statistics.total_penalties + $3,
                disqualifications = infraction_statistics.disqualifications + $4
        `;

        const penaltyIncrement = isPenalty ? 1 : 0;
        const dqIncrement = isDisqualification ? 1 : 0;

        await this.pool.query(query, [playerId, tournamentId, penaltyIncrement, dqIncrement]);
    }

    // Helper method
    private getLevelEnum(level: number): string {
        const levels = ['VERBAL_WARNING', 'MINOR_PENALTY', 'MAJOR_PENALTY', 'DISQUALIFICATION'];
        return levels[level] || 'VERBAL_WARNING';
    }
}
