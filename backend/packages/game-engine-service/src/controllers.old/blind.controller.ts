import { Controller, Get, Param } from '@nestjs/common';
import { BlindService } from '../services/blind.service';

@Controller('blinds')
export class BlindController {
    constructor(private blindService: BlindService) { }

    @Get(':tournamentId')
    async getBlindSchedule(@Param('tournamentId') tournamentId: string) {
        const blinds = await this.blindService.getBlindSchedule(tournamentId);
        return { success: true, data: blinds };
    }
}
