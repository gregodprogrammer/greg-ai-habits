import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { CreateTaskDto } from '@/features/tasks/dtos/create-task.dto';
import { TaskQueryDto } from '@/features/tasks/dtos/task-query.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = TaskQueryDto.parse(params);
    const { tasksService } = getContainer();
    const tasks = await tasksService.getTasks(user.id, query);
    return successResponse(tasks);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = CreateTaskDto.parse(await req.json());
    const { tasksService } = getContainer();
    const task = await tasksService.createTask(user.id, body);
    return successResponse(task, 201);
  });
}
