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
  },
  apis: ['./src/modules/product/product.routes.ts', './src/modules/product/product.schema.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(routes)

export default app
