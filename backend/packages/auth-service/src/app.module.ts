import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '@tdpokerpro/database';
import { AuthModule } from './auth.module';

/**
 * Root Application Module
 */
@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...AppDataSource.options,
            autoLoadEntities: true,
        }),
        AuthModule,
    ],
})
export class AppModule { }
