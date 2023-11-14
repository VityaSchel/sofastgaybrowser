import React from 'react'
import { Login } from '../pages/login.tsx'
import { Home } from '../pages/home.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from '@/shared/store.ts'
import { AuthContext } from '@/shared/context/auth.ts'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | 'loading'>('loading')
  const [token, setToken] = React.useState('')
  
  React.useEffect(() => {
    store.get('token')
      .then(token => {
        setToken(token as string)
        setIsLoggedIn(Boolean(token))
      })
  }, [])

  const handleSubmitLogin = (token: string) => {
    setToken(token)
    setIsLoggedIn(true)
  }

  return (
    <AuthContext.Provider value={{ token }}>
      <div className='bg-neutral-900'>
        {isLoggedIn !== 'loading' && (
          isLoggedIn
            ? (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </BrowserRouter>
            )
            : <Login onSubmit={handleSubmitLogin} />
        )}
      </div>
    </AuthContext.Provider>
  )
}