import { Knex } from 'knex';
import { TournamentDTO, BlindLevelDTO } from '@tdpokerpro/shared-types';

export class TournamentRepository {
    constructor(private db: Knex) { }

    async create(data: {
        created_by: string;
        name: string;
        game_type: string;
        buy_in_cents: number;
        rake_cents: number;
        starting_stack: number;
        seats_per_table: number;
        max_tables?: number;
        scheduled_start_time?: Date;
        blind_schedule: Array<{
            level: number;
            small_blind: number;
            big_blind: number;
            antes: number;
            duration_minutes: number;
            is_break?: boolean;
            break_duration_minutes?: number;
        }>;
    }): Promise<TournamentDTO> {
        const trx = await this.db.transaction();

        try {
            // Create tournament
            const [tournament] = await trx('tournaments')
                .insert({
                    created_by: data.created_by,
                    name: data.name,
                    game_type: data.game_type,
                    buy_in_cents: data.buy_in_cents,
                    rake_cents: data.rake_cents,
                    starting_stack: data.starting_stack,
                    seats_per_table: data.seats_per_table,
                    max_tables: data.max_tables,
                    scheduled_start_time: data.scheduled_start_time,
                    status: 'REGISTRATION',
                })
                .returning('*');

            // Create blind schedule
            for (const blind of data.blind_schedule) {
                await trx('tournament_blind_schedules').insert({
                    tournament_id: tournament.id,
                    level: blind.level,
                    small_blind: blind.small_blind,
                    big_blind: blind.big_blind,
                    antes: blind.antes,
                    duration_minutes: blind.duration_minutes,
                    is_break: blind.is_break || false,
                    break_duration_minutes: blind.break_duration_minutes,
                });
            }

            await trx.commit();
            return this.getById(tournament.id) as Promise<TournamentDTO>;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async getById(id: string): Promise<TournamentDTO | null> {
        const result = await this.db('tournaments as t')
            .select(
                't.*',
                this.db.raw('COUNT(DISTINCT pe.id)::int as registered_players_count')
            )
            .leftJoin('player_entries as pe', function () {
                this.on('t.id', '=', 'pe.tournament_id').andOnVal('pe.status', '!=', 'PAID_OUT');
            })
            .where('t.id', id)
            .groupBy('t.id')
            .first();

        if (!result) return null;

        // Get blind schedule
        const blindSchedule = await this.db('tournament_blind_schedules')
            .where({ tournament_id: id })
            .orderBy('level', 'asc');

        return {
            ...result,
            blind_schedule: blindSchedule,
            current_blind_level: 1,
        };
    }

    async getAll(filters?: { status?: string; created_by?: string }): Promise<TournamentDTO[]> {
        let query = this.db('tournaments as t')
            .select(
                't.*',
                this.db.raw('COUNT(DISTINCT pe.id)::int as registered_players_count')
            )
            .leftJoin('player_entries as pe', function () {
                this.on('t.id', '=', 'pe.tournament_id').andOnVal('pe.status', '!=', 'PAID_OUT');
            });

        if (filters?.status) {
            query = query.where('t.status', filters.status);
        }

        if (filters?.created_by) {
            query = query.where('t.created_by', filters.created_by);
        }

        const tournaments = await query.groupBy('t.id').orderBy('t.created_at', 'desc');

        // Get blind schedules for all tournaments
        const result = [];
        for (const tournament of tournaments) {
            const blindSchedule = await this.db('tournament_blind_schedules')
                .where({ tournament_id: tournament.id })
                .orderBy('level', 'asc');

            result.push({
                ...tournament,
                blind_schedule: blindSchedule,
                current_blind_level: 1,
            });
        }

        return result;
    }

    async update(
        id: string,
        data: Partial<{
            name: string;
            status: string;
            guarantee_cents: number;
        }>
    ): Promise<TournamentDTO> {
        await this.db('tournaments')
            .where({ id })
            .update({
                ...data,
                updated_at: this.db.fn.now(),
            });

        return this.getById(id) as Promise<TournamentDTO>;
    }

    async delete(id: string): Promise<void> {
        await this.db('tournaments').where({ id }).del();
    }

    async getBlindSchedule(tournamentId: string): Promise<BlindLevelDTO[]> {
        return this.db('tournament_blind_schedules')
            .where({ tournament_id: tournamentId })
            .orderBy('level', 'asc');
    }

    async addBlindLevel(tournamentId: string, blind: any): Promise<BlindLevelDTO> {
        const [result] = await this.db('tournament_blind_schedules')
            .insert({
                tournament_id: tournamentId,
                level: blind.level,
                small_blind: blind.small_blind,
                big_blind: blind.big_blind,
                antes: blind.antes,
                duration_minutes: blind.duration_minutes,
            })
            .returning('*');

        return result;
    }
}
