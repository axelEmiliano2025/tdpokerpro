import { SeatingAssignment } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';
import { DeepPartial } from 'typeorm';

/**
 * SeatingAssignment Repository
 * TDA Rule 7-11 table seating tracking
 */
export class SeatingAssignmentRepositoryTypeORM extends BaseRepository<SeatingAssignment> {
    constructor() {
        super(SeatingAssignment);
    }

    async findByTournament(tournamentId: string) {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            relations: ['playerEntry'],
            order: { table_number: 'ASC', seat_number: 'ASC' },
        });
    }

    async findByTable(tournamentId: string, tableNumber: number) {
        return this.repository.find({
            where: { tournament_id: tournamentId, table_number: tableNumber },
            relations: ['playerEntry'],
            order: { seat_number: 'ASC' },
        });
    }

    async findByPlayer(playerEntryId: string) {
        return this.repository.findOne({
            where: { player_entry_id: playerEntryId },
            relations: ['playerEntry'],
        });
    }

    async getTableAssignments(tournamentId: string) {
        const assignments = await this.repository.find({
            where: { tournament_id: tournamentId },
            relations: ['playerEntry', 'playerEntry.player'],
        });

        // Group by table
        const tables: { [key: number]: SeatingAssignment[] } = {};
        assignments.forEach(a => {
            if (!tables[a.table_number]) {
                tables[a.table_number] = [];
            }
            tables[a.table_number]!.push(a);
        }); return tables;
    }

    async countTables(tournamentId: string): Promise<number> {
        const result = await this.repository
            .createQueryBuilder('sa')
            .select('COUNT(DISTINCT sa.table_number)', 'count')
            .where('sa.tournament_id = :tournamentId', { tournamentId })
            .getRawOne();

        return parseInt(result?.count || '0');
    }

    async bulkAssign(assignments: DeepPartial<SeatingAssignment>[]): Promise<SeatingAssignment[]> {
        return this.repository.save(assignments);
    }

    async updateSeating(id: string, tableNumber: number, seatNumber: number): Promise<void> {
        await this.repository.update(id, {
            table_number: tableNumber,
            seat_number: seatNumber,
            assigned_at: new Date(),
        });
    }
}
