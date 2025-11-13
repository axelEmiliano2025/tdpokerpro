import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament, BlindSchedule } from '@tdpokerpro/database';
import { TournamentService } from './services/tournament.service';
import { TournamentController } from './controllers/tournament.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tournament, BlindSchedule])],
    controllers: [TournamentController],
    providers: [TournamentService],
    exports: [TournamentService],
})
export class TournamentModule { }
