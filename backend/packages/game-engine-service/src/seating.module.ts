import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatingAssignment } from '@tdpokerpro/database';
import { SeatingService } from './services/seating.service';
import { SeatingController } from './controllers/seating.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SeatingAssignment])],
    controllers: [SeatingController],
    providers: [SeatingService],
    exports: [SeatingService],
})
export class SeatingModule { }
