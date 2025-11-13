import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateTournamentsTable1699999999002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tournaments",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "created_by",
                        type: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "game_type",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["REGISTRATION", "STARTED", "HAND_FOR_HAND", "FINAL_TABLE", "COMPLETED", "PAUSED", "CANCELLED"],
                        default: `'REGISTRATION'`,
                    },
                    {
                        name: "buy_in_cents",
                        type: "bigint",
                    },
                    {
                        name: "rake_cents",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "guarantee_cents",
                        type: "bigint",
                        isNullable: true,
                    },
                    {
                        name: "house_contribution_cents",
                        type: "bigint",
                        default: 0,
                    },
                    {
                        name: "late_registration_enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "late_registration_end_level",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "rebuy_enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "rebuy_end_level",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "addon_enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "addon_level",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "starting_stack",
                        type: "bigint",
                    },
                    {
                        name: "seats_per_table",
                        type: "int",
                        default: 9,
                    },
                    {
                        name: "max_tables",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "scheduled_start_time",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "actual_start_time",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "expected_end_time",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "actual_end_time",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "version",
                        type: "int",
                        default: 1,
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
                indices: [
                    new TableIndex({ columnNames: ["status"] }),
                    new TableIndex({ columnNames: ["created_by"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "tournaments",
            new TableForeignKey({
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tournaments");
    }
}
