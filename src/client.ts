import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(
    withOptimize({
      apiKey: process.env.OPTIMIZE_API_KEY as string
    })
  )
}

// Prevent multiple instances of Prisma Client in development
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV === 'development') globalThis.prismaGlobal = prisma

export default prisma
