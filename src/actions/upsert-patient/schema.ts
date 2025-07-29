import { z } from 'zod'

export const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  sex: z.enum(['male', 'female']),
  clinicID: z.string(),
})

export type Schema = z.infer<typeof schema>
