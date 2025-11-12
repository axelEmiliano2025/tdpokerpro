import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserProfileRepository } from '../repositories/UserProfileRepository';
import { UserWalletRepository } from '../repositories/UserWalletRepository';
import { UserStatsRepository } from '../repositories/UserStatsRepository';
import { UserRepository } from '@tdpokerpro/auth-service';
import { authenticateToken } from '@tdpokerpro/auth-service';
import { Knex } from 'knex';
import Joi from 'joi';

// Validation schemas
const updateProfileSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    bio: Joi.string().max(500).optional(),
    country: Joi.string().length(2).optional(),
    privacySettings: Joi.object({
        showProfile: Joi.boolean(),
        showStats: Joi.boolean(),
        showActivity: Joi.boolean(),
    }).optional(),
});

const walletOperationSchema = Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().max(200).optional(),
});

const avatarSchema = Joi.object({
    avatarUrl: Joi.string().uri().required(),
});

// Validation middleware
const validate = (schema: Joi.ObjectSchema) => {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: error.details?.[0]?.message || 'Validation error',
                },
            });
        }
        next();
    };
};

export function createUserRouter(db: Knex): Router {
    const router = Router();

    // Initialize repositories
    const userRepository = new UserRepository(db);
    const profileRepository = new UserProfileRepository(db);
    const walletRepository = new UserWalletRepository(db);
    const statsRepository = new UserStatsRepository(db);

    // Initialize service and controller
    const userService = new UserService(
        userRepository,
        profileRepository,
        walletRepository,
        statsRepository
    );
    const userController = new UserController(userService);

    /**
     * @route GET /api/v1/users/:id
     * @desc Get user by ID
     * @access Private (own profile) or Admin
     */
    router.get('/:id', authenticateToken, userController.getUserById);

    /**
     * @route PATCH /api/v1/users/:id/profile
     * @desc Update user profile
     * @access Private (own profile) or Admin
     */
    router.patch(
        '/:id/profile',
        authenticateToken,
        validate(updateProfileSchema),
        userController.updateProfile
    );

    /**
     * @route GET /api/v1/users/:id/wallet
     * @desc Get user wallet
     * @access Private (own wallet) or Admin
     */
    router.get('/:id/wallet', authenticateToken, userController.getWallet);

    /**
     * @route POST /api/v1/users/:id/wallet/deposit
     * @desc Deposit funds to wallet
     * @access Private (own wallet) or Admin
     */
    router.post(
        '/:id/wallet/deposit',
        authenticateToken,
        validate(walletOperationSchema),
        userController.depositFunds
    );

    /**
     * @route POST /api/v1/users/:id/wallet/withdraw
     * @desc Withdraw funds from wallet
     * @access Private (own wallet) or Admin
     */
    router.post(
        '/:id/wallet/withdraw',
        authenticateToken,
        validate(walletOperationSchema),
        userController.withdrawFunds
    );

    /**
     * @route GET /api/v1/users/:id/stats
     * @desc Get user statistics
     * @access Public (if privacy allows) or own stats or Admin
     */
    router.get('/:id/stats', userController.getStats);

    /**
     * @route PATCH /api/v1/users/:id/avatar
     * @desc Update user avatar
     * @access Private (own profile) or Admin
     */
    router.patch(
        '/:id/avatar',
        authenticateToken,
        validate(avatarSchema),
        userController.updateAvatar
    );

    return router;
}
