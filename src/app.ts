import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import routes from './modules/product/product.routes'

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'API for managing products',
    },
    components: {
      schemas: {
        CreateProductDTO: {
          type: 'object',
          required: ['name', 'quantity', 'description', 'price'],
          properties: {
            name: { type: 'string', minLength: 1, example: 'Notebook' },
            quantity: { type: 'integer', minimum: 0, example: 10 },
            description: { type: 'string', minLength: 1, example: 'Notebook gamer' },
            price: { type: 'number', minimum: 0, example: 4999.9 },
          },
        },
        UpdateProductDTO: {
          type: 'object',
          minProperties: 1,
          properties: {
            name: { type: 'string', minLength: 1, example: 'Notebook atualizado' },
            description: { type: 'string', minLength: 1, example: 'Descricao atualizada' },
            price: { type: 'number', minimum: 0, example: 3999.9 },
          },
        },
        ProductResponseDTO: {
          type: 'object',
          required: ['id', 'name', 'description', 'quantity', 'price', 'inStock'],
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'Notebook' },
            description: { type: 'string', example: 'Notebook gamer' },
            quantity: { type: 'integer', example: 10 },
            price: { type: 'number', example: 4999.9 },
            inStock: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: ['./src/modules/product/product.routes.ts', './src/modules/product/product.schema.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(routes)

export default app
