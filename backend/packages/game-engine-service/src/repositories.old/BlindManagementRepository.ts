import { Pool } from 'pg';
import {
    BlindTrackingDTO,
    ColorUpRaceDTO,
    BreakScheduleDTO
} from '@tdpokerpro/shared-types';

export class BlindManagementRepository {
    constructor(private pool: Pool) { }

    /**
     * Initialize blind tracking when tournament starts
     */
    async initializeBlindTracking(tournamentId: string): Promise<BlindTrackingDTO> {
        const query = `
            INSERT INTO blind_tracking (tournament_id, current_level, is_break)
            VALUES ($1, 1, false)
            RETURNING 
                id::text,
                tournament_id::text,
                current_level,
                level_started_at,
                is_break,
                total_levels_played,
                created_at,
                updated_at
        `;

        const result = await this.pool.query(query, [tournamentId]);
        return result.rows[0];
    }

    /**
     * Get blind tracking for a tournament
     */
    async getBlindTracking(tournamentId: string): Promise<BlindTrackingDTO | null> {
        const query = `
            SELECT 
                id::text,
                tournament_id::text,
                current_level,
                level_started_at,
                is_break,
                total_levels_played,
                created_at,
                updated_at
            FROM blind_tracking 
            WHERE tournament_id = $1
        `;

        const result = await this.pool.query(query, [tournamentId]);
        return result.rows[0] || null;
    }

    /**
     * Advance to next blind level
     */
    async advanceBlind(tournamentId: string, newLevel: number): Promise<BlindTrackingDTO> {
        const query = `
            UPDATE blind_tracking 
            SET current_level = $2,
                level_started_at = NOW(),
                total_levels_played = total_levels_played + 1,
                updated_at = NOW()
            WHERE tournament_id = $1
            RETURNING 
                id::text,
                tournament_id::text,
                current_level,
                level_started_at,
                is_break,
                total_levels_played,
                created_at,
                updated_at
        `;

        const result = await this.pool.query(query, [tournamentId, newLevel]);
        return result.rows[0];
    }

    /**
     * Set break status
     */
    async setBreak(tournamentId: string, isBreak: boolean): Promise<BlindTrackingDTO> {
        const query = `
            UPDATE blind_tracking 
            SET is_break = $2,
                updated_at = NOW()
            WHERE tournament_id = $1
            RETURNING 
                id::text,
                tournament_id::text,
                current_level,
                level_started_at,
                is_break,
                total_levels_played,
                created_at,
                updated_at
        `;

        const result = await this.pool.query(query, [tournamentId, isBreak]);
        return result.rows[0];
    }

    /**
     * Create a color-up race
     */
    async createColorUpRace(data: {
        tournament_id: string;
        blind_level: number;
        old_chip_value: number;
        new_chip_value: number;
        is_race: boolean;
    }): Promise<ColorUpRaceDTO> {
        const query = `
            INSERT INTO color_up_races (
                tournament_id, blind_level, old_chip_value, new_chip_value, is_race
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING 
                id::text,
                tournament_id::text,
                blind_level,
                old_chip_value,
                new_chip_value,
                is_race,
                executed_at,
                status,
                created_at
        `;

        const result = await this.pool.query(query, [
            data.tournament_id,
            data.blind_level,
            data.old_chip_value,
            data.new_chip_value,
            data.is_race
        ]);
        return result.rows[0];
    }

    /**
     * Execute a color-up race
     */
    async executeColorUpRace(colorUpId: string): Promise<ColorUpRaceDTO> {
        const query = `
            UPDATE color_up_races 
            SET status = 'EXECUTED', executed_at = NOW()
            WHERE id = $1
            RETURNING 
                id::text,
                tournament_id::text,
                blind_level,
                old_chip_value,
                new_chip_value,
                is_race,
                executed_at,
                status,
                created_at
        `;

        const result = await this.pool.query(query, [colorUpId]);
        return result.rows[0];
    }

    /**
     * Get all color-up races for a tournament
     */
    async getColorUpRaces(tournamentId: string): Promise<ColorUpRaceDTO[]> {
        const query = `
            SELECT 
                id::text,
                tournament_id::text,
                blind_level,
                old_chip_value,
                new_chip_value,
                is_race,
                executed_at,
                status,
                created_at
            FROM color_up_races 
            WHERE tournament_id = $1 
            ORDER BY blind_level
        `;

        const result = await this.pool.query(query, [tournamentId]);
        return result.rows;
    }

    /**
     * Schedule a break
     */
    async scheduleBreak(data: {
        tournament_id: string;
        blind_level_before_break: number;
        break_duration_minutes: number;
    }): Promise<BreakScheduleDTO> {
        const query = `
            INSERT INTO break_schedule (
                tournament_id, blind_level_before_break, break_duration_minutes
            ) VALUES ($1, $2, $3)
            RETURNING 
                id::text,
                tournament_id::text,
                blind_level_before_break,
                break_duration_minutes,
                scheduled_at,
                started_at,
                ended_at,
                status,
                created_at
        `;

        const result = await this.pool.query(query, [
            data.tournament_id,
            data.blind_level_before_break,
            data.break_duration_minutes
        ]);
        return result.rows[0];
    }

    /**
     * Start a break
     */
    async startBreak(breakId: string): Promise<BreakScheduleDTO> {
        const query = `
            UPDATE break_schedule 
            SET status = 'IN_PROGRESS', started_at = NOW()
            WHERE id = $1
            RETURNING 
                id::text,
                tournament_id::text,
                blind_level_before_break,
                break_duration_minutes,
                scheduled_at,
                started_at,
                ended_at,
                status,
                created_at
        `;

        const result = await this.pool.query(query, [breakId]);
        return result.rows[0];
    }

    /**
     * End a break
     */
    async endBreak(breakId: string): Promise<BreakScheduleDTO> {
        const query = `
            UPDATE break_schedule 
            SET status = 'COMPLETED', ended_at = NOW()
            WHERE id = $1
            RETURNING 
                id::text,
                tournament_id::text,
                blind_level_before_break,
                break_duration_minutes,
                scheduled_at,
                started_at,
                ended_at,
                status,
                created_at
        `;

        const result = await this.pool.query(query, [breakId]);
        return result.rows[0];
    }

    /**
     * Get scheduled breaks for a tournament
     */
    async getScheduledBreaks(tournamentId: string): Promise<BreakScheduleDTO[]> {
        const query = `
            SELECT 
                id::text,
                tournament_id::text,
                blind_level_before_break,
                break_duration_minutes,
                scheduled_at,
                started_at,
                ended_at,
                status,
                created_at
            FROM break_schedule 
            WHERE tournament_id = $1 
            ORDER BY blind_level_before_break
        `;

        const result = await this.pool.query(query, [tournamentId]);
        return result.rows;
    }
}
