import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * User Entity - Unified for TD, Players, and Social
 * PHASE 7: Core identity for entire platform
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Authentication
    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    passwordHash: string;

    @Column({ default: false })
    emailVerified: boolean;

    @Column({ nullable: true })
    verifiedAt: Date;

    // Role & Status
    @Column({
        type: 'enum',
        enum: ['player', 'td', 'admin', 'venue_owner'],
        default: 'player'
    })
    role: string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'banned', 'suspended'],
        default: 'active'
    })
    status: string;

    // TD Fields
    @Column({ default: false })
    isTd: boolean;

    @Column({ nullable: true, length: 50 })
    tdLicenseNumber: string;

    @Column({ nullable: true })
    tdExperienceYears: number;

    @Column({ nullable: true, type: 'decimal', precision: 3, scale: 2 })
    tdRating: number;

    @Column({ default: 0 })
    tdRatingCount: number;

    // Profile (Social)
    @Column({ nullable: true, length: 100 })
    firstName: string;

    @Column({ nullable: true, length: 100 })
    lastName: string;

    @Column({ nullable: true, length: 500 })
    avatarUrl: string;

    @Column({ nullable: true, length: 500 })
    coverUrl: string;

    @Column({ nullable: true, type: 'text' })
    bio: string;

    @Column({ nullable: true, length: 255 })
    location: string;

    @Column({ nullable: true, length: 500 })
    websiteUrl: string;

    @Column({ nullable: true })
    birthDate: Date;

    // Social Stats
    @Column({ default: 0 })
    followersCount: number;

    @Column({ default: 0 })
    followingCount: number;

    @Column({ default: 0 })
    postsCount: number;

    // Player Stats
    @Column({ default: 0 })
    tournamentsPlayed: number;

    @Column({ default: 0 })
    tournamentsWon: number;

    @Column({ default: 0 })
    totalEarnings: number;

    @Column({ nullable: true, type: 'decimal', precision: 6, scale: 2 })
    currentRoi: number;

    // Privacy
    @Column({ default: false })
    isPrivate: boolean;

    @Column({ default: true })
    showEarnings: boolean;

    @Column({ default: true })
    allowMessages: boolean;

    // Timestamps
    @Column({ nullable: true })
    lastLogin: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
