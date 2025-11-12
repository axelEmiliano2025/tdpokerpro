/**
 * JWT Authentication Middleware
 * Verificar y validar tokens JWT en requests
 */
import { Request, Response, NextFunction } from 'express';
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
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): void;
/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export declare function authorizeRoles(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware opcional de autenticación
 * Intenta extraer usuario del token pero no requiere autenticación
 */
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map