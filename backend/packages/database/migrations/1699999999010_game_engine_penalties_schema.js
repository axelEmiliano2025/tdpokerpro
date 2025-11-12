/**
 * Migration: Create penalties_log and infractions tracking
 * TDA 2024 Rule 71 - Penalties and Infractions
 */

exports.up = (pgm) => {
    // Create enum for penalty levels
    pgm.createType('penalty_level_enum', [
        'VERBAL_WARNING',
        'MINOR_PENALTY',
        'MAJOR_PENALTY',
        'DISQUALIFICATION'
    ]);

    // Create enum for infraction types
    pgm.createType('infraction_type_enum', [
        'ETIQUETTE_VIOLATION',
        'CARD_EXPOSURE',
        'STRING_BET',
        'SOFT_PLAY',
        'CHIP_DUMPING',
        'COLLUSION',
        'DODGING_BLIND',
        'DEVICE_MISUSE',
        'ABUSIVE_CONDUCT',
        'LATE_TO_TABLE',
        'ANGLE_SHOOTING',
        'EXCESSIVE_TIME'
    ]);

    // Create penalties_log table
    pgm.createTable('penalties_log', {
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
        player_entry_id: {
            type: 'UUID',
            notNull: true,
            references: '"player_entries"(id)',
            onDelete: 'CASCADE'
        },

        // Infraction details
        infraction_type: {
            type: 'infraction_type_enum',
            notNull: true
        },
        penalty_level: {
            type: 'penalty_level_enum',
            notNull: true
        },

        description: 'TEXT',

        // Who imposed it
        imposed_by: {
            type: 'UUID',
            notNull: true,
            references: '"users"(id)',
            onDelete: 'RESTRICT'
        },

        // Escalation tracking
        previous_penalty_id: {
            type: 'UUID',
            references: '"penalties_log"(id)',
            onDelete: 'SET NULL'
        },
        is_automatic_escalation: {
            type: 'BOOLEAN',
            default: false
        },

        // Consequences
        missed_hands_count: {
            type: 'INT',
            default: 0 // For minor/major penalties
        },
        removal_from_tournament: {
            type: 'BOOLEAN',
            default: false // True if disqualification
        },

        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('NOW()'),
            notNull: true
        }
    });

    // Create infraction_statistics table
    pgm.createTable('infraction_statistics', {
        id: {
            type: 'UUID',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()')
        },
        player_id: {
            type: 'UUID',
            notNull: true,
            references: '"users"(id)',
            onDelete: 'CASCADE'
        },
        tournament_id: {
            type: 'UUID',
            notNull: true,
            references: '"tournaments"(id)',
            onDelete: 'CASCADE'
        },

        // Statistics
        total_infractions: {
            type: 'INT',
            default: 0
        },
        total_penalties: {
            type: 'INT',
            default: 0
        },
        disqualifications: {
            type: 'INT',
            default: 0
        },

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
    });

    // Indexes
    pgm.createIndex('penalties_log', 'tournament_id');
    pgm.createIndex('penalties_log', 'player_entry_id');
    pgm.createIndex('penalties_log', 'infraction_type');
    pgm.createIndex('penalties_log', 'penalty_level');
    pgm.createIndex('infraction_statistics', ['player_id', 'tournament_id']);
};

exports.down = (pgm) => {
    pgm.dropTable('infraction_statistics');
    pgm.dropTable('penalties_log');
    pgm.dropType('infraction_type_enum');
    pgm.dropType('penalty_level_enum');
};
