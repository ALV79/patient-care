'use client'

import { Mail, Phone, VenusAndMars } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deletePatient } from '@/actions/delete-patient'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { UpsertPatientForm } from './upsert-patient-form'

interface Props {
  patient: {
    id: string
    name: string
    email: string
    phone: string
    sex: 'male' | 'female'
  }
  clinicID: string
}

export function PatientCard({ patient, clinicID }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const patientInitials = patient.name
    .split(' ')
    .map((name) => name[0])
    .join('')

  const getSexLabel = (sex: 'male' | 'female') => {
    return sex === 'male' ? 'Masculino' : 'Feminino'
  }

  const { execute: executeDelete, isPending } = useAction(deletePatient, {
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso!')
      router.refresh()
    },
    onError: () => {
      toast.error('Erro ao excluir paciente. Tente novamente.')
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {patientInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{patient.name}</h3>
            <p className="to-muted-foreground text-sm">
              {getSexLabel(patient.sex)}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <Mail className="mr-1 h-3 w-3" />
          {patient.email}
        </Badge>
        <Badge variant="outline">
          <Phone className="mr-1 h-3 w-3" />
          {patient.phone}
        </Badge>
        <Badge variant="outline">
          <VenusAndMars className="mr-1 h-3 w-3" />
          {getSexLabel(patient.sex)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar paciente</DialogTitle>
            </DialogHeader>
            <UpsertPatientForm
              defaultValues={patient}
              clinicID={clinicID}
              onSuccess={() => {
                setIsOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className="text-destructive border-destructive w-full hover:bg-red-100 hover:text-red-800"
            >
              Excluir paciente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não poderá ser desfeita. Isso excluirá permanentemente
                o paciente <strong>{patient.name}</strong> e todas as suas
                informações.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => executeDelete({ id: patient.id })}
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
