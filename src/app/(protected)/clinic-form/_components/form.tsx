'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// import { createClinic } from '@/actions/create-clinic'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const clinicSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }),
  address: z.string().trim().min(1, { message: 'Endereço é obrigatório' }),
  phone: z.string().trim().min(1, { message: 'Telefone é obrigatório' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Email inválido' })
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .url({ message: 'Endereço incorreto' })
    .optional()
    .or(z.literal('')),
})

const ClinicForm = () => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof clinicSchema>) => {
    const response = await fetch('/api/clinic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data?.email ?? undefined,
        website: data?.website ?? undefined,
      }),
    })
    const clinic = await response.json()

    if (response.ok) {
      toast.success(`Clínica ${clinic.name} criada com sucesso!`)
      router.push('/dashboard')
    } else {
      toast.error(clinic?.message || 'Erro ao criar clínica.')
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome da clínica" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Endereço da clínica" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Telefone da clínica"
                    type="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="E-mail da clínica"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="Website da clínica"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Criar Clínica
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default ClinicForm
