import logger from '../../shared/lib/logger'
import { IProductRepository } from './product.repository'
import {
  CreateProductDTO,
  ListProductsQueryDTO,
  ProductResponseDTO,
  UpdateProductBodyDTO,
} from './product.schema'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async createProduct(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.productRepository.create(data)
    logger.info(`Product created with ID: ${product.id}`)
    return product
  }

  async listProducts(filters: ListProductsQueryDTO): Promise<ProductResponseDTO[]> {
    return this.productRepository.findMany(filters)
  }

  async listProductById(id: string): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findUnique(id)
    if (!product) {
      throw new NotFoundError(`Product not found with ID: ${id}`)
    }
    return product
  }

  async updateProduct(id: string, data: UpdateProductBodyDTO): Promise<ProductResponseDTO> {
    const existingProduct = await this.productRepository.findUnique(id)
    if (!existingProduct) {
      throw new NotFoundError(`Product not found with ID: ${id}`)
    }
    const updatedProduct = await this.productRepository.update(id, data)
    logger.info(`Product updated with ID: ${updatedProduct.id}`)
    return updatedProduct
  }

  async deleteProduct(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findUnique(id)
    if (!existingProduct) {
      throw new NotFoundError(`Product not found with ID: ${id}`)
    }
    await this.productRepository.delete(id)
    logger.info(`Product deleted with ID: ${id}`)
  }
}
