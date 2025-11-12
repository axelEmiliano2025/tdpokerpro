/**
 * Migration: Create blind_tracking, color_up_races, and break_schedule tables
 * TDA 2024 - Blind Management (Auto-advance, Color-up, Breaks)
 */

exports.up = async (knex) => {
    // Create blind_tracking table
    await knex.schema.createTable('blind_tracking', (table) => {
        table.increments('id').primary();
        table.integer('tournament_id').unsigned().notNullable()
            .references('id').inTable('tournaments')
            .onDelete('CASCADE');

        // Current status
        table.integer('current_level').notNullable().defaultTo(1)
            .checkPositive('current_level >= 1');
        table.timestamp('level_started_at').notNullable().defaultTo(knex.fn.now());
        table.boolean('is_break').defaultTo(false);

        // Tracking
        table.integer('total_levels_played').defaultTo(0);

        table.timestamps(true, true);

        // Indexes
        table.index('tournament_id');
    });

    // Create color_up_races table
    await knex.schema.createTable('color_up_races', (table) => {
        table.increments('id').primary();
        table.integer('tournament_id').unsigned().notNullable()
            .references('id').inTable('tournaments')
            .onDelete('CASCADE');
        table.integer('blind_level').notNullable();

        // Color up details
        table.bigInteger('old_chip_value').notNullable();
        table.bigInteger('new_chip_value').notNullable();

        // Race status
        table.boolean('is_race').defaultTo(true); // true = race, false = chip pull

        // Results
        table.timestamp('executed_at').nullable();
        table.string('status', 50).notNullable().defaultTo('PENDING'); // PENDING, EXECUTED, CANCELLED

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // Indexes
        table.index('tournament_id');
        table.index(['tournament_id', 'blind_level']);
    });

    // Create break_schedule table
    await knex.schema.createTable('break_schedule', (table) => {
        table.increments('id').primary();
        table.integer('tournament_id').unsigned().notNullable()
            .references('id').inTable('tournaments')
            .onDelete('CASCADE');

        table.integer('blind_level_before_break').notNullable();
        table.integer('break_duration_minutes').notNullable()
            .checkPositive('break_duration_minutes > 0');

        // Execution
        table.timestamp('scheduled_at').nullable();
        table.timestamp('started_at').nullable();
        table.timestamp('ended_at').nullable();
        table.string('status', 50).notNullable().defaultTo('SCHEDULED'); // SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // Indexes
        table.index('tournament_id');
        table.index(['tournament_id', 'blind_level_before_break']);
        table.index(['tournament_id', 'status']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('break_schedule');
    await knex.schema.dropTableIfExists('color_up_races');
    await knex.schema.dropTableIfExists('blind_tracking');
};
