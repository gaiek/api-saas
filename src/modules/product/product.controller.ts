import { Request, Response } from 'express'
import { ProductService } from './product.service'
import { CreateProductDTO, listProductsSchema } from './product.schema'
import { createProductSchema } from './product.schema'
import { ZodError } from 'zod'
import logger from '../../shared/lib/logger'

export class ProductController {
  constructor(private readonly productService: ProductService) {
    this.createProductController = this.createProductController.bind(this)
  }

  private extractId(req: Request): string {
    const { id } = req.params
    return Array.isArray(id) ? id[0] : id
  }

  async createProductController(req: Request, res: Response): Promise<void> {
    try {
      const { body } = createProductSchema.parse({
        body: req.body,
      })
      const product = await this.productService.createProduct(body)
      res.status(201).json(product)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error creating product:')
        res.status(400).json({ message: 'Invalid request body', errors: error.issues })
      }
      logger.error({ error }, 'Error creating product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listProductsController(req: Request, res: Response): Promise<void> {
    try {
      const { query: filters } = listProductsSchema.parse({
        query: req.query,
      })
      const products = await this.productService.listProducts(filters)
      res.status(200).json(products)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error listing products:')
        res.status(400).json({ message: 'Invalid query parameters', errors: error.issues })
      }
      logger.error({ error }, 'Error listing products:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listProductByIdController(req: Request, res: Response): Promise<void> {
    try {
      const productId = this.extractId(req)
      const product = await this.productService.listProductById(productId)

      if (!product) {
        res.status(404).json({ message: 'Product not found' })
        return
      }

      res.status(200).json(product)
    } catch (error) {
      logger.error({ error }, 'Error creating product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async updateProductController(req: Request, res: Response): Promise<void> {
    try {
      const productId = this.extractId(req)
      const data: Partial<CreateProductDTO> = req.body
      const updatedProduct = await this.productService.updateProduct(productId, data)
      res.status(200).json(updatedProduct)
    } catch (error) {
      logger.error({ error }, 'Error updating product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteProductController(req: Request, res: Response): Promise<void> {
    try {
      const productId = this.extractId(req)
      await this.productService.deleteProduct(productId)
      res.status(204).send()
    } catch (error) {
      logger.error({ error }, 'Error deleting product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
