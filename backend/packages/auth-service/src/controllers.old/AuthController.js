"use strict";
/**
 * Authentication Controller
 * Manejo de peticiones HTTP para autenticación
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const shared_utils_1 = require("@tdpokerpro/shared-utils");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * POST /register
     * Registrar nuevo usuario
     */
    register = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /login
     * Login de usuario
     */
    login = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /refresh
     * Renovar access token usando refresh token
     */
    refreshToken = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /logout
     * Logout de usuario (cliente debe eliminar tokens)
     */
    logout = async (req, res, next) => {
        try {
            // En implementación JWT stateless, logout es del lado del cliente
            // Aquí podríamos agregar tokens a blacklist si se implementa
            shared_utils_1.logger.info('User logged out', { userId: req.user?.userId });
            res.json({
                success: true,
                message: 'Logout successful',
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /me
     * Obtener información del usuario autenticado
     */
    getCurrentUser = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
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
                    user: req.user,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map