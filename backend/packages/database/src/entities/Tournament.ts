import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

/**
 * Tournament Entity - TD Management Core
 * PHASE 7: Tournament creation, configuration, state management
 */
@Entity('tournaments')
export class Tournament {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Creator Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @Column('uuid')
    created_by: string;

    // Basic Info
    @Column({ length: 255 })
    name: string;

    @Column({ length: 50 })
    game_type: string; // NLHE, PLO, OMAHA, etc

    // Status Management
    @Column({
        type: 'enum',
        enum: ['REGISTRATION', 'STARTED', 'HAND_FOR_HAND', 'FINAL_TABLE', 'COMPLETED', 'PAUSED', 'CANCELLED'],
        default: 'REGISTRATION'
    })
    status: string;

    // Financial Configuration
    @Column({ type: 'bigint' })
    buy_in_cents: number;

    @Column({ type: 'bigint', default: 0 })
    rake_cents: number;

    @Column({ type: 'bigint', nullable: true })
    guarantee_cents: number;

    @Column({ type: 'bigint', default: 0 })
    house_contribution_cents: number;

    // Registration Configuration
    @Column({ default: true })
    late_registration_enabled: boolean;

    @Column({ nullable: true })
    late_registration_end_level: number;

    @Column({ default: true })
    rebuy_enabled: boolean;

    @Column({ nullable: true })
    rebuy_end_level: number;

    @Column({ default: true })
    addon_enabled: boolean;

    @Column({ nullable: true })
    addon_level: number;

    // Tournament Configuration
    @Column({ type: 'bigint' })
    starting_stack: number;

    @Column({ default: 9 })
    seats_per_table: number;

    @Column({ nullable: true })
    max_tables: number;

    // Timing
    @Column({ nullable: true })
    scheduled_start_time: Date;

    @Column({ nullable: true })
    actual_start_time: Date;

    @Column({ nullable: true })
    expected_end_time: Date;

    @Column({ nullable: true })
    actual_end_time: Date;

    // Optimistic Locking
    @Column({ default: 1 })
    version: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
