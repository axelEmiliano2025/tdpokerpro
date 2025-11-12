"use strict";
/**
 * Authentication Service
 * Lógica de negocio para autenticación
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const shared_utils_1 = require("@tdpokerpro/shared-utils");
const shared_utils_2 = require("@tdpokerpro/shared-utils");
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Registrar nuevo usuario
     */
    async register(data) {
        // Validar que el email no exista
        const emailExists = await this.userRepository.emailExists(data.email);
        if (emailExists) {
            throw new shared_utils_1.ValidationError('Email already registered');
        }
        // Validar que el username no exista
        const usernameExists = await this.userRepository.usernameExists(data.username);
        if (usernameExists) {
            throw new shared_utils_1.ValidationError('Username already taken');
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        // Crear usuario
        const user = await this.userRepository.create({
            email: data.email,
            username: data.username,
            password_hash: passwordHash,
        });
        shared_utils_2.logger.info('User registered successfully', { userId: user.id, email: user.email });
        // Generar tokens
        const tokens = this.generateTokens(user);
        // Actualizar última conexión
        await this.userRepository.updateLastLogin(user.id);
        return { user, tokens };
    }
    /**
     * Login de usuario
     */
    async login(data) {
        // Buscar usuario
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new shared_utils_1.UnauthorizedError('Invalid credentials');
        }
        // Verificar si está activo
        if (!user.is_active) {
            throw new shared_utils_1.UnauthorizedError('Account is disabled');
        }
        // Verificar password
        const passwordValid = await bcrypt_1.default.compare(data.password, user.password_hash);
        if (!passwordValid) {
            throw new shared_utils_1.UnauthorizedError('Invalid credentials');
        }
        shared_utils_2.logger.info('User logged in successfully', { userId: user.id, email: user.email });
        // Generar tokens
        const tokens = this.generateTokens(user);
        // Actualizar última conexión
        await this.userRepository.updateLastLogin(user.id);
        return { user, tokens };
    }
    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        try {
            // Verificar refresh token
            const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
            // Buscar usuario
            const user = await this.userRepository.findById(payload.userId);
            if (!user || !user.is_active) {
                throw new shared_utils_1.UnauthorizedError('Invalid refresh token');
            }
            // Generar nuevos tokens
            return this.generateTokens(user);
        }
        catch (error) {
            shared_utils_2.logger.error('Refresh token verification failed', error);
            throw new shared_utils_1.UnauthorizedError('Invalid refresh token');
        }
    }
    /**
     * Verificar access token
     */
    async verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return payload;
        }
        catch (error) {
            shared_utils_2.logger.error('Token verification failed', error);
            throw new shared_utils_1.UnauthorizedError('Invalid or expired token');
        }
    }
    /**
     * Generar tokens JWT
     */
    generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: JWT_EXPIRES_IN,
        };
    }
    /**
     * Hash password (útil para resetear contraseñas)
     */
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, SALT_ROUNDS);
    }
    /**
     * Comparar password con hash
     */
    async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map