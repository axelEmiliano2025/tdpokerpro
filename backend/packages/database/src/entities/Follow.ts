import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User';

/**
 * Follow Entity - Social Relationships
 * PHASE 7: User following/followers tracking
 */
@Entity('follows')
@Unique(['follower_id', 'following_id'])
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Follower (person following)
    @ManyToOne(() => User)
    @JoinColumn({ name: 'follower_id' })
    follower: User;

    @Column('uuid')
    follower_id: string;

    // Following (person being followed)
    @ManyToOne(() => User)
    @JoinColumn({ name: 'following_id' })
    following: User;

    @Column('uuid')
    following_id: string;

    // Status
    @Column({ default: false })
    isApproved: boolean;

    @Column({ nullable: true })
    approvedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
