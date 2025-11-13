import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatingAssignment } from '@tdpokerpro/database';

@Injectable()
export class SeatingService {
    constructor(
        @InjectRepository(SeatingAssignment)
        private seatingRepository: Repository<SeatingAssignment>,
    ) { }

    async getSeatingAssignments(tournamentId: string) {
        const assignments = await this.seatingRepository.find({
            where: { tournament_id: tournamentId },
            order: { table_number: 'ASC', seat_number: 'ASC' },
        });

        return assignments.map((a) => ({
            id: a.id,
            tournament_id: a.tournament_id,
            player_entry_id: a.player_entry_id,
            table_number: a.table_number,
            seat_number: a.seat_number,
            assigned_at: a.assigned_at,
        }));
    }
}
