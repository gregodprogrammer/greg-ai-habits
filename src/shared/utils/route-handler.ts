import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { errorResponse, ErrorCodes } from './api-response';

export async function handleRoute<T>(
  fn: () => Promise<NextResponse<T>>,
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AppError) {
      return errorResponse(err.code, err.message, err.statusCode, err.details);
    }
    if (err instanceof ZodError) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        422,
        err.flatten().fieldErrors,
      );
    }
    console.error('[UnhandledError]', err);
    return errorResponse(ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred', 500);
  }
}
