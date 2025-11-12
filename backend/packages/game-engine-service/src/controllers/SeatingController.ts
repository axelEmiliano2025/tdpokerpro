import { Request, Response } from 'express';
import { SeatingService } from '../services/SeatingService';

export class SeatingController {
    constructor(private seatingService: SeatingService) { }

    async performInitialSeating(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id } = req.params;
            if (!tournament_id) {
                res.status(400).json({ success: false, error: { message: 'Missing tournament_id' } });
                return;
            }
            const result = await this.seatingService.performInitialSeating(tournament_id);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async seatLateRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id, player_entry_id } = req.params;
            if (!tournament_id || !player_entry_id) {
                res.status(400).json({ success: false, error: { message: 'Missing parameters' } });
                return;
            }
            const result = await this.seatingService.seatLateRegistration(tournament_id, player_entry_id);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async breakTable(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id, table_number } = req.params;
            if (!tournament_id || !table_number) {
                res.status(400).json({ success: false, error: { message: 'Missing parameters' } });
                return;
            }
            const result = await this.seatingService.breakTableDoubleRandom(tournament_id, parseInt(table_number));
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async balanceTables(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id } = req.params;
            if (!tournament_id) {
                res.status(400).json({ success: false, error: { message: 'Missing tournament_id' } });
                return;
            }
            const result = await this.seatingService.balanceTables(tournament_id);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async checkHaltingPlay(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id } = req.params;
            if (!tournament_id) {
                res.status(400).json({ success: false, error: { message: 'Missing tournament_id' } });
                return;
            }
            const result = await this.seatingService.detectHaltingPlay(tournament_id);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }

    async getPlayerSeating(req: Request, res: Response): Promise<void> {
        try {
            const { tournament_id, player_id } = req.params;
            if (!tournament_id || !player_id) {
                res.status(400).json({ success: false, error: { message: 'Missing parameters' } });
                return;
            }
            const result = await this.seatingService.getPlayerSeating(player_id, tournament_id);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: { message: (error as Error).message } });
        }
    }
}
