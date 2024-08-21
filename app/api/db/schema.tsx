import { z } from 'zod';

// define a schema for the notifications
export const ffDataSchema = z.object({
    analysis: z.array(
        z.object({
            explanation: z.string(),
            safe_pick: z.string(),
            risky_pick: z.string(),
            recommended_pick: z.string().optional(),
            certainty: z.string().optional(),
            undecided: z.string().optional(),
        }),
    ),
});