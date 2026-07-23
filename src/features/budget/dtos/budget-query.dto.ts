import { z } from 'zod';

export const BudgetQueryDto = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional(),
  type: z.enum(['income', 'expense']).optional(),
  category_id: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});

export type BudgetQueryDtoType = z.infer<typeof BudgetQueryDto>;
