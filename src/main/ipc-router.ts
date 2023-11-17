import type { PornolabAPI } from 'gayporn'
import { store } from './store'
import _ from 'lodash'

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

export function SetAuthToken(token: string) {
  return store.set('token', token)
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