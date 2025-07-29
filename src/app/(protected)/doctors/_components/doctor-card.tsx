'use client'
import { Doctor } from '@prisma/client'
import { CalendarIcon, ClockIcon, DollarSign, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteDoctor } from '@/actions/delete-doctor'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatCurrencyInCents } from '@/helpers/currency'

import { getAvailability } from '../_helpers/availability'
import UpsertDoctorForm from './upsert-doctor-form'

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const { execute: executeDelete, isPending } = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success('Médico adicionado com sucesso!')
      router.refresh()
    },
    onError: () => {
      toast.error('Erro ao adicionar médico!')
    },
  })

  const doctorInitials = doctor.name
    .split(' ')
    .map((name) => name[0])
    .join('')
  const availability = getAvailability(doctor)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {doctorInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="to-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="secondary" className="rounded-full">
          <CalendarIcon className="mr-1" />
          {availability.from.format('dddd')} a {availability.to.format('dddd')}
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          <ClockIcon className="mr-1" />
          {availability.from.format('HH:mm')} às{' '}
          {availability.to.format('HH:mm')}
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          <DollarSign className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format('HH:mm:ss'),
              availableToTime: availability.to.format('HH:mm:ss'),
            }}
            onSuccess={() => setDialogOpen(false)}
            isOpen={dialogOpen}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="text-destructive border-destructive w-full hover:bg-red-100 hover:text-red-800"
            >
              <TrashIcon />
              Excluir médico
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não poderá ser desfeita. Isso excluirá permanentemente
                o médico <strong>{doctor.name}</strong> e todas as suas
                informações.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => executeDelete({ id: doctor.id })}
                disabled={isPending}
                className="bg-destructive hover:bg-red-800 hover:text-red-200"
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
