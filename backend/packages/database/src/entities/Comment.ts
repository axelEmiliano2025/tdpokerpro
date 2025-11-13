import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

/**
 * Comment Entity - Post Comments
 * PHASE 7: User discussions on posts
 */
@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Post Reference
    @ManyToOne(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column('uuid')
    post_id: string;

    // Author Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('uuid')
    user_id: string;

    // Parent Comment (for threading)
    @Column({ nullable: true, type: 'uuid' })
    parent_comment_id: string;

    // Content
    @Column({ type: 'text' })
    content: string;

    // Engagement
    @Column({ default: 0 })
    likesCount: number;

    // Moderation
    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
