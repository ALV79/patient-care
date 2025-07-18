import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { upsertDoctor } from '@/actions/upsert-doctor'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  generateTimeOptions,
  TimeGroup,
  TimeOption,
} from '@/lib/utils/generate-available-time'

import { medicalEspecialties } from '../_constants'

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nome é obrigatório!' }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: 'Especialidade é obrigatório!' }),
    appointmentPrice: z
      .number()
      .min(1, { message: 'Preço da consulta é obrigatório!' }),
    availableFromWeekDay: z
      .string()
      .min(1, { message: 'Data inicial é obrigatório!' }),
    availableToWeekDay: z
      .string()
      .min(1, { message: 'Data final é obrigatório!' }),
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

interface UpsertDoctorFormProps {
  onSuccess?: () => void
}

const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      specialty: '',
      appointmentPrice: 0,
      availableFromWeekDay: '1',
      availableToWeekDay: '5',
      availableFromTime: '',
      availableToTime: '',
    },
  })

  const timeOptions = generateTimeOptions()
  const grouped = timeOptions.reduce(
    (acc, option) => {
      acc[option.group] = acc[option.group] || []
      acc[option.group].push(option)
      return acc
    },
    {} as Record<TimeGroup, TimeOption[]>
  )

  const daysOfTheWeek = [
    { label: 'domingo', value: '0' },
    { label: 'Segunda', value: '1' },
    { label: 'Terça', value: '2' },
    { label: 'Quarta', value: '3' },
    { label: 'Quinta', value: '4' },
    { label: 'Sexta', value: '5' },
    { label: 'Sábado', value: '6' },
  ]

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success('Médico adicionado com sucesso!')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erro ao adicionar médico!')
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      appointmentPriceInCents: values.appointmentPrice * 100,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicione médico</DialogTitle>
        <DialogDescription>Adicione um novo médico</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalEspecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da Consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue)
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$ "
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {daysOfTheWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {daysOfTheWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(grouped).map(([label, items]) => (
                      <SelectGroup key={label}>
                        <SelectLabel>{label}</SelectLabel>
                        {items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(grouped).map(([label, items]) => (
                      <SelectGroup key={label}>
                        <SelectLabel>{label}</SelectLabel>
                        {items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={upsertDoctorAction.isPending}
            >
              {upsertDoctorAction.isPending ? 'Salvando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export default UpsertDoctorForm
