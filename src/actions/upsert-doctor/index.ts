'use server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

import { upsertDoctorSchema } from './schema'

dayjs.extend(utc)

export const upsertDoctor = actionClient
  .inputSchema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const availableFromTime = parsedInput.availableFromTime
    const availableToTime = parsedInput.availableToTime

    const avalableFromTimeUTC = dayjs()
      .set('hour', parseInt(availableFromTime.split(':')[0]))
      .set('minute', parseInt(availableFromTime.split(':')[1]))
      .set('second', parseInt(availableFromTime.split(':')[2]))
      .utc()
      .format('HH:mm:ss')
    const avalableToTimeUTC = dayjs()
      .set('hour', parseInt(availableToTime.split(':')[0]))
      .set('minute', parseInt(availableToTime.split(':')[1]))
      .set('second', parseInt(availableToTime.split(':')[2]))
      .utc()
      .format('HH:mm:ss')

    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    if (!session?.user.clinic?.id) {
      throw new Error('Clinic not found')
    }

    if (parsedInput.id) {
      const { id, ...dataWithoutId } = parsedInput
      await prisma.doctor.update({
        where: { id },
        data: {
          ...dataWithoutId,
          availableFromTime: avalableFromTimeUTC,
          availableToTime: avalableToTimeUTC,
        },
      })
    } else {
      await prisma.doctor.create({
        data: {
          ...parsedInput,
          availableFromTime: avalableFromTimeUTC,
          availableToTime: avalableToTimeUTC,
          clinics: {
            connect: { id: session.user.clinic.id },
          },
        },
      })
    }
    revalidatePath('/doctors')
  })
