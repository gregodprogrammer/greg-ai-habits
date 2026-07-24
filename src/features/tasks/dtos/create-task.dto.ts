import { z } from 'zod';

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>;
