import { NextRequest } from 'next/server';
import { requireAuth } from '@/middleware/auth.middleware';
import { CreateTransactionDto } from '@/features/budget/dtos/create-transaction.dto';
import { BudgetQueryDto } from '@/features/budget/dtos/budget-query.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = BudgetQueryDto.parse(params);
    const { budgetService } = getContainer();
    const transactions = await budgetService.getTransactions(user.id, query);
    return successResponse(transactions);
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const body = CreateTransactionDto.parse(await req.json());
    const { budgetService } = getContainer();
    const transaction = await budgetService.createTransaction(user.id, body);
    return successResponse(transaction, 201);
  });
}
