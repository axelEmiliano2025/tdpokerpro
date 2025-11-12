/**
 * Authentication Controller
 * Manejo de peticiones HTTP para autenticación
 */
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    /**
     * POST /register
     * Registrar nuevo usuario
     */
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /login
     * Login de usuario
     */
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /refresh
     * Renovar access token usando refresh token
     */
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /logout
     * Logout de usuario (cliente debe eliminar tokens)
     */
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * GET /me
     * Obtener información del usuario autenticado
     */
    getCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map