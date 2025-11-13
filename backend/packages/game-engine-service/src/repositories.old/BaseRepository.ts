import { Repository, FindOptionsWhere, FindOptionsOrder, FindOptionsRelations, ObjectLiteral, DeepPartial, EntityTarget } from 'typeorm';
import { AppDataSource } from '@tdpokerpro/database';

/**
 * Generic Base Repository
 * Provides common CRUD operations for all repositories
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
    protected repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async findById(id: string, relations?: FindOptionsRelations<T>): Promise<T | null> {
        return this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<T>,
            relations,
        });
    }

    async findAll(
        where?: FindOptionsWhere<T>,
        order?: FindOptionsOrder<T>,
        relations?: FindOptionsRelations<T>,
        limit?: number,
        offset?: number
    ): Promise<T[]> {
        return this.repository.find({
            where,
            order,
            relations,
            take: limit,
            skip: offset,
        });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: string, data: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected || 0) > 0;
    }

    async count(where?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where });
    }
}