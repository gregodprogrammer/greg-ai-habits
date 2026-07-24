import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { CreateProjectDto } from '@/features/tasks/dtos/create-project.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { tasksService } = getContainer();
    const projects = await tasksService.getProjects(user.id);
    return successResponse(projects);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = CreateProjectDto.parse(await req.json());
    const { tasksService } = getContainer();
    const project = await tasksService.createProject(user.id, body);
    return successResponse(project, 201);
  });
}
