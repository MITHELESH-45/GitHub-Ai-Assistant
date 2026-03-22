import { Layers } from 'lucide-react';

export default function TechStack({ stack }) {
  if (!stack || stack.length === 0) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Technology Stack</h2>
        <p className="text-sm text-textSecondary mt-1">Detected frameworks, libraries, and tools used in this repository.</p>
      </div>

      <div className="bg-secondary p-5 md:p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <Layers className="w-6 h-6 text-accent" />
          <h3 className="text-lg font-semibold text-textPrimary">Detected Technologies</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          {stack.map((tech, index) => (
            <div 
              key={index}
              className="px-4 py-2 bg-[#0d1117] border border-border rounded-full text-sm font-medium text-textPrimary hover:border-[#8b949e] hover:text-white transition-all duration-300 cursor-default select-none shadow-sm hover:shadow"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
