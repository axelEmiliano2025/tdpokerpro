import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlindSchedule } from '@tdpokerpro/database';

@Injectable()
export class BlindService {
    constructor(
        @InjectRepository(BlindSchedule)
        private blindRepository: Repository<BlindSchedule>,
    ) { }

    async getBlindSchedule(tournamentId: string) {
        const blinds = await this.blindRepository.find({
            where: { tournament_id: tournamentId },
            order: { level: 'ASC' },
        });

        return blinds.map((b) => ({
            level: b.level,
            small_blind: b.small_blind,
            big_blind: b.big_blind,
            antes: b.antes,
            duration_minutes: b.duration_minutes,
            is_break: b.is_break,
        }));
    }
}
