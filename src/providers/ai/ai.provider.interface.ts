export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletion {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface IAIProvider {
  chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatCompletion>;
}
