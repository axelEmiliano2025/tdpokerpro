/**
 * Authentication Service
 * Lógica de negocio para autenticación
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '@tdpokerpro/shared-types';
import { ValidationError, UnauthorizedError } from '@tdpokerpro/shared-utils';
import { logger } from '@tdpokerpro/shared-utils';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const JWT_REFRESH_EXPIRES_IN: any = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    username: string;
    role: string;
}

export class AuthService {
    constructor(private userRepository: UserRepository) { }

    /**
     * Registrar nuevo usuario
     */
    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
        // Validar que el email no exista
        const emailExists = await this.userRepository.emailExists(data.email);
        if (emailExists) {
            throw new ValidationError('Email already registered');
        }

        // Validar que el username no exista
        const usernameExists = await this.userRepository.usernameExists(data.username);
        if (usernameExists) {
            throw new ValidationError('Username already taken');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        // Crear usuario
        const user = await this.userRepository.create({
            email: data.email,
            username: data.username,
            password_hash: passwordHash,
        });

        logger.info('User registered successfully', { userId: user.id, email: user.email });

        // Generar tokens
        const tokens = this.generateTokens(user);

        // Actualizar última conexión
        await this.userRepository.updateLastLogin(user.id);

        return { user, tokens };
    }

    /**
     * Login de usuario
     */
    async login(data: LoginData): Promise<{ user: User; tokens: AuthTokens }> {
        // Buscar usuario
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Verificar si está activo
        if (!user.is_active) {
            throw new UnauthorizedError('Account is disabled');
        }

        // Verificar password
        const passwordValid = await bcrypt.compare(data.password, user.password_hash);
        if (!passwordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        logger.info('User logged in successfully', { userId: user.id, email: user.email });

        // Generar tokens
        const tokens = this.generateTokens(user);

        // Actualizar última conexión
        await this.userRepository.updateLastLogin(user.id);

        return { user, tokens };
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verificar refresh token
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;

            // Buscar usuario
            const user = await this.userRepository.findById(payload.userId);
            if (!user || !user.is_active) {
                throw new UnauthorizedError('Invalid refresh token');
            }

            // Generar nuevos tokens
            return this.generateTokens(user);
        } catch (error) {
            logger.error('Refresh token verification failed', error);
            throw new UnauthorizedError('Invalid refresh token');
        }
    }

    /**
     * Verificar access token
     */
    async verifyToken(token: string): Promise<TokenPayload> {
        try {
            const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
            return payload;
        } catch (error) {
            logger.error('Token verification failed', error);
            throw new UnauthorizedError('Invalid or expired token');
        }
    }

    /**
     * Generar tokens JWT
     */
    private generateTokens(user: User): AuthTokens {
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
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
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    /**
     * Comparar password con hash
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
