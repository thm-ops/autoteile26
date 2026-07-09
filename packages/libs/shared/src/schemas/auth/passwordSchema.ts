import { z } from "zod";

const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[a-zA-Z]/, "Must contain at least one letter")
    .regex(/\d/, "Must contain at least one number");
export default passwordSchema;
