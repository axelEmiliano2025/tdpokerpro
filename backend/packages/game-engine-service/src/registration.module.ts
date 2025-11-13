import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntry } from '@tdpokerpro/database';
import { RegistrationService } from './services/registration.service';
import { RegistrationController } from './controllers/registration.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PlayerEntry])],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegistrationModule { }
