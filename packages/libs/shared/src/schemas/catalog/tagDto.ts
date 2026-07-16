import * as z from "zod"

const tagShape = {
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric and hyphen-separated'),
}

export const createTagDto = z.object(tagShape).strict()
export type CreateTagDto = z.infer<typeof createTagDto>

export const updateTagDto = z.object(tagShape).partial().strict()
export type UpdateTagDto = z.infer<typeof updateTagDto>
