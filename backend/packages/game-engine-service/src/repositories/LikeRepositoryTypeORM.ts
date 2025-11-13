import { Like } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * Like Repository
 * Post likes management
 */
export class LikeRepositoryTypeORM extends BaseRepository<Like> {
    constructor() {
        super(Like);
    }

    async findByPost(postId: string) {
        return this.repository.find({
            where: { post_id: postId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByUser(userId: string, limit = 20) {
        return this.repository.find({
            where: { user_id: userId },
            relations: ['post'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async hasLiked(userId: string, postId: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { user_id: userId, post_id: postId },
        });
        return count > 0;
    }

    async countByPost(postId: string): Promise<number> {
        return this.repository.count({
            where: { post_id: postId },
        });
    }

    async findOrCreate(userId: string, postId: string): Promise<Like> {
        const existing = await this.repository.findOne({
            where: { user_id: userId, post_id: postId },
        });

        if (existing) return existing;

        return this.repository.save({ user_id: userId, post_id: postId });
    }
}
