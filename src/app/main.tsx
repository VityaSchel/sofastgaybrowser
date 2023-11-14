import React from 'react'
import '@/shared/styles/global.scss'
import '@/shared/styles/tailwind.css'
import ReactDOM from 'react-dom/client'
import { Login } from '../pages/login.tsx'
import { Home } from '../pages/home.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  const loggedIn = true
  const apiInstance = React.useMemo(() => {
    new 
  })

  return (
    loggedIn
      ? <Home />
      : <Login />
  )
}