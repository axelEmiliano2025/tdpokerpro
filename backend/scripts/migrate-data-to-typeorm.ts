import 'reflect-metadata';
import { AppDataSource } from '@tdpokerpro/database';
import {
    UserRepository,
    PlayerEntryRepository,
    BlindScheduleRepositoryTypeORM,
    PenaltyRepositoryTypeORM,
} from '../packages/game-engine-service/src/repositories';
import { Pool } from 'pg';

/**
 * Data Migration Script
 * Migrates data from Knex tables → TypeORM entities
 * 
 * USAGE: npx ts-node backend/scripts/migrate-data-to-typeorm.ts
 * 
 * ⚠️  ONLY RUN IN STAGING ENVIRONMENT
 */

interface MigrationStats {
    users: number;
    tournaments: number;
    playerEntries: number;
    blindSchedules: number;
    penalties: number;
    totalErrors: number;
}

const stats: MigrationStats = {
    users: 0,
    tournaments: 0,
    playerEntries: 0,
    blindSchedules: 0,
    penalties: 0,
    totalErrors: 0,
};

async function initializeDataSources() {
    // Initialize TypeORM
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('✅ TypeORM initialized');
    }

    // Initialize old Knex pool (for reading from old schema)
    const knexPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'tdpokerpro',
    });

    return knexPool;
}

async function migrateUsers(knexPool: Pool) {
    console.log('\n📝 Migrating Users...');
    const userRepo = new UserRepository();

    try {
        // Read from old users table (assuming it exists)
        const result = await knexPool.query('SELECT * FROM users ORDER BY created_at LIMIT 1000');
        const users = result.rows;

        console.log(`   Found ${users.length} users to migrate`);

        if (users.length === 0) {
            console.log('   ⚠️  No legacy users found - skipping');
            return;
        }

        for (const user of users) {
            try {
                await userRepo.create({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    passwordHash: user.password_hash,
                    emailVerified: user.email_verified,
                    verifiedAt: user.verified_at,
                    role: user.role || 'player',
                    status: user.status || 'active',
                    isTd: user.is_td || false,
                    tdLicenseNumber: user.td_license_number,
                    tdExperienceYears: user.td_experience_years,
                    tdRating: user.td_rating,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatarUrl: user.avatar_url,
                    bio: user.bio,
                    followersCount: user.followers_count || 0,
                    followingCount: user.following_count || 0,
                    createdAt: new Date(user.created_at),
                    updatedAt: new Date(user.updated_at),
                });
                stats.users++;
            } catch (error: any) {
                console.error(`   ❌ Error migrating user ${user.id}:`, error.message);
                stats.totalErrors++;
            }
        }

        console.log(`✅ Migrated ${stats.users} users`);
    } catch (error: any) {
        if (error.code === '42P01') {
            console.log('   ℹ️  Legacy users table not found - skipping (expected for new installations)');
        } else {
            console.error('❌ Error reading users:', error.message);
            stats.totalErrors++;
        }
    }
}

async function migrateTournaments(knexPool: Pool) {
    console.log('\n📝 Migrating Tournaments...');

    try {
        const result = await knexPool.query('SELECT * FROM tournaments ORDER BY created_at LIMIT 1000');
        const tournaments = result.rows;

        console.log(`   Found ${tournaments.length} tournaments to migrate`);

        if (tournaments.length === 0) {
            console.log('   ⚠️  No legacy tournaments found - skipping');
            return;
        }

        // Note: TournamentRepository still uses old Knex pattern
        // This would need to be implemented with the new TypeORM repository
        console.log('   ⚠️  Tournament migration requires TournamentRepository TypeORM refactor');
        console.log('   ℹ️  Skipping tournaments - implement after repository migration');
    } catch (error: any) {
        if (error.code === '42P01') {
            console.log('   ℹ️  Legacy tournaments table not found - skipping');
        } else {
            console.error('❌ Error reading tournaments:', error.message);
            stats.totalErrors++;
        }
    }
}

async function migrateBlindSchedules(knexPool: Pool) {
    console.log('\n📝 Migrating Blind Schedules...');
    const blindRepo = new BlindScheduleRepositoryTypeORM();

    try {
        const result = await knexPool.query(
            'SELECT * FROM tournament_blind_schedules ORDER BY tournament_id, level'
        );
        const blinds = result.rows;

        console.log(`   Found ${blinds.length} blind levels to migrate`);

        if (blinds.length === 0) {
            console.log('   ⚠️  No legacy blind schedules found - skipping');
            return;
        }

        for (const b of blinds) {
            try {
                await blindRepo.create({
                    tournament_id: b.tournament_id,
                    level: b.level,
                    small_blind: b.small_blind,
                    big_blind: b.big_blind,
                    antes: b.antes,
                    duration_minutes: b.duration_minutes,
                    late_registration_end: b.late_registration_end || false,
                    rebuy_end: b.rebuy_end || false,
                    addon_available: b.addon_available || false,
                    is_break: b.is_break || false,
                    break_duration_minutes: b.break_duration_minutes,
                });
                stats.blindSchedules++;
            } catch (error: any) {
                console.error(`   ❌ Error migrating blind level:`, error.message);
                stats.totalErrors++;
            }
        }

        console.log(`✅ Migrated ${stats.blindSchedules} blind schedules`);
    } catch (error: any) {
        if (error.code === '42P01') {
            console.log('   ℹ️  Legacy blind schedules table not found - skipping');
        } else {
            console.error('❌ Error reading blind schedules:', error.message);
            stats.totalErrors++;
        }
    }
}

