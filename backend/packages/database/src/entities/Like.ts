import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

/**
 * Like Entity - Post Likes
 * PHASE 7: User engagement tracking
 */
@Entity('likes')
@Unique(['user_id', 'post_id'])
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // User Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('uuid')
    user_id: string;

    // Post Reference
    @ManyToOne(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column('uuid')
    post_id: string;

    @CreateDateColumn()
    createdAt: Date;
}
