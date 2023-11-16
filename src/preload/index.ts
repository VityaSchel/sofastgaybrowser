import { contextBridge, ipcRenderer } from 'electron'

export type API = {
  getAuthState: () => Promise<string | undefined>
}

const api: API = {
  getAuthState: () => ipcRenderer.invoke('get_auth_state'),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Render context is not isolated')
}
