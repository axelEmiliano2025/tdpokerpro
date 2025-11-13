import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './Tournament';

/**
 * EventLog Entity - Tournament Event Tracking
 * PHASE 7: Track tournament progression events (for replay, analytics)
 */
@Entity('event_logs')
export class EventLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Event Type
    @Column({ length: 50 })
    event_type: string; // 'BLIND_ADVANCED', 'PLAYER_ELIMINATED', 'TABLE_BREAK', etc

    // Event Data
    @Column({ type: 'jsonb' })
    event_data: Record<string, any>;

    // Level Context
    @Column({ nullable: true })
    blind_level: number;

    @Column({ nullable: true, type: 'uuid' })
    player_id: string;

    @CreateDateColumn()
    createdAt: Date;
}
