import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Tournament } from './Tournament';

/**
 * AuditLog Entity - System Audit Trail
 * PHASE 7: Track all critical actions for compliance & debugging
 */
@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Action Info
    @Column({ length: 50 })
    action: string; // 'CREATE', 'UPDATE', 'DELETE', 'PENALTY', etc

    @Column({ length: 100 })
    entity_type: string; // 'Tournament', 'PlayerEntry', 'Penalty', etc

    @Column({ type: 'uuid', nullable: true })
    entity_id: string;

    // Actor
    @ManyToOne(() => User)
    @JoinColumn({ name: 'actor_id' })
    actor: User;

    @Column({ type: 'uuid', nullable: true })
    actor_id: string; // Null for system actions

    // Tournament Context
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column({ type: 'uuid', nullable: true })
    tournament_id: string;

    // Details
    @Column({ type: 'jsonb', nullable: true })
    old_values: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    new_values: Record<string, any>;

    @Column({ type: 'text', nullable: true })
    reason: string;

    // IP & User Agent
    @Column({ length: 50, nullable: true })
    ip_address: string;

    @Column({ length: 500, nullable: true })
    user_agent: string;

    @CreateDateColumn()
    createdAt: Date;
}
