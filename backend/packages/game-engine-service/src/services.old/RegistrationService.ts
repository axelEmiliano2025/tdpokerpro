import { PlayerEntryRepository } from '../repositories/PlayerEntryRepository';
import { TournamentRepository } from '../repositories/TournamentRepository';
import {
    RegisterPlayerDTO,
    PlayerEntryDTO,
    RegistrationValidationDTO,
    UpdatePlayerEntryDTO,
    EntryType,
    TournamentDTO,
} from '@tdpokerpro/shared-types';

export class RegistrationService {
    constructor(
        private entryRepository: PlayerEntryRepository,
        private tournamentRepository: TournamentRepository
    ) { }

    async registerPlayer(dto: RegisterPlayerDTO): Promise<PlayerEntryDTO> {
        // Validar torneo existe y obtener config
        const tournament = await this.tournamentRepository.getById(dto.tournament_id);
        if (!tournament) {
            throw new Error('Tournament not found');
        }

        // Validar si el registro es permitido
        const validation = await this.validateRegistration(dto, tournament);
        if (!validation.valid) {
            throw new Error(`Registration failed: ${validation.errors.join(', ')}`);
        }

        // Obtener número de entrada siguiente
        const lastEntryNumber = await this.entryRepository.getLastEntryNumber(
            dto.tournament_id,
            dto.player_id
        );
        const entryNumber = lastEntryNumber + 1;

        // Crear entrada
        const entry = await this.entryRepository.create({
            tournament_id: dto.tournament_id,
            player_id: dto.player_id,
            entry_number: entryNumber,
            entry_type: dto.entry_type,
            buy_in_cents: dto.buy_in_cents,
            starting_stack: tournament.starting_stack,
            bounty_chips: dto.bounty_chips
        });

        // Si es re-entry, eliminar entrada anterior
        if (dto.entry_type === EntryType.REENTRY && entryNumber > 1) {
            const prevEntry = await this.entryRepository.getByTournamentAndPlayer(
                dto.tournament_id,
                dto.player_id
            );

            const lastActive = prevEntry.find(e => e.status === 'ACTIVE');
            if (lastActive) {
                await this.entryRepository.update(lastActive.id, { status: 'ELIMINATED' });
            }
        }

        return entry;
    }

    async validateRegistration(
        dto: RegisterPlayerDTO,
        tournament: TournamentDTO
    ): Promise<RegistrationValidationDTO> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validar torneo está en estado REGISTERING o RUNNING
        if (tournament.status !== 'registering' && tournament.status !== 'running') {
            errors.push(`Tournament is in ${tournament.status} status, cannot register`);
        }

        // Validar entry type específico
        switch (dto.entry_type) {
            case EntryType.INITIAL:
                if (tournament.status !== 'registering') {
                    errors.push('Initial registration only allowed during REGISTERING status');
                }
                break;

            case EntryType.LATE_REG:
                if (!tournament.late_registration_enabled) {
                    errors.push('Late registration is not enabled for this tournament');
                }
                // TODO: Check current blind level vs late_registration_end_level
                break;

            case EntryType.REBUY:
                if (!tournament.rebuy_enabled) {
                    errors.push('Rebuy is not enabled for this tournament');
                }
                // TODO: Check current blind level vs rebuy_end_level
                break;

            case EntryType.ADDON:
                if (!tournament.addon_enabled) {
                    errors.push('Add-on is not enabled for this tournament');
                }
                // TODO: Check current blind level vs addon_level
                break;

            case EntryType.REENTRY:
                // Always allowed until late registration ends
                break;
        }

        // Validar buy-in
        if (dto.buy_in_cents !== tournament.buy_in_cents) {
            errors.push(`Buy-in must match tournament buy-in of ${tournament.buy_in_cents} cents`);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            reason: errors.length > 0 ? errors[0] : undefined
        };
    }

    async updatePlayerEntry(id: string, dto: UpdatePlayerEntryDTO): Promise<PlayerEntryDTO> {
        return this.entryRepository.update(id, dto);
    }

    async eliminatePlayer(entryId: string, position: number, prize?: number): Promise<PlayerEntryDTO> {
        return this.entryRepository.update(entryId, {
            status: 'ELIMINATED',
            finishing_position: position,
            finishing_prize_cents: prize,
            busted_at: new Date()
        });
    }

    async getPlayerEntries(tournamentId: string, playerId: string): Promise<PlayerEntryDTO[]> {
        return this.entryRepository.getByTournamentAndPlayer(tournamentId, playerId);
    }

    async getActivePlayers(tournamentId: string): Promise<PlayerEntryDTO[]> {
        return this.entryRepository.getActivePlayers(tournamentId);
    }

    async recordBountyWon(toEntryId: string, fromEntryId: string, chips: number): Promise<void> {
        await this.entryRepository.addBountyWon(toEntryId, fromEntryId, chips);
    }
}
