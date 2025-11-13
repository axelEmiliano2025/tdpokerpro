import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreateStatisticsAuditTables1699999999005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // PlayerStatistics Table
        await queryRunner.createTable(
            new Table({
                name: "player_statistics",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "player_id",
                        type: "uuid",
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                    },
                    {
                        name: "entry_count",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "buy_in_total",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "final_position",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "prize_earned",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "roi",
                        type: "numeric",
                        precision: 8,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: "knockout_points",
                        type: "numeric",
                        precision: 8,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "playtime_minutes",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "bust_time",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "starting_chips",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "max_chips",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "final_chips",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "is_winner",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "made_final_table",
                        type: "boolean",
                        default: false,
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
                indices: [
                    new TableIndex({ columnNames: ["player_id"] }),
                    new TableIndex({ columnNames: ["tournament_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("player_statistics", [
            new TableForeignKey({
                columnNames: ["player_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        ]);

        // TournamentStatistics Table
        await queryRunner.createTable(
            new Table({
                name: "tournament_statistics",
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
                        name: "registered_players",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "started_players",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "finished_players",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "knockout_count",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "total_buy_ins",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "total_rebuys",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "total_rake_collected",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "total_prize_pool",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "house_profit",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "total_duration_minutes",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "total_blind_levels",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "average_buy_in",
                        type: "numeric",
                        precision: 5,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "average_stack",
                        type: "numeric",
                        precision: 6,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "is_completed",
                        type: "boolean",
                        default: false,
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
                uniques: [new TableUnique({ columnNames: ["tournament_id"] })],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "tournament_statistics",
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // AuditLog Table
        await queryRunner.createTable(
            new Table({
                name: "audit_logs",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "action",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "entity_type",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "entity_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "actor_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "tournament_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "old_values",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "new_values",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "reason",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "ip_address",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "user_agent",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                indices: [
                    new TableIndex({ columnNames: ["action"] }),
                    new TableIndex({ columnNames: ["entity_type"] }),
                    new TableIndex({ columnNames: ["tournament_id"] }),
                    new TableIndex({ columnNames: ["actor_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("audit_logs", [
            new TableForeignKey({
                columnNames: ["actor_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            }),
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            }),
        ]);

        // UserPreferences Table
        await queryRunner.createTable(
            new Table({
                name: "user_preferences",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "email_notifications_enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "tournament_reminders",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "social_notifications",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "message_notifications",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "show_online_status",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "show_location",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "allow_comments",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "allow_messages",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "language",
                        type: "varchar",
                        length: "10",
                        default: `'en'`,
                    },
                    {
                        name: "theme",
                        type: "varchar",
                        length: "10",
                        default: `'dark'`,
                    },
                    {
                        name: "timezone",
                        type: "varchar",
                        length: "10",
                        isNullable: true,
                    },
                    {
                        name: "tournament_filters",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "ui_settings",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "show_advanced_stats",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "ui_layout",
                        type: "varchar",
                        length: "50",
                        default: `'standard'`,
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
                indices: [new TableIndex({ columnNames: ["user_id"] })],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "user_preferences",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // EventLog Table
        await queryRunner.createTable(
            new Table({
                name: "event_logs",
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
                        name: "event_type",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "event_data",
                        type: "jsonb",
                    },
                    {
                        name: "blind_level",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "player_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                indices: [
                    new TableIndex({ columnNames: ["tournament_id"] }),
                    new TableIndex({ columnNames: ["event_type"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "event_logs",
            new TableForeignKey({
                columnNames: ["tournament_id"],
                referencedTableName: "tournaments",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("event_logs");
        await queryRunner.dropTable("user_preferences");
        await queryRunner.dropTable("audit_logs");
        await queryRunner.dropTable("tournament_statistics");
        await queryRunner.dropTable("player_statistics");
    }
}
