import { IAIService, ChatResponse } from './ai.service.interface';
import { IConversationRepository } from './conversation.repository.interface';
import { IAIProvider } from '@/providers/ai/ai.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AIConversation, UUID } from '@/shared/types';

const SYSTEM_PROMPT = `You are an AI habit coach for Greg AI Habits.
Help users build and maintain healthy habits. Be encouraging, practical, and concise.
Reference the user's habits and progress when discussing their routines.`;

export class AIService implements IAIService {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly conversationRepository: IConversationRepository,
    private readonly logger: ILogger,
  ) {}

  async chat(userId: UUID, message: string): Promise<ChatResponse> {
    this.logger.info('AIService.chat', { userId });

    await this.conversationRepository.save(userId, 'user', message);

    const history = await this.conversationRepository.getHistory(userId, 10);
    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    const completion = await this.aiProvider.chat(messages, SYSTEM_PROMPT);

    await this.conversationRepository.save(userId, 'assistant', completion.message);

    const updatedHistory = await this.conversationRepository.getHistory(userId, 20);
    return { reply: completion.message, history: updatedHistory };
  }

  async getHistory(userId: UUID): Promise<AIConversation[]> {
    return this.conversationRepository.getHistory(userId, 50);
  }
}
