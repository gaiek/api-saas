import { z } from 'zod'

export const categoryEnum = z.enum([
  'ELECTRONICS',
  'CLOTHING',
  'FOOD',
  'BOOKS',
  'FURNITURE',
  'TOYS',
  'SPORTS',
  'BEAUTY',
  'HEALTH',
  'MUSIC',
  'MOVIES',
  'GAMES',
  'JEWELRY',
  'ACCESSORIES',
  'OTHER',
])
export type Category = z.infer<typeof categoryEnum>
