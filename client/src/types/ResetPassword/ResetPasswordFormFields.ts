import { z } from 'zod'

export const schema = z.object({
    password: z.string().min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain maximum 20 characters")
    .refine(val => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/.test(val),
    "Password should contain at least one upper case letter, one lower case letter and one number"),
    submitPassword: z.string()
})

export type ResetPasswordFormFields = z.infer<typeof schema>