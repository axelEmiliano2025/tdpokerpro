/**
 * Authentication Service
 * Lógica de negocio para autenticación
 */
import { UserRepository } from '../repositories/UserRepository';
import { User } from '@tdpokerpro/shared-types';
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
export declare class AuthService {
    private userRepository;
    constructor(userRepository: UserRepository);
    /**
     * Registrar nuevo usuario
     */
    register(data: RegisterData): Promise<{
        user: User;
        tokens: AuthTokens;
    }>;
    /**
     * Login de usuario
     */
    login(data: LoginData): Promise<{
        user: User;
        tokens: AuthTokens;
    }>;
    /**
     * Refresh access token
     */
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    /**
     * Verificar access token
     */
    verifyToken(token: string): Promise<TokenPayload>;
    /**
     * Generar tokens JWT
     */
    private generateTokens;
    /**
     * Hash password (útil para resetear contraseñas)
     */
    hashPassword(password: string): Promise<string>;
    /**
     * Comparar password con hash
     */
    comparePassword(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=AuthService.d.ts.map