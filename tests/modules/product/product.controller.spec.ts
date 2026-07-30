import { ProductController } from '../../../src/modules/product/product.controller'
import { ProductService, NotFoundError } from '../../../src/modules/product/product.service'
import { Request, Response } from 'express'

describe('ProductController', () => {
  let productController: ProductController
  let mockProductService: jest.Mocked<ProductService>

  beforeEach(() => {
    mockProductService = {
      productRepository: {} as unknown,
      listProductById: jest.fn(),
      createProduct: jest.fn(),
      listProducts: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>
    productController = new ProductController(mockProductService)
  })

  it('should be defined', () => {
    expect(productController).toBeDefined()
  })

  it('should have methods defined', () => {
    expect(productController.createProductController).toBeDefined()
    expect(productController.listProductsController).toBeDefined()
    expect(productController.listProductByIdController).toBeDefined()
    expect(productController.updateProductController).toBeDefined()
    expect(productController.deleteProductController).toBeDefined()
  })

  describe('createProductController', () => {
    it('should return 201 and the created product on success', async () => {
      const mockReq = {
        body: {
          name: 'Test Product',
          price: 100,
          description: 'Test Description',
          quantity: 10,
          inStock: true,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      const mockProductResponse = {
        id: '1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        quantity: 10,
        inStock: true,
      }

      mockProductService.createProduct.mockResolvedValue(mockProductResponse)

      await productController.createProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith(mockProductResponse)
    })

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        body: {
          name: '',
          price: -100,
          description: '',
          quantity: -10,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await productController.createProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid request body',
          errors: expect.any(Array),
        }),
      )
    })

    it('should return 500 if service throws an error', async () => {
      const mockReq = {
        body: {
          name: 'Test Product',
          price: 100,
          description: 'Test Description',
          quantity: 10,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.createProduct.mockRejectedValue(new Error('Service error'))

      await productController.createProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
        }),
      )
    })
  })

  describe('listProductsController', () => {
    it('should return 200 and the list of products on success', async () => {
      const mockReq = {
        query: {},
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      const mockProductsResponse = [
        {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
          name: 'Test Product 1',
          price: 100,
          description: 'Test Description 1',
          quantity: 10,
          inStock: true,
        },
        {
          id: '2',
          name: 'Test Product 2',
          price: 200,
          description: 'Test Description 2',
          quantity: 20,
          inStock: true,
        },
      ]

      mockProductService.listProducts.mockResolvedValue(mockProductsResponse)

      await productController.listProductsController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockProductsResponse)
    })

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        query: {
          pageSize: 'invalid',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await productController.listProductsController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid query parameters',
          errors: expect.any(Array),
        }),
      )
    })

    it('should return 500 if service throws an error', async () => {
      const mockReq = {
        query: {},
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.listProducts.mockRejectedValue(new Error('Service error'))

      await productController.listProductsController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
        }),
      )
    })
  })

  describe('listProductByIdController', () => {
    it('should return 200 and the product on success', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      const mockProductResponse = {
        id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        quantity: 10,
        inStock: true,
      }

      mockProductService.listProductById.mockResolvedValue(mockProductResponse)

      await productController.listProductByIdController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockProductResponse)
    })

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        params: {
          id: 'invalid-uuid',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await productController.listProductByIdController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid path parameters',
          errors: expect.any(Array),
        }),
      )
    })

    it('should return 404 if product is not found', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.listProductById.mockRejectedValue(new NotFoundError('Product not found'))

      await productController.listProductByIdController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Product not found',
        }),
      )
    })

    it('should return 500 if service throws an error', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.listProductById.mockRejectedValue(new Error('Service error'))

      await productController.listProductByIdController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
        }),
      )
    })
  })

  describe('updateProductController', () => {
    it('should return 200 and the updated product on success', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
        body: {
          name: 'Updated Product',
          price: 150,
          description: 'Updated Description',
          quantity: 15,
          inStock: true,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      const mockUpdatedProductResponse = {
        id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        name: 'Updated Product',
        price: 150,
        description: 'Updated Description',
        quantity: 15,
        inStock: true,
      }

      mockProductService.updateProduct.mockResolvedValue(mockUpdatedProductResponse)

      await productController.updateProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedProductResponse)
    })

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        params: {
          id: 'invalid-uuid',
        },
        body: {
          name: '',
          price: -150,
          description: '',
          quantity: -15,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await productController.updateProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid request data',
          errors: expect.any(Array),
        }),
      )
    })

    it('should return 404 if product is not found', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
        body: {
          name: 'Updated Product',
          price: 150,
          description: 'Updated Description',
          quantity: 15,
          inStock: true,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.updateProduct.mockRejectedValue(new NotFoundError('Product not found'))

      await productController.updateProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Product not found',
        }),
      )
    })

    it('should return 500 if service throws an error', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
        body: {
          name: 'Updated Product',
          price: 150,
          description: 'Updated Description',
          quantity: 15,
          inStock: true,
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.updateProduct.mockRejectedValue(new Error('Service error'))

      await productController.updateProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
        }),
      )
    })
  })

  describe('deleteProductController', () => {
    it('should return 204 on successful deletion', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response

      mockProductService.deleteProduct.mockResolvedValue()

      await productController.deleteProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(204)
      expect(mockRes.send).toHaveBeenCalled()
    })

    it('should return 400 if validation fails', async () => {
      const mockReq = {
        params: {
          id: 'invalid-uuid',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      await productController.deleteProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid path parameters',
          errors: expect.any(Array),
        }),
      )
    })

    it('should return 404 if product is not found', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.deleteProduct.mockRejectedValue(new NotFoundError('Product not found'))

      await productController.deleteProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Product not found',
        }),
      )
    })

    it('should return 500 if service throws an error', async () => {
      const mockReq = {
        params: {
          id: 'd3fa9922-ee98-48b7-8873-a2cae7bb53c1',
        },
      } as unknown as Request
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response

      mockProductService.deleteProduct.mockRejectedValue(new Error('Service error'))

      await productController.deleteProductController(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal server error',
        }),
      )
    })
  })
})
