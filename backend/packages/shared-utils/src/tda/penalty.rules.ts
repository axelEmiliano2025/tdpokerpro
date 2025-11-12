/**
 * TDA 2024 Rule 71 - Penalties and Infractions
 * Escalation logic: Warning → Minor → Major → Disqualification
 */

export class PenaltyRulesEngine {
    /**
     * Calculate next penalty level based on escalation
     * Rule 71: Penalties escalate with repeat infractions
     */
    calculateEscalation(
        previousLevel: number,
        _infractionType: string,
        withinTournament: boolean
    ): { level: number; automatic: boolean; reason: string } {

        // ESCALATION CHART (TDA Rule 71)
        const escalations: Record<number, { level: number; automatic: boolean; reason: string }> = {
            0: { level: 1, automatic: true, reason: 'Second infraction escalates to Minor Penalty' },
            1: { level: 2, automatic: true, reason: 'Third infraction escalates to Major Penalty' },
            2: { level: 3, automatic: true, reason: 'Fourth infraction results in Disqualification' }
        };

        if (previousLevel < 3 && withinTournament) {
            return escalations[previousLevel] || { level: 3, automatic: true, reason: 'Max escalation reached' };
        }

        return { level: 0, automatic: false, reason: 'No escalation' };
    }

    /**
     * Determine missed hands based on penalty level
     * Rule 71: Penalties result in sitting out hands
     */
    calculateMissedHands(penaltyLevel: number): number {
        const missedHands: Record<number, number> = {
            0: 0,      // VERBAL_WARNING: no hands missed
            1: 9,      // MINOR_PENALTY: 1 orbit (9 hands minimum)
            2: 18,     // MAJOR_PENALTY: 2 orbits (18 hands minimum)
            3: 999     // DISQUALIFICATION: removed from tournament
        };
        return missedHands[penaltyLevel] || 0;
    }

    /**
     * Determine if player should be removed from tournament
     */
    shouldRemovePlayer(penaltyLevel: number): boolean {
        return penaltyLevel === 3; // Only disqualification removes
    }

    /**
     * Validate penalty can be imposed
     */
    validatePenalty(
        previousLevel: number,
        newLevel: number,
        _withinTournament: boolean
    ): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Cannot impose penalty if already disqualified
        if (previousLevel === 3) {
            errors.push('Player is already disqualified');
        }

        // Level must be increasing (no downgrades)
        if (newLevel < previousLevel) {
            errors.push('Cannot downgrade penalty level');
        }

        // Can't skip levels (must escalate sequentially)
        if (newLevel > previousLevel + 1) {
            errors.push('Cannot skip penalty levels - must escalate sequentially');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Common infractions and recommended penalties (first offense)
     */
    getRecommendedPenaltyLevel(infractionType: string): number {
        const recommendations: Record<string, number> = {
            'ETIQUETTE_VIOLATION': 0,      // VERBAL_WARNING
            'CARD_EXPOSURE': 1,             // MINOR_PENALTY
            'STRING_BET': 1,                // MINOR_PENALTY
            'SOFT_PLAY': 2,                 // MAJOR_PENALTY
            'CHIP_DUMPING': 3,              // DISQUALIFICATION
            'COLLUSION': 3,                 // DISQUALIFICATION
            'DODGING_BLIND': 0,             // VERBAL_WARNING
            'DEVICE_MISUSE': 1,             // MINOR_PENALTY
            'ABUSIVE_CONDUCT': 2,           // MAJOR_PENALTY
            'LATE_TO_TABLE': 0,             // VERBAL_WARNING
            'ANGLE_SHOOTING': 1,            // MINOR_PENALTY
            'EXCESSIVE_TIME': 1             // MINOR_PENALTY
        };

        return recommendations[infractionType] ?? 0;
    }
}
