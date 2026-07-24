import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { UpdateTaskDto } from '@/features/tasks/dtos/update-task.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = UpdateTaskDto.parse(await req.json());
    const { tasksService } = getContainer();
    const task = await tasksService.updateTask(id, user.id, body);
    return successResponse(task);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { tasksService } = getContainer();
    await tasksService.deleteTask(id, user.id);
    return successResponse(null);
  });
}
