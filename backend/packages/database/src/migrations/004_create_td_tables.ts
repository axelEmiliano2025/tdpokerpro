import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreateTdTables1699999999004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // BlindSchedule Table
        await queryRunner.createTable(
            new Table({
                name: "blind_schedules",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "level",
                        type: "int",
                    },
                    {
                        name: "small_blind",
                        type: "bigint",
                    },
                    {
                        name: "big_blind",
                        type: "bigint",
                    },
                    {
                        name: "antes",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "duration_minutes",
                        type: "int",
                    },
                    {
                        name: "late_registration_end",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "rebuy_end",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "addon_available",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "is_break",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "break_duration_minutes",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                uniques: [new TableUnique({ columnNames: ["tournament_id", "level"] })],
                indices: [new TableIndex({ columnNames: ["tournament_id"] })],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "blind_schedules",
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // PlayerEntry Table
        await queryRunner.createTable(
            new Table({
                name: "player_entries",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "player_id",
                        type: "uuid",
                    },
                    {
                        name: "entry_number",
                        type: "int",
                    },
                    {
                        name: "entry_type",
                        type: "enum",
                        enum: ["initial", "late_reg", "rebuy", "reentry", "addon"],
                        default: `'initial'`,
                    },
                    {
                        name: "buy_in_cents",
                        type: "bigint",
                    },
                    {
                        name: "starting_stack",
                        type: "bigint",
                    },
                    {
                        name: "current_stack",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "bounty_chips_purchased",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "bounty_chips_current",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "bounty_chips_won_from",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["REGISTERED", "ACTIVE", "ELIMINATED", "PAID_OUT"],
                        default: `'REGISTERED'`,
                    },
                    {
                        name: "finishing_position",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "finishing_prize_cents",
                        type: "bigint",
                        isNullable: true,
                    },
                    {
                        name: "busted_hand_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "busted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
                uniques: [new TableUnique({ columnNames: ["tournament_id", "player_id", "entry_number"] })],
                indices: [
                    new TableIndex({ columnNames: ["tournament_id"] }),
                    new TableIndex({ columnNames: ["player_id"] }),
                    new TableIndex({ columnNames: ["status"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("player_entries", [
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["player_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            }),
        ]);

        // Penalty Table
        await queryRunner.createTable(
            new Table({
                name: "penalties",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "player_entry_id",
                        type: "uuid",
                    },
                    {
                        name: "infraction_type",
                        type: "enum",
                        enum: [
                            "ETIQUETTE_VIOLATION",
                            "CARD_EXPOSURE",
                            "STRING_BET",
                            "SOFT_PLAY",
                            "CHIP_DUMPING",
                            "COLLUSION",
                            "DODGING_BLIND",
                            "DEVICE_MISUSE",
                            "ABUSIVE_CONDUCT",
                            "LATE_TO_TABLE",
                            "ANGLE_SHOOTING",
                            "EXCESSIVE_TIME"
                        ],
                    },
                    {
                        name: "penalty_level",
                        type: "enum",
                        enum: ["VERBAL_WARNING", "MINOR_PENALTY", "MAJOR_PENALTY", "DISQUALIFICATION"],
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "imposed_by",
                        type: "uuid",
                    },
                    {
                        name: "previous_penalty_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "is_automatic_escalation",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "missed_hands_count",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "removal_from_tournament",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                indices: [
                    new TableIndex({ columnNames: ["tournament_id"] }),
                    new TableIndex({ columnNames: ["player_entry_id"] }),
                    new TableIndex({ columnNames: ["infraction_type"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("penalties", [
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["player_entry_id"],
                referencedTableName: "player_entries",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["imposed_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            }),
        ]);

        // SeatingAssignment Table
        await queryRunner.createTable(
            new Table({
                name: "seating_assignments",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "table_number",
                        type: "int",
                    },
                    {
                        name: "seat_number",
                        type: "int",
                    },
                    {
                        name: "player_entry_id",
                        type: "uuid",
                    },
                    {
                        name: "assigned_at",
                        type: "timestamp",
                    },
                    {
                        name: "moved_from_table",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "move_reason",
                        type: "enum",
                        enum: ["initial_seating", "table_break", "balance_movement", "replacement"],
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                uniques: [new TableUnique({ columnNames: ["tournament_id", "table_number", "seat_number"] })],
                indices: [
                    new TableIndex({ columnNames: ["tournament_id"] }),
                    new TableIndex({ columnNames: ["player_entry_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("seating_assignments", [
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["player_entry_id"],
                referencedTableName: "player_entries",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        ]);

        // BlindTracking Table
        await queryRunner.createTable(
            new Table({
                name: "blind_tracking",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "current_level",
                        type: "int",
                        default: 1,
                    },
                    {
                        name: "level_started_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "is_break",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "total_levels_played",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                indices: [new TableIndex({ columnNames: ["tournament_id"] })],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "blind_tracking",
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("blind_tracking");
        await queryRunner.dropTable("seating_assignments");
        await queryRunner.dropTable("penalties");
        await queryRunner.dropTable("player_entries");
        await queryRunner.dropTable("blind_schedules");
    }
}
