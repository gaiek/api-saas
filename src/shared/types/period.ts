import { z } from 'zod'

export const periodEnum = z.enum(['WEEK', 'MONTH', 'THREE_MONTHS', 'CUSTOM'])
export type Period = z.infer<typeof periodEnum>
