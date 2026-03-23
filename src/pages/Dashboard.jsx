import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import QA from '../components/QA';
import TechStack from '../components/TechStack';
import Suggestions from '../components/Suggestions';
import { dummyData } from '../data/mockData';
import { Github, Sparkles } from 'lucide-react';


export default function Dashboard({ repoUrl, onClear }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const analyzeRepo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/repo/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: repoUrl })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to analyze repository.");
        }

        if (result.success) {
          const backendMeta = result.metadata;
          const newAnalytics = {
            stars: backendMeta.stars,
            forks: backendMeta.forks,
            openIssues: backendMeta.issues,
            contributors: backendMeta.contributors || backendMeta.watchers
          };

          const uniqueExtensions = Array.from(new Set(result.files.map(f => f.name.split('.').pop())));
          const cleanTechStack = uniqueExtensions.map(ext => ext.toUpperCase() + ' File').filter(e => e !== 'MD File');
          
          if (cleanTechStack.length === 0) cleanTechStack.push('GitHub Repository');
          
          if (isMounted) {
            setData({
              ...dummyData,
              summary: {
                purpose: backendMeta.description || "No description provided by the repository owner.",
                features: result.files.map(f => f.path || f.name),
                analytics: newAnalytics
              },
              techStack: cleanTechStack
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to analyze repository.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (repoUrl) {
      analyzeRepo();
    }

    return () => {
      isMounted = false;
    };
  }, [repoUrl]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-textSecondary space-y-5 animate-pulse">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin" />
          <h3 className="text-lg font-medium text-textPrimary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Analyzing Repository Architecture...
          </h3>
          <p className="text-sm text-center max-w-sm">Fetching files, metadata, and mapping codebase structure.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-textSecondary space-y-4">
          <div className="text-yellow-500 font-medium bg-yellow-500/10 px-6 py-4 rounded-xl border border-yellow-500/20 max-w-lg text-center">
            {error}
          </div>
          <button onClick={onClear} className="text-textPrimary hover:text-accent font-medium px-4 py-2 rounded-lg border border-border bg-[#161b22] transition-colors">
            Return Home
          </button>
        </div>
      );
    }

    if (!data) return null;

    switch (activeTab) {
      case 'dashboard':
      case 'summary':
        return <Summary data={data.summary} repoUrl={repoUrl} />;
      case 'tech':
        return <TechStack stack={data.techStack} />;
      case 'suggestions':
        return <Suggestions data={data.suggestions} />;
      default:
        return <Summary data={data.summary} repoUrl={repoUrl} />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-primary flex flex-col md:flex-row font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 w-full">
        <Navbar
          repoUrl={repoUrl}
          toggleSidebar={() => setIsSidebarOpen(true)}
          onClear={onClear}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            {/* QA is always mounted to preserve chat history across tab switches.
                Hidden via CSS when another tab is active. */}
            {data && !isLoading && !error && (
              <div className={activeTab === 'qa' ? '' : 'hidden'}>
                <QA repoUrl={repoUrl} />
              </div>
            )}
            {/* All other tabs render conditionally */}
            {activeTab !== 'qa' && renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
