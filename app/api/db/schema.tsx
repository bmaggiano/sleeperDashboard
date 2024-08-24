import { z } from 'zod';

// define a schema for the notifications
export const ffDataSchema = z.object({
    analysis: z.array(
        z.object({
            explanation: z.string(),
            playerOneRecYards: z.number(),
            playerTwoRecYards: z.number(),
            playerOneRushYards: z.number(),
            playerTwoRushYards: z.number(),
            playerOneTouchdowns: z.number(),
            playerTwoTouchdowns: z.number(),
            playerOneReceptions: z.number(),
            playerTwoReceptions: z.number(),
            playerOneAirYards: z.number(),
            playerTwoAirYards: z.number(),
            playerOneYardsAfterCatch: z.number(),
            playerTwoYardsAfterCatch: z.number(),
            playerOneYardsPerReception: z.number(),
            playerTwoYardsPerReception: z.number(),
            longestPlayOne: z.number(),
            longestPlayTwo: z.number(),
            safe_pick: z.string(),
            risky_pick: z.string(),
            recommended_pick: z.string().optional(),
            certainty: z.number().optional(),
            undecided: z.string().optional(),
        }),
    ),
});