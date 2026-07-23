'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AIConversation } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';
import { apiFetch } from '@/shared/utils/api-client';

export default function AICoachPage() {
  const [messages, setMessages] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    apiFetch<AIConversation[]>('/api/ai/chat')
      .then((data) => setMessages(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    const optimistic: AIConversation = {
      id: `tmp-${Date.now()}`,
      user_id: '',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const result = await apiFetch<{ reply: string; history: AIConversation[] }>(
        '/api/ai/chat',
        { method: 'POST', body: JSON.stringify({ message: text }) },
      );
      setMessages(result.history);
    } catch (e: unknown) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError(e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Coach</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask for habit advice, motivation, or insights about your progress.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card shadow-sm p-4 space-y-4">
        {loading && (
          <div className="flex justify-center py-8"><Spinner size={24} /></div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 py-8">
            <p className="text-lg font-medium">Hello! I&apos;m your AI habit coach.</p>
            <p className="text-sm">Ask me anything about your habits, streaks, or how to stay motivated.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
              <Spinner size={16} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI coach… (Enter to send, Shift+Enter for newline)"
          rows={2}
          disabled={sending}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity self-end"
        >
          Send
        </button>
      </div>
    </div>
  );
}
