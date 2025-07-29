'use server'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

import { schema } from './schema'

export const upsertPatient = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    console.log('Upsert Patient Action:', parsedInput)

    if (parsedInput.id) {
      const { id: _id, ...dataWithoutId } = parsedInput
      const patient = await prisma.patient.update({
        where: { id: _id },
        data: dataWithoutId,
      })
      revalidatePath('/patients')
      return { patient }
    }

    const patient = await prisma.patient.create({
      data: { ...parsedInput },
    })
    revalidatePath('/patients')
    return { patient }
  })
