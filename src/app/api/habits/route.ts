import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { CreateHabitDto } from '@/features/habits/dtos/create-habit.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { habitsService } = getContainer();
    const habits = await habitsService.getAll(user.id);
    return successResponse(habits);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = CreateHabitDto.parse(await req.json());
    const { habitsService } = getContainer();
    const habit = await habitsService.create(user.id, body);
    return successResponse(habit, 201);
  });
}
