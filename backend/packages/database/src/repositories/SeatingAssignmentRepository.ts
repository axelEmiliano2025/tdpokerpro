import { SeatingAssignment } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * SeatingAssignment Repository
 * Table and seat management
 */
export class SeatingAssignmentRepository extends BaseRepository<SeatingAssignment> {
    constructor() {
        super(SeatingAssignment);
    }

    async findByTable(tournamentId: string, tableNumber: number): Promise<SeatingAssignment[]> {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
                table_number: tableNumber,
            },
            relations: { playerEntry: true },
            order: { seat_number: 'ASC' },
        });
    }

    async getTableAssignments(tournamentId: string): Promise<SeatingAssignment[]> {
        return this.repository.find({
            where: {
                tournament_id: tournamentId,
            },
            relations: { playerEntry: true },
            order: { table_number: 'ASC', seat_number: 'ASC' },
        });
    }

    async bulkAssign(assignments: Partial<SeatingAssignment>[]): Promise<SeatingAssignment[]> {
        const entities = this.repository.create(assignments);
        return this.repository.save(entities);
    }

    async removePlayerFromSeat(assignmentId: string): Promise<boolean> {
        const result = await this.repository.delete(assignmentId);
        return (result.affected || 0) > 0;
    }

    async getAvailableSeats(tournamentId: string, tableNumber: number): Promise<number[]> {
        const occupiedSeats = await this.repository.find({
            where: {
                tournament_id: tournamentId,
                table_number: tableNumber,
            },
            select: ['seat_number'],
        });

        const occupied = occupiedSeats.map((s) => s.seat_number);
        const allSeats = Array.from({ length: 9 }, (_, i) => i + 1);
        return allSeats.filter((seat) => !occupied.includes(seat));
    }
}
