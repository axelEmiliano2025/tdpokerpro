// TDA 2024 Rules Constants

export const TDA_CONSTANTS = {
    // Table balancing (Rule 11)
    TABLE_BALANCE_THRESHOLD: 3, // Halt play if mesa has 3+ fewer players

    // Hand-for-Hand (Rule 8 recommended)
    HAND_FOR_HAND_PLAYERS_THRESHOLD: 10, // Activate HFH cuando < 10 players

    // Seating
    SEATS_PER_TABLE: 9,

    // Blind management
    DEFAULT_BLIND_DURATION_MINUTES: 20,
    DEFAULT_ANTE_FORMAT: 'big_blind_ante', // BBL format

    // Penalties (Rule 71)
    PENALTY_LEVELS: {
        VERBAL_WARNING: 0,
        MINOR_PENALTY: 1,
        MAJOR_PENALTY: 2,
        DISQUALIFICATION: 3,
    },
} as const;
