import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlindSchedule } from '@tdpokerpro/database';
import { BlindService } from './services/blind.service';
import { BlindController } from './controllers/blind.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlindSchedule])],
    controllers: [BlindController],
    providers: [BlindService],
    exports: [BlindService],
})
export class BlindModule { }
