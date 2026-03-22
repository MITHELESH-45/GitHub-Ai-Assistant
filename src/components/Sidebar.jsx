import { LayoutDashboard, FileText, MessageSquare, Layers, AlertCircle, Menu, X, Github } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'qa', label: 'Q&A Chat', icon: MessageSquare },
    { id: 'tech', label: 'Tech Stack', icon: Layers },
    { id: 'suggestions', label: 'Suggestions', icon: AlertCircle },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#0d1117]/80 z-40 md:hidden backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-secondary border-r border-border transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <Github className="w-8 h-8 text-textPrimary" />
            <span className="font-semibold text-textPrimary text-base leading-tight tracking-wide">AI GitHub<br/>Assistant</span>
          </div>
          <button 
            className="md:hidden text-textSecondary hover:text-textPrimary bg-primary p-1.5 rounded-lg border border-border"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1.5 mt-2 flex flex-col h-[calc(100vh-80px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200
                  ${isActive 
                    ? 'bg-[#30363d] text-textPrimary font-medium border-l-[3px] border-accent rounded-l-sm' 
                    : 'text-textSecondary hover:bg-[#30363d]/50 hover:text-textPrimary border-l-[3px] border-transparent rounded-l-sm'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-textSecondary'}`} strokeWidth={2.5} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          
          <div className="mt-auto pt-4 border-t border-border">
            <div className="px-3 py-2 text-xs text-textSecondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              API Status: Ready
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
