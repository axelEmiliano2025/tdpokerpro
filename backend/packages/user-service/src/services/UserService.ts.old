/**
 * User Management Service
 */

import { UserProfileRepository } from '../repositories/UserProfileRepository';
import { UserWalletRepository } from '../repositories/UserWalletRepository';
import { UserStatsRepository } from '../repositories/UserStatsRepository';
import { UserRepository } from '@tdpokerpro/auth-service';
import { User, UserProfile, UserWallet, UserStats } from '@tdpokerpro/shared-types';
import { NotFoundError, ValidationError, BadRequestError } from '@tdpokerpro/shared-utils';
import { logger } from '@tdpokerpro/shared-utils';

export interface UpdateProfileData {
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    city?: string;
    birthDate?: Date;
    preferredLanguage?: string;
}

export interface UserFullData {
    user: User;
    profile: UserProfile | null;
    wallet: UserWallet | null;
    stats: UserStats | null;
}

export class UserService {
    constructor(
        private userRepository: UserRepository,
        private profileRepository: UserProfileRepository,
        private walletRepository: UserWalletRepository,
        private statsRepository: UserStatsRepository
    ) { }

    /**
     * Obtener datos completos de un usuario
     */
    async getUserById(userId: string): Promise<UserFullData> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const [profile, wallet, stats] = await Promise.all([
            this.profileRepository.findByUserId(userId),
            this.walletRepository.findByUserId(userId),
            this.statsRepository.findByUserId(userId),
        ]);

        return { user, profile, wallet, stats };
    }

    /**
     * Actualizar perfil de usuario
     */
    async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
        // Verificar que el usuario existe
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Verificar si ya tiene perfil
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            // Crear perfil si no existe
            profile = await this.profileRepository.create({
                userId,
                username: user.username,
                ...data,
            });
            logger.info('User profile created', { userId });
        } else {
            // Actualizar perfil existente
            const updated = await this.profileRepository.update(userId, data);
            if (!updated) {
                throw new Error('Failed to update profile');
            }
            profile = updated;
            logger.info('User profile updated', { userId });
        }

        return profile;
    }

    /**
     * Obtener wallet del usuario
     */
    async getUserWallet(userId: string): Promise<UserWallet> {
        // Verificar que el usuario existe
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        let wallet = await this.walletRepository.findByUserId(userId);

        if (!wallet) {
            // Crear wallet si no existe
            wallet = await this.walletRepository.create(userId);
            logger.info('User wallet created', { userId });
        }

        return wallet;
    }

    /**
     * Agregar fondos al wallet (depósito)
     */
    async depositFunds(userId: string, amount: number): Promise<UserWallet> {
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }

        // Asegurar que existe el wallet
        await this.getUserWallet(userId);

        const updated = await this.walletRepository.updateBalance(userId, amount, 'deposit');

        if (!updated) {
            throw new Error('Failed to update wallet');
        }

        logger.info('Funds deposited', { userId, amount, newBalance: updated.balance });
        return updated;
    }

    /**
     * Retirar fondos del wallet
     */
    async withdrawFunds(userId: string, amount: number): Promise<UserWallet> {
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }

        // Verificar fondos suficientes
        const hasFunds = await this.walletRepository.hasSufficientBalance(userId, amount);
        if (!hasFunds) {
            throw new BadRequestError('Insufficient funds');
        }

        const updated = await this.walletRepository.updateBalance(userId, amount, 'withdrawal');

        if (!updated) {
            throw new Error('Failed to update wallet');
        }

        logger.info('Funds withdrawn', { userId, amount, newBalance: updated.balance });
        return updated;
    }

    /**
     * Obtener estadísticas del usuario
     */
    async getUserStats(userId: string): Promise<UserStats> {
        // Verificar que el usuario existe
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        let stats = await this.statsRepository.findByUserId(userId);

        if (!stats) {
            // Crear stats si no existen
            stats = await this.statsRepository.create(userId);
            logger.info('User stats created', { userId });
        }

        return stats;
    }

    /**
     * Actualizar avatar del usuario
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
        return this.updateProfile(userId, { avatarUrl });
    }

    /**
     * Verificar si el usuario puede acceder a los datos
     */
    canAccessUserData(requestingUserId: string, targetUserId: string, userRole: string): boolean {
        // El usuario puede acceder a sus propios datos
        if (requestingUserId === targetUserId) {
            return true;
        }

        // Admin y director pueden acceder a todos los datos
        if (userRole === 'admin' || userRole === 'director') {
            return true;
        }

        return false;
    }
}
