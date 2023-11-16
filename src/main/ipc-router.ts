import { store } from './store'

export function GetAuthState() {
  return store.get('token')
}