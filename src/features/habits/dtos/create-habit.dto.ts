import { z } from 'zod';

export const CreateHabitDto = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  frequency: z.enum(['daily', 'weekly']).default('daily'),
  target_count: z.coerce.number().int().min(1).max(100).default(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color').optional(),
});

export type CreateHabitDtoType = z.infer<typeof CreateHabitDto>;
