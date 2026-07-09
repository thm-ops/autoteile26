import * as z from "zod"
import {registerDto} from "./registerDto.js";

export const loginDto = z.object({
    email: z.email(),
    password: z.string()
})

export type LoginDto = z.infer<typeof registerDto>
