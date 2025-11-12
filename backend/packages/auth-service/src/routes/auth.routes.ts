/**
 * Authentication Routes
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticateToken } from '../middleware/auth';
import { schemas } from '@tdpokerpro/shared-utils';
import Joi, { ObjectSchema } from 'joi';

// Middleware de validación (copiado de api-gateway)
function validateBody(schema: ObjectSchema) {
    return (req: any, res: any, next: any): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const details = error.details.map((detail: any) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details,
                },
            });
            return;
        }

        req.body = value;
        next();
    };
}

// Schemas de validación
const registerSchema = Joi.object({
    email: schemas.email,
    username: schemas.username,
    password: schemas.password,
});

const loginSchema = Joi.object({
    email: schemas.email,
    password: schemas.password,
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'any.required': 'Refresh token is required',
    }),
});

/**
 * Create auth router with dependencies
 */
export function createAuthRouter(userRepository: UserRepository): Router {
    const router = Router();
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    /**
     * POST /register
     * Register a new user
     */
    router.post(
        '/register',
        validateBody(registerSchema),
        authController.register
    );

    /**
     * POST /login
     * Login user
     */
    router.post(
        '/login',
        validateBody(loginSchema),
        authController.login
    );

    /**
     * POST /refresh
     * Refresh access token
     */
    router.post(
        '/refresh',
        validateBody(refreshTokenSchema),
        authController.refreshToken
    );

    /**
     * POST /logout
     * Logout user (client-side token removal)
     */
    router.post(
        '/logout',
        authenticateToken,
        authController.logout
    );

    /**
     * GET /me
     * Get current user info
     */
    router.get(
        '/me',
        authenticateToken,
        authController.getCurrentUser
    );

    return router;
}

export default createAuthRouter;
