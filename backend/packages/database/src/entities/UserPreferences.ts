import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

/**
 * UserPreferences Entity - User Configuration
 * PHASE 7: Personalization & settings storage
 */
@Entity('user_preferences')
export class UserPreferences {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // User Reference (1:1 relationship)
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('uuid')
    user_id: string;

    // Notifications
    @Column({ default: true })
    email_notifications_enabled: boolean;

    @Column({ default: true })
    tournament_reminders: boolean;

    @Column({ default: true })
    social_notifications: boolean;

    @Column({ default: true })
    message_notifications: boolean;

    // Privacy
    @Column({ default: true })
    show_online_status: boolean;

    @Column({ default: false })
    show_location: boolean;

    @Column({ default: true })
    allow_comments: boolean;

    @Column({ default: true })
    allow_messages: boolean;

    // Preferences
    @Column({ default: 'en', length: 10 })
    language: string; // 'en', 'es', 'pt'

    @Column({ default: 'dark', length: 10 })
    theme: string; // 'light', 'dark'

    @Column({ length: 10, nullable: true })
    timezone: string; // 'America/New_York', etc

    @Column({ type: 'jsonb', nullable: true })
    tournament_filters: Record<string, any>; // Saved filters

    @Column({ type: 'jsonb', nullable: true })
    ui_settings: Record<string, any>; // UI customization

    // TD-specific
    @Column({ default: false })
    show_advanced_stats: boolean;

    @Column({ default: 'standard', length: 50 })
    ui_layout: string; // 'standard', 'compact', 'wide'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
