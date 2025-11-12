"use strict";
/**
 * Authentication Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthService_1 = require("../services/AuthService");
const auth_1 = require("../middleware/auth");
const shared_utils_1 = require("@tdpokerpro/shared-utils");
const joi_1 = __importDefault(require("joi"));
// Middleware de validación (copiado de api-gateway)
function validateBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const details = error.details.map((detail) => ({
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
const registerSchema = joi_1.default.object({
    email: shared_utils_1.schemas.email,
    username: shared_utils_1.schemas.username,
    password: shared_utils_1.schemas.password,
});
const loginSchema = joi_1.default.object({
    email: shared_utils_1.schemas.email,
    password: shared_utils_1.schemas.password,
});
const refreshTokenSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required().messages({
        'any.required': 'Refresh token is required',
    }),
});
/**
 * Create auth router with dependencies
 */
function createAuthRouter(userRepository) {
    const router = (0, express_1.Router)();
    const authService = new AuthService_1.AuthService(userRepository);
    const authController = new AuthController_1.AuthController(authService);
    /**
     * POST /register
     * Register a new user
     */
    router.post('/register', validateBody(registerSchema), authController.register);
    /**
     * POST /login
     * Login user
     */
    router.post('/login', validateBody(loginSchema), authController.login);
    /**
     * POST /refresh
     * Refresh access token
     */
    router.post('/refresh', validateBody(refreshTokenSchema), authController.refreshToken);
    /**
     * POST /logout
     * Logout user (client-side token removal)
     */
    router.post('/logout', auth_1.authenticateToken, authController.logout);
    /**
     * GET /me
     * Get current user info
     */
    router.get('/me', auth_1.authenticateToken, authController.getCurrentUser);
    return router;
}
exports.default = createAuthRouter;
//# sourceMappingURL=auth.routes.js.map