import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'
import 'dotenv/config'

const connectionDatabaseUrl = process.env.DATABASE_URL

const adapter = new PrismaPg({
  connectionString: connectionDatabaseUrl,
})
export const prismaClient = new PrismaClient({ adapter })
