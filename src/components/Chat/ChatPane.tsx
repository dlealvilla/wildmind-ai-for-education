import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/assessment';
import { getAIProvider } from '../../lib/ai';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPaneProps {
  messages: ChatMessage[];
  onNewMessage: (message: ChatMessage) => void;
  onInsertText: (text: string, messageId: string) => void;
  readOnly?: boolean;
  courseCode?: string;
  variant?: 'default' | 'book';
}

export function ChatPane({
  messages,
  onNewMessage,
  onInsertText,
  readOnly = false,
  courseCode,
  variant = 'default',
}: ChatPaneProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || readOnly) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'student',
      content: input.trim(),
      createdAt: Date.now(),
    };

    onNewMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const provider = getAIProvider();
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const aiResponse = await provider.generateResponse(userMessage.content, chatHistory);

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'ai',
        content: aiResponse,
        createdAt: Date.now(),
      };

      onNewMessage(aiMessage);
    } catch (error) {
      console.error('AI error:', error);
      const friendly =
        error instanceof Error && error.message
          ? error.message
          : 'Sorry, the AI assistant is temporarily unavailable. Please try again.';
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'ai',
        content: friendly,
        createdAt: Date.now(),
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsert = (message: ChatMessage) => {
    if (readOnly) return;
    const insertFunction = (window as any).__editorInsertText;
    if (insertFunction) {
      insertFunction(message.content, message.id);
      onInsertText(message.content, message.id);
    }
  };

  const isBook = variant === 'book';

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        isBook ? 'bg-transparent' : 'bg-page text-ink border-l border-shelf',
        !isBook && 'w-[400px]',
      )}
    >
      <div className={cn('shrink-0', isBook ? 'px-7 pt-6 pb-3' : 'border-b border-shelf/40 p-4')}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-bold text-[13px] text-ink">AI Tutor</div>
            <div className="text-[11px] text-ink-subtle">
              Notes on the facing page{courseCode ? ` · ${courseCode}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className={cn('flex-1 overflow-y-auto space-y-3.5', isBook ? 'px-7 pb-2' : 'p-4')}>
        {messages.length === 0 && (
          <div className="text-ink-subtle text-center py-8 text-sm">
            Ask the tutor for help with your assessment. Notes appear here like sticky scraps on the facing page.
          </div>
        )}

        {messages.map((message) => {
          const isStudent = message.role === 'student';
          return (
            <div
              key={message.id}
              className={cn(
                'rounded-[2px] p-2.5 text-[13px] leading-relaxed text-ink',
                isStudent
                  ? 'bg-[#F0E8D8] border-l-[3px] border-secondary'
                  : 'bg-[#FFFEF5] border border-[#E0D4C0]',
              )}
            >
              <div
                className={cn(
                  'text-[10px] font-bold tracking-wide mb-1',
                  isStudent ? 'text-secondary' : 'text-[#8B6914]',
                )}
              >
                {isStudent ? 'STUDENT' : 'TUTOR'}
              </div>
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              {!isStudent && !readOnly && (
                <button
                  onClick={() => handleInsert(message)}
                  className="mt-2 inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105"
                >
                  Insert into document
                </button>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="bg-[#FFFEF5] border border-[#E0D4C0] rounded-[2px] p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-ink-subtle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!readOnly && (
        <div className={cn('shrink-0 flex gap-2', isBook ? 'px-7 pb-6 pt-2' : 'border-t border-shelf/40 p-4')}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask the tutor…"
            className="flex-1 px-2.5 py-2 border border-[#D4C4A8] rounded-[2px] bg-[#FFFEF5] text-[13px] text-ink outline-none focus:border-gold"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 text-[13px] font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
