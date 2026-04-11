import React, { useState } from 'react';

const EVENTS = [
  { date: '2025-01-29', time: '14:00', event: 'FOMC Interest Rate Decision', impact: 'HIGH', category: 'MONETARY', country: '🇺🇸', forecast: '4.25-4.50%', previous: '4.25-4.50%' },
  { date: '2025-01-31', time: '08:30', event: 'US Non-Farm Payrolls', impact: 'HIGH', category: 'EMPLOYMENT', country: '🇺🇸', forecast: '185K', previous: '256K' },
  { date: '2025-02-03', time: '10:00', event: 'ISM Manufacturing PMI', impact: 'MEDIUM', category: 'ECONOMIC', country: '🇺🇸', forecast: '49.5', previous: '49.3' },
  { date: '2025-02-05', time: '08:30', event: 'US Trade Balance', impact: 'MEDIUM', category: 'TRADE', country: '🇺🇸', forecast: '-$96.5B', previous: '-$78.2B' },
  { date: '2025-02-07', time: '08:30', event: 'US CPI Inflation Report', impact: 'HIGH', category: 'INFLATION', country: '🇺🇸', forecast: '2.9%', previous: '2.9%' },
  { date: '2025-02-12', time: '09:30', event: 'ECB Monetary Policy Meeting', impact: 'HIGH', category: 'MONETARY', country: '🇪🇺', forecast: '2.75%', previous: '3.00%' },
  { date: '2025-02-14', time: '08:30', event: 'US Retail Sales', impact: 'MEDIUM', category: 'CONSUMER', country: '🇺🇸', forecast: '+0.3%', previous: '-0.4%' },
  { date: '2025-02-19', time: '08:30', event: 'US PPI Producer Prices', impact: 'MEDIUM', category: 'INFLATION', country: '🇺🇸', forecast: '+0.3%', previous: '+0.2%' },
  { date: '2025-02-26', time: '08:30', event: 'US GDP Q4 Preliminary', impact: 'HIGH', category: 'ECONOMIC', country: '🇺🇸', forecast: '2.6%', previous: '3.1%' },
  { date: '2025-03-07', time: '08:30', event: 'US Jobs Report (NFP)', impact: 'HIGH', category: 'EMPLOYMENT', country: '🇺🇸', forecast: '175K', previous: '185K' },
];

const EARNINGS = [
  { ticker: 'AAPL', company: 'Apple Inc.', date: '2025-01-30', time: 'After Close', estimate: '$2.35 EPS', sentiment: 'BULLISH' },
  { ticker: 'MSFT', company: 'Microsoft', date: '2025-01-29', time: 'After Close', estimate: '$3.12 EPS', sentiment: 'BULLISH' },
  { ticker: 'META', company: 'Meta Platforms', date: '2025-01-29', time: 'After Close', estimate: '$6.78 EPS', sentiment: 'BULLISH' },
  { ticker: 'AMZN', company: 'Amazon', date: '2025-02-06', time: 'After Close', estimate: '$1.49 EPS', sentiment: 'NEUTRAL' },
  { ticker: 'GOOGL', company: 'Alphabet', date: '2025-02-04', time: 'After Close', estimate: '$2.15 EPS', sentiment: 'BULLISH' },
  { ticker: 'TSLA', company: 'Tesla', date: '2025-01-29', time: 'After Close', estimate: '$0.73 EPS', sentiment: 'BEARISH' },
];

export const MacroCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'macro' | 'earnings'>('macro');
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filtered = EVENTS.filter(e => filter === 'ALL' || e.impact === filter);

  const impactColor = (impact: string) =>
    impact === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
    impact === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
    'bg-slate-500/20 text-slate-400 border-slate-500/30';

  const sentimentColor = (s: string) =>
    s === 'BULLISH' ? 'text-emerald-400' : s === 'BEARISH' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {(['macro', 'earnings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab === 'macro' ? '📅 Macro Events' : '📊 Earnings Calendar'}
          </button>
        ))}
      </div>

      {activeTab === 'macro' ? (
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Upcoming Economic Events</h3>
            <div className="flex gap-2">
              {(['ALL', 'HIGH', 'MEDIUM'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#0a0b0d] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="text-center min-w-[60px]">
                  <p className="text-[10px] font-bold text-slate-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-[10px] text-slate-600">{event.time}</p>
                </div>
                <span className="text-xl">{event.country}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{event.event}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{event.category}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] text-slate-500">Forecast: <span className="text-white font-bold">{event.forecast}</span></p>
                  <p className="text-[10px] text-slate-600">Prev: {event.previous}</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${impactColor(event.impact)}`}>
                  {event.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Upcoming Earnings Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EARNINGS.map((e, i) => (
              <div key={i} className="bg-[#0a0b0d] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-black text-blue-400">{e.ticker.slice(0, 2)}</span>
                  </div>
                  <span className={`text-[10px] font-black ${sentimentColor(e.sentiment)}`}>{e.sentiment}</span>
                </div>
                <p className="text-sm font-black text-white">{e.ticker}</p>
                <p className="text-[10px] text-slate-500 mb-3">{e.company}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Date</span>
                    <span className="text-white font-bold">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Time</span>
                    <span className="text-white font-bold">{e.time}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Est. EPS</span>
                    <span className="text-emerald-400 font-bold">{e.estimate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
