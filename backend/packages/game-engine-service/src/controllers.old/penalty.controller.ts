import { Controller, Get, Param } from '@nestjs/common';
import { PenaltyService } from '../services/penalty.service';

@Controller('penalties')
export class PenaltyController {
    constructor(private penaltyService: PenaltyService) { }

    @Get(':tournamentId')
    async getPenalties(@Param('tournamentId') tournamentId: string) {
        const penalties = await this.penaltyService.getPenalties(tournamentId);
        return { success: true, data: penalties };
    }
}
