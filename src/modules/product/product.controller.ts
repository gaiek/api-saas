import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { ProductService, NotFoundError } from './product.service'
import {
  createProductSchema,
  listProductsSchema,
  getProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from './product.schema'
import logger from '../../shared/lib/logger'

export class ProductController {
  constructor(private readonly productService: ProductService) {
    this.createProductController = this.createProductController.bind(this)
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
        return
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
        return
      }
      logger.error({ error }, 'Error listing products:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async listProductByIdController(req: Request, res: Response): Promise<void> {
    try {
      const { params } = getProductSchema.parse({ params: req.params })
      const product = await this.productService.listProductById(params.id)

      res.status(200).json(product)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error getting product by ID:')
        res.status(400).json({ message: 'Invalid path parameters', errors: error.issues })
        return
      }
      if (error instanceof NotFoundError) {
        logger.error({ error }, 'Product not found:')
        res.status(404).json({ message: error.message })
        return
      }
      logger.error({ error }, 'Error getting product by ID:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async updateProductController(req: Request, res: Response): Promise<void> {
    try {
      const { params, body } = updateProductSchema.parse({
        params: req.params,
        body: req.body,
      })
      const updatedProduct = await this.productService.updateProduct(params.id, body)
      res.status(200).json(updatedProduct)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error updating product:')
        res.status(400).json({ message: 'Invalid request data', errors: error.issues })
        return
      }
      if (error instanceof NotFoundError) {
        logger.error({ error }, 'Product not found:')
        res.status(404).json({ message: error.message })
        return
      }
      logger.error({ error }, 'Error updating product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteProductController(req: Request, res: Response): Promise<void> {
    try {
      const { params } = deleteProductSchema.parse({ params: req.params })
      await this.productService.deleteProduct(params.id)
      res.status(204).send()
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error deleting product:')
        res.status(400).json({ message: 'Invalid path parameters', errors: error.issues })
        return
      }
      if (error instanceof NotFoundError) {
        logger.error({ error }, 'Product not found:')
        res.status(404).json({ message: error.message })
        return
      }
      logger.error({ error }, 'Error deleting product:')
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
