import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  display_name: z.string().min(1).max(100).optional(),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
