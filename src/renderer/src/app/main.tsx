import React from 'react'
import '@/shared/styles/tailwind.css'
import '@/shared/styles/globals.scss'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '@/shared/context/auth'

import { Login } from '@/pages/login'
import { Home } from '@/pages/home'
import { ForumPage } from '@/pages/forums/[id]'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

export function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | 'loading'>('loading')
  const [token, setToken] = React.useState('')

  React.useEffect(() => {
    window.api.getAuthState()
      .then(token => {
        if(!token) {
          setIsLoggedIn(false)
        } else {
          window.api.setBBData(token)
            .then(() => {
              setIsLoggedIn(true)
              setToken(token)
            })
        }
      })
  }, [])

  const handleSubmitLogin = (token: string) => {
    setToken(token)
    setIsLoggedIn(true)
  }

  return (
    <AuthContext.Provider value={{ token }}>
      <div className='bg-neutral-900 min-h-screen'>
        {isLoggedIn !== 'loading' && (
          isLoggedIn
            ? (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path='/forums/:id' element={<ForumPage />} />
                </Routes>
              </BrowserRouter>
            )
            : <Login onSubmit={handleSubmitLogin} />
        )}
      </div>
    </AuthContext.Provider>
  )
}