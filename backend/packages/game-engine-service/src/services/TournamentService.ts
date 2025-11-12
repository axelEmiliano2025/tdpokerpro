import { TournamentRepository } from '../repositories/TournamentRepository';
import {
    CreateTournamentDTO,
    UpdateTournamentDTO,
    TournamentDTO,
    TournamentValidationDTO,
} from '@tdpokerpro/shared-types';
import { validateBlindProportion } from '@tdpokerpro/shared-utils';

export class TournamentService {
    constructor(private tournamentRepository: TournamentRepository) { }

    async createTournament(dto: CreateTournamentDTO, userId: string): Promise<TournamentDTO> {
        // Validar estructura
        const validation = this.validateTournament(dto);
        if (!validation.valid) {
            throw new Error(`Tournament validation failed: ${validation.errors.join(', ')}`);
        }

        // Validar blind schedule
        for (const blind of dto.blind_schedule) {
            const blindValidation = validateBlindProportion(blind.small_blind, blind.big_blind);
            if (!blindValidation.valid) {
                console.warn(`Blind level ${blind.level} warnings:`, blindValidation.warnings);
            }
        }

        return this.tournamentRepository.create({
            created_by: userId,
            name: dto.name,
            game_type: dto.game_type,
            buy_in_cents: dto.buy_in_cents,
            rake_cents: dto.rake_cents || 0,
            starting_stack: dto.starting_stack,
            seats_per_table: dto.seats_per_table || 9,
            max_tables: dto.max_tables,
            scheduled_start_time: dto.scheduled_start_time,
            blind_schedule: dto.blind_schedule,
        });
    }

    async getTournament(id: string): Promise<TournamentDTO | null> {
        return this.tournamentRepository.getById(id);
    }

    async listTournaments(filters?: {
        status?: string;
        created_by?: string;
    }): Promise<TournamentDTO[]> {
        return this.tournamentRepository.getAll(filters);
    }

    async updateTournament(id: string, dto: UpdateTournamentDTO): Promise<TournamentDTO> {
        // Validate updates
        const tournament = await this.tournamentRepository.getById(id);
        if (!tournament) {
            throw new Error('Tournament not found');
        }

        if (dto.status && !this.isValidStatusTransition(tournament.status, dto.status)) {
            throw new Error(
                `Invalid status transition from ${tournament.status} to ${dto.status}`
            );
        }

        return this.tournamentRepository.update(id, dto);
    }

    async deleteTournament(id: string): Promise<void> {
        const tournament = await this.tournamentRepository.getById(id);

        if (tournament && tournament.status !== 'registering' && tournament.status !== 'draft') {
            throw new Error(`Cannot delete tournament in status ${tournament.status}`);
        }

        return this.tournamentRepository.delete(id);
    }

    // Validation
    private validateTournament(dto: CreateTournamentDTO): TournamentValidationDTO {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validar campos requeridos
        if (!dto.name || dto.name.trim().length === 0) {
            errors.push('Tournament name is required');
        }
        if (!dto.game_type) {
            errors.push('Game type is required');
        }
        if (dto.buy_in_cents <= 0) {
            errors.push('Buy-in must be greater than 0');
        }
        if (dto.starting_stack <= 0) {
            errors.push('Starting stack must be greater than 0');
        }

        // Validar blind schedule
        if (!dto.blind_schedule || dto.blind_schedule.length === 0) {
            errors.push('At least one blind level is required');
        } else {
            // Verificar que niveles sean secuenciales
            const levels = dto.blind_schedule.map((b) => b.level).sort((a, b) => a - b);
            for (let i = 0; i < levels.length; i++) {
                if (levels[i] !== i + 1) {
                    errors.push(`Blind levels must be sequential (missing level ${i + 1})`);
                    break;
                }
            }

            // Validar proporciones de ciegos
            for (const blind of dto.blind_schedule) {
                if (blind.small_blind >= blind.big_blind) {
                    errors.push(`Level ${blind.level}: Small blind must be less than big blind`);
                }
                if (blind.duration_minutes <= 0) {
                    errors.push(`Level ${blind.level}: Duration must be greater than 0`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }

    private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
        // Valid transitions per TDA rules
        const validTransitions: Record<string, string[]> = {
            draft: ['registering', 'cancelled'],
            scheduled: ['registering', 'cancelled'],
            registering: ['running', 'paused', 'cancelled'],
            running: ['paused', 'finished', 'cancelled'],
            paused: ['running', 'cancelled'],
            finished: [],
            cancelled: [],
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
}
