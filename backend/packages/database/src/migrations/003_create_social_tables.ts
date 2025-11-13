import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreateSocialTables1699999999003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Posts Table
        await queryRunner.createTable(
            new Table({
                name: "posts",
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
                        name: "content",
                        type: "text",
                    },
                    {
                        name: "imageUrl",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "videoUrl",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "likesCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "commentsCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "sharesCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "hashtags",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "isPinned",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "isPublic",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "isSpam",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "isDeleted",
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
                    {
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({ columnNames: ["user_id"] }),
                    new TableIndex({ columnNames: ["type"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "posts",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // Follows Table
        await queryRunner.createTable(
            new Table({
                name: "follows",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "follower_id",
                        type: "uuid",
                    },
                    {
                        name: "following_id",
                        type: "uuid",
                    },
                    {
                        name: "isApproved",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "approvedAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                uniques: [new TableUnique({ columnNames: ["follower_id", "following_id"] })],
                indices: [
                    new TableIndex({ columnNames: ["follower_id"] }),
                    new TableIndex({ columnNames: ["following_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("follows", [
            new TableForeignKey({
                columnNames: ["follower_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["following_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        ]);

        // Comments Table
        await queryRunner.createTable(
            new Table({
                name: "comments",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: `gen_random_uuid()`,
                    },
                    {
                        name: "post_id",
                        type: "uuid",
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "parent_comment_id",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "content",
                        type: "text",
                    },
                    {
                        name: "likesCount",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "isDeleted",
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
                    {
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
                indices: [
                    new TableIndex({ columnNames: ["post_id"] }),
                    new TableIndex({ columnNames: ["user_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("comments", [
            new TableForeignKey({
                columnNames: ["post_id"],
                referencedTableName: "posts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        ]);

        // Likes Table
        await queryRunner.createTable(
            new Table({
                name: "likes",
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
                        name: "post_id",
                        type: "uuid",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                uniques: [new TableUnique({ columnNames: ["user_id", "post_id"] })],
                indices: [
                    new TableIndex({ columnNames: ["user_id"] }),
                    new TableIndex({ columnNames: ["post_id"] }),
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("likes", [
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["post_id"],
                referencedTableName: "posts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("likes");
        await queryRunner.dropTable("comments");
        await queryRunner.dropTable("follows");
        await queryRunner.dropTable("posts");
    }
}
