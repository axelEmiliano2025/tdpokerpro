import { Request, Response } from 'express';
import { BlindManagementService } from '../services/BlindManagementService';

export class BlindManagementController {
    constructor(private blindService: BlindManagementService) { }

    /**
     * POST /blinds/:tournament_id/initialize
     * Initialize blind tracking for a tournament
     */
    initializeBlindTracking = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            const result = await this.blindService.initializeBlindTracking(tournament_id);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error initializing blind tracking:', error);
            res.status(400).json({
                error: 'Failed to initialize blind tracking',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * POST /blinds/:tournament_id/advance-auto
     * Auto-advance to next blind level
     */
    autoAdvanceBlind = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            const result = await this.blindService.autoAdvanceBlind(tournament_id);
            res.json(result);
        } catch (error) {
            console.error('Error auto-advancing blind:', error);
            res.status(400).json({
                error: 'Failed to auto-advance blind',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * POST /blinds/:tournament_id/advance-manual
     * Manually advance blind levels (TD override)
     */
    manualAdvanceBlind = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;
            const { levels } = req.body;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            if (!levels || typeof levels !== 'number') {
                res.status(400).json({ error: 'Missing or invalid levels parameter' });
                return;
            }

            const result = await this.blindService.manualAdvanceBlind(tournament_id, levels);
            res.json(result);
        } catch (error) {
            console.error('Error manually advancing blind:', error);
            res.status(400).json({
                error: 'Failed to manually advance blind',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * POST /blinds/:tournament_id/break
     * Start or end a break
     */
    setBreak = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;
            const { is_break } = req.body;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            if (typeof is_break !== 'boolean') {
                res.status(400).json({ error: 'Missing or invalid is_break parameter' });
                return;
            }

            const result = await this.blindService.setBreak(tournament_id, is_break);
            res.json(result);
        } catch (error) {
            console.error('Error setting break:', error);
            res.status(400).json({
                error: 'Failed to set break',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * POST /blinds/:tournament_id/color-up
     * Create a color-up race
     */
    createColorUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;
            const { blind_level, old_chip_value, new_chip_value, is_race } = req.body;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            if (!blind_level || !old_chip_value || !new_chip_value || typeof is_race !== 'boolean') {
                res.status(400).json({
                    error: 'Missing required fields: blind_level, old_chip_value, new_chip_value, is_race'
                });
                return;
            }

            const result = await this.blindService.createColorUpRace({
                tournament_id,
                blind_level,
                old_chip_value,
                new_chip_value,
                is_race
            });

            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating color-up:', error);
            res.status(400).json({
                error: 'Failed to create color-up',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * POST /blinds/:tournament_id/color-up/:color_up_id/execute
     * Execute a color-up race
     */
    executeColorUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { color_up_id } = req.params;

            if (!color_up_id) {
                res.status(400).json({ error: 'Missing color_up_id' });
                return;
            }

            const result = await this.blindService.executeColorUpRace(color_up_id);
            res.json(result);
        } catch (error) {
            console.error('Error executing color-up:', error);
            res.status(400).json({
                error: 'Failed to execute color-up',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * GET /blinds/:tournament_id/status
     * Get current blind management status
     */
    getBlindStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tournament_id } = req.params;

            if (!tournament_id) {
                res.status(400).json({ error: 'Missing tournament_id' });
                return;
            }

            const result = await this.blindService.getBlindStatus(tournament_id);
            res.json(result);
        } catch (error) {
            console.error('Error getting blind status:', error);
            res.status(400).json({
                error: 'Failed to get blind status',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
