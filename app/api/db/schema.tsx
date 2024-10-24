import { z } from 'zod'

export const ffDataSchema = z.object({
  analysis: z.array(
    z.object({
      playerOnePosition: z.string(),
      playerTwoPosition: z.string(),
      playerOneName: z.string(),
      playerTwoName: z.string(),
      playerOneTeam: z.string(),
      playerTwoTeam: z.string(),
      explanation: z.string(),
      recommended_pick: z.string().optional(),
      recommended_pick_espn_id: z.string().optional(),
      certainty: z.number().optional(),
      undecided: z.string().optional(),
    })
  ),
})
