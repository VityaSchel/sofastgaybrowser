import React from 'react'
import { AuthContext } from '@/shared/context/auth'

export function Home() {
  // const { token } = React.useContext(AuthContext)!
  const data = {}
  
  return (
    <main className='w-full h-screen flex items-center justify-center'>
      {JSON.stringify(data)}
    </main>
  )
}