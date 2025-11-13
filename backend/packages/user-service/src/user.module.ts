import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@tdpokerpro/database';
import { UserService } from './services/user.service';

/**
 * User Module
 * Manages user profiles, wallets, and statistics
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
