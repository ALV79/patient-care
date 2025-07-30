import { Suspense } from 'react'

import { DataTable } from '@/components/ui/data-table'
import { PageContainer } from '@/components/ui/page-container'
import prisma from '@/lib/prisma'

import { AddPatientButton } from './_components/add-patient-button'
// import { PatientCard } from './_components/patient-card'
import { patientsTableColumns } from './_components/table-columns'

// async function PatientList({ clinicID }: { clinicID: string }) {
//   const patients = await prisma.patient.findMany({
//     where: {
//       clinicID,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   })

//   if (patients.length === 0) {
//     return (
//       <div className="mt-10 text-center">
//         <p className="text-muted-foreground">Nenhum paciente cadastrado.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {patients.map((patient) => (
//         <PatientCard key={patient.id} patient={patient} clinicID={clinicID} />
//       ))}
//     </div>
//   )
// }

export default async function PatientsPage() {
  const clinic = await prisma.clinic.findFirst()

  if (!clinic) {
    return null
  }

  const patients = await prisma.patient.findMany({
    where: {
      clinicID: clinic.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Gerencie os pacientes da clínica.
          </p>
        </div>
        <AddPatientButton clinicID={clinic.id} />
      </div>

      <Suspense
        fallback={
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">Carregando pacientes...</p>
          </div>
        }
      >
        <DataTable data={patients} columns={patientsTableColumns} />
        {/* <PatientList clinicID={clinic.id} /> */}
      </Suspense>
    </PageContainer>
  )
}
