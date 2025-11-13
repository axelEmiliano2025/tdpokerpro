import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

/**
 * Post Entity - Social Feed Core
 * PHASE 7: User posts, tournament updates, social engagement
 */
@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Creator Reference
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('uuid')
    user_id: string;

    // Content
    @Column({ type: 'text' })
    content: string;

    @Column({ nullable: true, length: 500 })
    imageUrl: string;

    @Column({ nullable: true, length: 255 })
    videoUrl: string;

    // Engagement
    @Column({ default: 0 })
    likesCount: number;

    @Column({ default: 0 })
    commentsCount: number;

    @Column({ default: 0 })
    sharesCount: number;

    // Context
    @Column({ nullable: true, length: 50 })
    type: string; // 'status', 'tournament_update', 'achievement', 'question', etc

    @Column({ nullable: true, length: 255 })
    hashtags: string; // Comma-separated

    @Column({ default: false })
    isPinned: boolean;

    @Column({ default: true })
    isPublic: boolean;

    // Moderation
    @Column({ default: false })
    isSpam: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}
