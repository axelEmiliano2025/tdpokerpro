/**
 * Seating DTOs - TDA 2024 Rules 7-11
 * Random seating, late registration, table balancing, halting play
 */

export interface SeatAssignmentDTO {
    id: string;
    tournament_id: string;
    table_number: number;
    seat_number: number;
    player_entry_id: string;
    assigned_at: Date;
    moved_from_table?: number;
    move_reason?: string;
}

export interface TableStatusDTO {
    table_number: number;
    seats_occupied: number;
    seats_available: number;
    players: {
        player_id: string;
        entry_id: string;
        seat: number;
        stack: number;
        bounty_chips: number;
    }[];
    button_seat: number;
    small_blind_seat: number;
    big_blind_seat: number;
    is_halted: boolean;
}

export interface SeatingResultDTO {
    assignments: SeatAssignmentDTO[];
    tables_opened: number;
    unassigned_players?: string[];
    messages: string[];
}

export interface BalanceResultDTO {
    movements: {
        player_entry_id: string;
        from_table: number;
        from_seat: number;
        to_table: number;
        to_seat: number;
        reason: string;
    }[];
    tables_halted: number[];
    new_tables_opened: number;
    auto_executed: boolean;
}

export interface TableBreakResultDTO {
    source_table: number;
    affected_players: string[];
    redistributed_to: { table: number; count: number }[];
    double_randomization_used: boolean;
}

export interface HaltingPlayStatusDTO {
    is_halting: boolean;
    halted_tables: number[];
    max_players_at_table: number;
    min_players_at_table: number;
    disparity: number;
    reason?: string;
}
