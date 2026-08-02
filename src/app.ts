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
            name: {
              type: 'string',
              minLength: 1,
              example: 'Notebook Gamer',
              description: 'Product name',
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              example: 10,
              description: 'Available quantity in stock',
            },
            description: {
              type: 'string',
              minLength: 1,
              example: 'Notebook Gamer com RTX 4060',
              description: 'Product description',
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 4999.9,
              description: 'Product price in BRL',
            },
          },
        },
        UpdateProductDTO: {
          type: 'object',
          minProperties: 1,
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              example: 'Notebook Gamer Pro',
            },
            description: {
              type: 'string',
              minLength: 1,
              example: 'Descrição atualizada do produto',
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              example: 15,
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 3999.9,
            },
          },
          description: 'At least one field must be provided',
        },
        ProductResponseDTO: {
          type: 'object',
          required: ['id', 'name', 'description', 'quantity', 'price', 'inStock'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Notebook Gamer',
            },
            description: {
              type: 'string',
              example: 'Notebook Gamer com RTX 4060',
            },
            quantity: {
              type: 'integer',
              example: 10,
            },
            price: {
              type: 'number',
              example: 4999.9,
            },
            inStock: {
              type: 'boolean',
              example: true,
              description: 'True if quantity > 0',
            },
          },
        },
        ListProductsQueryDTO: {
          type: 'object',
          properties: {
            period: {
              type: 'string',
              enum: ['TODAY', 'WEEK', 'MONTH', 'CUSTOM'],
              example: 'TODAY',
              description: 'Filter products by creation period',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
              description: 'Start date for CUSTOM period (YYYY-MM-DD)',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-31',
              description: 'End date for CUSTOM period (YYYY-MM-DD)',
            },
            page: {
              type: 'integer',
              minimum: 1,
              example: 1,
              description: 'Page number (1-indexed)',
            },
            pageSize: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10,
              description: 'Number of items per page (max 100)',
            },
          },
        },
        ProductListResponseDTO: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProductResponseDTO',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                pageSize: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 },
              },
            },
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
