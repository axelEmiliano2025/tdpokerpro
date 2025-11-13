import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tournament } from './Tournament';

/**
 * TournamentStatistics Entity - Tournament Aggregate Statistics
 * PHASE 7: Tournament-level analytics for reporting
 */
@Entity('tournament_statistics')
@Unique(['tournament_id'])
export class TournamentStatistics {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Attendance
    @Column({ default: 0 })
    registered_players: number;

    @Column({ default: 0 })
    started_players: number;

    @Column({ default: 0 })
    finished_players: number;

    @Column({ default: 0 })
    knockout_count: number;

    // Financial
    @Column({ type: 'bigint', default: 0 })
    total_buy_ins: number;

    @Column({ type: 'bigint', default: 0 })
    total_rebuys: number;

    @Column({ type: 'bigint', default: 0 })
    total_rake_collected: number;

    @Column({ type: 'bigint', default: 0 })
    total_prize_pool: number;

    @Column({ type: 'bigint', default: 0 })
    house_profit: number;

    // Duration
    @Column({ default: 0 })
    total_duration_minutes: number;

    @Column({ default: 0 })
    total_blind_levels: number;

    // Quality Metrics
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    average_buy_in: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    average_stack: number;

    // Status
    @Column({ default: false })
    is_completed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
