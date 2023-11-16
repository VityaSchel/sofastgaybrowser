import { AuthContext } from '@/shared/context/auth'
import { trpc } from '@/shared/trpc'
import React from 'react'

export function Home() {
  const { token } = React.useContext(AuthContext)!
  const { data } = trpc.useQuery(['forum', { bbData: token, id: 1777 }])

  return (
    <main className='w-full h-screen flex items-center justify-center'>
      {JSON.stringify(data)}
    </main>
  )
}