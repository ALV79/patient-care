import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'

import { upsertPatient } from '@/actions/upsert-patient'
import { type Schema, schema } from '@/actions/upsert-patient/schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  defaultValues?: Partial<Schema>
  clinicID: string
  onSuccess?: () => void
  className?: string
}

export function UpsertPatientForm({
  defaultValues,
  clinicID,
  onSuccess,
  className,
}: Props) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      sex: 'male',
      ...defaultValues,
      clinicID,
    },
  })

  const { execute, isPending } = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        defaultValues?.id
          ? 'Paciente atualizado com sucesso!'
          : 'Paciente criado com sucesso!'
      )
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erro ao salvar paciente. Tente novamente.')
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do paciente</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do paciente" {...field} />
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Digite o e-mail" type="email" {...field} />
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
                <PatternFormat
                  format="(##) #####-####"
                  mask="_"
                  placeholder="(11) 99999-9999"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.value)
                  }}
                  customInput={Input}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {defaultValues?.id ? 'Salvando' : 'Salvar'} paciente
        </Button>
      </form>
    </Form>
  )
}
