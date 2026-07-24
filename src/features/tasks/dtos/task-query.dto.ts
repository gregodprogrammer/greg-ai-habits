import { z } from 'zod';

export const TaskQueryDto = z.object({
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  project_id: z.string().uuid().optional(),
  overdue: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(500).optional().default(100),
});

export type TaskQueryDtoType = z.infer<typeof TaskQueryDto>;
