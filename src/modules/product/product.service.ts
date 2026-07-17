import logger from '../../shared/lib/logger'
import { IProductRepository } from './product.repository'
import { CreateProductDTO, ListProductsQueryDTO, ProductResponseDTO } from './product.schema'

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
    const products = await this.productRepository.list(filters)
    return products.data
  }

  async listProductById(id: string): Promise<ProductResponseDTO | null> {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new NotFoundError(`Product not found with ID: ${id}`)
    }
    return product
  }

  async updateProduct(id: string, data: Partial<CreateProductDTO>): Promise<ProductResponseDTO> {
    const existingProduct = await this.productRepository.findById(id)
    if (!existingProduct) {
      throw new NotFoundError(`Product not found with ID: ${id}`)
    }
    const updatedProduct = await this.productRepository.update(id, data)
    logger.info(`Product updated with ID: ${updatedProduct.id}`)
    return updatedProduct
  }

  async deleteProduct(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id)
    if (!existingProduct) {
      logger.info(`Produto não encontrado com ID: ${id}, verifique se o ID está correto.`)
      throw Object.assign(new Error('Produto não encontrado'), { status: 404 })
    }
    await this.productRepository.delete(id)
    logger.info(`Product deleted with ID: ${id}`)
  }
}
