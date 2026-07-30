import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  getProductSchema,
  deleteProductSchema,
  productResponseSchema,
} from '../../../src/modules/product/product.schema'

describe('Schemas Validation', () => {
  describe('createProductSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        body: {
          name: 'Test Product',
          price: 10,
          description: 'Description',
          quantity: 5,
        },
      }

      const result = createProductSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when data is missing required fields', () => {
      const data = {
        body: {
          name: '',
          price: -10,
          description: '',
          quantity: -5,
        },
      }

      const result = createProductSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['body', 'name'] }),
            expect.objectContaining({ path: ['body', 'price'] }),
            expect.objectContaining({ path: ['body', 'description'] }),
            expect.objectContaining({ path: ['body', 'quantity'] }),
          ]),
        )
      }
    })
  })

  describe('updateProductSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        body: {
          name: 'Updated Product',
          price: 20,
        },
        params: {
          id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a',
        },
      }

      const result = updateProductSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when no fields are provided for update', () => {
      const data = {
        body: {},
        params: {
          id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a',
        },
      }

      const result = updateProductSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ path: ['body'] })]),
        )
      }
    })
  })

  describe('listProductsSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        query: {
          period: 'WEEK',
          pageSize: '10',
          page: '1',
        },
      }

      const result = listProductsSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when period is CUSTOM but startDate or endDate is missing', () => {
      const data = {
        query: {
          period: 'CUSTOM',
          pageSize: '10',
          page: '1',
        },
      }

      const result = listProductsSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ path: ['query', 'startDate'] })]),
        )
      }
    })

    it('should fail validation when pageSize or page is not a positive integer', () => {
      const data = {
        query: {
          period: 'WEEK',
          pageSize: '-10',
          page: '0',
        },
      }

      const result = listProductsSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['query', 'pageSize'] }),
            expect.objectContaining({ path: ['query', 'page'] }),
          ]),
        )
      }
    })

    it('should fail validation when startDate is grater than endDate', () => {
      const data = {
        query: {
          period: 'CUSTOM',
          startDate: '2024-06-10',
          endDate: '2024-06-01',
        },
      }

      const result = listProductsSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ path: ['query', 'startDate'] })]),
        )
      }
    })
  })

  describe('getProductSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        params: {
          id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a',
        },
      }

      const result = getProductSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when id is not a valid UUID', () => {
      const data = {
        params: {
          id: 'invalid-uuid',
        },
      }

      const result = getProductSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ path: ['params', 'id'] })]),
        )
      }
    })
  })

  describe('deleteProductSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        params: {
          id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a',
        },
      }

      const result = deleteProductSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when id is not a valid UUID', () => {
      const data = {
        params: {
          id: 'invalid-uuid',
        },
      }

      const result = deleteProductSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ path: ['params', 'id'] })]),
        )
      }
    })
  })

  describe('productResponseSchema', () => {
    it('should validate with successful data when correctly formatted', () => {
      const data = {
        id: '3fd65ae5-9936-4c32-a78c-a5f728c3cd5a',
        name: 'Test Product',
        price: 10,
        description: 'Description',
        quantity: 5,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = productResponseSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail validation when required fields are missing or incorrectly formatted', () => {
      const data = {
        id: 'invalid-uuid',
        inStock: 'not-a-boolean',
      }

      const result = productResponseSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['id'] }),
            expect.objectContaining({ path: ['inStock'] }),
          ]),
        )
      }
    })
  })
})
