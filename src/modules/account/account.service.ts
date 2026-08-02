import { IAccountRepository } from './account.repository'
import logger from '../../shared/lib/logger'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  AccountUserResponseDTO,
  CreateAccountUserDTO,
  LoginResponseDTO,
  UpdateAccountUserBodyDTO,
} from './account.schema'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async createAccount(data: CreateAccountUserDTO): Promise<AccountUserResponseDTO> {
    const emailAlreadyInUse = await this.accountRepository.findByEmail(data.email)
    if (emailAlreadyInUse) {
      throw new ConflictError(`Email ${data.email} is already in use.`)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const account = await this.accountRepository.create({
      ...data,
      password: hashedPassword,
    })

    logger.info(`Account created with ID: ${account.id}`)

    return account
  }

  async loginAccount(email: string, password: string): Promise<LoginResponseDTO | null> {
    const account = await this.accountRepository.findForAuth(email)

    if (!account) return null

    const isPasswordValid = await bcrypt.compare(password, account.password)
    if (!isPasswordValid) return null

    const userSafeData = {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    const token = jwt.sign({ id: account.id }, secret, { expiresIn: '1d' })

    return {
      user: userSafeData,
      token,
    }
  }

  async listAccounts(): Promise<AccountUserResponseDTO[]> {
    return this.accountRepository.findMany()
  }

  async listAccountById(id: string): Promise<AccountUserResponseDTO> {
    const account = await this.accountRepository.findUnique(id)
    if (!account) {
      throw new NotFoundError(`Account not found with ID: ${id}`)
    }
    return account
  }

  async findAccountByEmail(email: string): Promise<AccountUserResponseDTO | null> {
    return this.accountRepository.findByEmail(email)
  }

  async updateAccount(id: string, data: UpdateAccountUserBodyDTO): Promise<AccountUserResponseDTO> {
    const existingAccount = await this.accountRepository.findUnique(id)
    if (!existingAccount) {
      throw new NotFoundError(`Account not found with ID: ${id}`)
    }

    let dataToUpdate = { ...data }
    if (data.password) {
      dataToUpdate.password = await bcrypt.hash(data.password, 10)
    }

    if (data.email && data.email !== existingAccount.email) {
      const emailInUse = await this.accountRepository.findByEmail(data.email)
      if (emailInUse) throw new ConflictError(`Email ${data.email} is already in use.`)
    }

    const updatedAccount = await this.accountRepository.update(id, dataToUpdate)
    logger.info(`Account updated with ID: ${updatedAccount.id}`)
    return updatedAccount
  }

  async deleteAccount(id: string): Promise<void> {
    const existingAccount = await this.accountRepository.findUnique(id)
    if (!existingAccount) {
      throw new NotFoundError(`Account not found with ID: ${id}`)
    }
    await this.accountRepository.delete(id)
    logger.info(`Account deleted with ID: ${id}`)
  }
}
