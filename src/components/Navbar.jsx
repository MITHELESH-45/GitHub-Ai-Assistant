import { Menu, User, Github, ArrowLeft } from 'lucide-react';

export default function Navbar({ repoUrl, toggleSidebar, onClear }) {
  const extractRepoName = (url) => {
    try {
      if (!url.includes('github.com')) return url;
      const parts = url.split('github.com/')[1].split('/');
      return `${parts[0]}/${parts[1]}`;
    } catch {
      return url || "Repository";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-secondary/80 backdrop-blur-md border-b border-border md:px-6">
      <div className="flex items-center w-full max-w-3xl">
        <button 
          className="mr-3 md:hidden text-textSecondary hover:text-textPrimary bg-[#0d1117] p-2 rounded-md border border-border"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <button 
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs md:text-sm text-textSecondary hover:text-textPrimary transition-colors bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-border shrink-0 hover:bg-[#161b22]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Change Repo</span>
          </button>
          
          <div className="h-6 w-px bg-border shrink-0"></div>
          
          <div className="flex items-center gap-2 text-textPrimary font-medium min-w-0">
            <Github className="w-5 h-5 text-textSecondary shrink-0" />
            <span className="truncate max-w-[150px] md:max-w-xs">{extractRepoName(repoUrl)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center ml-4 gap-4 shrink-0">
        <div className="hidden lg:flex text-right flex-col">
          <span className="text-sm font-medium text-textPrimary">Guest User</span>
          <span className="text-xs text-textSecondary">Free Tier</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#30363d] border border-border flex items-center justify-center hover:ring-2 ring-accent transition-all">
          <User className="w-5 h-5 text-textSecondary" />
        </button>
      </div>
    </header>
  );
}
