import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileCode2, Sparkles, AlertTriangle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function AnswerText({ text }) {
  const codeBlockParts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-sm md:text-base leading-relaxed text-textPrimary">
      {codeBlockParts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).trim();
          const firstNewline = code.indexOf('\n');
          const lang = firstNewline !== -1 ? code.slice(0, firstNewline) : '';
          const cleanCode = firstNewline !== -1 ? code.slice(firstNewline + 1) : code;

          return (
            <div key={index} className="my-4 rounded-lg overflow-hidden border border-border bg-[#0d1117]">
              {lang && (
                <div className="px-4 py-2 bg-[#161b22] border-b border-border text-xs font-mono text-textSecondary uppercase tracking-wider">
                  {lang}
                </div>
              )}
              <pre className="p-4 overflow-x-auto custom-scrollbar font-mono text-xs md:text-sm text-blue-300">
                <code>{cleanCode}</code>
              </pre>
            </div>
          );
        }

        const paragraphs = part.split(/\n{2,}/);
        return paragraphs.map((para, pi) => {
          if (!para.trim()) return null;

          if (para.startsWith('### ')) {
            return (
              <h3 key={`${index}-${pi}`} className="text-lg font-bold text-white mt-6 mb-2 border-b border-border pb-1">
                {para.replace('### ', '')}
              </h3>
            );
          }
          if (para.startsWith('## ')) {
            return (
              <h2 key={`${index}-${pi}`} className="text-xl font-bold text-white mt-8 mb-3 border-b border-border pb-1">
                {para.replace('## ', '')}
              </h2>
            );
          }

          const lines = para.split('\n');
          return (
            <div key={`${index}-${pi}`} className="space-y-1.5">
              {lines.map((line, li) => {
                const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ');
                const cleanLine = isBullet ? line.trim().replace(/^[-*•]\s+/, '') : line;

                const bold = cleanLine.replace(/\*\*(.*?)\*\*/g, (_, m) => `§BOLD§${m}§/BOLD§`)
                  .replace(/\*(.*?)\*/g, (_, m) => `§BOLD§${m}§/BOLD§`);
                const parts = bold.split(/(§BOLD§.*?§\/BOLD§)/g);

                const content = (
                  <>
                    {parts.map((p, idx) => {
                      if (p.startsWith('§BOLD§') && p.endsWith('§/BOLD§')) {
                        return <strong key={idx} className="font-bold text-white">{p.slice(6, -7)}</strong>;
                      }
                      return <span key={idx}>{p}</span>;
                    })}
                  </>
                );

                if (isBullet) {
                  return (
                    <div key={li} className="flex gap-2 ml-2 items-start py-0.5">
                      <span className="text-textSecondary mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-textSecondary/40" />
                      <span className="flex-1">{content}</span>
                    </div>
                  );
                }

                return (
                  <p key={li} className="whitespace-pre-wrap">
                    {content}
                  </p>
                );
              })}
            </div>
          );
        });
      })}
    </div>
  );
}

export default function QA({ repoUrl }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'ai',
        text: `Repository loaded! 🎉 You can now ask me anything about the codebase.\n\nTry questions like:\n• "Give me a detailed summary of this project"\n• "How does authentication work?"\n• "What is the overall architecture?"\n• "Explain the data flow in this app"`,
        sources: [],
      },
    ]);
  }, [repoUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMsg = { id: `user-${Date.now()}`, type: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/repo/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get an answer.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          type: 'ai',
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'error',
          text: err.message,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="pb-4 border-b border-border mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Codebase Q&amp;A
        </h2>
        <p className="text-sm text-textSecondary mt-1">
          Ask any question about architecture, logic, or implementation — powered by RAG + GPT-4o mini.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 mb-4 pb-4 custom-scrollbar">
        {messages.map((msg) => {
          if (msg.type === 'user') {
            return (
              <div key={msg.id} className="flex gap-3 justify-end">
                <div className="max-w-[85%] md:max-w-[75%] bg-[#30363d] rounded-2xl rounded-tr-sm px-4 py-3 text-textPrimary shadow-sm">
                  <p className="text-sm md:text-base">{msg.text}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#161b22] border border-border flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-textSecondary" />
                </div>
              </div>
            );
          }

          if (msg.type === 'error') {
            return (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="max-w-[85%] md:max-w-[75%] bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-3 md:gap-4">
              <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center shrink-0 shadow-md mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[85%] md:max-w-[75%] space-y-3">
                <div className="bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <AnswerText text={msg.text} />
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161b22] border border-border text-xs text-textSecondary hover:border-accent hover:text-accent transition-colors cursor-default"
                        title={src}
                      >
                        <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-mono truncate max-w-[180px]">{src}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      <form onSubmit={handleSend} className="relative mt-auto shrink-0">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the codebase… (Enter to send)"
          className="w-full bg-[#161b22] border border-border text-textPrimary text-sm md:text-base rounded-xl focus:ring-1 focus:ring-accent focus:border-accent block p-4 pr-14 transition-all outline-none shadow-sm resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent hover:bg-[#2ea043] text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
