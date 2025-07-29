'use server'

import { z } from 'zod'

import prisma from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

const schema = z.object({
  id: z.string(),
})

export const deletePatient = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    await prisma.patient.delete({
      where: { id: parsedInput.id },
    })

    return { success: true }
  })
