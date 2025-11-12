import { Request, Response } from 'express';
import { TournamentService } from '../services/TournamentService';
import { CreateTournamentDTO, UpdateTournamentDTO } from '@tdpokerpro/shared-types';

export class TournamentController {
    constructor(private tournamentService: TournamentService) { }

    createTournament = async (req: Request, res: Response): Promise<void> => {
        try {
            const dto: CreateTournamentDTO = req.body;
            // TODO: Get userId from auth context
            const userId = 'admin'; // Placeholder
            const tournament = await this.tournamentService.createTournament(dto, userId);
            res.status(201).json({ success: true, data: tournament });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: (error as Error).message },
            });
        }
    };

    getTournament = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: { message: 'Tournament ID is required' },
                });
                return;
            }

            const tournament = await this.tournamentService.getTournament(id);

            if (!tournament) {
                res.status(404).json({
                    success: false,
                    error: { message: 'Tournament not found' },
                });
                return;
            }

            res.json({ success: true, data: tournament });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: (error as Error).message },
            });
        }
    };

    listTournaments = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status, created_by } = req.query;
            const tournaments = await this.tournamentService.listTournaments({
                status: status as string,
                created_by: created_by as string,
            });
            res.json({ success: true, data: tournaments });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: (error as Error).message },
            });
        }
    };

    updateTournament = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: { message: 'Tournament ID is required' },
                });
                return;
            }

            const dto: UpdateTournamentDTO = req.body;
            const tournament = await this.tournamentService.updateTournament(id, dto);
            res.json({ success: true, data: tournament });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: (error as Error).message },
            });
        }
    };

    deleteTournament = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: { message: 'Tournament ID is required' },
                });
                return;
            }

            await this.tournamentService.deleteTournament(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: (error as Error).message },
            });
        }
    };
}
