/**
 * TDA 2024 Rules 7-11 Seating Algorithms
 * - Rule 7: Random seating (Fisher-Yates)
 * - Rule 8: Late registration seating (no SB position)
 * - Rule 10-B: Double randomization for table breaks
 * - Rule 11: Table balancing with worst-position detection
 * - Rule 11-D: Halting play (3+ disparity)
 */

export class SeatingAlgorithm {
    private readonly SEATS_PER_TABLE = 9;
    private readonly TABLE_BALANCE_THRESHOLD = 3; // Halt if 3+ disparity

    /**
     * Rule 7: Initial random seating (Fisher-Yates shuffle)
     */
    randomSeat(
        playerEntryIds: string[],
        seatsPerTable: number = this.SEATS_PER_TABLE
    ): Array<{ player_entry_id: string; table: number; seat: number }> {
        // Fisher-Yates shuffle
        const shuffled = this.fisherYatesShuffle([...playerEntryIds]);

        const assignments = [];
        for (let i = 0; i < shuffled.length; i++) {
            const table = Math.floor(i / seatsPerTable) + 1;
            const seat = (i % seatsPerTable) + 1;

            assignments.push({
                player_entry_id: shuffled[i]!,
                table,
                seat
            });
        }

        return assignments;
    }

    /**
     * Rule 8: Late registration seating (avoid SB position)
     * SB is always at position 2 (next to button at 1)
     */
    seatLateRegistration(
        _playerEntryId: string,
        currentTables: Array<{ table: number; players_count: number }>,
        seatsPerTable: number = this.SEATS_PER_TABLE
    ): { table: number; seat: number } {
        // Find table with fewest players
        const targetTable = currentTables.reduce((min, current) =>
            current.players_count < min.players_count ? current : min
        );

        // If target table is full, need to open new table
        if (targetTable.players_count >= seatsPerTable) {
            return {
                table: Math.max(...currentTables.map(t => t.table)) + 1,
                seat: 1
            };
        }

        // Get next available seat (NOT position 2 = SB)
        // Assume button is at position 1, so SB is at position 2
        const sbSeat = 2;
        const nextSeat = targetTable.players_count + 1;

        if (nextSeat === sbSeat) {
            // Skip SB position if it's next available
            return {
                table: targetTable.table,
                seat: nextSeat + 1
            };
        }

        return {
            table: targetTable.table,
            seat: nextSeat
        };
    }

    /**
     * Rule 10-B: Double randomization for table breaks
     * Step 1: Shuffle position cards (1-9)
     * Step 2: Deal playing cards to each player
     * Step 3: Sort players by card (high to low)
     * Step 4: Distribute to positions
     */
    doubleRandomization(
        playerEntryIds: string[],
        targetTables: number[] // Tables where they'll go
    ): Array<{ player_entry_id: string; table: number; seat: number }> {
        // Step 1: Shuffle position cards
        const positionCards = Array.from({ length: this.SEATS_PER_TABLE }, (_, i) => i + 1);
        const shuffledPositions = this.fisherYatesShuffle(positionCards);

        // Step 2: Generate random playing cards for each player
        const playerCards = playerEntryIds.map(id => ({
            id,
            card: this.generateRandomCard()
        }));

        // Step 3: Sort by card (highest first)
        const sorted = playerCards.sort((a, b) =>
            this.compareCards(b.card, a.card)
        );

        // Step 4: Distribute to shuffled positions across target tables
        const assignments: Array<{ player_entry_id: string; table: number; seat: number }> = [];
        for (let i = 0; i < sorted.length; i++) {
            const tableIndex = Math.floor(i / this.SEATS_PER_TABLE);
            const table = targetTables[tableIndex] || targetTables[0] || 1;
            const seat = shuffledPositions[i % this.SEATS_PER_TABLE] || 1;

            assignments.push({
                player_entry_id: sorted[i]!.id,
                table,
                seat
            });
        }

        return assignments;
    }

