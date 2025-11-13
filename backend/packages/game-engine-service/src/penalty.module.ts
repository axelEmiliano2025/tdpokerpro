import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalty } from '@tdpokerpro/database';
import { PenaltyService } from './services/penalty.service';
import { PenaltyController } from './controllers/penalty.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Penalty])],
    controllers: [PenaltyController],
    providers: [PenaltyService],
    exports: [PenaltyService],
})
export class PenaltyModule { }
