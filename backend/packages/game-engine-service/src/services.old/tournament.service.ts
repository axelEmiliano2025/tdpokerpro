import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament, BlindSchedule } from '@tdpokerpro/database';
import {
    CreateTournamentDTO,
    UpdateTournamentDTO,
    TournamentDTO,
    TournamentValidationDTO,
} from '@tdpokerpro/shared-types';
import { validateBlindProportion } from '@tdpokerpro/shared-utils';

@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private tournamentRepository: Repository<Tournament>,
        @InjectRepository(BlindSchedule)
        private blindScheduleRepository: Repository<BlindSchedule>,
    ) { }

    async createTournament(
        dto: CreateTournamentDTO,
        userId: string,
    ): Promise<TournamentDTO> {
        // Validar estructura
        const validation = this.validateTournament(dto);
        if (!validation.valid) {
            throw new Error(
                `Tournament validation failed: ${validation.errors.join(', ')}`,
            );
        }

        // Validar blind schedule
        for (const blind of dto.blind_schedule) {
            const blindValidation = validateBlindProportion(
                blind.small_blind,
                blind.big_blind,
            );
            if (!blindValidation.valid) {
                console.warn(
                    `Blind level ${blind.level} warnings:`,
                    blindValidation.warnings,
                );
            }
        }

        // Crear torneo
        const tournament = this.tournamentRepository.create({
            createdBy: userId,
            name: dto.name,
            gameType: dto.game_type,
            buyInCents: dto.buy_in_cents,
            rakeCents: dto.rake_cents || 0,
            startingStack: dto.starting_stack,
            seatsPerTable: dto.seats_per_table || 9,
            maxTables: dto.max_tables,
            scheduledStartTime: dto.scheduled_start_time,
        });

        const savedTournament = await this.tournamentRepository.save(tournament);

        // Crear blind schedule
        const blindSchedules = dto.blind_schedule.map((blind) =>
            this.blindScheduleRepository.create({
                tournament: savedTournament,
                level: blind.level,
                smallBlind: blind.small_blind,
                bigBlind: blind.big_blind,
                antes: blind.antes,
                durationMinutes: blind.duration_minutes,
                isBreak: blind.is_break,
            }),
        );

        await this.blindScheduleRepository.save(blindSchedules);

        return this.mapToDTO(savedTournament);
    }

    async getTournament(id: string): Promise<TournamentDTO | null> {
        const tournament = await this.tournamentRepository.findOne({
            where: { id },
            relations: ['blindSchedule'],
        });

        return tournament ? this.mapToDTO(tournament) : null;
    }

    async listTournaments(filters?: {
        status?: string;
        created_by?: string;
    }): Promise<TournamentDTO[]> {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.created_by) {
            where.created_by = filters.created_by;
        }

        const tournaments = await this.tournamentRepository.find({
            where,
            relations: ['blindSchedule'],
        });

        return tournaments.map((t) => this.mapToDTO(t));
    } async updateTournament(
        id: string,
        dto: UpdateTournamentDTO,
    ): Promise<TournamentDTO> {
        const tournament = await this.tournamentRepository.findOne({
            where: { id },
            relations: ['blindSchedule'],
        });

        if (!tournament) {
            throw new Error('Tournament not found');
        }

        if (
            dto.status &&
            !this.isValidStatusTransition(tournament.status, dto.status)
        ) {
            throw new Error(
                `Invalid status transition from ${tournament.status} to ${dto.status}`,
            );
        }

        // Update fields
        if (dto.name) tournament.name = dto.name;
        if (dto.status) tournament.status = dto.status;
        if (dto.scheduled_start_time)
            tournament.scheduledStartTime = dto.scheduled_start_time;

        const updated = await this.tournamentRepository.save(tournament);
        return this.mapToDTO(updated);
    }

    async deleteTournament(id: string): Promise<void> {
        const tournament = await this.tournamentRepository.findOne({
            where: { id },
        });

        if (
            tournament &&
            tournament.status !== 'registering' &&
            tournament.status !== 'draft'
        ) {
            throw new Error(
                `Cannot delete tournament in status ${tournament.status}`,
            );
        }

        await this.tournamentRepository.delete(id);
    }

    // Validation
    private validateTournament(dto: CreateTournamentDTO): TournamentValidationDTO {
        const errors: string[] = [];
        const warnings: string[] = [];

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

        if (!dto.blind_schedule || dto.blind_schedule.length === 0) {
            errors.push('At least one blind level is required');
        } else {
            const levels = dto.blind_schedule.map((b) => b.level).sort((a, b) => a - b);
            for (let i = 0; i < levels.length; i++) {
                if (levels[i] !== i + 1) {
                    errors.push(
                        `Blind levels must be sequential (missing level ${i + 1})`,
                    );
                    break;
                }
            }

            for (const blind of dto.blind_schedule) {
                if (blind.small_blind >= blind.big_blind) {
                    errors.push(
                        `Level ${blind.level}: Small blind must be less than big blind`,
                    );
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

    private isValidStatusTransition(
        currentStatus: string,
        newStatus: string,
    ): boolean {
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

    private mapToDTO(tournament: Tournament): TournamentDTO {
        return {
            id: tournament.id,
            created_by: tournament.created_by,
            name: tournament.name,
            game_type: tournament.game_type,
            buy_in_cents: tournament.buy_in_cents,
            rake_cents: tournament.rake_cents,
            starting_stack: tournament.starting_stack,
            seats_per_table: tournament.seats_per_table,
            status: tournament.status as any,
            late_registration_enabled: tournament.late_registration_enabled,
            late_registration_end_level: tournament.late_registration_end_level,
            rebuy_enabled: tournament.rebuy_enabled,
            rebuy_end_level: tournament.rebuy_end_level,
            addon_enabled: tournament.addon_enabled,
            addon_level: tournament.addon_level,
            blind_schedule: [],
            created_at: tournament.createdAt,
            updated_at: tournament.updatedAt,
        };
    }
}
