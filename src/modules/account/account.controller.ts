import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { AccountService, NotFoundError, ConflictError } from './account.service'
import {
  createAccountUserSchema,
  updateAccountUserSchema,
  getAccountUserSchema,
  deleteAccountUserSchema,
  getAccountByEmailSchema,
  loginAccountUserSchema,
} from './account.schema'
import logger from '../../shared/lib/logger'

export class AccountController {
  constructor(private readonly accountService: AccountService) {
    this.createAccountController = this.createAccountController.bind(this)
    this.listAccountsController = this.listAccountsController.bind(this)
    this.listAccountByIdController = this.listAccountByIdController.bind(this)
    this.updateAccountController = this.updateAccountController.bind(this)
    this.deleteAccountController = this.deleteAccountController.bind(this)
    this.listAccountByEmailController = this.listAccountByEmailController.bind(this)
    this.loginAccountController = this.loginAccountController.bind(this)
  }

  async createAccountController(req: Request, res: Response): Promise<void> {
    try {
      const body = createAccountUserSchema.parse(req.body)
      const result = await this.accountService.createAccount(body)
      res.status(201).json({
        user: result,
        message: 'Account created successfully',
      })
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else if (error instanceof ConflictError) {
        logger.error({ error }, 'Conflict error:')
        res.status(409).json({ error: error.message })
      } else {
        logger.error({ error }, 'Error creating account:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }

  async loginAccountController(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = loginAccountUserSchema.parse(req.body)
      const result = await this.accountService.loginAccount(email, password)

      if (!result) {
        res.status(401).json({ error: 'Invalid email or password' })
        return
      }

      res.status(200).json({
        user: result.user,
        token: result.token,
        message: 'Login successful',
      })
    } catch (error) {
      logger.error({ error }, 'Error logging in account:')
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async listAccountsController(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await this.accountService.listAccounts()
      res.status(200).json(accounts)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error listing accounts:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else if (error instanceof ConflictError) {
        logger.error({ error }, 'Conflict error:')
        res.status(409).json({ error: error.message })
      } else {
        logger.error({ error }, 'Error listing accounts:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }

  async listAccountByIdController(req: Request, res: Response): Promise<void> {
    try {
      const { params } = getAccountUserSchema.parse({ params: req.params })
      const account = await this.accountService.listAccountById(params.id)
      res.status(200).json(account)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error listing account by ID:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else if (error instanceof NotFoundError) {
        logger.error({ error }, 'Account not found:')
        res.status(404).json({ error: error.message })
      } else {
        logger.error({ error }, 'Error listing account by ID:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }

  async listAccountByEmailController(req: Request, res: Response): Promise<void> {
    try {
      const { params } = getAccountByEmailSchema.parse({ params: req.params })
      const account = await this.accountService.findAccountByEmail(params.email)
      if (!account) {
        res.status(404).json({ error: 'Account not found' })
        return
      }
      res.status(200).json(account)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error listing account by email:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else {
        logger.error({ error }, 'Error listing account by email:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }

  async updateAccountController(req: Request, res: Response): Promise<void> {
    try {
      const { body, params } = updateAccountUserSchema.parse({
        body: req.body,
        params: req.params,
      })
      const account = await this.accountService.updateAccount(params.id, body)
      res.status(200).json(account)
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error updating account:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else if (error instanceof NotFoundError) {
        logger.error({ error }, 'Account not found:')
        res.status(404).json({ error: error.message })
      } else {
        logger.error({ error }, 'Error updating account:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }

  async deleteAccountController(req: Request, res: Response): Promise<void> {
    try {
      const { params } = deleteAccountUserSchema.parse({ params: req.params })
      await this.accountService.deleteAccount(params.id)
      res.status(204).send()
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ error }, 'Validation error deleting account:')
        res.status(400).json({ error: 'Validation failed', details: error.issues })
      } else if (error instanceof NotFoundError) {
        logger.error({ error }, 'Account not found:')
        res.status(404).json({ error: error.message })
      } else {
        logger.error({ error }, 'Error deleting account:')
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}
