import { contextBridge, ipcRenderer } from 'electron'

export type API = typeof api
const api = {
  getAuthState: (): Promise<string | undefined> => ipcRenderer.invoke('get_auth_state'),
  setToken: (token: string): Promise<void> => ipcRenderer.invoke('set_auth_token', token),
  login: (username: string, password: string, captcha?: string): Promise<{ ok: true, captcha: false, token: string } | { ok: true, captcha: true, captchaURL: string } | { ok: false, error: string }> => ipcRenderer.invoke('login', username, password, captcha),
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
