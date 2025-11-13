/**
 * User Repository
 * Manejo de datos de usuarios en PostgreSQL
 */
import { Knex } from 'knex';
import { User } from '@tdpokerpro/shared-types';
export declare class UserRepository {
    private db;
    constructor(db: Knex);
    /**
     * Buscar usuario por email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Buscar usuario por username
     */
    findByUsername(username: string): Promise<User | null>;
    /**
     * Buscar usuario por ID
     */
    findById(id: string): Promise<User | null>;
    /**
     * Crear nuevo usuario
     */
    create(data: {
        email: string;
        username: string;
        password_hash: string;
        role?: string;
    }): Promise<User>;
    /**
     * Actualizar última conexión
     */
    updateLastLogin(userId: string): Promise<void>;
    /**
     * Verificar si existe email
     */
    emailExists(email: string): Promise<boolean>;
    /**
     * Verificar si existe username
     */
    usernameExists(username: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map