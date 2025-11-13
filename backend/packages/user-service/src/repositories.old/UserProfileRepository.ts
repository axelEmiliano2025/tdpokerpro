/**
 * User Profile Repository
 */

import { Knex } from 'knex';
import { UserProfile } from '@tdpokerpro/shared-types';

export class UserProfileRepository {
    constructor(private db: Knex) { }

    /**
     * Buscar perfil por user ID
     */
    async findByUserId(userId: string): Promise<UserProfile | null> {
        const profile = await this.db('user_profiles')
            .where({ user_id: userId })
            .first();

        return profile || null;
    }

    /**
     * Crear perfil de usuario
     */
    async create(data: {
        userId: string;
        username: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        avatarUrl?: string;
        bio?: string;
        country?: string;
        city?: string;
        birthDate?: Date;
        preferredLanguage?: string;
    }): Promise<UserProfile> {
        const [profile] = await this.db('user_profiles')
            .insert({
                user_id: data.userId,
                username: data.username,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                avatar_url: data.avatarUrl,
                bio: data.bio,
                country: data.country,
                city: data.city,
                birth_date: data.birthDate,
                preferred_language: data.preferredLanguage || 'es',
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('*');

        return profile;
    }

    /**
     * Actualizar perfil
     */
    async update(
        userId: string,
        data: Partial<{
            username: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatarUrl: string;
            bio: string;
            country: string;
            city: string;
            birthDate: Date;
            preferredLanguage: string;
        }>
    ): Promise<UserProfile | null> {
        const updateData: any = {
            updated_at: new Date(),
        };

        if (data.username !== undefined) updateData.username = data.username;
        if (data.firstName !== undefined) updateData.first_name = data.firstName;
        if (data.lastName !== undefined) updateData.last_name = data.lastName;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
        if (data.bio !== undefined) updateData.bio = data.bio;
        if (data.country !== undefined) updateData.country = data.country;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;
        if (data.preferredLanguage !== undefined) updateData.preferred_language = data.preferredLanguage;

        const [profile] = await this.db('user_profiles')
            .where({ user_id: userId })
            .update(updateData)
            .returning('*');

        return profile || null;
    }

    /**
     * Eliminar perfil
     */
    async delete(userId: string): Promise<boolean> {
        const deleted = await this.db('user_profiles')
            .where({ user_id: userId })
            .delete();

        return deleted > 0;
    }
}
