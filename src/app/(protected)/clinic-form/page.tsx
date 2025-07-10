import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import ClinicForm from './_components/form'
const ClinicFormPage = () => {
  return (
    <Dialog open>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar clínica</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar clínica</DialogTitle>
          <DialogDescription>
            Adicione uma clínica para continuar.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm />
      </DialogContent>
    </Dialog>
  )
}

export default ClinicFormPage
