/**
 * Migration: Create Users and Authentication Tables
 * 
 * Creates:
 * - users: Core user accounts
 * - user_profiles: Extended user information
 * - user_sessions: Active user sessions for JWT refresh tokens
 */

exports.up = (pgm) => {
    // ========================================
    // USERS TABLE
    // ========================================
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        role: {
            type: 'user_role',
            notNull: true,
            default: 'player',
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        is_verified: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        verification_token: {
            type: 'varchar(255)',
            unique: true,
        },
        reset_password_token: {
            type: 'varchar(255)',
            unique: true,
        },
        reset_password_expires: {
            type: 'timestamp',
        },
        last_login_at: {
            type: 'timestamp',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for users
    pgm.createIndex('users', 'email');
    pgm.createIndex('users', 'role');
    pgm.createIndex('users', 'is_active');
    pgm.createIndex('users', 'created_at');

    // ========================================
    // USER PROFILES TABLE
    // ========================================
    pgm.createTable('user_profiles', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            unique: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        username: {
            type: 'varchar(50)',
            notNull: true,
            unique: true,
        },
        first_name: {
            type: 'varchar(100)',
        },
        last_name: {
            type: 'varchar(100)',
        },
        phone: {
            type: 'varchar(20)',
        },
        avatar_url: {
            type: 'text',
        },
        bio: {
            type: 'text',
        },
        country: {
            type: 'varchar(3)',
        },
        city: {
            type: 'varchar(100)',
        },
        birth_date: {
            type: 'date',
        },
        preferred_language: {
            type: 'varchar(10)',
            default: 'pt-BR',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for user_profiles
    pgm.createIndex('user_profiles', 'user_id');
    pgm.createIndex('user_profiles', 'username');
    pgm.createIndex('user_profiles', 'country');

    // ========================================
    // USER SESSIONS TABLE
    // ========================================
    pgm.createTable('user_sessions', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        refresh_token: {
            type: 'varchar(500)',
            notNull: true,
            unique: true,
        },
        device_info: {
            type: 'jsonb',
        },
        ip_address: {
            type: 'inet',
        },
        expires_at: {
            type: 'timestamp',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for user_sessions
    pgm.createIndex('user_sessions', 'user_id');
    pgm.createIndex('user_sessions', 'refresh_token');
    pgm.createIndex('user_sessions', 'expires_at');

    // ========================================
    // TRIGGERS FOR UPDATED_AT
    // ========================================
    pgm.createFunction(
        'update_updated_at_column',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
            replace: true,
        },
        `
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    `
    );

    pgm.createTrigger('users', 'update_users_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('user_profiles', 'update_user_profiles_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON TABLE users IS 'Core user accounts with authentication data';
    COMMENT ON TABLE user_profiles IS 'Extended user profile information';
    COMMENT ON TABLE user_sessions IS 'Active user sessions for JWT refresh tokens';
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('user_sessions', { cascade: true });
    pgm.dropTable('user_profiles', { cascade: true });
    pgm.dropTable('users', { cascade: true });
    pgm.dropFunction('update_updated_at_column', [], { cascade: true });
};
