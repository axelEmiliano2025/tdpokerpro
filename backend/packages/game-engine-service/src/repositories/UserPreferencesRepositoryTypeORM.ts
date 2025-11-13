import { UserPreferences } from '@tdpokerpro/database';
import { BaseRepository } from './BaseRepository';

/**
 * UserPreferences Repository
 * User customization settings
 */
export class UserPreferencesRepositoryTypeORM extends BaseRepository<UserPreferences> {
    constructor() {
        super(UserPreferences);
    }

    async findByUser(userId: string): Promise<UserPreferences | null> {
        return this.repository.findOne({
            where: { user_id: userId },
        });
    }

    async updateTheme(userId: string, theme: string): Promise<void> {
        await this.repository.update(
            { user_id: userId },
            { theme }
        );
    }

    async updateLanguage(userId: string, language: string): Promise<void> {
        await this.repository.update(
            { user_id: userId },
            { language }
        );
    }

    async updateNotifications(userId: string, notifications: boolean): Promise<void> {
        await this.repository.update(
            { user_id: userId },
            { email_notifications_enabled: notifications }
        );
    }

    async updateSoundEffects(userId: string, enabled: boolean): Promise<void> {
        await this.repository.update(
            { user_id: userId },
            { tournament_reminders: enabled }
        );
    } async findOrCreate(userId: string): Promise<UserPreferences> {
        const existing = await this.findByUser(userId);
        if (existing) return existing;

        return this.repository.save({ user_id: userId });
    }
}
