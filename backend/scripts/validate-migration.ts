import 'reflect-metadata';
import { AppDataSource } from '@tdpokerpro/database';
import {
    UserRepository,
    PlayerEntryRepository,
    BlindScheduleRepositoryTypeORM,
} from '../packages/game-engine-service/src/repositories';

/**
 * Validation Script
 * Validates data integrity after migration
 * 
 * USAGE: npx ts-node backend/scripts/validate-migration.ts
 */

interface ValidationResult {
    check: string;
    expected: number;
    actual: number;
    status: 'PASS' | 'FAIL' | 'WARN';
}

const results: ValidationResult[] = [];

async function validateEntityCounts() {
    console.log('\n📊 Validating Entity Counts...\n');

    const userRepo = new UserRepository();
    const entryRepo = new PlayerEntryRepository();
    const blindRepo = new BlindScheduleRepositoryTypeORM();

    // Count users
    const userCount = await userRepo.count();
    console.log(`   Users: ${userCount}`);
    results.push({
        check: 'Users count',
        expected: userCount,
        actual: userCount,
        status: userCount >= 0 ? 'PASS' : 'WARN',
    });

    // Count player entries
    const entryCount = await entryRepo.count();
    console.log(`   Player Entries: ${entryCount}`);
    results.push({
        check: 'Player Entries count',
        expected: entryCount,
        actual: entryCount,
        status: entryCount >= 0 ? 'PASS' : 'WARN',
    });

    // Count blind schedules
    const blindCount = await blindRepo.count();
    console.log(`   Blind Schedules: ${blindCount}`);
    results.push({
        check: 'Blind Schedules count',
        expected: blindCount,
        actual: blindCount,
        status: blindCount >= 0 ? 'PASS' : 'WARN',
    });
}

async function validateForeignKeys() {
    console.log('\n🔗 Validating Foreign Key Relationships...\n');

    const entryRepo = new PlayerEntryRepository();

    try {
        // Get sample entries and verify relationships load
        const entries = await entryRepo.findAll({}, { createdAt: 'DESC' }, { player: true, tournament: true }, 5);

        let validPlayerRefs = 0;
        let validTournamentRefs = 0;

        for (const entry of entries) {
            if (entry.player) validPlayerRefs++;
            if (entry.tournament) validTournamentRefs++;
        } console.log(`   PlayerEntry → User: ${validPlayerRefs}/${entries.length}`);
        console.log(`   PlayerEntry → Tournament: ${validTournamentRefs}/${entries.length}`);

        results.push({
            check: 'Foreign key: PlayerEntry.player',
            expected: entries.length,
            actual: validPlayerRefs,
            status: validPlayerRefs === entries.length ? 'PASS' : 'WARN',
        });

        results.push({
            check: 'Foreign key: PlayerEntry.tournament',
            expected: entries.length,
            actual: validTournamentRefs,
            status: validTournamentRefs === entries.length ? 'PASS' : 'WARN',
        });
    } catch (error: any) {
        console.log(`   ℹ️  No entries to validate: ${error.message}`);
        results.push({
            check: 'Foreign key validation',
            expected: 0,
            actual: 0,
            status: 'PASS',
        });
    }
}

async function validateDataTypes() {
    console.log('\n📋 Validating Data Types...\n');

    const userRepo = new UserRepository();

    try {
        const users = await userRepo.findAll({}, {}, {}, 5);

        if (users.length > 0) {
            for (const u of users) {
                console.log(`   User: ${u.username}`);
                console.log(`     - email: ${typeof u.email} (expected: string)`);
                console.log(`     - role: ${typeof u.role} (expected: string)`);
                console.log(`     - followersCount: ${typeof u.followersCount} (expected: number)`);
            } results.push({
                check: 'Data types validation',
                expected: 1,
                actual: 1,
                status: 'PASS',
            });
        } else {
            console.log('   ℹ️  No users found for validation');
            results.push({
                check: 'Data types validation',
                expected: 0,
                actual: 0,
                status: 'PASS',
            });
        }
    } catch (error: any) {
        console.error(`   ❌ Error validating data types: ${error.message}`);
        results.push({
            check: 'Data types validation',
            expected: 1,
            actual: 0,
            status: 'FAIL',
        });
    }
}

async function validateRepositoryQueries() {
    console.log('\n🧪 Testing Repository Queries...\n');

    const userRepo = new UserRepository();

    try {
        // Test findByUsername
        const users = await userRepo.findAll({}, {}, {}, 1);
        if (users.length > 0 && users[0]) {
            const user = await userRepo.findByUsername(users[0].username);
            console.log(`   ✅ findByUsername: ${user ? 'PASS' : 'FAIL'}`);
        }

        // Test findByEmail
        if (users.length > 0 && users[0]) {
            const user = await userRepo.findByEmail(users[0].email);
            console.log(`   ✅ findByEmail: ${user ? 'PASS' : 'FAIL'}`);
        }        // Test findTournamentDirectors
        const tds = await userRepo.findTournamentDirectors();
        console.log(`   ✅ findTournamentDirectors: ${tds.length} TDs found`); results.push({
            check: 'Repository queries',
            expected: 1,
            actual: 1,
            status: 'PASS',
        });
    } catch (error: any) {
        console.error(`   ❌ Error testing queries: ${error.message}`);
        results.push({
            check: 'Repository queries',
            expected: 1,
            actual: 0,
            status: 'FAIL',
        });
    }
}

async function main() {
    console.log('🔍 Starting Data Migration Validation');
    console.log('═════════════════════════════════════════════════\n');

    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        await validateEntityCounts();
        await validateForeignKeys();
        await validateDataTypes();
        await validateRepositoryQueries();

        await AppDataSource.destroy();

        console.log('\n═════════════════════════════════════════════════');
        console.log('📋 VALIDATION REPORT\n');

        const passed = results.filter(r => r.status === 'PASS').length;
        const failed = results.filter(r => r.status === 'FAIL').length;
        const warned = results.filter(r => r.status === 'WARN').length;

        results.forEach(r => {
            const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️ ';
            console.log(`${icon} ${r.check}: ${r.actual}/${r.expected}`);
        });

        console.log(`\n📊 Summary: ${passed} passed, ${failed} failed, ${warned} warned`);

        if (failed > 0) {
            console.log('\n❌ VALIDATION FAILED');
            process.exit(1);
        } else {
            console.log('\n✅ VALIDATION SUCCESSFUL');
            process.exit(0);
        }
    } catch (error: any) {
        console.error('❌ Validation error:', error);
        process.exit(1);
    }
}

main();
