import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', {
      getAuthState: () => ipcRenderer.invoke('get_auth_state'),
    })
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Render context is not isolated')
}
