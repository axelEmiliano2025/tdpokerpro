/**
 * Event Bus Types
 * PHASE 7: Pub/Sub system for real-time updates
 */

export interface IEventListener<T = any> {
    handle(event: T): Promise<void> | void;
}

export interface IEventBus {
    on<T>(eventName: string, listener: IEventListener<T>): void;
    off<T>(eventName: string, listener: IEventListener<T>): void;
    emit<T>(eventName: string, event: T): Promise<void>;
}

// Event types
export interface TournamentCreatedEvent {
    tournamentId: string;
    name: string;
    createdBy: string;
    createdAt: Date;
}

export interface PlayerRegisteredEvent {
    tournamentId: string;
    playerId: string;
    registeredAt: Date;
}

export interface BlindAdvancedEvent {
    tournamentId: string;
    newLevel: number;
    advancedAt: Date;
}

export interface PenaltyAppliedEvent {
    tournamentId: string;
    playerId: string;
    infractionType: string;
    penaltyLevel: number;
    appliedAt: Date;
}

export interface SeatingUpdatedEvent {
    tournamentId: string;
    tableNumber: number;
    seats: string[]; // player IDs
    updatedAt: Date;
}

export interface PostCreatedEvent {
    postId: string;
    userId: string;
    content: string;
    createdAt: Date;
}

export interface UserFollowedEvent {
    followerId: string;
    followingId: string;
    followedAt: Date;
}
