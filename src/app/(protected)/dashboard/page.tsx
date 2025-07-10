import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import SignOutButton from './_components/sign-out-button'

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }

  const userToClinic = await prisma.user.findUnique({
    where: { id: session?.user.id },
    include: { clinics: true },
  })

  if (!userToClinic?.clinics || userToClinic.clinics.length === 0) {
    redirect('/clinic-form')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session?.user.name}</p>
      <p>{session?.user.email}</p>
      <SignOutButton />
    </div>
  )
}

export default DashboardPage
