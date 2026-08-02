import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { productRouter } from './modules/product/product.routes'
import { accountRouter } from './modules/account/account.routes'

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'SaaS API',
      version: '1.0.0',
      description: 'API for managing SaaS',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateAccountDTO: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: '123456' },
          },
        },
        UpdateAccountDTO: {
          type: 'object',
          minProperties: 1,
          properties: {
            name: { type: 'string', example: 'João Silva Atualizado' },
            email: { type: 'string', format: 'email', example: 'joao.novo@email.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: '654321' },
          },
        },
        AccountResponseDTO: {
          type: 'object',
          required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginResponseDTO: {
          type: 'object',
          required: ['user', 'token'],
          properties: {
            user: {
              $ref: '#/components/schemas/AccountResponseDTO',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            details: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
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
  apis: [
    './src/modules/product/product.routes.ts',
    './src/modules/product/product.schema.ts',
    './src/modules/account/account.routes.ts',
  ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/products', productRouter)
app.use('/api/accounts', accountRouter)

export default app
