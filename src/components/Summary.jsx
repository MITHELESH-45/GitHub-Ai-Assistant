import { FileText, CheckCircle2, Star, GitFork, AlertCircle, Users } from 'lucide-react';

export default function Summary({ data, repoUrl }) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-textPrimary mb-2 flex items-center gap-2">
          Project Overview
        </h2>
        <p className="text-sm text-textSecondary">Comprehensive repository analysis and AI summaries</p>
      </div>

      {data.analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-xl border border-border flex items-center gap-3 shadow-sm hover:border-[#8b949e]/30 transition-colors">
            <div className="p-2.5 bg-[#0d1117] rounded-lg border border-border">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-textSecondary font-medium">Stars</p>
              <p className="text-lg font-bold text-textPrimary">{data.analytics.stars}</p>
            </div>
          </div>
          
          <div className="bg-secondary p-4 rounded-xl border border-border flex items-center gap-3 shadow-sm hover:border-[#8b949e]/30 transition-colors">
            <div className="p-2.5 bg-[#0d1117] rounded-lg border border-border">
              <GitFork className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-textSecondary font-medium">Forks</p>
              <p className="text-lg font-bold text-textPrimary">{data.analytics.forks}</p>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-xl border border-border flex items-center gap-3 shadow-sm hover:border-[#8b949e]/30 transition-colors">
            <div className="p-2.5 bg-[#0d1117] rounded-lg border border-border">
              <AlertCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-textSecondary font-medium">Issues</p>
              <p className="text-lg font-bold text-textPrimary">{data.analytics.openIssues}</p>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-xl border border-border flex items-center gap-3 shadow-sm hover:border-[#8b949e]/30 transition-colors">
            <div className="p-2.5 bg-[#0d1117] rounded-lg border border-border">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-textSecondary font-medium">Contributors</p>
              <p className="text-lg font-bold text-textPrimary">{data.analytics.contributors}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-[#161b22] flex items-center gap-2">
          <FileText className="w-5 h-5 text-textSecondary" />
          <h3 className="font-semibold text-textPrimary">Project Purpose</h3>
        </div>
        <div className="p-5">
          <p className="text-textPrimary leading-relaxed text-sm md:text-base">{data.purpose}</p>
        </div>
      </div>

      <div className="bg-secondary rounded-xl border border-border overflow-hidden mt-6 shadow-sm">
        <div className="px-5 py-4 border-b border-border bg-[#161b22] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-textPrimary">Analyzed Files</h3>
        </div>
        <ul className="p-5 space-y-3">
          {data.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 group">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 group-hover:scale-150 transition-transform" />
              <span className="text-textPrimary text-sm font-mono bg-[#0d1117] px-2 py-1 rounded border border-border">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
