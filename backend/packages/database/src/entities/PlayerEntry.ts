import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tournament } from './Tournament';
import { User } from './User';

/**
 * PlayerEntry Entity - Player Registration in Tournament
 * PHASE 7: Tournament participation tracking
 */
@Entity('player_entries')
@Unique(['tournament_id', 'player_id', 'entry_number'])
export class PlayerEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Player Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'player_id' })
    player: User;

    @Column('uuid')
    player_id: string;

    // Entry Info
    @Column()
    entry_number: number; // 1 for initial, 2+ for rebuys

    @Column({
        type: 'enum',
        enum: ['initial', 'late_reg', 'rebuy', 'reentry', 'addon'],
        default: 'initial'
    })
    entry_type: string;

    // Financial
    @Column({ type: 'bigint' })
    buy_in_cents: number;

    @Column({ type: 'bigint' })
    starting_stack: number;

    @Column({ type: 'bigint', default: 0 })
    current_stack: number;

    // Bounty (if applicable)
    @Column({ default: 0 })
    bounty_chips_purchased: number;

    @Column({ default: 0 })
    bounty_chips_current: number;

    @Column({ type: 'jsonb', nullable: true })
    bounty_chips_won_from: string[]; // Array of player IDs

    // Status
    @Column({
        type: 'enum',
        enum: ['REGISTERED', 'ACTIVE', 'ELIMINATED', 'PAID_OUT'],
        default: 'REGISTERED'
    })
    status: string;

    // Results
    @Column({ nullable: true })
    finishing_position: number;

    @Column({ type: 'bigint', nullable: true })
    finishing_prize_cents: number;

    @Column({ nullable: true, type: 'uuid' })
    busted_hand_id: string;

    @Column({ nullable: true })
    busted_at: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
