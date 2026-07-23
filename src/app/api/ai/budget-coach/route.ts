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
    const history = await aiService.getBudgetHistory(user.id);
    return successResponse(history);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { message } = MessageDto.parse(await req.json());
    const { aiService, budgetService } = getContainer();

    // Inject current month's summary as context for the AI
    const now = new Date();
    const summary = await budgetService.getSummary(user.id, now.getMonth() + 1, now.getFullYear());

    const result = await aiService.budgetChat(user.id, message, summary);
    return successResponse(result);
  });
}
