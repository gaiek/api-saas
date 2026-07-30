import { prismaClient } from '../../shared/database/database'
import { Prisma } from '../../generated/prisma/client'
import {
  ProductResponseDTO,
  ListProductsQueryDTO,
  CreateProductDTO,
  UpdateProductBodyDTO,
} from './product.schema'
import logger from '../../shared/lib/logger'

export interface IProductRepository {
  create(product: CreateProductDTO): Promise<ProductResponseDTO>
  findUnique(id: string): Promise<ProductResponseDTO | null>
  update(id: string, product: UpdateProductBodyDTO): Promise<ProductResponseDTO>
  delete(id: string): Promise<void>
  findMany(filters: ListProductsQueryDTO): Promise<ProductResponseDTO[]>
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

  async findMany(filters: ListProductsQueryDTO): Promise<ProductResponseDTO[]> {
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

    const products = await prismaClient.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return products.map(product => ({
      ...product,
      price: Number(product.price),
      inStock: product.quantity > 0,
    }))
  }

  async findUnique(id: string): Promise<ProductResponseDTO | null> {
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

  async update(id: string, data: UpdateProductBodyDTO): Promise<ProductResponseDTO> {
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

  async delete(id: string): Promise<void> {
    try {
      await prismaClient.product.delete({
        where: { id },
      })
    } catch (error) {
      logger.error(`Error deleting product ID ${id}:`)
      throw error
    }
  }
}
