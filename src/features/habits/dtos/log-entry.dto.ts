import { z } from 'zod';

export const LogEntryDto = z.object({
  logged_date: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  note: z.string().max(500).optional(),
});

export type LogEntryDtoType = z.infer<typeof LogEntryDto>;
