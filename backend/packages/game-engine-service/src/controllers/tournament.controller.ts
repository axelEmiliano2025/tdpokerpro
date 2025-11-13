import { Controller, Get, Param } from '@nestjs/common';
import { TournamentService } from '../services/tournament.service';
@Controller('tournaments')
export class TournamentController {
  constructor(private svc: TournamentService) {}
  @Get() async findAll() { return { success: true, data: await this.svc.findAll() }; }
  @Get(':id') async findOne(@Param('id') id: string) { return { success: true, data: await this.svc.findOne(id) }; }
}
