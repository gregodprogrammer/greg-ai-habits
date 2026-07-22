import OpenAI from 'openai';
import { IAIProvider, ChatMessage, ChatCompletion } from './ai.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AppError } from '@/shared/utils/errors';

export class OpenAIProvider implements IAIProvider {
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string,
    private readonly logger: ILogger,
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatCompletion> {
    const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      allMessages.push({ role: 'system', content: systemPrompt });
    }

    allMessages.push(...messages.map((m) => ({ role: m.role, content: m.content })));

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: allMessages,
        max_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AppError('AI_ERROR', 'No response from AI provider', 502);
      }

      return {
        message: content,
        usage: response.usage
          ? {
              prompt_tokens: response.usage.prompt_tokens,
              completion_tokens: response.usage.completion_tokens,
            }
          : undefined,
      };
    } catch (err) {
      this.logger.error('OpenAI chat failed', err);
      if (err instanceof AppError) throw err;
      throw new AppError('AI_ERROR', 'AI provider request failed', 502);
    }
  }
}
