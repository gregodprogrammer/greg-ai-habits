import { z } from 'zod';

export const UpdateTransactionDto = z.object({
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category_id: z.string().uuid().nullable().optional(),
  is_recurring: z.boolean().optional(),
  recurring_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type UpdateTransactionDtoType = z.infer<typeof UpdateTransactionDto>;
