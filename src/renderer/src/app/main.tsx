import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from '@/shared/store'
import { AuthContext } from '@/shared/context/auth'

import { Login } from '@/pages/login'
import { Home } from '@/pages/home'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

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