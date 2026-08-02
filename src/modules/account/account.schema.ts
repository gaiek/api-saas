import { z } from 'zod'

export const createAccountUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export type CreateAccountUserDTO = z.infer<typeof createAccountUserSchema>

export const loginAccountUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginAccountUserDTO = z.infer<typeof loginAccountUserSchema>

export const getAccountByEmailSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
})

export type GetAccountByEmailParamsDTO = z.infer<typeof getAccountByEmailSchema>['params']

export const updateAccountUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
  params: z.object({
    id: z.string().uuid('Invalid account ID'),
  }),
})

export type UpdateAccountUserBodyDTO = z.infer<typeof updateAccountUserSchema>['body']
export type UpdateAccountUserParamsDTO = z.infer<typeof updateAccountUserSchema>['params']

export const getAccountUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account ID'),
  }),
})

export type GetAccountUserParamsDTO = z.infer<typeof getAccountUserSchema>['params']

export const deleteAccountUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account ID'),
  }),
})

export type DeleteAccountUserParamsDTO = z.infer<typeof deleteAccountUserSchema>['params']

export const accountUserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type AccountUserResponseDTO = z.infer<typeof accountUserResponseSchema>

export type LoginResponseDTO = {
  user: AccountUserResponseDTO
  token: string
}
