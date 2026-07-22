import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { LogEntryDto } from '@/features/habits/dtos/log-entry.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = LogEntryDto.parse(await req.json());
    const { habitsService } = getContainer();
    const entry = await habitsService.logEntry(id, user.id, body);
    return successResponse(entry, 201);
  });
}
