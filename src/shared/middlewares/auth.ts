import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../lib/logger'

interface JwtPayload {
  id: string
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization header format' })
  }

  try {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
      logger.error('[Auth Middleware] JWT_SECRET not configured')
      return res.status(500).json({ message: 'Authentication not configured' })
    }
    const decoded = jwt.verify(token, secretKey) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    logger.error({ error }, '[Auth Middleware] Authentication error')
    return res.status(401).json({ message: 'Invalid token' })
  }
}
