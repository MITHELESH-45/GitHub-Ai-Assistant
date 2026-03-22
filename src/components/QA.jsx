import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, FileCode2 } from 'lucide-react';

export default function QA({ initialData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const initialMessages = [];
    initialData.forEach((qa, index) => {
      initialMessages.push({ id: `user-${index}`, type: 'user', text: qa.question });
      initialMessages.push({ 
        id: `ai-${index}`, 
        type: 'ai', 
        text: qa.answer,
        source: qa.source
      });
    });
    setMessages(initialMessages);
  }, [initialData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        text: "This is a simulated AI response indicating where this logic might reside. In a real application, the backend vector search would analyze the target codebase to answer this accurately.",
        source: "src/utils/dummy.js"
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="pb-4 border-b border-border mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-textPrimary">Codebase Q&A</h2>
        <p className="text-sm text-textSecondary mt-1">Ask questions about architecture, logic, or implementation details.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4 pb-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`max-w-[85%] md:max-w-[75%] ${msg.type === 'user' ? 'bg-[#30363d] rounded-2xl rounded-tr-sm px-4 py-2.5 text-textPrimary shadow-sm' : 'space-y-2'}`}>
              {msg.type === 'user' ? (
                <p className="text-sm md:text-base">{msg.text}</p>
              ) : (
                <>
                  <div className="text-textPrimary text-sm md:text-base leading-relaxed">
                    {msg.text}
                  </div>
                  {msg.source && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#161b22] border border-border text-xs text-textSecondary mt-2 hover:border-textSecondary transition-colors cursor-pointer">
                      <FileCode2 className="w-3.5 h-3.5" />
                      {msg.source}
                    </div>
                  )}
                </>
              )}
            </div>

            {msg.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[#161b22] border border-border flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-textSecondary" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#238636] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1 h-8 px-2">
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-textSecondary animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      <form onSubmit={handleSend} className="relative mt-auto shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the code..."
          className="w-full bg-[#161b22] border border-border text-textPrimary text-sm md:text-base rounded-xl focus:ring-1 focus:ring-accent focus:border-accent block p-4 pr-14 transition-all outline-none shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent hover:bg-[#2ea043] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
