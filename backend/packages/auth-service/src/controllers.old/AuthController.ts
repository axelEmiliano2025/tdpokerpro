/**
 * Authentication Controller
 * Manejo de peticiones HTTP para autenticación
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { logger } from '@tdpokerpro/shared-utils';

export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * POST /register
     * Registrar nuevo usuario
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, username, password } = req.body;

            const result = await this.authService.register({
                email,
                username,
                password,
            });

            // No devolver password_hash
            const { password_hash, ...userWithoutPassword } = result.user;

            res.status(201).json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    tokens: result.tokens,
                },
                message: 'User registered successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /login
     * Login de usuario
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            const result = await this.authService.login({
                email,
                password,
            });

            // No devolver password_hash
            const { password_hash, ...userWithoutPassword } = result.user;

            res.json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    tokens: result.tokens,
                },
                message: 'Login successful',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /refresh
     * Renovar access token usando refresh token
     */
    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_REFRESH_TOKEN',
                        message: 'Refresh token is required',
                    },
                });
                return;
            }

            const tokens = await this.authService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: { tokens },
                message: 'Token refreshed successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /logout
     * Logout de usuario (cliente debe eliminar tokens)
     */
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // En implementación JWT stateless, logout es del lado del cliente
            // Aquí podríamos agregar tokens a blacklist si se implementa

            logger.info('User logged out', { userId: (req as any).user?.userId });

            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /me
     * Obtener información del usuario autenticado
     */
    getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            // Aquí iría la lógica para obtener datos completos del usuario
            // Por ahora devolvemos lo que tenemos en el token
            res.json({
                success: true,
                data: {
                    user: (req as any).user,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
