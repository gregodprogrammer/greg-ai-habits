import { SupabaseClient } from '@supabase/supabase-js';
import { IConversationRepository } from './conversation.repository.interface';
import { AIConversation, UUID } from '@/shared/types';
import { ILogger } from '@/infrastructure/logger/logger.interface';

export class ConversationRepository implements IConversationRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async save(userId: UUID, role: 'user' | 'assistant', content: string, module = 'habits'): Promise<AIConversation> {
    const { data, error } = await this.db
      .from('ai_conversations')
      .insert({ user_id: userId, role, content, module })
      .select()
      .single();

    if (error || !data) {
      this.logger.error('ConversationRepository.save failed', error);
      throw new Error('Failed to save conversation');
    }
    return data as AIConversation;
  }

  async getHistory(userId: UUID, limit = 20, module = 'habits'): Promise<AIConversation[]> {
    const { data } = await this.db
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('module', module)
      .order('created_at', { ascending: false })
      .limit(limit);

    return ((data ?? []) as AIConversation[]).reverse();
  }

  async clearHistory(userId: UUID, module = 'habits'): Promise<void> {
    await this.db
      .from('ai_conversations')
      .delete()
      .eq('user_id', userId)
      .eq('module', module);
  }
}
