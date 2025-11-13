import 'reflect-metadata';
import {
    UserRepository,
    PlayerEntryRepository,
    BlindScheduleRepositoryTypeORM,
} from '../packages/game-engine-service/src/repositories';
import { AppDataSource } from '@tdpokerpro/database';

/**
 * Repository Test Script
 * Tests TypeORM repositories with actual database queries
 * 
 * USAGE: npx ts-node backend/scripts/test-repositories.ts
 */

async function testRepositories() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const userRepo = new UserRepository();
    const entryRepo = new PlayerEntryRepository();
    const blindRepo = new BlindScheduleRepositoryTypeORM();

    console.log('🧪 Testing TypeORM Repositories...\n');

    // Test 1: Read users
    console.log('Test 1: UserRepository.findAll()');
    const users = await userRepo.findAll({}, { createdAt: 'DESC' }, {}, 5);
    console.log(`✅ Read ${users.length} users`);
    if (users.length > 0 && users[0]) {
        console.log(`   - Sample: ${users[0].username} (${users[0].email})`);
    }

    // Test 2: Find user by username
    if (users.length > 0 && users[0]) {
        console.log('\nTest 2: UserRepository.findByUsername()');
        const user = await userRepo.findByUsername(users[0].username);
        console.log(`✅ Found user: ${user ? user.email : 'null'}`);
    }    // Test 3: Find TDs
    console.log('\nTest 3: UserRepository.findTournamentDirectors()');
    const tds = await userRepo.findTournamentDirectors();
    console.log(`✅ Found ${tds.length} tournament directors`);    // Test 4: Count entities
    console.log('\nTest 4: Repository.count()');
    const userCount = await userRepo.count();
    const entryCount = await entryRepo.count();
    const blindCount = await blindRepo.count();
    console.log(`✅ Counts:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Entries: ${entryCount}`);
    console.log(`   - Blinds: ${blindCount}`);

    // Test 5: Read with relations
    console.log('\nTest 5: PlayerEntryRepository with relations');
    const entries = await entryRepo.findAll({}, {}, { player: true, tournament: true }, 3);
    console.log(`✅ Read ${entries.length} entries with relations`);
    if (entries.length > 0 && entries[0]) {
        console.log(`   - Player loaded: ${entries[0].player ? 'YES' : 'NO'}`);
        console.log(`   - Tournament loaded: ${entries[0].tournament ? 'YES' : 'NO'}`);
    } console.log('\n═════════════════════════════════════════════════');
    console.log('✅ ALL REPOSITORY TESTS PASSED!');
    console.log('═════════════════════════════════════════════════\n');

    await AppDataSource.destroy();
}

testRepositories().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
