import { Pool } from 'pg';
import { SeatAssignmentDTO, TableStatusDTO } from '@tdpokerpro/shared-types';

export class SeatingRepository {
    constructor(private pool: Pool) { }

    async assignSeats(assignments: Array<{
        tournament_id: string;
        table_number: number;
        seat_number: number;
        player_entry_id: string;
        move_reason?: string;
    }>): Promise<SeatAssignmentDTO[]> {
        const results: SeatAssignmentDTO[] = [];

        for (const assignment of assignments) {
            const result = await this.pool.query(
                `INSERT INTO table_assignments (
          tournament_id, table_number, seat_number, player_entry_id, move_reason
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
                [
                    assignment.tournament_id,
                    assignment.table_number,
                    assignment.seat_number,
                    assignment.player_entry_id,
                    assignment.move_reason || 'initial_seating'
                ]
            );
            results.push(result.rows[0]);
        }

        return results;
    }

    async getTableAssignments(tournamentId: string): Promise<SeatAssignmentDTO[]> {
        const result = await this.pool.query(
            `SELECT * FROM table_assignments WHERE tournament_id = $1`,
            [tournamentId]
        );
        return result.rows;
    }

    async getTableStatus(tournamentId: string, tableNumber: number): Promise<TableStatusDTO> {
        const result = await this.pool.query(
            `SELECT ta.*, pe.player_id, pe.current_stack, pe.bounty_chips_current
       FROM table_assignments ta
       JOIN player_entries pe ON ta.player_entry_id = pe.id
       WHERE ta.tournament_id = $1 AND ta.table_number = $2`,
            [tournamentId, tableNumber]
        );

        const players = result.rows.map(row => ({
            player_id: row.player_id,
            entry_id: row.player_entry_id,
            seat: row.seat_number,
            stack: parseInt(row.current_stack, 10),
            bounty_chips: parseInt(row.bounty_chips_current, 10)
        }));

        return {
            table_number: tableNumber,
            seats_occupied: players.length,
            seats_available: 9 - players.length,
            players,
            button_seat: 1, // TODO: track button position
            small_blind_seat: 2,
            big_blind_seat: 3,
            is_halted: false // TODO: track halt status
        };
    }

    async movePlayer(
        playerEntryId: string,
        fromTable: number,
        toTable: number,
        toSeat: number,
        reason: string
    ): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Remove from old table
            await client.query(
                `DELETE FROM table_assignments 
         WHERE player_entry_id = $1 AND table_number = $2`,
                [playerEntryId, fromTable]
            );

            // Add to new table
            await client.query(
                `INSERT INTO table_assignments (
          tournament_id, table_number, seat_number, player_entry_id,
          moved_from_table, move_reason
        ) VALUES (
          (SELECT tournament_id FROM table_assignments WHERE player_entry_id = $3 LIMIT 1),
          $1, $2, $3, $4, $5
        )`,
                [toTable, toSeat, playerEntryId, fromTable, reason]
            );

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async logBalanceEvent(tournamentId: string, event: {
        event_type: string;
        affected_tables: number[];
        affected_players: string[];
        reason: string;
        auto_executed: boolean;
    }): Promise<void> {
        await this.pool.query(
            `INSERT INTO table_balance_events (
        tournament_id, event_type, affected_tables, affected_players, reason, auto_executed
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                tournamentId,
                event.event_type,
                event.affected_tables,
                event.affected_players,
                event.reason,
                event.auto_executed
            ]
        );
    }

    async getTableCount(tournamentId: string): Promise<number> {
        const result = await this.pool.query(
            `SELECT COUNT(DISTINCT table_number) as count FROM table_assignments 
       WHERE tournament_id = $1`,
            [tournamentId]
        );
        return parseInt(result.rows[0]?.count || '0', 10);
    }

    async getPlayerTableAssignment(playerId: string, tournamentId: string): Promise<SeatAssignmentDTO | null> {
        const result = await this.pool.query(
            `SELECT ta.* FROM table_assignments ta
       JOIN player_entries pe ON ta.player_entry_id = pe.id
       WHERE pe.player_id = $1 AND ta.tournament_id = $2 AND pe.status = 'ACTIVE'`,
            [playerId, tournamentId]
        );
        return result.rows[0] || null;
    }
}
