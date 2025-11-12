/**
 * Migration: Create table_assignments and seating audit tables
 * TDA 2024 Rules 7-11
 */

exports.up = (pgm) => {
    // Create table_assignments
    pgm.createTable('table_assignments', {
        id: {
            type: 'UUID',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        tournament_id: {
            type: 'UUID',
            notNull: true,
            references: '"tournaments"(id)',
            onDelete: 'CASCADE'
        },
        table_number: {
            type: 'INT',
            notNull: true
        },
        seat_number: {
            type: 'INT',
            notNull: true,
            check: 'seat_number > 0 AND seat_number <= 9'
        },
        player_entry_id: {
            type: 'UUID',
            notNull: true,
            references: '"player_entries"(id)',
            onDelete: 'CASCADE'
        },

        // Tracking
        assigned_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        },
        moved_from_table: 'INT',
        move_reason: 'VARCHAR(255)', // 'initial_seating', 'table_break', 'balance_movement'

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        }
    });

    // Unique constraint: one entry per table/seat
    pgm.addConstraint('table_assignments', 'table_seat_unique', {
        unique: ['tournament_id', 'table_number', 'seat_number']
    });

    // Indexes
    pgm.createIndex('table_assignments', 'tournament_id');
    pgm.createIndex('table_assignments', ['tournament_id', 'table_number']);
    pgm.createIndex('table_assignments', 'player_entry_id');

    // Create table_balance_events for audit
    pgm.createTable('table_balance_events', {
        id: {
            type: 'UUID',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        tournament_id: {
            type: 'UUID',
            notNull: true,
            references: '"tournaments"(id)',
            onDelete: 'CASCADE'
        },
        event_type: {
            type: 'VARCHAR(50)',
            notNull: true,
            check: "event_type IN ('balance_suggested', 'balance_auto_executed', 'halt_play_triggered', 'table_break', 'new_table_opened')"
        },

        affected_tables: {
            type: 'INT[]'
        },
        affected_players: {
            type: 'UUID[]'
        },

        reason: 'VARCHAR(255)',
        auto_executed: {
            type: 'BOOLEAN',
            default: false
        },

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        }
    });

    pgm.createIndex('table_balance_events', 'tournament_id');
};

exports.down = (pgm) => {
    pgm.dropTable('table_balance_events');
    pgm.dropTable('table_assignments');
};
