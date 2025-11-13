import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Penalty } from '@tdpokerpro/database';

@Injectable()
export class PenaltyService {
    constructor(
        @InjectRepository(Penalty)
        private penaltyRepository: Repository<Penalty>,
    ) { }

    async getPenalties(tournamentId: string) {
        const penalties = await this.penaltyRepository.find({
            where: { tournament_id: tournamentId },
            order: { createdAt: 'DESC' },
        });

        return penalties.map((p) => ({
            id: p.id,
            tournament_id: p.tournament_id,
            player_entry_id: p.player_entry_id,
            infraction_type: p.infraction_type,
            penalty_level: p.penalty_level,
            created_at: p.createdAt,
        }));
    }
}