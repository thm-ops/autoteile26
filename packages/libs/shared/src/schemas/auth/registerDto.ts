import * as z from "zod"
import passwordSchema from "./passwordSchema.js";

export const registerDto = z.object({
    email: z.email(),
    password: passwordSchema
})

export type RegisterDto = z.infer<typeof registerDto>
