/**
 * Base Entity Interfaces
 */

import {
    UserRole,
    TournamentStatus,
    GameType,
    TransactionType,
    TransactionStatus,
    NotificationType,
    PostVisibility,
    InteractionType,
    RankingPeriod,
    BarOrderStatus,
    PaymentGateway,
} from './enums';

// ========================================
// USER ENTITIES
// ========================================

export interface User {
    id: string;
    email: string;
    username: string;
    password_hash: string;
    role: UserRole;
    isActive: boolean;
    is_active: boolean; // Alias para compatibilidad con DB
    isVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    id: string;
    userId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    city?: string;
    birthDate?: Date;
    preferredLanguage: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSession {
    id: string;
    userId: string;
    refreshToken: string;
    deviceInfo?: Record<string, unknown>;
    ipAddress?: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface UserWallet {
    id: string;
    userId: string;
    balance: number;
    lifetimeDeposits: number;
    lifetimeWithdrawals: number;
    lifetimeWinnings: number;
    lastTransactionAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserStats {
    id: string;
    userId: string;
    totalTournaments: number;
    tournamentsWon: number;
    totalGames: number;
    gamesWon: number;
    totalHands: number;
    handsWon: number;
    biggestWin: number;
    totalWinnings: number;
    totalBuyIns: number;
    roi: number;
    avgFinishPosition: number;
    createdAt: Date;
    updatedAt: Date;
}

// ========================================
// TOURNAMENT ENTITIES
// ========================================

export interface Tournament {
    id: string;
    clubId: string;
    name: string;
    description?: string;
    tournamentType: string;
    status: TournamentStatus;
    buyInAmount: number;
    rebuyAmount: number;
    addonAmount: number;
    startingChips: number;
    maxPlayers: number;
    minPlayers: number;
    playersPerTable: number;
    lateRegistrationLevel?: number;
    rebuyUntilLevel?: number;
    addonLevel?: number;
    levelDurationMinutes: number;
    breakFrequency?: number;
    breakDurationMinutes?: number;
    prizePoolPercentage: number;
    scheduledStartTime?: Date;
    actualStartTime?: Date;
    endTime?: Date;
    currentLevel: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TournamentParticipant {
    id: string;
    tournamentId: string;
    userId: string;
    entryNumber: number;
    tableId?: string;
    seatNumber?: number;
    chipCount: number;
    rebuysCount: number;
    addonsCount: number;
    isActive: boolean;
    finishPosition?: number;
    prizeAmount: number;
    registeredAt: Date;
    eliminatedAt?: Date;
}

export interface GamingTable {
    id: string;
    tournamentId?: string;
    tableNumber: number;
    tableName?: string;
    gameType: GameType;
    maxSeats: number;
    currentPlayers: number;
    isActive: boolean;
    smallBlind?: number;
    bigBlind?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlindsStructure {
    id: string;
    tournamentId: string;
    level: number;
    smallBlind: number;
    bigBlind: number;
    ante: number;
    durationMinutes: number;
    isBreak: boolean;
    createdAt: Date;
}

// ========================================
// FINANCIAL ENTITIES
// ========================================

export interface Transaction {
    id: string;
    userId: string;
    tournamentId?: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description?: string;
    metadata?: Record<string, unknown>;
    processedBy?: string;
    processedAt?: Date;
    createdAt: Date;
}

export interface Payment {
    id: string;
    transactionId: string;
    userId: string;
    gateway: PaymentGateway;
    gatewayTransactionId?: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod?: string;
    paymentDetails?: Record<string, unknown>;
    errorMessage?: string;
    webhookData?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

// ========================================
// SOCIAL ENTITIES
// ========================================

export interface Post {
    id: string;
    userId: string;
    tournamentId?: string;
    content: string;
    mediaUrls?: string[];
    postType: string;
    visibility: PostVisibility;
    isPinned: boolean;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    parentCommentId?: string;
    content: string;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SocialInteraction {
    id: string;
    userId: string;
    targetUserId?: string;
    postId?: string;
    commentId?: string;
    interactionType: InteractionType;
    createdAt: Date;
}

export interface UserRanking {
    id: string;
    userId: string;
    rankingPeriod: RankingPeriod;
    periodStart?: Date;
    periodEnd?: Date;
    totalPoints: number;
    tournamentsPlayed: number;
    tournamentsWon: number;
    finalTables: number;
    totalBuyIns: number;
    totalPrizes: number;
    roiPercentage: number;
    rankPosition?: number;
    createdAt: Date;
    updatedAt: Date;
}

// ========================================
// NOTIFICATION ENTITIES
// ========================================

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

// ========================================
// BAR ENTITIES
// ========================================

export interface BarProduct {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    costPrice?: number;
    stockQuantity: number;
    minStockAlert: number;
    imageUrl?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BarOrder {
    id: string;
    userId: string;
    tournamentId?: string;
    tableId?: string;
    items: BarOrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod?: string;
    status: BarOrderStatus;
    notes?: string;
    servedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BarOrderItem {
    productId: string;
    quantity: number;
    price: number;
}

// ========================================
// STATISTICS ENTITIES
// ========================================

export interface GameStatistics {
    id: string;
    userId: string;
    tournamentId?: string;
    handsPlayed: number;
    handsWon: number;
    totalTimePlayedMinutes: number;
    biggestPotWon: number;
    biggestHand?: string;
    statisticsData?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
