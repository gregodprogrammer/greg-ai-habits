import { z } from 'zod';

export const UpdateHabitDto = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
  target_count: z.coerce.number().int().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  is_archived: z.boolean().optional(),
});

export type UpdateHabitDtoType = z.infer<typeof UpdateHabitDto>;
