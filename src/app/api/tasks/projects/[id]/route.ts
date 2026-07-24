import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { UpdateProjectDto } from '@/features/tasks/dtos/create-project.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = UpdateProjectDto.parse(await req.json());
    const { tasksService } = getContainer();
    const project = await tasksService.updateProject(id, user.id, body);
    return successResponse(project);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { tasksService } = getContainer();
    await tasksService.deleteProject(id, user.id);
    return successResponse(null);
  });
}
