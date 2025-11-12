import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1699999999001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "passwordHash",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "emailVerified",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "verifiedAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["player", "td", "admin", "venue_owner"],
                        default: `'player'`,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["active", "inactive", "banned", "suspended"],
                        default: `'active'`,
                    },
                    {
                        name: "isTd",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "tdLicenseNumber",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "tdExperienceYears",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "tdRating",
                        type: "numeric",
                        precision: 3,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "tdRatingCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "firstName",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "lastName",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "avatarUrl",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "coverUrl",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "bio",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "location",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "websiteUrl",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "birthDate",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "followersCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "followingCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "postsCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "tournamentsPlayed",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "tournamentsWon",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "totalEarnings",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "currentRoi",
                        type: "numeric",
                        precision: 6,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "isPrivate",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "showEarnings",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "allowMessages",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "lastLogin",
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
                indices: [
                    {
                        name: "IDX_users_email",
                        columnNames: ["email"],
                    },
                    {
                        name: "IDX_users_username",
                        columnNames: ["username"],
                    },
                    {
                        name: "IDX_users_role",
                        columnNames: ["role"],
                    },
                    {
                        name: "IDX_users_status",
                        columnNames: ["status"],
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
