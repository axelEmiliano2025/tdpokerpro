import { Post } from '../entities';
import { BaseRepository } from './BaseRepository';
import { IsNull } from 'typeorm';

/**
 * Post Repository
 * Social feed posts management
 */
export class PostRepository extends BaseRepository<Post> {
    constructor() {
        super(Post);
    }

    async findFeed(limit: number = 20, offset: number = 0): Promise<Post[]> {
        return this.repository.find({
            where: {
                deletedAt: IsNull(),
                isPublic: true,
            },
            relations: { user: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
    }

    async findTrending(limit: number = 10): Promise<Post[]> {
        return this.repository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where('post.deletedAt IS NULL')
            .andWhere('post.createdAt > :since', {
                since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
            })
            .orderBy('post.likesCount', 'DESC')
            .addOrderBy('post.commentsCount', 'DESC')
            .take(limit)
            .getMany();
    }

    async updateEngagement(postId: string, type: 'like' | 'comment'): Promise<void> {
        const column = type === 'like' ? 'likesCount' : 'commentsCount';
        await this.repository.increment({ id: postId }, column, 1);
    }

    async softDelete(postId: string): Promise<boolean> {
        const result = await this.repository.update(postId, {
            deletedAt: new Date(),
            isDeleted: true,
        });
        return (result.affected || 0) > 0;
    }

    async findByAuthor(authorId: string, limit: number = 20): Promise<Post[]> {
        return this.repository.find({
            where: {
                user_id: authorId,
                deletedAt: IsNull(),
            },
            relations: { user: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
}
