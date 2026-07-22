import { AIConversation, UUID } from '@/shared/types';

export interface IConversationRepository {
  save(userId: UUID, role: 'user' | 'assistant', content: string): Promise<AIConversation>;
  getHistory(userId: UUID, limit?: number): Promise<AIConversation[]>;
  clearHistory(userId: UUID): Promise<void>;
}
