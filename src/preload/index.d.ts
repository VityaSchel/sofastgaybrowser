import { type API } from './index'

declare global {
  interface Window {
    api: API
  }
}

