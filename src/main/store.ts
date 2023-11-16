import Store, { Schema } from 'electron-store'

const schema: Schema<{ token: string }> = {
  token: {
    type: 'string',
  },
}

export const store = new Store({ schema })