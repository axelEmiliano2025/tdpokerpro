import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './Tournament';

/**
 * BlindTracking Entity - Real-time Blind Level Tracking
 * PHASE 7: Tournament state (current blind level, break status)
 */
@Entity('blind_tracking')
export class BlindTracking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Current State
    @Column({ default: 1 })
    current_level: number;

    @Column({ nullable: true })
    level_started_at: Date;

    @Column({ default: false })
    is_break: boolean;

    @Column({ default: 0 })
    total_levels_played: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
