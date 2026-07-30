import { prismaClient } from '../../../src/shared/database/database'
import { ProductService, NotFoundError } from '../../../src/modules/product/product.service'
import { IProductRepository } from '../../../src/modules/product/product.repository'

jest.mock('../../../src/shared/database/database', () => ({
  prismaClient: {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe('ProductService', () => {
  let productService: ProductService
  let productRepository: IProductRepository

  beforeEach(() => {
    productRepository = prismaClient.product as unknown as IProductRepository
    productService = new ProductService(productRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(productService).toBeDefined()
  })

  it('should have methods', () => {
    expect(productService.createProduct).toBeDefined()
    expect(productService.listProducts).toBeDefined()
    expect(productService.listProductById).toBeDefined()
    expect(productService.updateProduct).toBeDefined()
    expect(productService.deleteProduct).toBeDefined()
  })

  describe('createProduct', () => {
    it('should create a product', async () => {
      const productData = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        quantity: 5,
      }
      const createdProduct = { id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a', ...productData }
      ;(prismaClient.product.create as jest.Mock).mockResolvedValue(createdProduct)

      const result = await productService.createProduct(productData)

      expect(prismaClient.product.create).toHaveBeenCalledWith(productData)
      expect(result).toEqual(createdProduct)
    })

    it('should throw an error if product creation fails', async () => {
      const productData = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        quantity: 5,
      }
      const errorMessage = 'Failed to create product'
      ;(prismaClient.product.create as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(productService.createProduct(productData)).rejects.toThrow(errorMessage)
    })
  })

  describe('listProducts', () => {
    it('should list products', async () => {
      const filters = { period: 'WEEK' as const }
      const products = [
        { id: '1', name: 'Test Product 1', price: 10, description: 'Description 1', quantity: 5 },
        { id: '2', name: 'Test Product 2', price: 20, description: 'Description 2', quantity: 10 },
      ]
      ;(prismaClient.product.findMany as jest.Mock).mockResolvedValue(products)

      const result = await productService.listProducts(filters)

      expect(prismaClient.product.findMany).toHaveBeenCalledWith(filters)
      expect(result).toEqual(products)
    })

    it('should throw an error if listing products fails', async () => {
      const filters = { period: 'WEEK' as const }
      const errorMessage = 'Failed to list products'
      ;(prismaClient.product.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(productService.listProducts(filters)).rejects.toThrow(errorMessage)
    })
  })

  describe('listProductById', () => {
    it('should return a product by ID', async () => {
      const productId = '1'
      const product = {
        id: productId,
        name: 'Test Product',
        price: 10,
        description: 'Description',
        quantity: 5,
      }
      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(product)

      const result = await productService.listProductById(productId)

      expect(prismaClient.product.findUnique).toHaveBeenCalledWith(productId)
      expect(result).toEqual(product)
    })

    it('should throw NotFoundError if product not found', async () => {
      const productId = 'non-existent-id'
      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(productService.listProductById(productId)).rejects.toThrow(NotFoundError)
    })
  })

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productId = '1'
      const updateData = { name: 'Updated Product' }
      const existingProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
        description: 'Description',
        quantity: 5,
      }
      const updatedProduct = { ...existingProduct, ...updateData }

      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(existingProduct)
      ;(prismaClient.product.update as jest.Mock).mockResolvedValue(updatedProduct)

      const result = await productService.updateProduct(productId, updateData)

      expect(prismaClient.product.findUnique).toHaveBeenCalledWith(productId)
      expect(prismaClient.product.update).toHaveBeenCalledWith(productId, updateData)
      expect(result).toEqual(updatedProduct)
    })

    it('should throw NotFoundError if product to update does not exist', async () => {
      const productId = 'non-existent-id'
      const updateData = { name: 'Updated Product' }
      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(productService.updateProduct(productId, updateData)).rejects.toThrow(
        NotFoundError,
      )
    })
  })

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productId = '1'
      const existingProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
        description: 'Description',
        quantity: 5,
      }

      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(existingProduct)
      ;(prismaClient.product.delete as jest.Mock).mockResolvedValue(undefined)

      await productService.deleteProduct(productId)

      expect(prismaClient.product.findUnique).toHaveBeenCalledWith(productId)
      expect(prismaClient.product.delete).toHaveBeenCalledWith(productId)
    })

    it('should throw NotFoundError if product to delete does not exist', async () => {
      const productId = 'non-existent-id'
      ;(prismaClient.product.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(productService.deleteProduct(productId)).rejects.toThrow(NotFoundError)
    })
  })
})
