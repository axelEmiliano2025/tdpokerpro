/**
 * Helper Utility Functions
 */

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Format currency (BRL by default)
 */
export function formatCurrency(amount: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
    total: number,
    page: number = 1,
    limit: number = 20
): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
} {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}

/**
 * Sanitize object by removing null/undefined values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
    ) as Partial<T>;
}

/**
 * Delay execution (useful for retry logic)
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: {
        retries?: number;
        delay?: number;
        onRetry?: (error: Error, attempt: number) => void;
    } = {}
): Promise<T> {
    const { retries = 3, delay = 1000, onRetry } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (attempt < retries) {
                if (onRetry) {
                    onRetry(lastError, attempt);
                }
                await sleep(delay * attempt);
            }
        }
    }

    throw lastError!;
}

/**
 * Check if value is a valid UUID
 */
export function isUUID(value: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export default {
    sleep,
    generateRandomString,
    formatCurrency,
    calculatePagination,
    sanitizeObject,
    retry,
    isUUID,
    snakeToCamel,
    camelToSnake,
    deepClone,
};
