/**
 * Enums for TDPokerPro Platform
 */

// User Roles
export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    PLAYER = 'player',
    STAFF = 'staff',
}

// Tournament Status
export enum TournamentStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    REGISTERING = 'registering',
    RUNNING = 'running',
    PAUSED = 'paused',
    FINISHED = 'finished',
    CANCELLED = 'cancelled',
}

// Game Type
export enum GameType {
    TOURNAMENT = 'tournament',
    CASH_GAME = 'cash_game',
}

// Transaction Type
export enum TransactionType {
    BUY_IN = 'buy_in',
    REBUY = 'rebuy',
    ADDON = 'addon',
    CASHOUT = 'cashout',
    PRIZE = 'prize',
    EXPENSE = 'expense',
    BAR_PURCHASE = 'bar_purchase',
    TIP = 'tip',
}

// Transaction Status
export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

// Notification Type
export enum NotificationType {
    GAME_START = 'game_start',
    GAME_END = 'game_end',
    BREAK = 'break',
    NEXT_LEVEL = 'next_level',
    PRIZE = 'prize',
    SOCIAL = 'social',
    SYSTEM = 'system',
}

// Post Visibility
export enum PostVisibility {
    PUBLIC = 'public',
    FRIENDS = 'friends',
    PRIVATE = 'private',
}

// Social Interaction Type
export enum InteractionType {
    LIKE = 'like',
    SHARE = 'share',
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow',
}

// Ranking Period
export enum RankingPeriod {
    ALL_TIME = 'all_time',
    YEARLY = 'yearly',
    MONTHLY = 'monthly',
    WEEKLY = 'weekly',
}

// Bar Order Status
export enum BarOrderStatus {
    PENDING = 'pending',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

// Payment Gateway
export enum PaymentGateway {
    STRIPE = 'stripe',
    PAGSEGURO = 'pagseguro',
    PIX = 'pix',
    CASH = 'cash',
}

// Entry Type (TDA Rule 8 & 27 - Multiple entries)
export enum EntryType {
    INITIAL = 'initial',
    LATE_REG = 'late_reg',
    REBUY = 'rebuy',
    REENTRY = 'reentry',
    ADDON = 'addon',
}

// Entry Status
export enum EntryStatus {
    REGISTERED = 'REGISTERED',
    ACTIVE = 'ACTIVE',
    ELIMINATED = 'ELIMINATED',
    PAID_OUT = 'PAID_OUT',
}
