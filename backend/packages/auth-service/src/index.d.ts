/**
 * Auth Service Entry Point
 */
export { AuthService } from './services/AuthService';
export { AuthController } from './controllers/AuthController';
export { UserRepository } from './repositories/UserRepository';
export { authenticateToken, authorizeRoles, optionalAuth } from './middleware/auth';
export { createAuthRouter } from './routes/auth.routes';
export type { RegisterData, LoginData, AuthTokens, TokenPayload } from './services/AuthService';
export type { AuthRequest } from './middleware/auth';
//# sourceMappingURL=index.d.ts.map