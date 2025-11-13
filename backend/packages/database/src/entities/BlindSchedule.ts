import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tournament } from './Tournament';

/**
 * BlindSchedule Entity - Blind Levels for Tournament
 * PHASE 7: Tournament blind progression (TDA Rules compliant)
 */
@Entity('blind_schedules')
@Unique(['tournament_id', 'level'])
export class BlindSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Level
    @Column()
    level: number;

    // Blinds
    @Column({ type: 'bigint' })
    small_blind: number;

    @Column({ type: 'bigint' })
    big_blind: number;

    @Column({ type: 'bigint', default: 0 })
    antes: number;

    // Duration
    @Column()
    duration_minutes: number;

    // Special Markers
    @Column({ default: false })
    late_registration_end: boolean;

    @Column({ default: false })
    rebuy_end: boolean;

    @Column({ default: false })
    addon_available: boolean;

    @Column({ default: false })
    is_break: boolean;

    @Column({ nullable: true })
    break_duration_minutes: number;

    @CreateDateColumn()
    createdAt: Date;
}
