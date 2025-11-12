/**
 * Penalty DTOs - TDA 2024 Rule 71
 * Penalties and Infractions Management
 */

export interface ImposePenaltyDTO {
    tournament_id: string;
    player_entry_id: string;
    infraction_type: string;
    description: string;
    imposed_by: string; // User/TD ID
}

export interface PenaltyDTO {
    id: string;
    tournament_id: string;
    player_entry_id: string;
    infraction_type: string;
    penalty_level: string; // 'VERBAL_WARNING', 'MINOR_PENALTY', 'MAJOR_PENALTY', 'DISQUALIFICATION'
    description: string;
    imposed_by: string;
    previous_penalty_id?: string;
    is_automatic_escalation: boolean;
    missed_hands_count: number;
    removal_from_tournament: boolean;
    created_at: Date;
}

export interface PlayerPenaltyHistoryDTO {
    tournament_id: string;
    player_entry_id: string;
    penalties: PenaltyDTO[];
    total_count: number;
    highest_level: number;
}

export interface PenaltyEscalationDTO {
    current_level: number;
    next_level: number;
    escalation_reason: string;
    automatic: boolean;
    consequences: {
        missed_hands?: number;
        removal?: boolean;
    };
}

export interface PenaltyVerificationDTO {
    tournament_id: string;
    player_entry_id: string;
    current_level: number;
    penalties_count: number;
    status: string;
    consequences: string;
}
