import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '@tdpokerpro/database';
import { TournamentModule } from './tournament.module';
import { BlindModule } from './blind.module';
import { SeatingModule } from './seating.module';
import { PenaltyModule } from './penalty.module';
import { RegistrationModule } from './registration.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TournamentModule,
        BlindModule,
        SeatingModule,
        PenaltyModule,
        RegistrationModule,
    ],
})
export class AppModule { }
