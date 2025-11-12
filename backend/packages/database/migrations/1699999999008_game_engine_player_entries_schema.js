/**
 * Migration: Create player_entries table for tournament registrations
 * TDA 2024 Rule 8 & 27 - Multiple entries per player
 */

exports.up = (pgm) => {
    // Create player_entries table
    pgm.createTable('player_entries', {
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
        player_id: {
            type: 'UUID',
            notNull: true,
            references: '"users"(id)',
            onDelete: 'CASCADE'
        },
        entry_number: {
            type: 'INT',
            notNull: true
        },
        entry_type: {
            type: 'VARCHAR(50)',
            notNull: true,
            check: "entry_type IN ('initial', 'late_reg', 'rebuy', 'reentry', 'addon')"
        },

        // Chips
        buy_in_cents: {
            type: 'BIGINT',
            notNull: true
        },
        starting_stack: {
            type: 'BIGINT',
            notNull: true
        },
        current_stack: {
            type: 'BIGINT',
            notNull: true
        },

        // Bounty (KO tournaments)
        bounty_chips_purchased: {
            type: 'INT',
            default: 0
        },
        bounty_chips_current: {
            type: 'INT',
            notNull: true,
            default: 0
        },
        bounty_chips_won_from: {
            type: 'JSONB',
            default: '{}'
        },

        // Status
        status: {
            type: 'VARCHAR(50)',
            notNull: true,
            default: 'REGISTERED',
            check: "status IN ('REGISTERED', 'ACTIVE', 'ELIMINATED', 'PAID_OUT')"
        },
        finishing_position: {
            type: 'INT',
            check: 'finishing_position IS NULL OR finishing_position > 0'
        },
        finishing_prize_cents: 'BIGINT',

        // Elimination Details
        busted_hand_id: 'UUID',
        busted_at: 'TIMESTAMP',

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        },
        updated_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        }
    })

    // Unique constraint: one entry per player per entry_number
    pgm.addConstraint('player_entries', 'entry_unique', {
        unique: ['tournament_id', 'player_id', 'entry_number']
    })

    // Indexes
    pgm.createIndex('player_entries', 'tournament_id')
    pgm.createIndex('player_entries', 'player_id')
    pgm.createIndex('player_entries', ['tournament_id', 'status'])
    pgm.createIndex('player_entries', ['tournament_id', 'finishing_position'])
}

exports.down = (pgm) => {
    pgm.dropTable('player_entries')
}
