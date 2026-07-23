import { IAIService, ChatResponse } from './ai.service.interface';
import { IConversationRepository } from './conversation.repository.interface';
import { IAIProvider } from '@/providers/ai/ai.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AIConversation, BudgetSummary, UUID } from '@/shared/types';

const HABITS_SYSTEM_PROMPT = `You are an AI habit coach for Greg AI Habits.
Help users build and maintain healthy habits. Be encouraging, practical, and concise.
Reference the user's habits and progress when discussing their routines.`;

const BUDGET_SYSTEM_PROMPT = `You are an AI budget coach for the AI Productivity Platform.
Help users understand their spending patterns, build healthy financial habits, and reach their savings goals.
Be specific, practical, and encouraging. When discussing numbers, be direct and clear.`;

function buildBudgetPrompt(summary?: BudgetSummary): string {
  if (!summary) return BUDGET_SYSTEM_PROMPT;
  return `${BUDGET_SYSTEM_PROMPT}

Current financial snapshot (${summary.month}/${summary.year}):
- Income this month: $${summary.total_income.toFixed(2)}
- Expenses this month: $${summary.total_expenses.toFixed(2)}
- Net this month: $${summary.net_balance.toFixed(2)}
- All-time running balance: $${summary.running_balance.toFixed(2)}
${summary.monthly_limit ? `- Monthly spending limit: $${summary.monthly_limit.toFixed(2)}` : ''}

Use this context to give personalised, data-driven advice.`;
}

export class AIService implements IAIService {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly conversationRepository: IConversationRepository,
    private readonly logger: ILogger,
  ) {}

  async chat(userId: UUID, message: string): Promise<ChatResponse> {
    this.logger.info('AIService.chat', { userId });

    await this.conversationRepository.save(userId, 'user', message, 'habits');

    const history = await this.conversationRepository.getHistory(userId, 10, 'habits');
    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    const completion = await this.aiProvider.chat(messages, HABITS_SYSTEM_PROMPT);

    await this.conversationRepository.save(userId, 'assistant', completion.message, 'habits');

    const updatedHistory = await this.conversationRepository.getHistory(userId, 20, 'habits');
    return { reply: completion.message, history: updatedHistory };
  }

  async getHistory(userId: UUID): Promise<AIConversation[]> {
    return this.conversationRepository.getHistory(userId, 50, 'habits');
  }

  async budgetChat(userId: UUID, message: string, summary?: BudgetSummary): Promise<ChatResponse> {
    this.logger.info('AIService.budgetChat', { userId });

    await this.conversationRepository.save(userId, 'user', message, 'budget');

    const history = await this.conversationRepository.getHistory(userId, 10, 'budget');
    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    const systemPrompt = buildBudgetPrompt(summary);
    const completion = await this.aiProvider.chat(messages, systemPrompt);

    await this.conversationRepository.save(userId, 'assistant', completion.message, 'budget');

    const updatedHistory = await this.conversationRepository.getHistory(userId, 20, 'budget');
    return { reply: completion.message, history: updatedHistory };
  }

  async getBudgetHistory(userId: UUID): Promise<AIConversation[]> {
    return this.conversationRepository.getHistory(userId, 50, 'budget');
  }
}
