/**
 * Migration: Create tournaments table and blind_schedules table
 * TDA 2024 Rules Based
 */

exports.up = (pgm) => {
    // Create tournaments table
    pgm.createTable('tournaments', {
        id: {
            type: 'UUID',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        created_by: {
            type: 'UUID',
            notNull: true,
            references: '"users"(id)',
            onDelete: 'RESTRICT',
        },
        name: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        status: {
            type: 'VARCHAR(50)',
            notNull: true,
            default: "'REGISTRATION'",
        },
        game_type: {
            type: 'VARCHAR(50)',
            notNull: true, // 'NLHE', 'PLO', 'OMAHA', etc
        },

        // Financial
        buy_in_cents: {
            type: 'BIGINT',
            notNull: true,
        },
        rake_cents: {
            type: 'BIGINT',
            default: 0,
        },
        guarantee_cents: {
            type: 'BIGINT',
        },
        house_contribution_cents: {
            type: 'BIGINT',
            default: 0,
        },

        // Registration Configuration
        late_registration_enabled: {
            type: 'BOOLEAN',
            default: true,
        },
        late_registration_end_level: {
            type: 'INT',
        },
        rebuy_enabled: {
            type: 'BOOLEAN',
            default: true,
        },
        rebuy_end_level: {
            type: 'INT',
        },
        addon_enabled: {
            type: 'BOOLEAN',
            default: true,
        },
        addon_level: {
            type: 'INT',
        },

        // Tournament Configuration
        starting_stack: {
            type: 'BIGINT',
            notNull: true,
        },
        seats_per_table: {
            type: 'INT',
            default: 9,
        },
        max_tables: {
            type: 'INT',
        },

        // Timestamps
        scheduled_start_time: 'TIMESTAMP',
        actual_start_time: 'TIMESTAMP',
        expected_end_time: 'TIMESTAMP',
        actual_end_time: 'TIMESTAMP',

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true,
        },
        updated_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true,
        },

        // Optimistic locking
        version: {
            type: 'INT',
            default: 1,
            notNull: true,
        },
    });

    // Add check constraint for status
    pgm.addConstraint('tournaments', 'tournaments_status_check', {
        check: "status IN ('REGISTRATION', 'STARTED', 'HAND_FOR_HAND', 'FINAL_TABLE', 'COMPLETED', 'PAUSED', 'CANCELLED')",
    });

    // Create tournament_blind_schedules table
    pgm.createTable('tournament_blind_schedules', {
        id: {
            type: 'UUID',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        tournament_id: {
            type: 'UUID',
            notNull: true,
            references: '"tournaments"(id)',
            onDelete: 'CASCADE',
        },
        level: {
            type: 'INT',
            notNull: true,
        },
        small_blind: {
            type: 'BIGINT',
            notNull: true,
        },
        big_blind: {
            type: 'BIGINT',
            notNull: true,
        },
        antes: {
            type: 'BIGINT',
            notNull: true,
            default: 0,
        },
        duration_minutes: {
            type: 'INT',
            notNull: true,
        },

        // Special Levels
        late_registration_end: {
            type: 'BOOLEAN',
            default: false,
        },
        rebuy_end: {
            type: 'BOOLEAN',
            default: false,
        },
        addon_available: {
            type: 'BOOLEAN',
            default: false,
        },
        is_break: {
            type: 'BOOLEAN',
            default: false,
        },
        break_duration_minutes: 'INT',

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true,
        },
    });

    // Add check constraints
    pgm.addConstraint('tournament_blind_schedules', 'blind_small_blind_check', {
        check: 'small_blind >= 0',
    });

    pgm.addConstraint('tournament_blind_schedules', 'blind_big_blind_check', {
        check: 'big_blind >= 0',
    });

    pgm.addConstraint('tournament_blind_schedules', 'blind_antes_check', {
        check: 'antes >= 0',
    });

    pgm.addConstraint('tournament_blind_schedules', 'blind_duration_check', {
        check: 'duration_minutes > 0',
    });

    // Create unique constraint for tournament/level
    pgm.addConstraint('tournament_blind_schedules', 'tournament_level_unique', {
        unique: ['tournament_id', 'level'],
    });

    // Create indexes
    pgm.createIndex('tournaments', 'status');
    pgm.createIndex('tournaments', 'created_by');
    pgm.createIndex('tournament_blind_schedules', 'tournament_id');
};

exports.down = (pgm) => {
    pgm.dropTable('tournament_blind_schedules');
    pgm.dropTable('tournaments');
};
