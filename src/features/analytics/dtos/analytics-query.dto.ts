import { z } from 'zod';

export const AnalyticsQueryDto = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export type AnalyticsQueryDtoType = z.infer<typeof AnalyticsQueryDto>;
