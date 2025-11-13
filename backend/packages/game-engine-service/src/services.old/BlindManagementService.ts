import { Pool } from 'pg';
import {
    BlindTrackingDTO,
    BlindManagementStatusDTO,
    ColorUpRaceDTO
} from '@tdpokerpro/shared-types';
import { BlindManagementRepository } from '../repositories/BlindManagementRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';

export class BlindManagementService {
    private blindRepository: BlindManagementRepository;
    private tournamentRepository: TournamentRepository;

    constructor(pool: Pool, db: any) {
        this.blindRepository = new BlindManagementRepository(pool);
        this.tournamentRepository = new TournamentRepository(db);
    }

    /**
     * Initialize blind tracking when tournament starts
     */
    async initializeBlindTracking(tournamentId: string): Promise<BlindTrackingDTO> {
        return this.blindRepository.initializeBlindTracking(tournamentId);
    }

    /**
     * Auto-advance blind level
     * Called when current level time expires
     */
    async autoAdvanceBlind(tournamentId: string): Promise<BlindTrackingDTO> {
        const tracking = await this.blindRepository.getBlindTracking(tournamentId);
        if (!tracking) {
            throw new Error('Blind tracking not found');
        }

        const blindSchedule = await this.tournamentRepository.getBlindSchedule(tournamentId);
        const nextLevel = tracking.current_level + 1;

        // Check if next level exists
        if (!blindSchedule.find((b) => b.level === nextLevel)) {
            throw new Error('Tournament has reached final level');
        }

        return this.blindRepository.advanceBlind(tournamentId, nextLevel);
    }

    /**
     * Manual blind advance (TD override)
     */
    async manualAdvanceBlind(tournamentId: string, levels: number): Promise<BlindTrackingDTO> {
        const tracking = await this.blindRepository.getBlindTracking(tournamentId);
        if (!tracking) {
            throw new Error('Blind tracking not found');
        }

        const newLevel = tracking.current_level + levels;
        return this.blindRepository.advanceBlind(tournamentId, newLevel);
    }

    /**
     * Start/End break
     */
    async setBreak(tournamentId: string, isBreak: boolean): Promise<BlindTrackingDTO> {
        const tracking = await this.blindRepository.getBlindTracking(tournamentId);
        if (!tracking) {
            throw new Error('Blind tracking not found');
        }

        return this.blindRepository.setBreak(tournamentId, isBreak);
    }

    /**
     * Create color-up / chip race
     */
    async createColorUpRace(data: {
        tournament_id: string;
        blind_level: number;
        old_chip_value: number;
        new_chip_value: number;
        is_race: boolean; // true = race, false = chip pull
    }): Promise<ColorUpRaceDTO> {
        return this.blindRepository.createColorUpRace(data);
    }

    /**
     * Execute color-up race
     * All players with old_chip_value chips must exchange for new_chip_value
     */
    async executeColorUpRace(colorUpId: string): Promise<ColorUpRaceDTO> {
        return this.blindRepository.executeColorUpRace(colorUpId);
    }

    /**
     * Get current blind management status
     */
    async getBlindStatus(tournamentId: string): Promise<BlindManagementStatusDTO> {
        const tracking = await this.blindRepository.getBlindTracking(tournamentId);
        if (!tracking) {
            throw new Error('Blind tracking not found');
        }

        const tournament = await this.tournamentRepository.getById(tournamentId);
        if (!tournament) {
            throw new Error('Tournament not found');
        }

        const blindSchedule = await this.tournamentRepository.getBlindSchedule(tournamentId);

        const currentBlind = blindSchedule.find((b) => b.level === tracking.current_level);
        const nextBlind = blindSchedule.find((b) => b.level === tracking.current_level + 1);

        // Calculate time in current level
        const timeElapsed = Math.floor(
            (Date.now() - new Date(tracking.level_started_at).getTime()) / 1000 / 60
        );
        const timeRemaining = Math.max(0, (currentBlind?.duration_minutes || 0) - timeElapsed);

        return {
            current_level: tracking.current_level,
            current_blind: {
                small: currentBlind?.small_blind || 0,
                big: currentBlind?.big_blind || 0,
                antes: currentBlind?.antes || 0
            },
            time_in_current_level_minutes: timeElapsed,
            time_remaining_minutes: timeRemaining,
            is_break: tracking.is_break,
            next_level: nextBlind
                ? {
                    number: nextBlind.level,
                    small: nextBlind.small_blind,
                    big: nextBlind.big_blind
                }
                : undefined,
            levels_until_next_break: this.getLevelsUntilBreak(blindSchedule, tracking.current_level)
        };
    }

    /**
     * Helper: count levels until next break
     */
    private getLevelsUntilBreak(blindSchedule: any[], currentLevel: number): number {
        for (let i = currentLevel; i < blindSchedule.length; i++) {
            if (blindSchedule[i].is_break) {
                return i - currentLevel + 1;
            }
        }
        return blindSchedule.length - currentLevel;
    }
}
