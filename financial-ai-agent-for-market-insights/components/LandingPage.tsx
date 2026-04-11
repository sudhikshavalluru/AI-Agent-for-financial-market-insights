
import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white flex flex-col selection:bg-blue-500/30 font-['Inter']">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0b0d]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">F</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Financial AI Agent
            </h1>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
            <button className="hover:text-white transition-colors">Features</button>
            <button className="hover:text-white transition-colors">Capabilities</button>
          </div>
          <div className="space-x-4 flex items-center">
            <button onClick={() => setView('login')} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2">Login</button>
            <button onClick={() => setView('signup')} className="bg-[#2563eb] hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">Get Started</button>
          </div>
        </div>
      </nav>

      {view === 'landing' ? (
        <div className="flex-1 flex flex-col justify-center pt-20">
          <section className="relative px-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span>AI-Powered Insights</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-7xl md:text-[88px] font-extrabold tracking-tight leading-[0.95] text-white">
                    Financial AI Agent for <span className="text-[#3b82f6]">Market</span><br />
                    <span className="text-[#3b82f6]">Insights</span>
                  </h2>
                  
                  <p className="text-xl text-slate-400 max-w-xl font-medium leading-relaxed mt-6">
                    The ultimate NLP intelligence platform designed for institutional-grade market analysis and predictive sentiment discovery.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                  <button 
                    onClick={() => setView('login')}
                    className="w-full sm:w-auto px-10 py-4 bg-[#2563eb] hover:bg-blue-700 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
                  >
                    Launch Terminal
                  </button>
                </div>
              </div>

              {/* Project Image - Right Side */}
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-[#161b22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop" 
                    alt="Financial Market Intelligence Visualization" 
                    className="w-full h-full object-cover aspect-[4/3] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">📈</div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Analysis</p>
                        <p className="text-xs font-bold text-white italic">"Alpha signals detected in news stream..."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 pt-32">
          <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-400"></div>
            <button 
              onClick={() => setView('landing')}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-2">
                {view === 'login' ? 'Agent Access' : 'Create Account'}
              </h3>
              <p className="text-slate-500 text-sm">
                Access the Financial AI Intelligence Portal
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="analyst@finaigent.io"
                  className="w-full bg-[#0a0b0d] border border-[#30363d] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0a0b0d] border border-[#30363d] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm transition-all shadow-xl shadow-blue-600/20 mt-6 active:scale-[0.98]"
              >
                {view === 'login' ? 'Authorize Login' : 'Register New Agent'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-[#30363d] text-center">
              <p className="text-sm text-slate-500">
                {view === 'login' ? "Need access?" : "Existing user?"}{' '}
                <button 
                  onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                  className="text-blue-500 font-bold hover:text-blue-400 transition-colors"
                >
                  {view === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
