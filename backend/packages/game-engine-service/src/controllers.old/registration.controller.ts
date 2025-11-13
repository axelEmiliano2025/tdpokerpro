import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RegistrationService } from '../services/registration.service';
import { RegisterPlayerDTO } from '@tdpokerpro/shared-types';

@Controller('registration')
export class RegistrationController {
    constructor(private registrationService: RegistrationService) { }

    @Post()
    async registerPlayer(@Body() dto: RegisterPlayerDTO) {
        const entry = await this.registrationService.registerPlayer(dto);
        return { success: true, data: entry };
    }

    @Get(':tournamentId/players/:playerId')
    async getPlayerEntries(
        @Param('tournamentId') tournamentId: string,
        @Param('playerId') playerId: string,
    ) {
        const entries = await this.registrationService.getPlayerEntries(
            tournamentId,
            playerId,
        );
        return { success: true, data: entries };
    }

    @Get(':tournamentId/active')
    async getActivePlayers(@Param('tournamentId') tournamentId: string) {
        const entries = await this.registrationService.getActivePlayers(tournamentId);
        return { success: true, data: entries };
    }
}
