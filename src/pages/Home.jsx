import { useState } from 'react';
import { Search, Github, Sparkles } from 'lucide-react';

export default function Home({ onAnalyze }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      setIsLoading(true);
      onAnalyze(url);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 selection:bg-accent/30 selection:text-white">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-border">
            <Github className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4 tracking-tight drop-shadow-sm">
            AI GitHub Assistant
          </h1>
          <p className="text-lg text-textSecondary max-w-xl mx-auto leading-relaxed">
            Paste a GitHub repository link to generate instant code summaries, architectural insights, and interactive AI Q&A.
          </p>
        </div>

        <div className="bg-secondary p-6 md:p-8 rounded-2xl border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="https://github.com/facebook/react"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#0d1117] border border-border text-textPrimary text-lg rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent block pl-12 p-4 transition-all outline-none shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full py-4 bg-accent hover:bg-[#2ea043] text-white text-lg font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-accent/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Repository...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Insights
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Analyzes dependencies
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Explains architecture
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Security suggestions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
