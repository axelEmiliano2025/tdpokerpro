import { AuditLog } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * AuditLog Repository
 * Security & compliance audit trail
 */
export class AuditLogRepositoryTypeORM extends BaseRepository<AuditLog> {
    constructor() {
        super(AuditLog);
    }

    async findByUser(userId: string, limit = 50) {
        return this.repository.find({
            where: { actor_id: userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByAction(action: string, limit = 50) {
        return this.repository.find({
            where: { action },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByEntity(entityType: string, limit = 50) {
        return this.repository.find({
            where: { entity_type: entityType },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByResource(entityType: string, entityId: string) {
        return this.repository.find({
            where: {
                entity_type: entityType,
                entity_id: entityId,
            },
            order: { createdAt: 'DESC' },
        });
    } async findRecent(hours = 24, limit = 100) {
        const since = new Date();
        since.setHours(since.getHours() - hours);

        return this.repository
            .createQueryBuilder('al')
            .where('al.createdAt >= :since', { since })
            .orderBy('al.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }

    async logAction(
        actorId: string,
        action: string,
        entityType: string,
        entityId: string,
        tournamentId?: string,
        details?: { oldValues?: any; newValues?: any; reason?: string }
    ): Promise<AuditLog> {
        return this.repository.save({
            actor_id: actorId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            tournament_id: tournamentId,
            old_values: details?.oldValues,
            new_values: details?.newValues,
            reason: details?.reason,
        });
    }
}
