import { BlindSchedule } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';
import { DeepPartial } from 'typeorm';

/**
 * BlindSchedule Repository
 * Tournament blind levels (TDA compliant)
 */
export class BlindScheduleRepositoryTypeORM extends BaseRepository<BlindSchedule> {
    constructor() {
        super(BlindSchedule);
    }

    async findByTournament(tournamentId: string) {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            order: { level: 'ASC' },
        });
    }

    async findLevel(tournamentId: string, level: number): Promise<BlindSchedule | null> {
        return this.repository.findOne({
            where: {
                tournament_id: tournamentId,
                level,
            },
        });
    }

    async countLevels(tournamentId: string): Promise<number> {
        return this.repository.count({
            where: { tournament_id: tournamentId },
        });
    }

    async findBreaks(tournamentId: string) {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                is_break: true,
            },
            order: { level: 'ASC' },
        });
    }

    async findLateRegistrationEnd(tournamentId: string): Promise<BlindSchedule | null> {
        return this.repository.findOne({
            where: {
                tournament_id: tournamentId,
                late_registration_end: true,
            },
        });
    }

    async findRebuyEnd(tournamentId: string): Promise<BlindSchedule | null> {
        return this.repository.findOne({
            where: {
                tournament_id: tournamentId,
                rebuy_end: true,
            },
        });
    }

    async bulkCreate(tournamentId: string, blinds: DeepPartial<BlindSchedule>[]): Promise<BlindSchedule[]> {
        const blindsWithTournament = blinds.map(b => ({
            ...b,
            tournament_id: tournamentId,
        }));
        return this.repository.save(blindsWithTournament);
    }
}
