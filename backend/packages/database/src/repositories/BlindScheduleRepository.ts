import { BlindSchedule } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * BlindSchedule Repository
 * Blind level progression management
 */
export class BlindScheduleRepository extends BaseRepository<BlindSchedule> {
    constructor() {
        super(BlindSchedule);
    }

    async findByTournament(tournamentId: string): Promise<BlindSchedule[]> {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            order: { level: 'ASC' },
        });
    }

    async findLevel(tournamentId: string, levelNumber: number): Promise<BlindSchedule | null> {
        return this.repository.findOne({
            where: {
                tournament_id: tournamentId,
                level: levelNumber,
            },
        });
    }

    async findBreaks(tournamentId: string): Promise<BlindSchedule[]> {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                is_break: true,
            },
            order: { level: 'ASC' },
        });
    }

    async bulkCreate(schedules: Partial<BlindSchedule>[]): Promise<BlindSchedule[]> {
        const entities = this.repository.create(schedules);
        return this.repository.save(entities);
    }

    async getNextLevel(tournamentId: string, currentLevel: number): Promise<BlindSchedule | null> {
        return this.repository.findOne({
            where: {
                tournament_id: tournamentId,
                level: currentLevel + 1,
            },
        });
    }
}
