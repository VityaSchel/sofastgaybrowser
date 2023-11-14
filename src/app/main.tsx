import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/shared/styles/global.scss'
import { Login } from '../pages/login.tsx'
import { Home } from '../pages/home.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  const loggedIn = false

  return (
    loggedIn
      ? <Login />
      : <Home />
  )
}