import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { CreateCategoryDto } from '@/features/budget/dtos/create-category.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { budgetService } = getContainer();
    const categories = await budgetService.getCategories(user.id);
    return successResponse(categories);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = CreateCategoryDto.parse(await req.json());
    const { budgetService } = getContainer();
    const category = await budgetService.createCategory(user.id, body);
    return successResponse(category, 201);
  });
}
