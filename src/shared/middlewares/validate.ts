import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodTypeAny } from 'zod'
import logger from '../lib/logger'

export const validate = (schema: ZodTypeAny) => {
  async function validateMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid request data',
          errors: error.issues,
        })
      }
      logger.error({ error }, 'Schema validation failed unexpectedly')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  return validateMiddleware
}