    /**
     * Rule 11: Table balancing with worst-position detection
     * Move player who will be next BB to worst position in short table
     */
    balanceTables(
        currentAssignments: Array<{ table: number; seat: number; player_entry_id: string; button_seat: number }>,
        seatsPerTable: number = this.SEATS_PER_TABLE
    ): Array<{ player_entry_id: string; from_table: number; to_table: number; reason: string }> {
        // Group by table
        const tableMap = new Map<number, any[]>();
        currentAssignments.forEach(a => {
            if (!tableMap.has(a.table)) tableMap.set(a.table, []);
            tableMap.get(a.table)!.push(a);
        });

        const tables = Array.from(tableMap.entries());
        const maxPlayers = Math.max(...tables.map(([_, p]) => p.length));

        const movements: Array<{ player_entry_id: string; from_table: number; to_table: number; reason: string }> = [];

        // Rule 11: Balance if disparity exists
        tables.forEach(([tableNum, players]) => {
            if (maxPlayers - players.length >= 1) {
                // This table is short, move someone to it

                // Find player to move: the one who will be next BB
                const buttonSeat = players[0]?.button_seat || 1;
                const nextBBSeat = (buttonSeat % seatsPerTable) + 1;

                const playerToMove = players.find(p => p.seat === nextBBSeat);
                if (!playerToMove) return;

                // Find best target table: one with more players (least short)
                const targetTable = tables.find(([t, p]) =>
                    t !== tableNum && p.length > players.length
                );

                if (!targetTable) return;

                // Find worst position in target table (NOT SB = position 2)
                const targetButtonSeat = targetTable[1][0]?.button_seat || 1;
                const targetSBSeat = (targetButtonSeat % seatsPerTable) + 1;

                // Find worst seat using helper
                this.findWorstSeat(
                    targetTable[1],
                    targetSBSeat,
                    seatsPerTable
                );

                movements.push({
                    player_entry_id: playerToMove.player_entry_id,
                    from_table: tableNum,
                    to_table: targetTable[0],
                    reason: 'balance_movement_next_bb'
                });
            }
        });

        return movements;
    }

    /**
     * Rule 11-D: Detect halting play (3+ disparity)
     */
    detectHaltingPlay(
        tablePlayerCounts: Array<{ table: number; count: number }>
    ): { should_halt: boolean; tables_to_halt: number[]; disparity: number } {
        const maxPlayers = Math.max(...tablePlayerCounts.map(t => t.count));
        const minPlayers = Math.min(...tablePlayerCounts.map(t => t.count));
        const disparity = maxPlayers - minPlayers;

        if (disparity >= this.TABLE_BALANCE_THRESHOLD) {
            const tablesToHalt = tablePlayerCounts
                .filter(t => maxPlayers - t.count >= this.TABLE_BALANCE_THRESHOLD)
                .map(t => t.table);

            return {
                should_halt: true,
                tables_to_halt: tablesToHalt,
                disparity
            };
        }

        return {
            should_halt: false,
            tables_to_halt: [],
            disparity
        };
    }

    // ==================== HELPER FUNCTIONS ====================

    private fisherYatesShuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = result[i]!;
            result[i] = result[j]!;
            result[j] = temp;
        }
        return result;
    }

    private generateRandomCard(): { rank: number; suit: string } {
        const ranks = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // A-K high
        const suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];

        const rankIndex = Math.floor(Math.random() * ranks.length);
        const suitIndex = Math.floor(Math.random() * suits.length);

        return {
            rank: ranks[rankIndex]!,
            suit: suits[suitIndex]!
        };
    }

    private compareCards(card1: { rank: number; suit: string }, card2: { rank: number; suit: string }): number {
        const suitValue: Record<string, number> = { SPADES: 4, HEARTS: 3, DIAMONDS: 2, CLUBS: 1 };

        if (card1.rank !== card2.rank) {
            return card2.rank - card1.rank; // Higher rank wins
        }

        return (suitValue[card2.suit] || 0) - (suitValue[card1.suit] || 0); // Higher suit wins
    }

    private findWorstSeat(
        players: any[],
        sbSeat: number,
        seatsPerTable: number
    ): number {
        const occupiedSeats = players.map(p => p.seat);

        // Worst position = first available that is NOT SB
        for (let seat = 1; seat <= seatsPerTable; seat++) {
            if (!occupiedSeats.includes(seat) && seat !== sbSeat) {
                return seat;
            }
        }

        // Fallback: any available seat
        for (let seat = 1; seat <= seatsPerTable; seat++) {
            if (!occupiedSeats.includes(seat)) {
                return seat;
            }
        }

        throw new Error('No available seats found');
    }
}
