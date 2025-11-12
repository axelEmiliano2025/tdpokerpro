/**
 * User Controller
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '@tdpokerpro/auth-service';

function validateUserId(id: string | undefined): id is string {
    return typeof id === 'string' && id.length > 0;
}

export class UserController {
    constructor(private userService: UserService) { }

    /**
     * GET /users/:id
     * Obtener datos completos de un usuario
     */
    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const requestingUser = (req as AuthRequest).user;

            if (!id) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_USER_ID',
                        message: 'User ID is required',
                    },
                });
                return;
            }

            // Verificar permisos
            if (!requestingUser || !this.userService.canAccessUserData(requestingUser.userId, id, requestingUser.role)) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You do not have permission to access this user data',
                    },
                });
                return;
            }

            const userData = await this.userService.getUserById(id);

            // No devolver password_hash
            const { password_hash, ...userWithoutPassword } = userData.user;

            res.json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    profile: userData.profile,
                    wallet: userData.wallet,
                    stats: userData.stats,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * PUT /users/:id/profile
     * Actualizar perfil de usuario
     */
    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const requestingUser = (req as AuthRequest).user;

            if (!validateUserId(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_USER_ID',
                        message: 'User ID is required',
                    },
                });
                return;
            }

            // Verificar permisos
            if (!requestingUser || !this.userService.canAccessUserData(requestingUser.userId, id, requestingUser.role)) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You do not have permission to update this profile',
                    },
                });
                return;
            }

            const profile = await this.userService.updateProfile(id, req.body);

            res.json({
                success: true,
                data: { profile },
                message: 'Profile updated successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /users/:id/wallet
     * Obtener wallet del usuario
     */
    getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const requestingUser = (req as AuthRequest).user;

            // Verificar permisos (solo el propio usuario puede ver su wallet)
            if (!requestingUser || requestingUser.userId !== id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only access your own wallet',
                    },
                });
                return;
            }

            const wallet = await this.userService.getUserWallet(id);

            res.json({
                success: true,
                data: { wallet },
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /users/:id/wallet/deposit
     * Depositar fondos
     */
    depositFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const requestingUser = (req as AuthRequest).user;

            // Verificar permisos
            if (!requestingUser || requestingUser.userId !== id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only deposit to your own wallet',
                    },
                });
                return;
            }

            const wallet = await this.userService.depositFunds(id, amount);

            res.json({
                success: true,
                data: { wallet },
                message: 'Funds deposited successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /users/:id/wallet/withdraw
     * Retirar fondos
     */
    withdrawFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const requestingUser = (req as AuthRequest).user;

            // Verificar permisos
            if (!requestingUser || requestingUser.userId !== id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only withdraw from your own wallet',
                    },
                });
                return;
            }

            const wallet = await this.userService.withdrawFunds(id, amount);

            res.json({
                success: true,
                data: { wallet },
                message: 'Funds withdrawn successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /users/:id/stats
     * Obtener estadísticas del usuario
     */
    getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            if (!validateUserId(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_USER_ID',
                        message: 'User ID is required',
                    },
                });
                return;
            }

            const stats = await this.userService.getUserStats(id);

            res.json({
                success: true,
                data: { stats },
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * PUT /users/:id/avatar
     * Actualizar avatar
     */
    updateAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { avatarUrl } = req.body;
            const requestingUser = (req as AuthRequest).user;

            // Verificar permisos
            if (!requestingUser || requestingUser.userId !== id) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only update your own avatar',
                    },
                });
                return;
            }

            const profile = await this.userService.updateAvatar(id, avatarUrl);

            res.json({
                success: true,
                data: { profile },
                message: 'Avatar updated successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}
