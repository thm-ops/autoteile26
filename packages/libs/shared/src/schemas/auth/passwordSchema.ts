import { z } from "zod";

const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/\d/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/g, "Must contain at least one special character");
export default passwordSchema;
