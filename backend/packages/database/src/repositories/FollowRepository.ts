import { Follow } from '../entities';
import { BaseRepository } from './BaseRepository';

/**
 * Follow Repository
 * User follow relationships management
 */
export class FollowRepository extends BaseRepository<Follow> {
    constructor() {
        super(Follow);
    }

    async findFollowers(userId: string, limit: number = 50): Promise<Follow[]> {
        return this.repository.find({
            where: {
                following_id: userId,
                isApproved: true,
            },
            relations: { follower: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findFollowing(userId: string, limit: number = 50): Promise<Follow[]> {
        return this.repository.find({
            where: {
                follower_id: userId,
                isApproved: true,
            },
            relations: { following: true },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await this.repository.findOne({
            where: {
                follower_id: followerId,
                following_id: followingId,
                isApproved: true,
            },
        });
        return follow !== null;
    }

    async approveFollow(followId: string): Promise<Follow | null> {
        await this.repository.update(followId, {
            isApproved: true,
            approvedAt: new Date(),
        });
        return this.findById(followId);
    }

    async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
        const result = await this.repository.delete({
            follower_id: followerId,
            following_id: followingId,
        });
        return (result.affected || 0) > 0;
    }

    async countFollowers(userId: string): Promise<number> {
        return this.repository.count({
            where: {
                following_id: userId,
                isApproved: true,
            },
        });
    }

    async countFollowing(userId: string): Promise<number> {
        return this.repository.count({
            where: {
                follower_id: userId,
                isApproved: true,
            },
        });
    }
}
