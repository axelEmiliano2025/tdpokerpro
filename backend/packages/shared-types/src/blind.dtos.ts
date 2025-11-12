/**
 * Blind Management DTOs - TDA 2024
 * Auto-advance, Color-up, Breaks
 */

export interface BlindTrackingDTO {
    id: string;
    tournament_id: string;
    current_level: number;
    level_started_at: Date;
    is_break: boolean;
    total_levels_played: number;
    created_at: Date;
    updated_at: Date;
}

export interface AdvanceBlindDTO {
    tournament_id: string;
    auto_advance: boolean;
    manual_advance_by?: number; // Si manual, cuántos niveles
}

export interface ColorUpRaceDTO {
    id: string;
    tournament_id: string;
    blind_level: number;
    old_chip_value: number;
    new_chip_value: number;
    is_race: boolean; // true = race, false = chip pull
    executed_at?: Date;
    status: string; // PENDING, EXECUTED, CANCELLED
    created_at: Date;
}

export interface BreakScheduleDTO {
    id: string;
    tournament_id: string;
    blind_level_before_break: number;
    break_duration_minutes: number;
    scheduled_at?: Date;
    started_at?: Date;
    ended_at?: Date;
    status: string; // SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED
    created_at: Date;
}

export interface BlindManagementStatusDTO {
    current_level: number;
    current_blind: { small: number; big: number; antes: number };
    time_in_current_level_minutes: number;
    time_remaining_minutes: number;
    is_break: boolean;
    break_status?: string;
    next_level?: { number: number; small: number; big: number };
    levels_until_next_break?: number;
}
