import { Controller, Get, Param } from '@nestjs/common';
import { SeatingService } from '../services/seating.service';

@Controller('seating')
export class SeatingController {
    constructor(private seatingService: SeatingService) { }

    @Get(':tournamentId')
    async getSeatingAssignments(@Param('tournamentId') tournamentId: string) {
        const seating = await this.seatingService.getSeatingAssignments(tournamentId);
        return { success: true, data: seating };
    }
}
