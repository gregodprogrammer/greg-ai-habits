import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { ChatDto } from '@/features/ai/dtos/chat.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { aiService } = getContainer();
    const history = await aiService.getHistory(user.id);
    return successResponse(history);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = ChatDto.parse(await req.json());
    const { aiService } = getContainer();
    const result = await aiService.chat(user.id, body.message);
    return successResponse(result);
  });
}
