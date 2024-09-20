import { z } from 'zod'

export const propsResSchema = z.object({
  analysis: z.array(
    z.object({
      prop: z.string(),
      overUnder: z.string(),
      certainty: z.number().optional(),
      explanation: z.string(),
    })
  ),
})
