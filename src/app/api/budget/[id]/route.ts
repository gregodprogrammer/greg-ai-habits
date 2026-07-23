import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { UpdateTransactionDto } from '@/features/budget/dtos/update-transaction.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = UpdateTransactionDto.parse(await req.json());
    const { budgetService } = getContainer();
    const transaction = await budgetService.updateTransaction(id, user.id, body);
    return successResponse(transaction);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { budgetService } = getContainer();
    await budgetService.deleteTransaction(id, user.id);
    return successResponse(null);
  });
}
