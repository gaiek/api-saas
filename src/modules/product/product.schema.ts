import { z } from 'zod'
import { periodEnum } from '../../shared/types/period'

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    quantity: z.number().int().min(0, 'Quantity must be a positive integer'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be a positive number'),
  }),
})

export type CreateProductDTO = z.infer<typeof createProductSchema>['body']

export const updateProductSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Name is required').optional(),
      description: z.string().min(1, 'Description is required').optional(),
      price: z.number().min(0, 'Price must be a positive number').optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
})

export type UpdateProductBodyDTO = z.infer<typeof updateProductSchema>['body']
export type UpdateProductParamsDTO = z.infer<typeof updateProductSchema>['params']

export const listProductsSchema = z.object({
  query: z
    .object({
      period: periodEnum.optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      pageSize: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .pipe(z.number().int().positive())
        .optional(),
      page: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .pipe(z.number().int().positive())
        .optional(),
    })
    .superRefine((query, ctx) => {
      if (query.period === 'CUSTOM') {
        if (!query.startDate || !query.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'startDate e endDate são obrigatórios quando period=CUSTOM',
            path: ['startDate'],
          })
        }
      }
      if (query.startDate && query.endDate && query.startDate > query.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'startDate não pode ser maior que endDate',
          path: ['startDate'],
        })
      }
    }),
})

export type ListProductsQueryDTO = z.infer<typeof listProductsSchema>['query']

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
})

export type GetProductParamsDTO = z.infer<typeof getProductSchema>['params']

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
})

export type DeleteProductParamsDTO = z.infer<typeof deleteProductSchema>['params']

export const productResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  quantity: z.number().int(),
  price: z.number(),
  inStock: z.boolean(),
})

export type ProductResponseDTO = z.infer<typeof productResponseSchema>
