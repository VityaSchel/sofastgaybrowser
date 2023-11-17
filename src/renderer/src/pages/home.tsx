// import React from 'react'
// import { AuthContext } from '@/shared/context/auth'
import { Navigate } from 'react-router-dom'

// import GayPornForumThumbnail from '@/assets/'

export function Home() {
  // const { token } = React.useContext(AuthContext)!

  return (
    <Navigate replace to='/forums/1688' />
  )
  
  return (
    <main className='w-full h-screen flex items-center justify-center'>
      <ForumThumb

      />
    </main>
  )
}

function ForumThumb() {
  return (
    <img src='@/'></img>
  )
}