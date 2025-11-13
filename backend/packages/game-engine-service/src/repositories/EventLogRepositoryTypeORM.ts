import { EventLog } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * EventLog Repository
 * System event tracking
 */
export class EventLogRepositoryTypeORM extends BaseRepository<EventLog> {
    constructor() {
        super(EventLog);
    }

    async findByType(eventType: string, limit = 50) {
        return this.repository.find({
            where: { event_type: eventType },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByTournament(tournamentId: string, limit = 50) {
        return this.repository.find({
            where: { tournament_id: tournamentId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findRecent(hours = 24, limit = 100) {
        const since = new Date();
        since.setHours(since.getHours() - hours);

        return this.repository
            .createQueryBuilder('el')
            .where('el.createdAt >= :since', { since })
            .orderBy('el.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }

    async logEvent(
        tournamentId: string,
        eventType: string,
        eventData: any,
        blindLevel?: number,
        playerId?: string
    ): Promise<EventLog> {
        return this.repository.save({
            tournament_id: tournamentId,
            event_type: eventType,
            event_data: eventData,
            blind_level: blindLevel,
            player_id: playerId,
        });
    }
}
