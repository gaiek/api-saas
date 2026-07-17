import { prismaClient } from '../../shared/database/database'
import { Category } from '../../shared/types/category'
import { Prisma } from '../../generated/prisma/client'
import {
  ProductResponseDTO,
  DeleteProductParamsDTO,
  ListProductsQueryDTO,
  CreateProductDTO,
} from './product.schema'
import logger from '../../shared/lib/logger'

export type UpdateProduct = {
  name?: string
  description?: string
  price?: number
  category?: Category
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface IProductRepository {
  create(product: CreateProductDTO): Promise<ProductResponseDTO>
  findById(id: string): Promise<ProductResponseDTO | null>
  update(id: string, product: UpdateProduct): Promise<ProductResponseDTO>
  delete(id: string): Promise<DeleteProductParamsDTO>
  list(filters: ListProductsQueryDTO): Promise<PaginatedResponse<ProductResponseDTO>>
}

export class ProductRepository implements IProductRepository {
  async create(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = await prismaClient.product.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        description: data.description,
        price: data.price,
      },
    })

    return {
      ...product,
      price: Number(product.price),
      inStock: product.quantity > 0,
    }
  }

  async list(filters: ListProductsQueryDTO): Promise<PaginatedResponse<ProductResponseDTO>> {
    const { period, startDate, endDate, pageSize = 10, page = 1 } = filters

    const where: Prisma.ProductWhereInput = {}

    if (period) {
      const now = new Date()
      let start: Date | undefined
      let end: Date | undefined

      switch (period) {
        case 'THREE_MONTHS':
          start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          end = now
          break
        case 'WEEK':
          const firstDayOfWeek = now.getDate() - now.getDay()
          start = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek)
          end = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek + 7)
          break
        case 'MONTH':
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          break
        case 'CUSTOM':
          if (startDate && endDate) {
            start = startDate
            end = endDate
          }
          break
      }

      if (start && end) {
        where.createdAt = {
          gte: start,
          lt: end,
        }
      }
    }

    const [products, total] = await Promise.all([
      prismaClient.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaClient.product.count({ where }),
    ])

    return {
      data: products.map(product => ({
        ...product,
        price: Number(product.price),
        inStock: product.quantity > 0,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async findById(id: string): Promise<ProductResponseDTO | null> {
    const product = await prismaClient.product.findUnique({
      where: { id },
    })

    if (!product) {
      return null
    }

    return {
      ...product,
      price: Number(product.price),
      inStock: product.quantity > 0,
    }
  }

  async update(id: string, data: UpdateProduct): Promise<ProductResponseDTO> {
    const product = await prismaClient.product.update({
      where: { id },
      data: {
        ...data,
      },
    })

    return {
      ...product,
      price: Number(product.price),
      inStock: product.quantity > 0,
    }
  }

  async delete(id: string): Promise<DeleteProductParamsDTO> {
    try {
      await prismaClient.product.delete({
        where: { id },
      })
      return { id }
    } catch (error) {
      logger.error(`Error deleting product ID ${id}:`)
      throw error
    }
  }
}
