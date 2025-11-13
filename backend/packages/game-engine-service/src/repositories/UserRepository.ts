import { User } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * User Repository
 * Authentication & Player/TD Profile management
 */
export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.repository.findOne({
            where: { username },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({
            where: { email },
        });
    }

    async findTournamentDirectors(): Promise<User[]> {
        return this.repository.find({
            where: { isTd: true, status: 'active' },
            order: { tdRating: 'DESC' },
        });
    }

    async findActivePlayers(): Promise<User[]> {
        return this.repository.find({
            where: { role: 'player', status: 'active' },
            order: { followersCount: 'DESC' },
        });
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.repository.update(userId, {
            lastLogin: new Date(),
        });
    }

    async getPlayerStats(userId: string) {
        return this.repository.findOne({
            where: { id: userId },
            select: [
                'id',
                'username',
                'tournamentsPlayed',
                'tournamentsWon',
                'totalEarnings',
                'currentRoi',
            ],
        });
    }
}
