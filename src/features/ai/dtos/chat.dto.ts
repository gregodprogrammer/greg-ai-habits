import { z } from 'zod';

export const ChatDto = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
});

export type ChatDtoType = z.infer<typeof ChatDto>;
