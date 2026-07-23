import { env } from '@/config/env';
import { ConsoleLogger } from '@/infrastructure/logger/console.logger';
import { getDbClient } from '@/infrastructure/db/client';
import { SupabaseAuthProvider } from '@/providers/auth/supabase-auth.provider';
import { OpenAIProvider } from '@/providers/ai/openai.provider';
import { SupabaseStorageProvider } from '@/providers/storage/supabase-storage.provider';
import { AuthRepository } from '@/features/auth/auth.repository';
import { AuthService } from '@/features/auth/auth.service';
import { HabitsRepository } from '@/features/habits/habits.repository';
import { HabitsService } from '@/features/habits/habits.service';
import { AnalyticsRepository } from '@/features/analytics/analytics.repository';
import { AnalyticsService } from '@/features/analytics/analytics.service';
import { ConversationRepository } from '@/features/ai/conversation.repository';
import { AIService } from '@/features/ai/ai.service';
import { BudgetRepository } from '@/features/budget/budget.repository';
import { BudgetService } from '@/features/budget/budget.service';

function buildContainer() {
  const logger = new ConsoleLogger('App');
  const db = getDbClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const authProvider = new SupabaseAuthProvider(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    logger,
  );
  const aiProvider = new OpenAIProvider(env.OPENAI_API_KEY, env.OPENAI_MODEL, logger);
  const storageProvider = new SupabaseStorageProvider(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    logger,
  );

  const authRepository = new AuthRepository(db, logger);
  const habitsRepository = new HabitsRepository(db, logger);
  const analyticsRepository = new AnalyticsRepository(db, logger);
  const conversationRepository = new ConversationRepository(db, logger);
  const budgetRepository = new BudgetRepository(db, logger);

  const authService = new AuthService(authProvider, authRepository, logger);
  const habitsService = new HabitsService(habitsRepository, logger);
  const analyticsService = new AnalyticsService(analyticsRepository, logger);
  const aiService = new AIService(aiProvider, conversationRepository, logger);
  const budgetService = new BudgetService(budgetRepository, logger);

  return {
    logger,
    authService,
    habitsService,
    analyticsService,
    aiService,
    budgetService,
    storageProvider,
  };
}

// Singleton: built once per process (server) or per request (edge/serverless uses caution)
let _container: ReturnType<typeof buildContainer> | null = null;

export function getContainer(): ReturnType<typeof buildContainer> {
  if (!_container) {
    _container = buildContainer();
  }
  return _container;
}
