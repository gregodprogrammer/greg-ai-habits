import { AIConversation, UUID } from '@/shared/types';

export interface ChatResponse {
  reply: string;
  history: AIConversation[];
}

export interface IAIService {
  chat(userId: UUID, message: string): Promise<ChatResponse>;
  getHistory(userId: UUID): Promise<AIConversation[]>;
}
