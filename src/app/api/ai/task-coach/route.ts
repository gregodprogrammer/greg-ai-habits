import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';
import { z } from 'zod';

const MessageDto = z.object({ message: z.string().min(1).max(2000) });

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { aiService } = getContainer();
    const history = await aiService.getTaskHistory(user.id);
    return successResponse(history);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { message } = MessageDto.parse(await req.json());
    const { aiService, tasksService } = getContainer();

    const stats = await tasksService.getStats(user.id);
    const result = await aiService.taskChat(user.id, message, stats);
    return successResponse(result);
  });
}
