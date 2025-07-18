'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const deleteDoctor = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    const doctor = await prisma.doctor.findUnique({
      where: { id: parsedInput.id },
    })
    if (!doctor) {
      throw new Error('Médico não encontrado')
    }
    if (doctor.clinicID !== session.user.clinic?.id) {
      throw new Error('Não autorizado a excluir este médico')
    } else {
      await prisma.doctor.delete({
        where: {
          id: parsedInput.id,
        },
      })
    }
    revalidatePath('/doctors')
  })
