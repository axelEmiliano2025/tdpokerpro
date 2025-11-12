// TDA Rule Validators

export function validateBlindProportion(
    sb: number,
    bb: number
): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // BB debería ser ~2x SB (Rule 23 TDA)
    if (bb < sb * 1.5) {
        warnings.push(`BB debería ser >= 1.5x SB`);
    }
    if (bb > sb * 4) {
        warnings.push(`BB muy alto comparado a SB`);
    }

    return {
        valid: warnings.length === 0,
        warnings,
    };
}

export function validateRaiseAmount(
    previousBet: number,
    currentBet: number
): { valid: boolean; message?: string } {
    // Rule 43 TDA: Raise must be at least equal to previous bet
    if (currentBet < previousBet) {
        return { valid: false, message: 'Raise must be at least equal to previous bet' };
    }
    return { valid: true };
}

export function validateChipCount(
    expected: number,
    actual: number
): { valid: boolean; variance: number; message?: string } {
    const variance = expected - actual;

    if (variance === 0) {
        return { valid: true, variance: 0 };
    }

    if (variance > 0) {
        return {
            valid: false,
            variance,
            message: `Missing ${variance} chips. Cannot close tournament.`,
        };
    }

    return {
        valid: false,
        variance: Math.abs(variance),
        message: `Excess ${Math.abs(variance)} chips. Verify chip counts.`,
    };
}
