import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/middleware/auth.middleware';
import { LogEntryDto } from '@/features/habits/dtos/log-entry.dto';
import { getContainer } from '@/shared/lib/container';
import { successResponse } from '@/shared/utils/api-response';
import { handleRoute } from '@/shared/utils/route-handler';

const EntryQuerySchema = z.object({
  from: z.string().date('from must be YYYY-MM-DD'),
  to: z.string().date('to must be YYYY-MM-DD'),
});

const DeleteEntryQuerySchema = z.object({
  date: z.string().date('Must be a valid date (YYYY-MM-DD)'),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { from, to } = EntryQuerySchema.parse({
      from: req.nextUrl.searchParams.get('from'),
      to: req.nextUrl.searchParams.get('to'),
    });
    const { habitsService } = getContainer();
    const entries = await habitsService.getEntries(id, user.id, from, to);
    return successResponse(entries);
  });
}

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

export async function DELETE(req: NextRequest, { params }: Params) {
  return handleRoute(async () => {
    const user = await requireAuth(req);
    const { id } = await params;
    const { date } = DeleteEntryQuerySchema.parse({ date: req.nextUrl.searchParams.get('date') });
    const { habitsService } = getContainer();
    await habitsService.deleteEntry(id, user.id, date);
    return successResponse(null);
  });
}
