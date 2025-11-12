/**
 * User Wallet Repository
 */

import { Knex } from 'knex';
import { UserWallet } from '@tdpokerpro/shared-types';

export class UserWalletRepository {
    constructor(private db: Knex) { }

    /**
     * Buscar wallet por user ID
     */
    async findByUserId(userId: string): Promise<UserWallet | null> {
        const wallet = await this.db('user_wallets')
            .where({ user_id: userId })
            .first();

        return wallet || null;
    }

    /**
     * Crear wallet de usuario
     */
    async create(userId: string): Promise<UserWallet> {
        const [wallet] = await this.db('user_wallets')
            .insert({
                user_id: userId,
                balance: 0,
                lifetime_deposits: 0,
                lifetime_withdrawals: 0,
                lifetime_winnings: 0,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('*');

        return wallet;
    }

    /**
     * Actualizar balance
     */
    async updateBalance(
        userId: string,
        amount: number,
        type: 'deposit' | 'withdrawal' | 'winning' | 'expense'
    ): Promise<UserWallet | null> {
        // Actualizar balance
        if (type === 'deposit' || type === 'winning') {
            await this.db('user_wallets')
                .where({ user_id: userId })
                .increment('balance', amount);
        } else {
            await this.db('user_wallets')
                .where({ user_id: userId })
                .decrement('balance', amount);
        }

        // Actualizar lifetime stats
        if (type === 'deposit') {
            await this.db('user_wallets')
                .where({ user_id: userId })
                .increment('lifetime_deposits', amount);
        } else if (type === 'withdrawal') {
            await this.db('user_wallets')
                .where({ user_id: userId })
                .increment('lifetime_withdrawals', amount);
        } else if (type === 'winning') {
            await this.db('user_wallets')
                .where({ user_id: userId })
                .increment('lifetime_winnings', amount);
        }

        // Actualizar last_transaction_at
        await this.db('user_wallets')
            .where({ user_id: userId })
            .update({
                last_transaction_at: new Date(),
                updated_at: new Date(),
            });

        return this.findByUserId(userId);
    }

    /**
     * Verificar si tiene fondos suficientes
     */
    async hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
        const wallet = await this.findByUserId(userId);
        return wallet ? wallet.balance >= amount : false;
    }
}
