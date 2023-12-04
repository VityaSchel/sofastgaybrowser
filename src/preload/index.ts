import { contextBridge, ipcRenderer } from 'electron'
import { Forum } from 'gayporn/out/model/forum'
import { Topic } from 'gayporn/out/model/topic'

export type API = typeof api
const api = {
  getAuthState: (): Promise<string | undefined> => ipcRenderer.invoke('get_auth_state'),
  setToken: (token: string): Promise<boolean> => ipcRenderer.invoke('set_auth_token', token),
  login: (username: string, password: string, captcha?: string): Promise<{ ok: true, captcha: false, token: string } | { ok: true, captcha: true, captchaURL: string } | { ok: false, error: string }> => ipcRenderer.invoke('login', username, password, captcha),
  getForum: (forumID: number, page?: number): Promise<Forum> => ipcRenderer.invoke('get_forum', forumID, page),
  getTopic: async (topicID: number): Promise<Topic> => {
    if(topicsCache.has(topicID)) {
      return topicsCache.get(topicID)
    } else {
      const response = await ipcRenderer.invoke('get_topic', topicID)
      topicsCache.set(topicID, response)
      return response
    }
  },
  setBBData: (token: string) => ipcRenderer.invoke('set_bb_data', token),
  openTorrentFile: (topicId: number): Promise<{ ok: true } | { ok: false, error?: string }> => ipcRenderer.invoke('open_torrent_file', topicId),
  saveTorrentFile: (topicId: number): Promise<{ ok: true } | { ok: false, error?: string }> => ipcRenderer.invoke('save_torrent_file', topicId),
  onLogout: (callback) => {
    ipcRenderer.on('logout', (_, message) => callback(message))
  }
}

const topicsCache = new Map<number, any>()

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  throw new Error('Render context is not isolated')
}
