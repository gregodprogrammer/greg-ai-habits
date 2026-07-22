import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { UpdateHabitDto } from '@/features/habits/dtos/update-habit.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { habitsService } = getContainer();
    const habit = await habitsService.getById(id, user.id);
    return successResponse(habit);
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = UpdateHabitDto.parse(await req.json());
    const { habitsService } = getContainer();
    const habit = await habitsService.update(id, user.id, body);
    return successResponse(habit);
  });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { habitsService } = getContainer();
    await habitsService.delete(id, user.id);
    return successResponse({ message: 'Habit deleted' });
  });
}
