import { SeatingRepository } from '../repositories/SeatingRepository';
import { PlayerEntryRepository } from '../repositories/PlayerEntryRepository';
import { SeatingAlgorithm } from '../algorithms/SeatingAlgorithm';
import {
    SeatingResultDTO,
    BalanceResultDTO,
    TableBreakResultDTO,
    HaltingPlayStatusDTO
} from '@tdpokerpro/shared-types';

export class SeatingService {
    private algorithm = new SeatingAlgorithm();

    constructor(
        private seatingRepository: SeatingRepository,
        private playerRepository: PlayerEntryRepository
    ) { }

    /**
     * Rule 7: Initial random seating for tournament start
     */
    async performInitialSeating(tournamentId: string): Promise<SeatingResultDTO> {
        // Get all registered players
        const players = await this.playerRepository.getByTournament(tournamentId);
        const playerEntryIds = players.map(p => p.id);

        if (playerEntryIds.length === 0) {
            return {
                assignments: [],
                tables_opened: 0,
                messages: ['No players registered']
            };
        }

        // Random seat algorithm
        const assignments = this.algorithm.randomSeat(playerEntryIds);

        // Save to database
        const saved = await this.seatingRepository.assignSeats(
            assignments.map(a => ({
                tournament_id: tournamentId,
                table_number: a.table,
                seat_number: a.seat,
                player_entry_id: a.player_entry_id,
                move_reason: 'initial_seating'
            }))
        );

        const maxTable = Math.max(...assignments.map(a => a.table));

        return {
            assignments: saved,
            tables_opened: maxTable,
            messages: [`Seating ${playerEntryIds.length} players into ${maxTable} tables`]
        };
    }

    /**
     * Rule 8: Seat late registration player
     */
    async seatLateRegistration(tournamentId: string, playerEntryId: string): Promise<SeatingResultDTO> {
        // Get current table status
        const currentAssignments = await this.seatingRepository.getTableAssignments(tournamentId);

        const tableStatus = new Map<number, number>();
        currentAssignments.forEach(a => {
            tableStatus.set(a.table_number, (tableStatus.get(a.table_number) || 0) + 1);
        });

        const tableArray = Array.from(tableStatus.entries()).map(([table, count]) => ({
            table,
            players_count: count
        }));

        // Algorithm: seat in least-occupied table, avoiding SB
        const { table, seat } = this.algorithm.seatLateRegistration(
            playerEntryId,
            tableArray
        );

        // If opening new table
        if (table > (Math.max(...tableArray.map(t => t.table)) || 0)) {
            await this.seatingRepository.logBalanceEvent(tournamentId, {
                event_type: 'new_table_opened',
                affected_tables: [table],
                affected_players: [playerEntryId],
                reason: 'late_registration',
                auto_executed: true
            });
        }

        const saved = await this.seatingRepository.assignSeats([{
            tournament_id: tournamentId,
            table_number: table,
            seat_number: seat,
            player_entry_id: playerEntryId,
            move_reason: 'late_registration'
        }]);

        return {
            assignments: saved,
            tables_opened: table > (Math.max(...tableArray.map(t => t.table)) || 0) ? 1 : 0,
            messages: [`Player seated at Table ${table}, Seat ${seat}`]
        };
    }

    /**
     * Rule 10-B: Break table using double randomization
     */
    async breakTableDoubleRandom(
        tournamentId: string,
        tableToBreak: number
    ): Promise<TableBreakResultDTO> {
        const assignments = await this.seatingRepository.getTableAssignments(tournamentId);
        const tableAssignments = assignments.filter(a => a.table_number === tableToBreak);
        const playerIds = tableAssignments.map(a => a.player_entry_id);

        const otherTables = Array.from(new Set(assignments.map(a => a.table_number)))
            .filter(t => t !== tableToBreak)
            .sort((a, b) => a - b);

        // Double randomization algorithm
        const newAssignments = this.algorithm.doubleRandomization(playerIds, otherTables);

        // Move players
        const redistributed = new Map<number, number>();
        for (const assignment of newAssignments) {
            redistributed.set(
                assignment.table,
                (redistributed.get(assignment.table) || 0) + 1
            );

            await this.seatingRepository.movePlayer(
                assignment.player_entry_id,
                tableToBreak,
                assignment.table,
                assignment.seat,
                'table_break_double_random'
            );
        }

        // Log event
        await this.seatingRepository.logBalanceEvent(tournamentId, {
            event_type: 'table_break',
            affected_tables: [tableToBreak, ...otherTables],
            affected_players: playerIds,
            reason: 'table_break_double_randomization',
            auto_executed: true
        });

        return {
            source_table: tableToBreak,
            affected_players: playerIds,
            redistributed_to: Array.from(redistributed.entries()).map(([table, count]) => ({
                table,
                count
            })),
            double_randomization_used: true
        };
    }

    /**
     * Rule 11: Balance tables
     */
    async balanceTables(tournamentId: string): Promise<BalanceResultDTO> {
        const assignments = await this.seatingRepository.getTableAssignments(tournamentId);

        // Group by table
        const tableMap = new Map<number, any[]>();
        assignments.forEach(a => {
            if (!tableMap.has(a.table_number)) tableMap.set(a.table_number, []);
            tableMap.get(a.table_number)!.push({
                table: a.table_number,
                seat: a.seat_number,
                player_entry_id: a.player_entry_id,
                button_seat: 1 // TODO: track actual button
            });
        });

        const allAssignments = Array.from(tableMap.values()).flat();
        const movements = this.algorithm.balanceTables(allAssignments);

        // Apply movements
        for (const movement of movements) {
            await this.seatingRepository.movePlayer(
                movement.player_entry_id,
                movement.from_table,
                movement.to_table,
                1, // TODO: find actual seat in target table
                movement.reason
            );
        }

        return {
            movements: movements.map(m => ({
                ...m,
                from_seat: 1, // TODO: track actual seat
                to_seat: 1 // TODO: track actual seat
            })),
            tables_halted: [],
            new_tables_opened: 0,
            auto_executed: true
        };
    }

    /**
     * Rule 11-D: Detect halting play condition
     */
    async detectHaltingPlay(tournamentId: string): Promise<HaltingPlayStatusDTO> {
        const assignments = await this.seatingRepository.getTableAssignments(tournamentId);

        const tableCounts = Array.from(
            new Map(assignments.map(a => [a.table_number, null])).keys()
        ).map(table => ({
            table,
            count: assignments.filter(a => a.table_number === table).length
        }));

        const { should_halt, tables_to_halt, disparity } = this.algorithm.detectHaltingPlay(tableCounts);

        return {
            is_halting: should_halt,
            halted_tables: tables_to_halt,
            max_players_at_table: Math.max(...tableCounts.map(t => t.count)),
            min_players_at_table: Math.min(...tableCounts.map(t => t.count)),
            disparity,
            reason: should_halt ? `Table disparity (${disparity}) exceeds threshold (3)` : undefined
        };
    }

    /**
     * Get player's current table and seat
     */
    async getPlayerSeating(playerId: string, tournamentId: string) {
        return this.seatingRepository.getPlayerTableAssignment(playerId, tournamentId);
    }
}
