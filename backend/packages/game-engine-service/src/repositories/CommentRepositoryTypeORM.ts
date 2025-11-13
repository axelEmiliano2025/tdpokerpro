import { Comment } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * Comment Repository
 * Post comments management
 */
export class CommentRepositoryTypeORM extends BaseRepository<Comment> {
    constructor() {
        super(Comment);
    }

    async findByPost(postId: string) {
        return this.repository.find({
            where: { post_id: postId, isDeleted: false },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }

    async findByUser(userId: string, limit = 20) {
        return this.repository.find({
            where: { user_id: userId, isDeleted: false },
            relations: ['post'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async countByPost(postId: string): Promise<number> {
        return this.repository.count({
            where: { post_id: postId, isDeleted: false },
        });
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.update(id, {
            isDeleted: true,
            deletedAt: new Date(),
        });
    }
}
