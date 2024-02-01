import { z } from 'zod'

export const schema = z.object({
    name: z.string().min(3),
    password: z.string().optional()
})

export type CreateRoomFormFields = z.infer<typeof schema>