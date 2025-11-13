import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TournamentService } from '../services/tournament.service';
import { CreateTournamentDTO, UpdateTournamentDTO } from '@tdpokerpro/shared-types';

@Controller('tournaments')
export class TournamentController {
    constructor(private tournamentService: TournamentService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTournament(@Body() dto: CreateTournamentDTO) {
        // TODO: Get userId from auth context
        const userId = 'admin';
        const tournament = await this.tournamentService.createTournament(dto, userId);
        return { success: true, data: tournament };
    }

    @Get(':id')
    async getTournament(@Param('id') id: string) {
        const tournament = await this.tournamentService.getTournament(id);

        if (!tournament) {
            return {
                success: false,
                error: { message: 'Tournament not found' },
            };
        }

        return { success: true, data: tournament };
    }

    @Get()
    async listTournaments(
        @Query('status') status?: string,
        @Query('created_by') createdBy?: string,
    ) {
        const tournaments = await this.tournamentService.listTournaments({
            status,
            created_by: createdBy,
        });
        return { success: true, data: tournaments };
    }

    @Put(':id')
    async updateTournament(
        @Param('id') id: string,
        @Body() dto: UpdateTournamentDTO,
    ) {
        const tournament = await this.tournamentService.updateTournament(id, dto);
        return { success: true, data: tournament };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTournament(@Param('id') id: string) {
        await this.tournamentService.deleteTournament(id);
    }
}
