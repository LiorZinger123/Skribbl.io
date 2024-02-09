import { z } from 'zod'

export const schema = z.object({
    username: z.string().min(8, "Username must contain at least 8 characters"),
    password: z.string().min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain maximum 20 characters")
    .refine(val => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/.test(val),
    "Password should contain at least one upper case letter, one lower case letter and one number"),
    submitPassword: z.string(),
    email: z.string().email()
})

export type SignUpFormFields = z.infer<typeof schema>