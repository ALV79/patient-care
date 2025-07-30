'use client'

import { Patient } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => {
      const phone = row.original.phone
      if (!phone) return ''
      return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4')
    },
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => {
      const patient = row.original
      return patient.sex === 'male' ? 'Masculino' : 'Feminino'
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="text-primary border-primary hover:bg-blue-100 hover:text-blue-800"
            onClick={() => {
              // Logic to open upsert form with patient data
            }}
          >
            <Edit />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive border-destructive hover:bg-red-100 hover:text-red-800"
            onClick={() => {
              // Logic to delete patient
            }}
          >
            <Trash2 />
          </Button>
        </div>
      )
    },
  },
]
