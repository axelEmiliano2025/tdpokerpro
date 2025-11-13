import { Follow } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * Follow Repository
 * User relationships tracking
 */
export class FollowRepositoryTypeORM extends BaseRepository<Follow> {
    constructor() {
        super(Follow);
    }

    async findFollowers(userId: string) {
        return this.repository.find({
            where: { following_id: userId, isApproved: true },
            relations: ['follower'],
        });
    }

    async findFollowing(userId: string) {
        return this.repository.find({
            where: { follower_id: userId, isApproved: true },
            relations: ['following'],
        });
    }

    async countFollowers(userId: string): Promise<number> {
        return this.repository.count({
            where: { following_id: userId, isApproved: true },
        });
    }

    async countFollowing(userId: string): Promise<number> {
        return this.repository.count({
            where: { follower_id: userId, isApproved: true },
        });
    }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const count = await this.repository.count({
            where: {
                follower_id: followerId,
                following_id: followingId,
                isApproved: true,
            },
        });
        return count > 0;
    }

    async findPendingRequests(userId: string) {
        return this.repository.find({
            where: { following_id: userId, isApproved: false },
            relations: ['follower'],
        });
    }

    async approveFollow(id: string): Promise<void> {
        await this.repository.update(id, {
            isApproved: true,
            approvedAt: new Date(),
        });
    }
}
