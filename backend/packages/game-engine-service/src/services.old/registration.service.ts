import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntry } from '@tdpokerpro/database';
import {
    RegisterPlayerDTO,
    PlayerEntryDTO,
    EntryType,
} from '@tdpokerpro/shared-types';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(PlayerEntry)
        private entryRepository: Repository<PlayerEntry>,
    ) { }

    async registerPlayer(dto: RegisterPlayerDTO): Promise<PlayerEntryDTO> {
        const entry = this.entryRepository.create({
            tournament_id: dto.tournament_id,
            player_id: dto.player_id,
            entry_number: 1,
            entry_type: dto.entry_type,
            buy_in_cents: dto.buy_in_cents,
            starting_stack: 10000,
        });

        const saved = await this.entryRepository.save(entry);
        return this.mapToDTO(saved);
    } async getPlayerEntries(
        tournamentId: string,
        playerId: string,
    ): Promise<PlayerEntryDTO[]> {
        const entries = await this.entryRepository.find({
            where: { tournament_id: tournamentId, player_id: playerId },
        });

        return entries.map((e) => this.mapToDTO(e));
    }

    async getActivePlayers(tournamentId: string): Promise<PlayerEntryDTO[]> {
        const entries = await this.entryRepository.find({
            where: { tournament_id: tournamentId, status: 'ACTIVE' },
        });

        return entries.map((e) => this.mapToDTO(e));
    }

    private mapToDTO(entry: PlayerEntry): PlayerEntryDTO {
        return {
            id: entry.id,
            tournament_id: entry.tournament_id,
            player_id: entry.player_id,
            entry_number: entry.entry_number,
            entry_type: entry.entry_type as EntryType,
            status: entry.status as any,
            buy_in_cents: entry.buy_in_cents,
            starting_stack: entry.starting_stack,
            current_stack: entry.current_stack,
            created_at: entry.createdAt,
        };
    }
}