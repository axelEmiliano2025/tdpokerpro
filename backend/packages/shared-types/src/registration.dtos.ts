/**
 * Registration DTOs - TDA 2024 Rule 8 & 27
 * Multiple entries per player (initial, late_reg, rebuy, reentry, addon)
 */

import { EntryType, EntryStatus } from './enums';

// Register Player
export interface RegisterPlayerDTO {
    tournament_id: string;
    player_id: string;
    entry_type: EntryType; // 'initial', 'late_reg', 'rebuy', 'reentry', 'addon'
    buy_in_cents: number;
    bounty_chips?: number; // Optional for KO tournaments
}

// Update Player Entry
export interface UpdatePlayerEntryDTO {
    current_stack?: number;
    bounty_chips_current?: number;
    status?: EntryStatus;
    finishing_position?: number;
    finishing_prize_cents?: number;
}

// Response DTOs
export interface PlayerEntryDTO {
    id: string;
    tournament_id: string;
    player_id: string;
    entry_number: number;
    entry_type: EntryType;
    status: EntryStatus;

    buy_in_cents: number;
    starting_stack: number;
    current_stack: number;

    bounty_chips_purchased: number;
    bounty_chips_current: number;
    bounty_chips_won_from?: Record<string, number>;

    finishing_position?: number;
    finishing_prize_cents?: number;

    created_at: Date;
    updated_at: Date;
}

export interface PlayerEntryListDTO {
    id: string;
    player_id: string;
    entry_number: number;
    entry_type: EntryType;
    status: EntryStatus;
    current_stack: number;
    bounty_chips_current: number;
    finishing_position?: number;
}

// Validation
export interface RegistrationValidationDTO {
    valid: boolean;
    errors: string[];
    warnings: string[];
    reason?: string; // Why registration failed
}

// Chip Count Summary
export interface PlayerChipSummaryDTO {
    player_entry_id: string;
    current_stack: number;
    initial_stack: number;
    change_percentage: number;
    bounty_chips: number;
}

// Bounty Tracking
export interface BountyTransactionDTO {
    id: string;
    tournament_id: string;
    from_player_entry_id: string; // Player eliminated
    to_player_entry_id: string;   // Player who busted them
    bounty_chips_transferred: number;
    hand_id?: string;
    timestamp: Date;
}