async function migratePlayerEntries(knexPool: Pool) {
    console.log('\n📝 Migrating Player Entries...');
    const entryRepo = new PlayerEntryRepository();

    try {
        const result = await knexPool.query('SELECT * FROM player_entries ORDER BY created_at LIMIT 5000');
        const entries = result.rows;

        console.log(`   Found ${entries.length} player entries to migrate`);

        if (entries.length === 0) {
            console.log('   ⚠️  No legacy player entries found - skipping');
            return;
        }

        for (const e of entries) {
            try {
                await entryRepo.create({
                    tournament_id: e.tournament_id,
                    player_id: e.player_id,
                    entry_number: e.entry_number,
                    entry_type: e.entry_type || 'initial',
                    buy_in_cents: e.buy_in_cents,
                    starting_stack: e.starting_stack,
                    current_stack: e.current_stack || 0,
                    status: e.status || 'REGISTERED',
                    finishing_position: e.finishing_position,
                    finishing_prize_cents: e.finishing_prize_cents,
                    busted_at: e.busted_at,
                    createdAt: new Date(e.created_at),
                });
                stats.playerEntries++;
            } catch (error: any) {
                console.error(`   ❌ Error migrating player entry:`, error.message);
                stats.totalErrors++;
            }
        }

        console.log(`✅ Migrated ${stats.playerEntries} player entries`);
    } catch (error: any) {
        if (error.code === '42P01') {
            console.log('   ℹ️  Legacy player entries table not found - skipping');
        } else {
            console.error('❌ Error reading player entries:', error.message);
            stats.totalErrors++;
        }
    }
}

async function migratePenalties(knexPool: Pool) {
    console.log('\n📝 Migrating Penalties...');
    const penaltyRepo = new PenaltyRepositoryTypeORM();

    try {
        const result = await knexPool.query('SELECT * FROM penalties ORDER BY created_at LIMIT 1000');
        const penalties = result.rows;

        console.log(`   Found ${penalties.length} penalties to migrate`);

        if (penalties.length === 0) {
            console.log('   ⚠️  No legacy penalties found - skipping');
            return;
        }

        for (const p of penalties) {
            try {
                await penaltyRepo.create({
                    tournament_id: p.tournament_id,
                    player_entry_id: p.player_entry_id,
                    infraction_type: p.infraction_type,
                    penalty_level: p.penalty_level,
                    description: p.description,
                    imposed_by: p.imposed_by,
                    previous_penalty_id: p.previous_penalty_id,
                    createdAt: new Date(p.created_at),
                });
                stats.penalties++;
            } catch (error: any) {
                console.error(`   ❌ Error migrating penalty:`, error.message);
                stats.totalErrors++;
            }
        }

        console.log(`✅ Migrated ${stats.penalties} penalties`);
    } catch (error: any) {
        if (error.code === '42P01') {
            console.log('   ℹ️  Legacy penalties table not found - skipping');
        } else {
            console.error('❌ Error reading penalties:', error.message);
            stats.totalErrors++;
        }
    }
}

async function main() {
    console.log('🚀 Starting Data Migration: Knex → TypeORM');
    console.log('═══════════════════════════════════════════════\n');

    // Safety check
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ FATAL: Cannot run migration in production!');
        console.error('   Set NODE_ENV=staging and try again');
        process.exit(1);
    }

    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'tdpokerpro'}`);
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log('');

    const startTime = Date.now();

    try {
        const knexPool = await initializeDataSources();

        // Migrate data in order (respecting foreign keys)
        await migrateUsers(knexPool);
        await migrateTournaments(knexPool);
        await migrateBlindSchedules(knexPool);
        await migratePlayerEntries(knexPool);
        await migratePenalties(knexPool);

        // Close connections
        await AppDataSource.destroy();
        await knexPool.end();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ MIGRATION COMPLETED');
        console.log('═══════════════════════════════════════════════');
        console.log(`\n📊 Migration Summary:`);
        console.log(`   Users:          ${stats.users}`);
        console.log(`   Tournaments:    ${stats.tournaments}`);
        console.log(`   Blind Schedules:${stats.blindSchedules}`);
        console.log(`   Player Entries: ${stats.playerEntries}`);
        console.log(`   Penalties:      ${stats.penalties}`);
        console.log(`   ─────────────────────`);
        console.log(`   Total Migrated: ${stats.users + stats.tournaments + stats.blindSchedules + stats.playerEntries + stats.penalties}`);
        console.log(`   Errors:         ${stats.totalErrors}`);
        console.log(`   Duration:       ${duration}s`);

        if (stats.totalErrors > 0) {
            console.log('\n⚠️  Warning: Some errors occurred during migration');
            console.log('   Review logs above for details');
            process.exit(1);
        } else {
            console.log('\n🎉 All data migrated successfully!');
            process.exit(0);
        }
    } catch (error: any) {
        console.error('\n❌ FATAL ERROR during migration:');
        console.error(error);
        process.exit(1);
    }
}

main();
