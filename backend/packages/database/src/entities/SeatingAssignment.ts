import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tournament } from './Tournament';
import { PlayerEntry } from './PlayerEntry';

/**
 * SeatingAssignment Entity - Table & Seat Assignments
 * PHASE 7: TDA Rule 7-11 seating tracking
 */
@Entity('seating_assignments')
@Unique(['tournament_id', 'table_number', 'seat_number'])
export class SeatingAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tournament Reference
    @ManyToOne(() => Tournament)
    @JoinColumn({ name: 'tournament_id' })
    tournament: Tournament;

    @Column('uuid')
    tournament_id: string;

    // Table & Seat
    @Column()
    table_number: number;

    @Column()
    seat_number: number; // 1-9

    // Player Reference
    @ManyToOne(() => PlayerEntry)
    @JoinColumn({ name: 'player_entry_id' })
    playerEntry: PlayerEntry;

    @Column('uuid')
    player_entry_id: string;

    // Assignment Info
    @Column()
    assigned_at: Date;

    @Column({ nullable: true })
    moved_from_table: number;

    @Column({
        type: 'enum',
        enum: ['initial_seating', 'table_break', 'balance_movement', 'replacement'],
        nullable: true
    })
    move_reason: string;

    @CreateDateColumn()
    createdAt: Date;
}
