import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './Tournament';
import { PlayerEntry } from './PlayerEntry';
import { User } from './User';

/**
 * Penalty Entity - Player Infractions
 * PHASE 7: TDA-compliant penalty system
 */
@Entity('penalties')
export class Penalty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Player Reference
    @ManyToOne(() => PlayerEntry)
    @JoinColumn({ name: 'player_entry_id' })
    playerEntry: PlayerEntry;

    @Column('uuid')
    player_entry_id: string;

    // Infraction Type
    @Column({
        type: 'enum',
        enum: [
            'ETIQUETTE_VIOLATION',
            'CARD_EXPOSURE',
            'STRING_BET',
            'SOFT_PLAY',
            'CHIP_DUMPING',
            'COLLUSION',
            'DODGING_BLIND',
            'DEVICE_MISUSE',
            'ABUSIVE_CONDUCT',
            'LATE_TO_TABLE',
            'ANGLE_SHOOTING',
            'EXCESSIVE_TIME'
        ]
    })
    infraction_type: string;

    // Penalty Level
    @Column({
        type: 'enum',
        enum: ['VERBAL_WARNING', 'MINOR_PENALTY', 'MAJOR_PENALTY', 'DISQUALIFICATION']
    })
    penalty_level: string;

    // Description
    @Column({ type: 'text', nullable: true })
    description: string;

    // Who Imposed
    @ManyToOne(() => User)
    @JoinColumn({ name: 'imposed_by' })
    imposedBy: User;

    @Column('uuid')
    imposed_by: string;

    // Escalation Chain
    @Column({ type: 'uuid', nullable: true })
    previous_penalty_id: string;

    @Column({ default: false })
    is_automatic_escalation: boolean;

    // Execution
    @Column({ nullable: true })
    missed_hands_count: number;

    @Column({ default: false })
    removal_from_tournament: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
