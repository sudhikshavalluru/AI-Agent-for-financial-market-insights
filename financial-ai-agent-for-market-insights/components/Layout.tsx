import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
    ],
  },
  {
    label: 'NLP Analysis',
    items: [
      { id: 'news', label: 'News Engine', icon: '📰' },
      { id: 'earnings', label: 'Earnings', icon: '💰' },
      { id: 'predictor', label: 'Predictor', icon: '🎯' },
      { id: 'compare', label: 'Sentiment Compare', icon: '🔀' },
      { id: 'qa', label: 'AI Agent', icon: '🤖' },
    ],
  },
  {
    label: 'Market Tools',
    items: [
      { id: 'portfolio', label: 'Portfolio', icon: '📊' },
      { id: 'heatmap', label: 'Heatmap', icon: '🗺️' },
      { id: 'risk', label: 'Risk Calculator', icon: '⚠️' },
      { id: 'calendar', label: 'Macro Calendar', icon: '📅' },
    ],
  },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [time, setTime] = useState(new Date());
  const [apiLoad, setApiLoad] = useState(33);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setApiLoad(Math.floor(Math.random() * 40 + 20));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const activeLabel = allItems.find(i => i.id === activeTab)?.label ?? 'Dashboard';

  const h = time.getHours();
  const marketOpen = h >= 9 && h < 16;
  const marketStatus = h >= 9 && h < 16 ? 'Market Open' : h >= 4 && h < 9 ? 'Pre-Market' : h >= 16 && h < 20 ? 'After Hours' : 'Market Closed';
  const statusDot = marketOpen ? 'bg-emerald-500' : 'bg-amber-500';

  return (
    <div className="flex h-screen bg-[#0a0b0d] overflow-hidden text-slate-200">

      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 bg-[#0d1117] flex flex-col z-20 shrink-0">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-500/30">F</div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">FinAgent</h1>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">NLP Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse shrink-0`} />
            <span className="text-[9px] font-bold text-slate-400 truncate">{marketStatus}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                      activeTab === item.id
                        ? 'bg-blue-600/15 text-white'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-sm shrink-0 ${activeTab === item.id ? '' : 'opacity-50'}`}>{item.icon}</span>
                    <span className={`text-[11px] font-bold truncate ${activeTab === item.id ? 'text-blue-300' : ''}`}>{item.label}</span>
                    {activeTab === item.id && <div className="ml-auto w-1 h-3 bg-blue-500 rounded-full shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-3">
          <div className="bg-[#161b22] rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">API Load</p>
              <p className="text-[9px] font-bold text-slate-400">{apiLoad}%</p>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${apiLoad > 70 ? 'bg-rose-500' : apiLoad > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${apiLoad}%` }}
              />
            </div>
          </div>

          <div className="bg-[#161b22] rounded-xl p-3">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Model</p>
            <p className="text-[10px] font-bold text-blue-400 mono">gemini-1.5-pro</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#0a0b0d] flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0a0b0d]/90 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-px h-5 bg-white/10" />
            <h2 className="text-xs font-black text-white uppercase tracking-[0.25em]">{activeLabel}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500 font-bold">
              <span className="mono">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-slate-700">•</span>
              <span>{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400">AI Online</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
