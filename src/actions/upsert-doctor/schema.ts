import { z } from 'zod'

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, { message: 'Nome é obrigatório!' }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: 'Especialidade é obrigatório!' }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: 'Preço da consulta é obrigatório!' }),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z
      .string()
      .min(1, { message: 'Hora de inicio é obrigatório!' }),
    availableToTime: z
      .string()
      .min(1, { message: 'Hora de término é obrigatório!' }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime
    },
    {
      message:
        'A hora de término não pode ser anterior ou igual à hora de início!',
      path: ['availableToTime'],
    }
  )
  .refine(
    (data) => {
      return data.availableFromWeekDay < data.availableToWeekDay
    },
    {
      message: 'O dia final não pode ser anterior ou igual ao dia inicial!',
      path: ['availableToWeekDay'],
    }
  )
