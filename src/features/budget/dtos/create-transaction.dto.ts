import { z } from 'zod';

export const CreateTransactionDto = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  description: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  category_id: z.string().uuid().nullable().optional(),
  is_recurring: z.boolean().optional().default(false),
  recurring_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateTransactionDtoType = z.infer<typeof CreateTransactionDto>;
