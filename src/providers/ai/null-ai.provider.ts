import { IAIProvider, ChatCompletion, ChatMessage } from './ai.provider.interface';
import { AppError } from '@/shared/utils/errors';

export class NullAIProvider implements IAIProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async chat(_messages: ChatMessage[], _systemPrompt?: string): Promise<ChatCompletion> {
    throw new AppError(
      'AI_UNAVAILABLE',
      'AI features are not available in this deployment. Set the OPENAI_API_KEY environment variable to enable them.',
      503,
    );
  }
}
