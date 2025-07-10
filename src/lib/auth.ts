// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { customSession } from 'better-auth/plugins'

const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const clinicsUser = await prisma.user.findMany({
        where: {
          id: session.userId,
        },
        include: {
          clinics: true,
        },
      })
      const clinic = clinicsUser?.[0].clinics?.[0] || undefined
      return {
        user: {
          ...user,
          clinic,
        },
        session,
      }
    }),
  ],
})
