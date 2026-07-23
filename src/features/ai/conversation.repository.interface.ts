import { AIConversation, UUID } from '@/shared/types';

export interface IConversationRepository {
  save(userId: UUID, role: 'user' | 'assistant', content: string, module?: string): Promise<AIConversation>;
  getHistory(userId: UUID, limit?: number, module?: string): Promise<AIConversation[]>;
  clearHistory(userId: UUID, module?: string): Promise<void>;
}
