/**
 * User Repository
 * Manejo de datos de usuarios en PostgreSQL
 */

import { Knex } from 'knex';
import { User } from '@tdpokerpro/shared-types';

export class UserRepository {
    constructor(private db: Knex) { }

    /**
     * Buscar usuario por email
     */
    async findByEmail(email: string): Promise<User | null> {
        const user = await this.db('users')
            .where({ email })
            .first();

        return user || null;
    }

    /**
     * Buscar usuario por username
     */
    async findByUsername(username: string): Promise<User | null> {
        const user = await this.db('users')
            .where({ username })
            .first();

        return user || null;
    }

    /**
     * Buscar usuario por ID
     */
    async findById(id: string): Promise<User | null> {
        const user = await this.db('users')
            .where({ id })
            .first();

        return user || null;
    }

    /**
     * Crear nuevo usuario
     */
    async create(data: {
        email: string;
        username: string;
        password_hash: string;
        role?: string;
    }): Promise<User> {
        const [user] = await this.db('users')
            .insert({
                email: data.email,
                username: data.username,
                password_hash: data.password_hash,
                role: data.role || 'player',
                email_verified: false,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('*');

        return user;
    }

    /**
     * Actualizar última conexión
     */
    async updateLastLogin(userId: string): Promise<void> {
        await this.db('users')
            .where({ id: userId })
            .update({
                last_login_at: new Date(),
                updated_at: new Date(),
            });
    }

    /**
     * Verificar si existe email
     */
    async emailExists(email: string): Promise<boolean> {
        const count = await this.db('users')
            .where({ email })
            .count('* as count')
            .first();

        return Number(count?.count) > 0;
    }

    /**
     * Verificar si existe username
     */
    async usernameExists(username: string): Promise<boolean> {
        const count = await this.db('users')
            .where({ username })
            .count('* as count')
            .first();

        return Number(count?.count) > 0;
    }
}
