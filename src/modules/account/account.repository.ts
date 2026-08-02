import { Account } from '../../generated/prisma/client'
import { prismaClient } from '../../shared/database/database'

import {
  AccountUserResponseDTO,
  CreateAccountUserDTO,
  LoginAccountUserDTO,
  UpdateAccountUserBodyDTO,
} from './account.schema'

export interface IAccountRepository {
  create(account: CreateAccountUserDTO): Promise<AccountUserResponseDTO>
  findUnique(id: string): Promise<AccountUserResponseDTO | null>
  update(id: string, account: UpdateAccountUserBodyDTO): Promise<AccountUserResponseDTO>
  delete(id: string): Promise<void>
  findByEmail(email: string): Promise<AccountUserResponseDTO | null>
  findMany(): Promise<AccountUserResponseDTO[]>
  findForAuth(email: string): Promise<Account | null>
}

export class AccountRepository implements IAccountRepository {
  async create(data: CreateAccountUserDTO): Promise<AccountUserResponseDTO> {
    const account = await prismaClient.account.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    })

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }
  }

  async findUnique(id: string): Promise<AccountUserResponseDTO | null> {
    const account = await prismaClient.account.findUnique({
      where: { id },
    })

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }
  }

  async update(id: string, data: UpdateAccountUserBodyDTO): Promise<AccountUserResponseDTO> {
    const account = await prismaClient.account.update({
      where: { id },
      data,
    })

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }
  }

  async delete(id: string): Promise<void> {
    await prismaClient.account.delete({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<AccountUserResponseDTO | null> {
    const account = await prismaClient.account.findUnique({
      where: { email },
    })

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }
  }

  async findMany(): Promise<AccountUserResponseDTO[]> {
    const accounts = await prismaClient.account.findMany()

    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }))
  }

  async findForAuth(email: string): Promise<Account | null> {
    const account = await prismaClient.account.findUnique({
      where: { email },
    })

    if (!account) return null

    return account
  }
}
