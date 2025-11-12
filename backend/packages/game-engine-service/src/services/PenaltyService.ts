import { Pool } from 'pg';
import {
    ImposePenaltyDTO,
    PenaltyDTO,
    PlayerPenaltyHistoryDTO,
    PenaltyVerificationDTO
} from '@tdpokerpro/shared-types';
import { PenaltyRulesEngine } from '@tdpokerpro/shared-utils';
import { PenaltyRepository } from '../repositories/PenaltyRepository';
import { PlayerEntryRepository } from '../repositories/PlayerEntryRepository';

export class PenaltyService {
    private repository: PenaltyRepository;
    private playerEntryRepo: PlayerEntryRepository;
    private rulesEngine: PenaltyRulesEngine;

    constructor(pool: Pool) {
        this.repository = new PenaltyRepository(pool);
        this.playerEntryRepo = new PlayerEntryRepository(pool);
        this.rulesEngine = new PenaltyRulesEngine();
    }

    /**
     * Impose a penalty with automatic escalation
     */
    async imposePenalty(data: ImposePenaltyDTO): Promise<PenaltyDTO> {
        const tournamentId = parseInt(data.tournament_id, 10);
        const playerEntryId = parseInt(data.player_entry_id, 10);

        // Get player's latest penalty (if any)
        const latestPenalty = await this.repository.getLatestPenalty(
            tournamentId,
            playerEntryId
        );

        // Determine current penalty level
        const previousLevel = latestPenalty
            ? this.getLevelNumber(latestPenalty.penalty_level)
            : -1;

        // Calculate escalation
        const escalation = this.rulesEngine.calculateEscalation(
            previousLevel,
            data.infraction_type,
            true
        );

        const newLevel = escalation.automatic ? escalation.level :
            this.rulesEngine.getRecommendedPenaltyLevel(data.infraction_type);

        // Validate penalty
        const validation = this.rulesEngine.validatePenalty(
            previousLevel,
            newLevel,
            true
        );

        if (!validation.valid) {
            throw new Error(`Penalty validation failed: ${validation.errors.join(', ')}`);
        }

        // Calculate missed hands
        const missedHands = this.rulesEngine.calculateMissedHands(newLevel);

        // Check if removal is required
        const shouldRemove = this.rulesEngine.shouldRemovePlayer(newLevel);

        // Impose penalty
        const penalty = await this.repository.imposePenalty(
            data,
            newLevel,
            escalation.automatic,
            latestPenalty ? parseInt(latestPenalty.id, 10) : null,
            missedHands,
            shouldRemove
        );

        // If disqualification, update player entry status
        if (shouldRemove) {
            await this.playerEntryRepo.update(data.player_entry_id, {
                status: 'ELIMINATED'
            });
        }

        // Log infraction statistics
        const playerEntry = await this.playerEntryRepo.getById(data.player_entry_id);
        if (playerEntry) {
            await this.repository.logInfractionStatistic(
                parseInt(playerEntry.player_id, 10),
                tournamentId,
                newLevel > 0,
                shouldRemove
            );
        }

        return penalty;
    }

    /**
     * Get complete penalty history for a player
     */
    async getPlayerPenaltyHistory(
        tournamentId: number,
        playerEntryId: number
    ): Promise<PlayerPenaltyHistoryDTO> {
        const penalties = await this.repository.getPlayerPenalties(
            tournamentId,
            playerEntryId
        );

        const count = await this.repository.getPenaltyCount(
            tournamentId,
            playerEntryId
        );

        const highestLevel = await this.repository.getHighestPenaltyLevel(
            tournamentId,
            playerEntryId
        );

        return {
            tournament_id: tournamentId.toString(),
            player_entry_id: playerEntryId.toString(),
            penalties,
            total_count: count,
            highest_level: highestLevel
        };
    }

    /**
     * Get all penalties for a tournament
     */
    async getTournamentPenalties(tournamentId: number): Promise<PenaltyDTO[]> {
        return this.repository.getTournamentPenalties(tournamentId);
    }

    /**
     * Get current penalty status for a player
     */
    async getPlayerPenaltyStatus(
        tournamentId: number,
        playerEntryId: number
    ): Promise<PenaltyVerificationDTO> {
        const latestPenalty = await this.repository.getLatestPenalty(
            tournamentId,
            playerEntryId
        );

        const count = await this.repository.getPenaltyCount(
            tournamentId,
            playerEntryId
        );

        const currentLevel = latestPenalty
            ? this.getLevelNumber(latestPenalty.penalty_level)
            : 0;

        // Determine status
        let status = 'GOOD_STANDING';
        let consequences = 'No active penalties';

        if (currentLevel === 3) {
            status = 'DISQUALIFIED';
            consequences = 'Removed from tournament';
        } else if (currentLevel === 2) {
            status = 'MAJOR_PENALTY_ACTIVE';
            consequences = `Must sit out ${latestPenalty!.missed_hands_count} hands. Next infraction results in disqualification.`;
        } else if (currentLevel === 1) {
            status = 'MINOR_PENALTY_ACTIVE';
            consequences = `Must sit out ${latestPenalty!.missed_hands_count} hands. Next infraction escalates to major penalty.`;
        } else if (currentLevel === 0 && count > 0) {
            status = 'WARNING_ACTIVE';
            consequences = 'Next infraction will result in penalty with missed hands.';
        }

        return {
            tournament_id: tournamentId.toString(),
            player_entry_id: playerEntryId.toString(),
            current_level: currentLevel,
            penalties_count: count,
            status,
            consequences
        };
    }

    // Helper method
    private getLevelNumber(level: string): number {
        const levels: Record<string, number> = {
            'VERBAL_WARNING': 0,
            'MINOR_PENALTY': 1,
            'MAJOR_PENALTY': 2,
            'DISQUALIFICATION': 3
        };
        return levels[level] ?? 0;
    }
}
