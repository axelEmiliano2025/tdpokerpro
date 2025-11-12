/**
 * Migration: Create Financial and Transaction Tables
 * 
 * Creates:
 * - transactions: All financial transactions
 * - user_wallets: User balance tracking
 * - payments: Payment gateway transactions
 */

exports.up = (pgm) => {
    // ========================================
    // USER WALLETS TABLE
    // ========================================
    pgm.createTable('user_wallets', {
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
        balance: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
            check: 'balance >= 0',
        },
        lifetime_deposits: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
        },
        lifetime_withdrawals: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
        },
        lifetime_winnings: {
            type: 'decimal(10,2)',
            notNull: true,
            default: 0,
        },
        last_transaction_at: {
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

    // Indexes for user_wallets
    pgm.createIndex('user_wallets', 'user_id');
    pgm.createIndex('user_wallets', 'balance');

    // ========================================
    // TRANSACTIONS TABLE
    // ========================================
    pgm.createTable('transactions', {
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
        tournament_id: {
            type: 'uuid',
            references: 'tournaments',
            onDelete: 'SET NULL',
            comment: 'Tournament related to this transaction (if applicable)',
        },
        type: {
            type: 'transaction_type',
            notNull: true,
        },
        status: {
            type: 'transaction_status',
            notNull: true,
            default: 'pending',
        },
        amount: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        balance_before: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        balance_after: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        description: {
            type: 'text',
        },
        metadata: {
            type: 'jsonb',
            comment: 'Additional transaction data',
        },
        processed_by: {
            type: 'uuid',
            references: 'users',
            comment: 'Staff member who processed the transaction',
        },
        processed_at: {
            type: 'timestamp',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Indexes for transactions
    pgm.createIndex('transactions', 'user_id');
    pgm.createIndex('transactions', 'tournament_id');
    pgm.createIndex('transactions', 'type');
    pgm.createIndex('transactions', 'status');
    pgm.createIndex('transactions', 'created_at');
    pgm.createIndex('transactions', 'metadata', { method: 'gin' });

    // ========================================
    // PAYMENTS TABLE (Stripe/Gateway Integration)
    // ========================================
    pgm.createTable('payments', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        transaction_id: {
            type: 'uuid',
            notNull: true,
            unique: true,
            references: 'transactions',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        gateway: {
            type: 'varchar(50)',
            notNull: true,
            comment: 'stripe, pagseguro, pix, etc.',
        },
        gateway_transaction_id: {
            type: 'varchar(255)',
            unique: true,
            comment: 'External payment ID from gateway',
        },
        amount: {
            type: 'decimal(10,2)',
            notNull: true,
        },
        currency: {
            type: 'varchar(3)',
            notNull: true,
            default: 'BRL',
        },
        status: {
            type: 'varchar(50)',
            notNull: true,
            default: 'pending',
        },
        payment_method: {
            type: 'varchar(50)',
            comment: 'card, pix, boleto, etc.',
        },
        payment_details: {
            type: 'jsonb',
            comment: 'Additional payment gateway data',
        },
        error_message: {
            type: 'text',
        },
        webhook_data: {
            type: 'jsonb',
            comment: 'Raw webhook payload from gateway',
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

    // Indexes for payments
    pgm.createIndex('payments', 'transaction_id');
    pgm.createIndex('payments', 'user_id');
    pgm.createIndex('payments', 'gateway');
    pgm.createIndex('payments', 'gateway_transaction_id');
    pgm.createIndex('payments', 'status');
    pgm.createIndex('payments', 'created_at');

    // ========================================
    // TRIGGERS
    // ========================================
    pgm.createTrigger('user_wallets', 'update_user_wallets_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    pgm.createTrigger('payments', 'update_payments_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON TABLE user_wallets IS 'User balance and lifetime statistics';
    COMMENT ON TABLE transactions IS 'All financial transactions (buy-ins, prizes, expenses, etc.)';
    COMMENT ON TABLE payments IS 'Payment gateway transactions (Stripe, PagSeguro, etc.)';
  `);
};

exports.down = (pgm) => {
    pgm.dropTable('payments', { cascade: true });
    pgm.dropTable('transactions', { cascade: true });
    pgm.dropTable('user_wallets', { cascade: true });
};
