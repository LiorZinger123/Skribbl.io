import { z } from 'zod'

export const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
})

export type LoginFormFields = z.infer<typeof schema>