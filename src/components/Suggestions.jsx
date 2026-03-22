import { Lightbulb, ShieldAlert, ArrowUpCircle } from 'lucide-react';

export default function Suggestions({ data }) {
  if (!data || data.length === 0) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
      case 'improvement': return <ArrowUpCircle className="w-5 h-5 text-[#2ea043]" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  const getThemeVars = (type) => {
    switch(type) {
      case 'warning': 
        return { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
      case 'improvement': 
        return { border: 'border-[#2ea043]/30', bg: 'bg-[#2ea043]/10', text: 'text-[#2ea043]' };
      default: 
        return { border: 'border-blue-400/30', bg: 'bg-blue-400/10', text: 'text-blue-400' };
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-textPrimary mb-2 flex items-center gap-2">
          AI Suggestions
        </h2>
        <p className="text-sm text-textSecondary mt-1">Recommended improvements and best practices identified in the codebase.</p>
      </div>

      <div className="space-y-4">
        {data.map((suggestion, index) => {
          const theme = getThemeVars(suggestion.type);
          return (
            <div 
              key={index} 
              className={`flex items-start gap-4 p-5 rounded-xl border ${theme.border} ${theme.bg} transition-all hover:bg-opacity-20`}
            >
              <div className="shrink-0 mt-0.5">
                {getIcon(suggestion.type)}
              </div>
              <div>
                <h4 className={`text-sm font-semibold mb-1 capitalize tracking-wide ${theme.text}`}>
                  {suggestion.type}
                </h4>
                <p className="text-textPrimary text-sm md:text-base leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
