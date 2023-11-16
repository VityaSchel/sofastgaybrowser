import * as trpc from '@trpc/server'
import { z } from 'zod'
import PornolabAPI from 'gayporn'

const AuthTokenSchema = z.string().min(0)

export const appRouter = trpc
  .router()
  // .mutation('login', {
  //   input: z.object({
  //     token: z.string()
  //   }),
  //   async resolve({ input }) {
  //     input.token
  //     return true
  //   },
  // })
  .query('forum', {
    input: z.object({
      bbData: AuthTokenSchema,
      id: z.number().int().min(0)
    }),
    async resolve({ input }) {
      try {
        const pornolabApi = new PornolabAPI({ bbData: input.bbData })
        const result = await pornolabApi.getForum(input.id)
        return result
      } catch(e) {
        if(e instanceof Error) {
          return e.message
        }
      }
    }
  })

export type AppRouter = typeof appRouter;