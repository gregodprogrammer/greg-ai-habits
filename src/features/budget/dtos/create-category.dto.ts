import { z } from 'zod';

export const CreateCategoryDto = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense', 'both']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#6366f1'),
  icon: z.string().max(50).nullable().optional(),
});

export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;
