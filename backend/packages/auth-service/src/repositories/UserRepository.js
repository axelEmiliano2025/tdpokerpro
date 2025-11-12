"use strict";
/**
 * User Repository
 * Manejo de datos de usuarios en PostgreSQL
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Buscar usuario por email
     */
    async findByEmail(email) {
        const user = await this.db('users')
            .where({ email })
            .first();
        return user || null;
    }
    /**
     * Buscar usuario por username
     */
    async findByUsername(username) {
        const user = await this.db('users')
            .where({ username })
            .first();
        return user || null;
    }
    /**
     * Buscar usuario por ID
     */
    async findById(id) {
        const user = await this.db('users')
            .where({ id })
            .first();
        return user || null;
    }
    /**
     * Crear nuevo usuario
     */
    async create(data) {
        const [user] = await this.db('users')
            .insert({
            email: data.email,
            username: data.username,
            password_hash: data.password_hash,
            role: data.role || 'player',
            email_verified: false,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning('*');
        return user;
    }
    /**
     * Actualizar última conexión
     */
    async updateLastLogin(userId) {
        await this.db('users')
            .where({ id: userId })
            .update({
            last_login_at: new Date(),
            updated_at: new Date(),
        });
    }
    /**
     * Verificar si existe email
     */
    async emailExists(email) {
        const count = await this.db('users')
            .where({ email })
            .count('* as count')
            .first();
        return Number(count?.count) > 0;
    }
    /**
     * Verificar si existe username
     */
    async usernameExists(username) {
        const count = await this.db('users')
            .where({ username })
            .count('* as count')
            .first();
        return Number(count?.count) > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map