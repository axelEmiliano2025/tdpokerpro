import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '@tdpokerpro/database';
import { UserModule } from './user.module';

/**
 * Root Application Module
 */
@Module({
    imports: [
        // TypeORM configuration (using existing AppDataSource)
        TypeOrmModule.forRoot({
            ...AppDataSource.options,
            autoLoadEntities: true,
        }),
        UserModule,
    ],
})
export class AppModule { }
