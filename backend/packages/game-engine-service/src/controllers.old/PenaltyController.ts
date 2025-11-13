import { Request, Response } from 'express';
import { Pool } from 'pg';
import { PenaltyService } from '../services/PenaltyService';
import { ImposePenaltyDTO } from '@tdpokerpro/shared-types';

export class PenaltyController {
    private service: PenaltyService;

    constructor(pool: Pool) {
        this.service = new PenaltyService(pool);
    }

    /**
     * POST /api/penalties
     * Impose a penalty on a player
     */
    imposePenalty = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: ImposePenaltyDTO = req.body;

            // Validate required fields
            if (!data.tournament_id || !data.player_entry_id || !data.infraction_type || !data.imposed_by) {
                res.status(400).json({
                    error: 'Missing required fields: tournament_id, player_entry_id, infraction_type, imposed_by'
                });
                return;
            }

            const penalty = await this.service.imposePenalty(data);

            res.status(201).json(penalty);
        } catch (error) {
            console.error('Error imposing penalty:', error);
            res.status(500).json({
                error: 'Failed to impose penalty',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * GET /api/penalties/player/:tournamentId/:playerEntryId
     * Get penalty history for a player
     */
    getPlayerPenaltyHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const tournamentId = parseInt(req.params.tournamentId || '', 10);
            const playerEntryId = parseInt(req.params.playerEntryId || '', 10);

            if (isNaN(tournamentId) || isNaN(playerEntryId)) {
                res.status(400).json({ error: 'Invalid tournamentId or playerEntryId' });
                return;
            }

            const history = await this.service.getPlayerPenaltyHistory(
                tournamentId,
                playerEntryId
            );

            res.status(200).json(history);
        } catch (error) {
            console.error('Error getting player penalty history:', error);
            res.status(500).json({
                error: 'Failed to retrieve penalty history',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * GET /api/penalties/tournament/:tournamentId
     * Get all penalties for a tournament
     */
    getTournamentPenalties = async (req: Request, res: Response): Promise<void> => {
        try {
            const tournamentId = parseInt(req.params.tournamentId || '', 10);

            if (isNaN(tournamentId)) {
                res.status(400).json({ error: 'Invalid tournamentId' });
                return;
            }

            const penalties = await this.service.getTournamentPenalties(tournamentId);

            res.status(200).json(penalties);
        } catch (error) {
            console.error('Error getting tournament penalties:', error);
            res.status(500).json({
                error: 'Failed to retrieve tournament penalties',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * GET /api/penalties/status/:tournamentId/:playerEntryId
     * Get current penalty status for a player
     */
    getPlayerPenaltyStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const tournamentId = parseInt(req.params.tournamentId || '', 10);
            const playerEntryId = parseInt(req.params.playerEntryId || '', 10);

            if (isNaN(tournamentId) || isNaN(playerEntryId)) {
                res.status(400).json({ error: 'Invalid tournamentId or playerEntryId' });
                return;
            }

            const status = await this.service.getPlayerPenaltyStatus(
                tournamentId,
                playerEntryId
            );

            res.status(200).json(status);
        } catch (error) {
            console.error('Error getting player penalty status:', error);
            res.status(500).json({
                error: 'Failed to retrieve penalty status',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
