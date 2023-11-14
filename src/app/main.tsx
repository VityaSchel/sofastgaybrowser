import React from 'react'
import '@/shared/styles/global.scss'
import '@/shared/styles/tailwind.css'
import ReactDOM from 'react-dom/client'
import { Login } from '../pages/login.tsx'
import { Home } from '../pages/home.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  const loggedIn = true

  return (
    loggedIn
      ? <ApiWrapper />
      : <Login />
  )
}

import { QueryClient, QueryClientProvider } from 'react-query'
import { listen, TauriEvent } from '@tauri-apps/api/event'
import { Command } from '@tauri-apps/api/shell'

import { trpc } from '../shared/trpc.ts'

/**
 * Running NodeJS process as a sidecar
 */
const cmd = Command.sidecar('binaries/app')

cmd.spawn().then((child) => {
  /**
   * Killing server process when window is closed. Probably won't
   * work for multi window application
   */
  listen(TauriEvent.WINDOW_DESTROYED, function () {
    child.kill()
  })
})

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
  url: 'http://localhost:3000/api'
})

function ApiWrapper() {

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  )
}