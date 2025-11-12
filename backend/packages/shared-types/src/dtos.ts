/**
 * Data Transfer Objects (DTOs) for API requests and responses
 */

import { UserRole, TournamentStatus, PostVisibility } from './enums';

// ========================================
// AUTH DTOs
// ========================================

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        role: UserRole;
        username: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

// ========================================
// USER DTOs
// ========================================

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    country?: string;
    city?: string;
    avatarUrl?: string;
    preferredLanguage?: string;
}

export interface UserProfileResponse {
    id: string;
    userId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    city?: string;
    createdAt: Date;
}

// ========================================
// TOURNAMENT DTOs
// ========================================

export interface CreateTournamentRequest {
    name: string;
    description?: string;
    tournamentType: string;
    buyInAmount: number;
    rebuyAmount?: number;
    addonAmount?: number;
    startingChips: number;
    maxPlayers: number;
    minPlayers: number;
    playersPerTable: number;
    lateRegistrationLevel?: number;
    levelDurationMinutes: number;
    scheduledStartTime?: Date;
    blindsStructure: {
        level: number;
        smallBlind: number;
        bigBlind: number;
        ante?: number;
        durationMinutes: number;
    }[];
}

export interface UpdateTournamentRequest {
    name?: string;
    description?: string;
    status?: TournamentStatus;
    scheduledStartTime?: Date;
}

export interface TournamentResponse {
    id: string;
    name: string;
    description?: string;
    status: TournamentStatus;
    buyInAmount: number;
    startingChips: number;
    maxPlayers: number;
    currentPlayers: number;
    scheduledStartTime?: Date;
    actualStartTime?: Date;
    createdBy: string;
    createdAt: Date;
}

export interface RegisterTournamentRequest {
    tournamentId: string;
}

export interface TournamentParticipantResponse {
    id: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    chipCount: number;
    tableNumber?: number;
    seatNumber?: number;
    finishPosition?: number;
    prizeAmount?: number;
}

// ========================================
// TRANSACTION DTOs
// ========================================

export interface CreateTransactionRequest {
    userId: string;
    type: string;
    amount: number;
    tournamentId?: string;
    description?: string;
}

export interface TransactionResponse {
    id: string;
    type: string;
    amount: number;
    status: string;
    balanceBefore: number;
    balanceAfter: number;
    description?: string;
    createdAt: Date;
}

// ========================================
// SOCIAL DTOs
// ========================================

export interface CreatePostRequest {
    content: string;
    tournamentId?: string;
    mediaUrls?: string[];
    visibility?: PostVisibility;
}

export interface UpdatePostRequest {
    content?: string;
    visibility?: PostVisibility;
}

export interface PostResponse {
    id: string;
    user: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    content: string;
    mediaUrls?: string[];
    visibility: PostVisibility;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    isLikedByCurrentUser?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCommentRequest {
    postId: string;
    content: string;
    parentCommentId?: string;
}

export interface CommentResponse {
    id: string;
    user: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    content: string;
    likesCount: number;
    isLikedByCurrentUser?: boolean;
    createdAt: Date;
}

// ========================================
// BAR DTOs
// ========================================

export interface CreateBarOrderRequest {
    items: {
        productId: string;
        quantity: number;
    }[];
    tournamentId?: string;
    tableId?: string;
    notes?: string;
}

export interface BarOrderResponse {
    id: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        price: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    createdAt: Date;
}

// ========================================
// COMMON DTOs
// ========================================

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    timestamp: Date;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    timestamp: Date;
}

// ========================================
// GAME ENGINE - TOURNAMENT MANAGEMENT DTOs
// ========================================

export interface CreateTournamentDTO {
    name: string;
    game_type: string; // 'NLHE', 'PLO', 'OMAHA'
    buy_in_cents: number;
    rake_cents?: number;
    guarantee_cents?: number;
    starting_stack: number;
    seats_per_table?: number;
    max_tables?: number;

    // Registration Config
    late_registration_enabled?: boolean;
    late_registration_end_level?: number;
    rebuy_enabled?: boolean;
    rebuy_end_level?: number;
    addon_enabled?: boolean;
    addon_level?: number;

    // Blind Schedule
    blind_schedule: CreateBlindLevelDTO[];

    // Timing
    scheduled_start_time?: Date;
}

export interface UpdateTournamentDTO {
    name?: string;
    status?: TournamentStatus;
    guarantee_cents?: number;
    late_registration_end_level?: number;
    rebuy_end_level?: number;
    addon_level?: number;
}

export interface CreateBlindLevelDTO {
    level: number;
    small_blind: number;
    big_blind: number;
    antes: number;
    duration_minutes: number;
    late_registration_end?: boolean;
    rebuy_end?: boolean;
    addon_available?: boolean;
    is_break?: boolean;
    break_duration_minutes?: number;
}

export interface BlindLevelDTO extends CreateBlindLevelDTO {
    id: string;
    tournament_id: string;
}

export interface TournamentDTO {
    id: string;
    name: string;
    game_type: string;
    status: TournamentStatus;

    buy_in_cents: number;
    rake_cents: number;
    guarantee_cents?: number;

    starting_stack: number;
    seats_per_table: number;

    // Tournament options
    late_registration_enabled: boolean;
    late_registration_end_level?: number;
    rebuy_enabled: boolean;
    rebuy_end_level?: number;
    addon_enabled: boolean;
    addon_level?: number;

    current_blind_level?: number;
    current_blind?: BlindLevelDTO;
    blind_schedule: BlindLevelDTO[];

    created_by: string;
    created_at: Date;
    updated_at: Date;

    // Runtime info
    registered_players_count?: number;
    active_players_count?: number;
    tables_count?: number;
}

export interface TournamentListDTO {
    id: string;
    name: string;
    game_type: string;
    status: TournamentStatus;
    buy_in_cents: number;
    created_by: string;
    created_at: Date;
    registered_players_count?: number;
    active_players_count?: number;
}

export interface TournamentConfigDTO {
    buy_in_cents: number;
    rake_cents: number;
    guarantee_cents?: number;
    starting_stack: number;
    seats_per_table: number;

    late_registration_enabled: boolean;
    late_registration_end_level?: number;
    rebuy_enabled: boolean;
    rebuy_end_level?: number;
    addon_enabled: boolean;
    addon_level?: number;
}

export interface TournamentValidationDTO {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
