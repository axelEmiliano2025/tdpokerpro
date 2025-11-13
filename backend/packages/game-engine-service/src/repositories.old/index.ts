/**
 * TypeORM Repositories - Central Export & Factory
 * PHASE 7a PASO 4: Repository layer for all entities
 */

import { BaseRepository } from './BaseRepository';
import { UserRepository } from './UserRepository';
import { PlayerEntryRepository } from './PlayerEntryRepositoryTypeORM';
import { BlindScheduleRepositoryTypeORM } from './BlindScheduleRepositoryTypeORM';
import { PenaltyRepositoryTypeORM } from './PenaltyRepositoryTypeORM';
import { SeatingAssignmentRepositoryTypeORM } from './SeatingAssignmentRepositoryTypeORM';
import { PostRepositoryTypeORM } from './PostRepositoryTypeORM';
import { FollowRepositoryTypeORM } from './FollowRepositoryTypeORM';
import { CommentRepositoryTypeORM } from './CommentRepositoryTypeORM';
import { LikeRepositoryTypeORM } from './LikeRepositoryTypeORM';
import { PlayerStatisticsRepositoryTypeORM } from './PlayerStatisticsRepositoryTypeORM';
import { TournamentStatisticsRepositoryTypeORM } from './TournamentStatisticsRepositoryTypeORM';
import { AuditLogRepositoryTypeORM } from './AuditLogRepositoryTypeORM';
import { UserPreferencesRepositoryTypeORM } from './UserPreferencesRepositoryTypeORM';
import { EventLogRepositoryTypeORM } from './EventLogRepositoryTypeORM';

export {
    BaseRepository,
    UserRepository,
    PlayerEntryRepository,
    BlindScheduleRepositoryTypeORM,
    PenaltyRepositoryTypeORM,
    SeatingAssignmentRepositoryTypeORM,
    PostRepositoryTypeORM,
    FollowRepositoryTypeORM,
    CommentRepositoryTypeORM,
    LikeRepositoryTypeORM,
    PlayerStatisticsRepositoryTypeORM,
    TournamentStatisticsRepositoryTypeORM,
    AuditLogRepositoryTypeORM,
    UserPreferencesRepositoryTypeORM,
    EventLogRepositoryTypeORM,
};

/**
 * RepositoryFactory
 * Centralized repository instantiation for dependency injection
 */
export class RepositoryFactory {
    private static userRepository: UserRepository;
    private static playerEntryRepository: PlayerEntryRepository;
    private static blindScheduleRepository: BlindScheduleRepositoryTypeORM;
    private static penaltyRepository: PenaltyRepositoryTypeORM;
    private static seatingAssignmentRepository: SeatingAssignmentRepositoryTypeORM;
    private static postRepository: PostRepositoryTypeORM;
    private static followRepository: FollowRepositoryTypeORM;
    private static commentRepository: CommentRepositoryTypeORM;
    private static likeRepository: LikeRepositoryTypeORM;
    private static playerStatisticsRepository: PlayerStatisticsRepositoryTypeORM;
    private static tournamentStatisticsRepository: TournamentStatisticsRepositoryTypeORM;
    private static auditLogRepository: AuditLogRepositoryTypeORM;
    private static userPreferencesRepository: UserPreferencesRepositoryTypeORM;
    private static eventLogRepository: EventLogRepositoryTypeORM;

    static getUserRepository(): UserRepository {
        if (!this.userRepository) {
            this.userRepository = new UserRepository();
        }
        return this.userRepository;
    }

    static getPlayerEntryRepository(): PlayerEntryRepository {
        if (!this.playerEntryRepository) {
            this.playerEntryRepository = new PlayerEntryRepository();
        }
        return this.playerEntryRepository;
    }

    static getBlindScheduleRepository(): BlindScheduleRepositoryTypeORM {
        if (!this.blindScheduleRepository) {
            this.blindScheduleRepository = new BlindScheduleRepositoryTypeORM();
        }
        return this.blindScheduleRepository;
    }

    static getPenaltyRepository(): PenaltyRepositoryTypeORM {
        if (!this.penaltyRepository) {
            this.penaltyRepository = new PenaltyRepositoryTypeORM();
        }
        return this.penaltyRepository;
    }

    static getSeatingAssignmentRepository(): SeatingAssignmentRepositoryTypeORM {
        if (!this.seatingAssignmentRepository) {
            this.seatingAssignmentRepository = new SeatingAssignmentRepositoryTypeORM();
        }
        return this.seatingAssignmentRepository;
    }

    static getPostRepository(): PostRepositoryTypeORM {
        if (!this.postRepository) {
            this.postRepository = new PostRepositoryTypeORM();
        }
        return this.postRepository;
    }

    static getFollowRepository(): FollowRepositoryTypeORM {
        if (!this.followRepository) {
            this.followRepository = new FollowRepositoryTypeORM();
        }
        return this.followRepository;
    }

    static getCommentRepository(): CommentRepositoryTypeORM {
        if (!this.commentRepository) {
            this.commentRepository = new CommentRepositoryTypeORM();
        }
        return this.commentRepository;
    }

    static getLikeRepository(): LikeRepositoryTypeORM {
        if (!this.likeRepository) {
            this.likeRepository = new LikeRepositoryTypeORM();
        }
        return this.likeRepository;
    }

    static getPlayerStatisticsRepository(): PlayerStatisticsRepositoryTypeORM {
        if (!this.playerStatisticsRepository) {
            this.playerStatisticsRepository = new PlayerStatisticsRepositoryTypeORM();
        }
        return this.playerStatisticsRepository;
    }

    static getTournamentStatisticsRepository(): TournamentStatisticsRepositoryTypeORM {
        if (!this.tournamentStatisticsRepository) {
            this.tournamentStatisticsRepository = new TournamentStatisticsRepositoryTypeORM();
        }
        return this.tournamentStatisticsRepository;
    }

    static getAuditLogRepository(): AuditLogRepositoryTypeORM {
        if (!this.auditLogRepository) {
            this.auditLogRepository = new AuditLogRepositoryTypeORM();
        }
        return this.auditLogRepository;
    }

    static getUserPreferencesRepository(): UserPreferencesRepositoryTypeORM {
        if (!this.userPreferencesRepository) {
            this.userPreferencesRepository = new UserPreferencesRepositoryTypeORM();
        }
        return this.userPreferencesRepository;
    }

    static getEventLogRepository(): EventLogRepositoryTypeORM {
        if (!this.eventLogRepository) {
            this.eventLogRepository = new EventLogRepositoryTypeORM();
        }
        return this.eventLogRepository;
    }
}
