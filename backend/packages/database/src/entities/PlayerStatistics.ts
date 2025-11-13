import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Tournament } from './Tournament';

/**
 * PlayerStatistics Entity - Player Performance Tracking
 * PHASE 7: Tournament-level statistics for analytics & leaderboards
 */
@Entity('player_statistics')
export class PlayerStatistics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Player Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'player_id' })
    player: User;

    @Column('uuid')
    player_id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Tournament Stats
    @Column({ default: 0 })
    entry_count: number; // Initial + rebuys

    @Column({ default: 0 })
    buy_in_total: number;

    @Column({ default: 0 })
    final_position: number;

    @Column({ default: 0 })
    prize_earned: number;

    // Performance
    @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
    roi: number; // Return on investment %

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    knockout_points: number;

    // Time Stats
    @Column({ default: 0 })
    playtime_minutes: number;

    @Column({ nullable: true })
    bust_time: Date;

    // Chip Stats
    @Column({ default: 0 })
    starting_chips: number;

    @Column({ default: 0 })
    max_chips: number;

    @Column({ default: 0 })
    final_chips: number;

    // Achievement
    @Column({ default: false })
    is_winner: boolean;

    @Column({ default: false })
    made_final_table: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
