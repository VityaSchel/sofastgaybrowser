import React from 'react'
import '@/shared/styles/global.scss'
import '@/shared/styles/tailwind.css'
import ReactDOM from 'react-dom/client'

import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

import { QueryClient, QueryClientProvider } from 'react-query'
import { listen, TauriEvent } from '@tauri-apps/api/event'
import { Command } from '@tauri-apps/api/shell'

import { trpc } from '../shared/trpc.ts'
import { App } from '@/app/app.tsx'

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


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
)