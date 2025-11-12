"use strict";
/**
 * JWT Authentication Middleware
 * Verificar y validar tokens JWT en requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const shared_utils_1 = require("@tdpokerpro/shared-utils");
const shared_utils_2 = require("@tdpokerpro/shared-utils");
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
/**
 * Middleware de autenticación
 * Verifica token JWT en Authorization header
 */
function authenticateToken(req, res, next) {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
        if (!token) {
            throw new shared_utils_1.UnauthorizedError('Access token is required');
        }
        // Verificar token
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Agregar datos del usuario al request
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            shared_utils_2.logger.warn('Token expired', { error: error.message });
            res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired',
                },
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            shared_utils_2.logger.warn('Invalid token', { error: error.message });
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
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
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
            shared_utils_2.logger.warn('Access denied - insufficient permissions', {
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
function optionalAuth(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = payload;
        }
    }
    catch (error) {
        // Ignorar errores en autenticación opcional
        shared_utils_2.logger.debug('Optional auth failed', { error });
    }
    next();
}
//# sourceMappingURL=auth.js.map