/**
 * Migration: Create Tournament and Game Tables
 * 
 * Creates:
 * - tournaments: Tournament configurations
 * - tournament_participants: Players registered in tournaments
 * - gaming_tables: Physical/virtual poker tables
 * - table_seats: Seats configuration for tables
 * - blinds_structure: Blind levels for tournaments
 */

exports.up = (pgm) => {
    // ========================================
    // TOURNAMENTS TABLE
    // ========================================
    pgm.createTable('tournaments', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        club_id: {
            type: 'uuid',
            notNull: true,
            comment: 'Reference to club/organization (future implementation)',
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        description: {
            type: 'text',
        },
        tournament_type: {
            type: 'varchar(50)',
            notNull: true,
            default: 'freezeout',
            comment: 'freezeout, rebuy, addon, bounty, satellite, etc.',
        },
        status: {
            type: 'tournament_status',
            notNull: true,
            default: 'draft',
        },
        buy_in_amount: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        rebuy_amount: {
            type: 'decimal(10,2)',
            default: 0,
        },
        addon_amount: {
            type: 'decimal(10,2)',
            default: 0,
        },
        starting_chips: {
            type: 'integer',
            notNull: true,
            default: 10000,
        },
        max_players: {
            type: 'integer',
            notNull: true,
            default: 100,
        },
        min_players: {
            type: 'integer',
            notNull: true,
            default: 10,
        },
        players_per_table: {
            type: 'integer',
            notNull: true,
            default: 8,
        },
        late_registration_level: {
            type: 'integer',
            default: 6,
            comment: 'Until which level late registration is allowed',
        },
        rebuy_until_level: {
            type: 'integer',
            default: 0,
        },
        addon_level: {
            type: 'integer',
            default: 0,
        },
        level_duration_minutes: {
            type: 'integer',
            notNull: true,
            default: 15,
        },
        break_frequency: {
            type: 'integer',
            default: 4,
            comment: 'Break after every X levels',
        },
        break_duration_minutes: {
            type: 'integer',
            default: 10,
        },
        prize_pool_percentage: {
            type: 'decimal(5,2)',
            default: 100,
            comment: 'Percentage of buy-ins that goes to prize pool',
        },
        scheduled_start_time: {
            type: 'timestamp',
        },
        actual_start_time: {
            type: 'timestamp',
        },
        end_time: {
            type: 'timestamp',
        },
        current_level: {
            type: 'integer',
            default: 1,
        },
        created_by: {
            type: 'uuid',
            notNull: true,
            references: 'users',
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

    // Indexes for tournaments
    pgm.createIndex('tournaments', 'club_id');
    pgm.createIndex('tournaments', 'status');
    pgm.createIndex('tournaments', 'scheduled_start_time');
    pgm.createIndex('tournaments', 'created_by');

    // ========================================
    // TOURNAMENT PARTICIPANTS TABLE
    // ========================================
    pgm.createTable('tournament_participants', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        tournament_id: {
            type: 'uuid',
            notNull: true,
            references: 'tournaments',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        entry_number: {
            type: 'integer',
            notNull: true,
            comment: 'Sequential number for re-entries',
        },
        table_id: {
            type: 'uuid',
            references: 'gaming_tables',
        },
        seat_number: {
            type: 'integer',
        },
        chip_count: {
            type: 'integer',
            default: 0,
        },
        rebuys_count: {
            type: 'integer',
            default: 0,
        },
        addons_count: {
            type: 'integer',
            default: 0,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        finish_position: {
            type: 'integer',
        },
        prize_amount: {
            type: 'decimal(10,2)',
            default: 0,
        },
        registered_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        eliminated_at: {
            type: 'timestamp',
        },
    });

    // Indexes for tournament_participants
    pgm.createIndex('tournament_participants', 'tournament_id');
    pgm.createIndex('tournament_participants', 'user_id');
    pgm.createIndex('tournament_participants', 'table_id');
    pgm.createIndex('tournament_participants', ['tournament_id', 'user_id', 'entry_number'], {
        unique: true,
    });

    // ========================================
    // GAMING TABLES TABLE
    // ========================================
    pgm.createTable('gaming_tables', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        tournament_id: {
            type: 'uuid',
            references: 'tournaments',
            onDelete: 'CASCADE',
            comment: 'Null for cash game tables',
        },
        table_number: {
            type: 'integer',
            notNull: true,
        },
        table_name: {
            type: 'varchar(100)',
        },
        game_type: {
            type: 'game_type',
            notNull: true,
        },
        max_seats: {
            type: 'integer',
            notNull: true,
            default: 9,
        },
        current_players: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        small_blind: {
            type: 'integer',
        },
        big_blind: {
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

    // Indexes for gaming_tables
    pgm.createIndex('gaming_tables', 'tournament_id');
    pgm.createIndex('gaming_tables', 'game_type');
    pgm.createIndex('gaming_tables', 'is_active');

    // ========================================
    // BLINDS STRUCTURE TABLE
    // ========================================
    pgm.createTable('blinds_structure', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        tournament_id: {
            type: 'uuid',
            notNull: true,
            references: 'tournaments',
            onDelete: 'CASCADE',
        },
        level: {
            type: 'integer',
            notNull: true,
        },
        small_blind: {
            type: 'integer',
            notNull: true,
        },
        big_blind: {
            type: 'integer',
            notNull: true,
        },
        ante: {
            type: 'integer',
            default: 0,
        },
        duration_minutes: {
            type: 'integer',
            notNull: true,
        },
        is_break: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for blinds_structure
    pgm.createIndex('blinds_structure', 'tournament_id');
    pgm.createIndex('blinds_structure', ['tournament_id', 'level'], { unique: true });

    // ========================================
    // TRIGGERS
    // ========================================
    pgm.createTrigger('tournaments', 'update_tournaments_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('gaming_tables', 'update_gaming_tables_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON TABLE tournaments IS 'Tournament configurations and state';
    COMMENT ON TABLE tournament_participants IS 'Players registered in tournaments';
    COMMENT ON TABLE gaming_tables IS 'Physical/virtual poker tables';
    COMMENT ON TABLE blinds_structure IS 'Blind levels configuration for tournaments';
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('blinds_structure', { cascade: true });
    pgm.dropTable('tournament_participants', { cascade: true });
    pgm.dropTable('gaming_tables', { cascade: true });
    pgm.dropTable('tournaments', { cascade: true });
};
