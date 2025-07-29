'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { UpsertPatientForm } from './upsert-patient-form'

interface Props {
  clinicID: string
}

export function AddPatientButton({ clinicID }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar paciente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar paciente</DialogTitle>
        </DialogHeader>
        <UpsertPatientForm
          clinicID={clinicID}
          onSuccess={() => {
            setIsOpen(false)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
