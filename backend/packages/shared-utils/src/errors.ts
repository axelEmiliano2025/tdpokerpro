/**
 * Custom Error Classes
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
    }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
    constructor(
        message: string,
        public details?: Array<{ field: string; message: string }>
    ) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

/**
 * Internal Server Error
 */
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
    }
}

export default {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    ConflictError,
    ValidationError,
    InternalServerError,
};
