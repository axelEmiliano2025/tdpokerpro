import { Request, Response } from 'express';
import { RegistrationService } from '../services/RegistrationService';
import { RegisterPlayerDTO } from '@tdpokerpro/shared-types';

export class RegistrationController {
    constructor(private registrationService: RegistrationService) { }

    async registerPlayer(req: Request, res: Response): Promise<void> {
        try {
            const dto: RegisterPlayerDTO = req.body;
            const entry = await this.registrationService.registerPlayer(dto);
            res.status(201).json({ success: true, data: entry });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async getPlayerEntries(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id, player_id } = req.params;
            if (!tournament_id || !player_id) {
                res.status(400).json({ success: false, error: { message: 'Missing tournament_id or player_id' } });
                return;
            }
            const entries = await this.registrationService.getPlayerEntries(tournament_id, player_id);
            res.json({ success: true, data: entries });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async getActivePlayers(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id } = req.params;
            if (!tournament_id) {
                res.status(400).json({ success: false, error: { message: 'Missing tournament_id' } });
                return;
            }
            const players = await this.registrationService.getActivePlayers(tournament_id);
            res.json({ success: true, data: players });
        } catch (error) {
            res.status(500).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async eliminatePlayer(req: Request, res: Response): Promise<void> {
        try {
            const { entry_id } = req.params;
            const { position, prize } = req.body;

            if (!entry_id) {
                res.status(400).json({ success: false, error: { message: 'Missing entry_id' } });
                return;
            }

            const result = await this.registrationService.eliminatePlayer(
                entry_id,
                position,
                prize
            );
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async recordBountyWon(req: Request, res: Response): Promise<void> {
        try {
            const { to_entry_id, from_entry_id, chips } = req.body;

            if (!to_entry_id || !from_entry_id || !chips) {
                res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
                return;
            }

            await this.registrationService.recordBountyWon(
                to_entry_id,
                from_entry_id,
                chips
            );
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }
}
