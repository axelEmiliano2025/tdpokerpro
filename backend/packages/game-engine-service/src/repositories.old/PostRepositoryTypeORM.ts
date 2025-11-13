import { Post } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * Post Repository
 * Social feed management
 */
export class PostRepositoryTypeORM extends BaseRepository<Post> {
    constructor() {
        super(Post);
    }

    async findFeed(limit = 20, offset = 0) {
        return this.repository.find({
            where: { isPublic: true, isDeleted: false, isSpam: false },
            order: { createdAt: 'DESC' },
            relations: ['user'],
            take: limit,
            skip: offset,
        });
    }

    async findByUser(userId: string, limit = 20, offset = 0) {
        return this.repository.find({
            where: { user_id: userId, isDeleted: false },
            order: { createdAt: 'DESC' },
            relations: ['user'],
            take: limit,
            skip: offset,
        });
    }

    async findByType(type: string, limit = 20) {
        return this.repository.find({
            where: { type, isPublic: true, isDeleted: false },
            order: { likesCount: 'DESC' },
            take: limit,
        });
    }

    async findTrending(limit = 10) {
        return this.repository.find({
            where: { isPublic: true, isDeleted: false },
            order: { likesCount: 'DESC' },
            take: limit,
        });
    }

    async updateEngagement(id: string, likeDelta: number, commentDelta: number): Promise<void> {
        await this.repository.increment(
            { id },
            'likesCount',
            likeDelta
        );
        await this.repository.increment(
            { id },
            'commentsCount',
            commentDelta
        );
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.update(id, {
            isDeleted: true,
            deletedAt: new Date(),
        });
    }
}
