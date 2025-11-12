/**
 * Migration: Create Notifications and Additional Tables
 * 
 * Creates:
 * - notifications: User notifications
 * - bar_products: Products in bar/restaurant
 * - bar_orders: Orders from bar/restaurant
 * - game_statistics: Detailed game statistics
 */

exports.up = (pgm) => {
    // ========================================
    // NOTIFICATIONS TABLE
    // ========================================
    pgm.createTable('notifications', {
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
        type: {
            type: 'notification_type',
            notNull: true,
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        message: {
            type: 'text',
            notNull: true,
        },
        data: {
            type: 'jsonb',
            comment: 'Additional notification data (tournament_id, post_id, etc.)',
        },
        is_read: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        read_at: {
            type: 'timestamp',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for notifications
    pgm.createIndex('notifications', 'user_id');
    pgm.createIndex('notifications', 'type');
    pgm.createIndex('notifications', 'is_read');
    pgm.createIndex('notifications', 'created_at');
    pgm.createIndex('notifications', 'data', { method: 'gin' });

    // ========================================
    // BAR PRODUCTS TABLE
    // ========================================
    pgm.createTable('bar_products', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        description: {
            type: 'text',
        },
        category: {
            type: 'varchar(50)',
            notNull: true,
            comment: 'drinks, food, snacks, etc.',
        },
        price: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        cost_price: {
            type: 'decimal(10,2)',
            comment: 'For profit calculation',
        },
        stock_quantity: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        min_stock_alert: {
            type: 'integer',
            default: 10,
        },
        image_url: {
            type: 'text',
        },
        is_available: {
            type: 'boolean',
            notNull: true,
            default: true,
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

    // Indexes for bar_products
    pgm.createIndex('bar_products', 'category');
    pgm.createIndex('bar_products', 'is_available');
    pgm.createIndex('bar_products', 'name');

    // ========================================
    // BAR ORDERS TABLE
    // ========================================
    pgm.createTable('bar_orders', {
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
        },
        table_id: {
            type: 'uuid',
            references: 'gaming_tables',
            onDelete: 'SET NULL',
        },
        items: {
            type: 'jsonb',
            notNull: true,
            comment: 'Array of {product_id, quantity, price}',
        },
        subtotal: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        tax: {
            type: 'decimal(10,2)',
            default: 0,
        },
        total: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        payment_method: {
            type: 'varchar(50)',
            comment: 'cash, card, wallet, etc.',
        },
        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'pending',
            comment: 'pending, preparing, ready, delivered, cancelled',
        },
        notes: {
            type: 'text',
        },
        served_by: {
            type: 'uuid',
            references: 'users',
            comment: 'Staff member who served',
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

    // Indexes for bar_orders
    pgm.createIndex('bar_orders', 'user_id');
    pgm.createIndex('bar_orders', 'tournament_id');
    pgm.createIndex('bar_orders', 'table_id');
    pgm.createIndex('bar_orders', 'status');
    pgm.createIndex('bar_orders', 'created_at');

    // ========================================
    // GAME STATISTICS TABLE
    // ========================================
    pgm.createTable('game_statistics', {
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
            onDelete: 'CASCADE',
        },
        hands_played: {
            type: 'integer',
            default: 0,
        },
        hands_won: {
            type: 'integer',
            default: 0,
        },
        total_time_played_minutes: {
            type: 'integer',
            default: 0,
        },
        biggest_pot_won: {
            type: 'integer',
            default: 0,
        },
        biggest_hand: {
            type: 'varchar(50)',
            comment: 'Royal Flush, Straight Flush, etc.',
        },
        statistics_data: {
            type: 'jsonb',
            comment: 'Additional detailed statistics',
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

    // Indexes for game_statistics
    pgm.createIndex('game_statistics', 'user_id');
    pgm.createIndex('game_statistics', 'tournament_id');
    pgm.createIndex('game_statistics', ['user_id', 'tournament_id'], { unique: true });

    // ========================================
    // TRIGGERS
    // ========================================
    pgm.createTrigger('bar_products', 'update_bar_products_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('bar_orders', 'update_bar_orders_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('game_statistics', 'update_game_statistics_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON TABLE notifications IS 'User notifications for all events';
    COMMENT ON TABLE bar_products IS 'Products available in bar/restaurant';
    COMMENT ON TABLE bar_orders IS 'Orders from bar/restaurant';
    COMMENT ON TABLE game_statistics IS 'Detailed game statistics per user/tournament';
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('game_statistics', { cascade: true });
    pgm.dropTable('bar_orders', { cascade: true });
    pgm.dropTable('bar_products', { cascade: true });
    pgm.dropTable('notifications', { cascade: true });
};
