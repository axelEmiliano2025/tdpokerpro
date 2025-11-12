/**
 * JWT Authentication Middleware
 * Verificar y validar tokens JWT en requests
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@tdpokerpro/shared-utils';
import { logger } from '@tdpokerpro/shared-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        username: string;
        role: string;
    };
}

/**
 * Middleware de autenticación
 * Verifica token JWT en Authorization header
 */
export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

        if (!token) {
            throw new UnauthorizedError('Access token is required');
        }

        // Verificar token
        const payload = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            username: string;
            role: string;
        };

        // Agregar datos del usuario al request
        (req as AuthRequest).user = payload;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('Token expired', { error: (error as Error).message });
            res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired',
                },
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn('Invalid token', { error: (error as Error).message });
            res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid token',
                },
            });
            return;
        }

        next(error);
    }
}

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export function authorizeRoles(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as AuthRequest).user;

        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                },
            });
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            logger.warn('Access denied - insufficient permissions', {
                userId: user.userId,
                userRole: user.role,
                requiredRoles: allowedRoles,
            });

            res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions',
                },
            });
            return;
        }

        next();
    };
}

/**
 * Middleware opcional de autenticación
 * Intenta extraer usuario del token pero no requiere autenticación
 */
export function optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const payload = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                email: string;
                username: string;
                role: string;
            };

            (req as AuthRequest).user = payload;
        }
    } catch (error) {
        // Ignorar errores en autenticación opcional
        logger.debug('Optional auth failed', { error });
    }

    next();
}
