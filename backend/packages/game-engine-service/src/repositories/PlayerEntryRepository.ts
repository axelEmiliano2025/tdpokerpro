import { Pool } from 'pg';
import { PlayerEntryDTO, PlayerEntryListDTO, EntryType, EntryStatus } from '@tdpokerpro/shared-types';

export class PlayerEntryRepository {
    constructor(private pool: Pool) { }

    async create(data: {
        tournament_id: string;
        player_id: string;
        entry_number: number;
        entry_type: EntryType;
        buy_in_cents: number;
        starting_stack: number;
        bounty_chips?: number;
    }): Promise<PlayerEntryDTO> {
        const result = await this.pool.query(
            `INSERT INTO player_entries (
        tournament_id, player_id, entry_number, entry_type,
        buy_in_cents, starting_stack, current_stack,
        bounty_chips_purchased, bounty_chips_current, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7, 'REGISTERED')
      RETURNING *`,
            [
                data.tournament_id,
                data.player_id,
                data.entry_number,
                data.entry_type,
                data.buy_in_cents,
                data.starting_stack,
                data.bounty_chips || 0
            ]
        );
        return result.rows[0];
    }

    async getById(id: string): Promise<PlayerEntryDTO | null> {
        const result = await this.pool.query(
            `SELECT * FROM player_entries WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async getByTournamentAndPlayer(tournamentId: string, playerId: string): Promise<PlayerEntryDTO[]> {
        const result = await this.pool.query(
            `SELECT * FROM player_entries 
       WHERE tournament_id = $1 AND player_id = $2
       ORDER BY entry_number ASC`,
            [tournamentId, playerId]
        );
        return result.rows;
    }

    async getActivePlayers(tournamentId: string): Promise<PlayerEntryDTO[]> {
        const result = await this.pool.query(
            `SELECT * FROM player_entries 
       WHERE tournament_id = $1 AND status = 'ACTIVE'`,
            [tournamentId]
        );
        return result.rows;
    }

    async getByTournament(tournamentId: string): Promise<PlayerEntryListDTO[]> {
        const result = await this.pool.query(
            `SELECT id, player_id, entry_number, entry_type, status,
              current_stack, bounty_chips_current, finishing_position
       FROM player_entries 
       WHERE tournament_id = $1
       ORDER BY created_at ASC`,
            [tournamentId]
        );
        return result.rows;
    }

    async getLastEntryNumber(tournamentId: string, playerId: string): Promise<number> {
        const result = await this.pool.query(
            `SELECT MAX(entry_number) as max_entry
       FROM player_entries 
       WHERE tournament_id = $1 AND player_id = $2`,
            [tournamentId, playerId]
        );
        return result.rows[0]?.max_entry || 0;
    }

    async update(id: string, data: any): Promise<PlayerEntryDTO> {
        const updates: string[] = [];
        const params: any[] = [];
        let paramCount = 1;

        if (data.current_stack !== undefined) {
            params.push(data.current_stack);
            updates.push(`current_stack = $${paramCount++}`);
        }

        if (data.bounty_chips_current !== undefined) {
            params.push(data.bounty_chips_current);
            updates.push(`bounty_chips_current = $${paramCount++}`);
        }

        if (data.status !== undefined) {
            params.push(data.status);
            updates.push(`status = $${paramCount++}`);
        }

        if (data.finishing_position !== undefined) {
            params.push(data.finishing_position);
            updates.push(`finishing_position = $${paramCount++}`);
        }

        if (data.finishing_prize_cents !== undefined) {
            params.push(data.finishing_prize_cents);
            updates.push(`finishing_prize_cents = $${paramCount++}`);
        }

        if (data.busted_at !== undefined) {
            params.push(data.busted_at);
            updates.push(`busted_at = $${paramCount++}`);
        }

        params.push(id);
        updates.push(`updated_at = NOW()`);

        const query = `UPDATE player_entries SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        const result = await this.pool.query(query, params);
        return result.rows[0];
    }

    async addBountyWon(entryId: string, fromEntryId: string, chips: number): Promise<void> {
        await this.pool.query(
            `UPDATE player_entries 
       SET bounty_chips_won_from = COALESCE(bounty_chips_won_from, '{}'::jsonb) || jsonb_build_object($2, $3),
           updated_at = NOW()
       WHERE id = $1`,
            [entryId, fromEntryId, chips]
        );
    }

    async getPlayersCount(tournamentId: string, status: EntryStatus): Promise<number> {
        const result = await this.pool.query(
            `SELECT COUNT(*) as count FROM player_entries 
       WHERE tournament_id = $1 AND status = $2`,
            [tournamentId, status]
        );
        return parseInt(result.rows[0].count, 10);
    }

    async getTotalChipCount(tournamentId: string): Promise<number> {
        const result = await this.pool.query(
            `SELECT SUM(current_stack) as total FROM player_entries 
       WHERE tournament_id = $1 AND status IN ('ACTIVE', 'ELIMINATED')`,
            [tournamentId]
        );
        return parseInt(result.rows[0]?.total || '0', 10);
    }
}
