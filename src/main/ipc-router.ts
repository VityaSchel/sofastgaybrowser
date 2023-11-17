import { store } from './store'
import { CaptchaRequiredError, CredentialsIncorrectError, PornolabAPI } from 'gayporn'

const api = new PornolabAPI({ 
  proxy: {
    host: '127.0.0.1',
    port: 9150,
    type: 5
  } 
})

export function GetAuthState() {
  return store.get('token')
}

export function SetAuthToken(token: string) {
  return store.set('token', token)
}

let captchaInternals: any
export async function Login(username: string, password: string, captchaSolution?: string) {
  const captcha = captchaSolution ? {
    solution: captchaSolution,
    internals: captchaInternals
  } : undefined
  try {
    const token = await api.login({ username, password, captcha })
    return { ok: true, token }
  } catch (e) {
    if (e instanceof CaptchaRequiredError) {
      captchaInternals = e.captcha.internals
      return { ok: true, captchaURL: e.captcha.url }
    } else if (e instanceof CredentialsIncorrectError) {
      return { ok: false, error: 'Некорректные данные для входа' }
    } else {
      throw e
    }
  }
}