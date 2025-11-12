/**
 * Migration: Create Social Network Tables
 * 
 * Creates:
 * - posts: User posts in the social feed
 * - comments: Comments on posts
 * - social_interactions: Likes, shares, follows
 * - user_rankings: Global and periodic rankings
 */

exports.up = (pgm) => {
    // ========================================
    // POSTS TABLE
    // ========================================
    pgm.createTable('posts', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        tournament_id: {
            type: 'uuid',
            references: 'tournaments',
            onDelete: 'SET NULL',
            comment: 'Tournament related to this post (if applicable)',
        },
        content: {
            type: 'text',
            notNull: true,
        },
        media_urls: {
            type: 'jsonb',
            comment: 'Array of image/video URLs',
        },
        post_type: {
            type: 'varchar(50)',
            notNull: true,
            default: 'standard',
            comment: 'standard, tournament_result, achievement, etc.',
        },
        visibility: {
            type: 'varchar(20)',
            notNull: true,
            default: 'public',
            comment: 'public, friends, private',
        },
        is_pinned: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        likes_count: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        comments_count: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        shares_count: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for posts
    pgm.createIndex('posts', 'user_id');
    pgm.createIndex('posts', 'tournament_id');
    pgm.createIndex('posts', 'post_type');
    pgm.createIndex('posts', 'visibility');
    pgm.createIndex('posts', 'created_at');
    pgm.createIndex('posts', 'likes_count');

    // ========================================
    // COMMENTS TABLE
    // ========================================
    pgm.createTable('comments', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        post_id: {
            type: 'uuid',
            notNull: true,
            references: 'posts',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        parent_comment_id: {
            type: 'uuid',
            references: 'comments',
            onDelete: 'CASCADE',
            comment: 'For nested replies',
        },
        content: {
            type: 'text',
            notNull: true,
        },
        likes_count: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for comments
    pgm.createIndex('comments', 'post_id');
    pgm.createIndex('comments', 'user_id');
    pgm.createIndex('comments', 'parent_comment_id');
    pgm.createIndex('comments', 'created_at');

    // ========================================
    // SOCIAL INTERACTIONS TABLE
    // ========================================
    pgm.createTable('social_interactions', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
            comment: 'User performing the action',
        },
        target_user_id: {
            type: 'uuid',
            references: 'users',
            onDelete: 'CASCADE',
            comment: 'User being followed (for follows)',
        },
        post_id: {
            type: 'uuid',
            references: 'posts',
            onDelete: 'CASCADE',
            comment: 'Post being liked/shared',
        },
        comment_id: {
            type: 'uuid',
            references: 'comments',
            onDelete: 'CASCADE',
            comment: 'Comment being liked',
        },
        interaction_type: {
            type: 'varchar(20)',
            notNull: true,
            comment: 'like, share, follow, unfollow',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for social_interactions
    pgm.createIndex('social_interactions', 'user_id');
    pgm.createIndex('social_interactions', 'target_user_id');
    pgm.createIndex('social_interactions', 'post_id');
    pgm.createIndex('social_interactions', 'comment_id');
    pgm.createIndex('social_interactions', 'interaction_type');
    pgm.createIndex('social_interactions', ['user_id', 'target_user_id', 'interaction_type'], {
        unique: true,
        name: 'unique_follow',
        where: "interaction_type = 'follow'",
    });
    pgm.createIndex('social_interactions', ['user_id', 'post_id', 'interaction_type'], {
        unique: true,
        name: 'unique_post_like',
        where: "interaction_type = 'like' AND post_id IS NOT NULL",
    });

    // ========================================
    // USER RANKINGS TABLE
    // ========================================
    pgm.createTable('user_rankings', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        ranking_period: {
            type: 'varchar(20)',
            notNull: true,
            comment: 'all_time, yearly, monthly, weekly',
        },
        period_start: {
            type: 'date',
        },
        period_end: {
            type: 'date',
        },
        total_points: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        tournaments_played: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        tournaments_won: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        final_tables: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        total_buy_ins: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
        },
        total_prizes: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
        },
        roi_percentage: {
            type: 'decimal(5,2)',
            notNull: true,
            default: 0,
            comment: 'Return on Investment percentage',
        },
        rank_position: {
            type: 'integer',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for user_rankings
    pgm.createIndex('user_rankings', 'user_id');
    pgm.createIndex('user_rankings', 'ranking_period');
    pgm.createIndex('user_rankings', 'total_points');
    pgm.createIndex('user_rankings', 'rank_position');
    pgm.createIndex('user_rankings', ['user_id', 'ranking_period', 'period_start'], {
        unique: true,
    });

    // ========================================
    // TRIGGERS
    // ========================================
    pgm.createTrigger('posts', 'update_posts_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('comments', 'update_comments_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('user_rankings', 'update_user_rankings_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON TABLE posts IS 'User posts in the social feed';
    COMMENT ON TABLE comments IS 'Comments on posts with support for nested replies';
    COMMENT ON TABLE social_interactions IS 'Likes, shares, follows and other social actions';
    COMMENT ON TABLE user_rankings IS 'Player rankings by period (all-time, yearly, monthly, weekly)';
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('user_rankings', { cascade: true });
    pgm.dropTable('social_interactions', { cascade: true });
    pgm.dropTable('comments', { cascade: true });
    pgm.dropTable('posts', { cascade: true });
};
