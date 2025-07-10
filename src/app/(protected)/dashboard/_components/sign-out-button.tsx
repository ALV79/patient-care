'use client'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const SignOutButton = () => {
  const router = useRouter()
  return (
    <Button
      className="mt-4"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/authentication')
            },
          },
        })
      }
    >
      Sair
    </Button>
  )
}

export default SignOutButton
