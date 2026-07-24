import { z } from 'zod';

export const CreateProjectDto = z.object({
  name: z.string().min(1).max(200),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#6366f1'),
  description: z.string().max(1000).nullable().optional(),
});

export type CreateProjectDtoType = z.infer<typeof CreateProjectDto>;

export const UpdateProjectDto = z.object({
  name: z.string().min(1).max(200).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  description: z.string().max(1000).nullable().optional(),
  is_archived: z.boolean().optional(),
});

export type UpdateProjectDtoType = z.infer<typeof UpdateProjectDto>;
