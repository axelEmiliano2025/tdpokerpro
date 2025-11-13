import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@tdpokerpro/database';

/**
 * User Service (NestJS)
 * Migrated from Express to NestJS
 */
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findById(userId: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: userId },
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { username },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async update(userId: string, data: Partial<User>): Promise<User | null> {
        await this.userRepository.update(userId, data);
        return this.findById(userId);
    }

    async delete(userId: string): Promise<boolean> {
        const result = await this.userRepository.delete(userId);
        return (result.affected || 0) > 0;
    }
}
