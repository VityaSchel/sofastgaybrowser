import type { PornolabAPI } from 'gayporn'
import { store } from './store'
import _ from 'lodash'
import { dialog } from 'electron'
import { mainWindow } from './index'
import fs from 'fs/promises'
import { ExecException, exec } from 'child_process'
import path from 'path'
import { TorrentFile } from 'gayporn/out/model/torrent-file'
import tmp from 'tmp'

let Pornolab: typeof import('gayporn')
import('gayporn')
  .then(pornolabImports => { 
    Pornolab = pornolabImports
    getAPI()
  })


let api: PornolabAPI
function getAPI() {
  api = new Pornolab.PornolabAPI({
    proxy: {
      host: '127.0.0.1',
      port: 9150,
      type: 5
    }
  })
}

export function GetAuthState() {
  return store.get('token')
}

export async function SetAuthToken(token: string): Promise<boolean> {
  api.setAuthToken({ bbData: token })
  const isLoggedIn = await api.isLoggedIn()
  if (isLoggedIn) {
    store.set('token', token)
    return true
  } else {
    return false
  }
}

export function SetBBData(token: string) {
  api.setAuthToken({ bbData: token })
}

let captchaInternals: any
export async function Login(username: string, password: string, captchaSolution?: string) {
  const captcha = captchaSolution ? {
    solution: captchaSolution,
    internals: captchaInternals
  } : undefined
  try {
    const token = await api.login({ username, password, captcha })
    store.set('token', token)
    return { ok: true, token }
  } catch (e) {
    if (e instanceof Pornolab.CaptchaRequiredError) {
      captchaInternals = e.captcha.internals
      return { ok: true, captcha: true, captchaURL: e.captcha.url }
    } else if (e instanceof Pornolab.CredentialsIncorrectError) {
      return { ok: false, error: 'Некорректные данные для входа' }
    } else {
      throw e
    }
  }
}

export async function GetForum(forumID: number, page = 0) {
  const topics = await api.getForum(forumID, { offset: page * 50 })
  return topics
}

export async function GetTopic(topicID: number) {
  const topic = await api.getTopic(topicID)
  return _.omit(topic, 'torrent.download')
}

async function downloadFile(topicId: number): Promise<{ ok: true, file: TorrentFile } | { ok: false, error?: string }> {
  try {
    const file = await api.downloadTopicFile(topicId)
    return { ok: true, file }
  } catch (e) {
    console.error(e)
    if (e instanceof Error && 'message' in e) {
      return { ok: false, error: e.message }
    } else {
      return { ok: false }
    }
  }
}

export async function SaveFile(topicId: number) {
  const result = await downloadFile(topicId)
  if (!result.ok) return result
  const file = result.file
  const returnValue = await dialog.showSaveDialog(mainWindow!, {
    properties: ['showOverwriteConfirmation', 'dontAddToRecent', 'createDirectory'],
    title: 'Сохранить Torrent файл',
    defaultPath: file.name
  })
  if (!returnValue.canceled) {
    const filePath = returnValue.filePath!
    await fs.writeFile(filePath, Buffer.from(file.content))
  }
  return { ok: true }
}

export async function OpenFile(topicId: number) {
  const result = await downloadFile(topicId)
  if (!result.ok) return result

  const file = tmp.fileSync()

  const normalizedPath = path.normalize(file.name) + '.torrent'

  await fs.writeFile(normalizedPath, Buffer.from(result.file.content))
  
  let command

  enum Platform {
    macOS = 'darwin',
    Windows = 'win32',
    Linux = 'linux'
  }
  switch (process.platform) {
    case Platform.macOS:
      command = `open "${normalizedPath}"`
      break
    case Platform.Windows:
      command = `start "" "${normalizedPath}"`
      break
    default:
      command = `xdg-open "${normalizedPath}"`
  }

  const error = await new Promise<ExecException | null>(resolve => exec(command, (error) => resolve(error)))
  
  if (error) {
    console.error(`Error opening file: ${error}`)
    return { ok: false, error: error.message }
  }
  console.log(`Torrent file opened successfully: ${normalizedPath}`)
  return { ok: true }
}