import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const TICKERS = [
  { symbol: 'S&P 500', base: 5248.49 }, { symbol: 'NASDAQ', base: 16742.39 },
  { symbol: 'DOW', base: 39127.14 }, { symbol: 'BTC/USD', base: 67420.50 },
  { symbol: 'AAPL', base: 189.45 }, { symbol: 'NVDA', base: 875.30 },
  { symbol: 'TSLA', base: 198.70 }, { symbol: 'MSFT', base: 415.20 },
  { symbol: 'GOLD', base: 2342.10 }, { symbol: 'OIL', base: 82.45 },
];

const TOP_MOVERS = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: 875.30, change: 4.12, vol: '48.2M' },
  { ticker: 'META', name: 'Meta Platforms', price: 512.40, change: 3.21, vol: '22.1M' },
  { ticker: 'NFLX', name: 'Netflix Inc', price: 680.20, change: 5.18, vol: '8.4M' },
  { ticker: 'TSLA', name: 'Tesla Inc', price: 198.70, change: -1.84, vol: '91.3M' },
  { ticker: 'AMD', name: 'Advanced Micro', price: 142.80, change: -2.14, vol: '35.7M' },
];

const RECENT_SIGNALS = [
  { time: '14:32', ticker: 'NVDA', signal: 'BULLISH', reason: 'Earnings beat + guidance raise', confidence: 94 },
  { time: '13:58', ticker: 'TSLA', signal: 'BEARISH', reason: 'Production miss Q1 2025', confidence: 81 },
  { time: '13:21', ticker: 'AAPL', signal: 'BULLISH', reason: 'Services revenue all-time high', confidence: 88 },
  { time: '12:45', ticker: 'JPM', signal: 'NEUTRAL', reason: 'Fed rate uncertainty', confidence: 62 },
  { time: '11:30', ticker: 'META', signal: 'BULLISH', reason: 'Ad revenue surge +24% YoY', confidence: 91 },
];

const UPCOMING_EVENTS = [
  { date: 'Jan 29', event: 'FOMC Rate Decision', impact: 'HIGH', icon: '🏦' },
  { date: 'Jan 30', event: 'AAPL Earnings', impact: 'HIGH', icon: '📊' },
  { date: 'Jan 31', event: 'US NFP Report', impact: 'HIGH', icon: '📋' },
  { date: 'Feb 4', event: 'GOOGL Earnings', impact: 'MEDIUM', icon: '📊' },
  { date: 'Feb 7', event: 'US CPI Data', impact: 'HIGH', icon: '📈' },
];

const generateChartData = () =>
  Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    sentiment: +(Math.random() * 0.5 + 0.35).toFixed(3),
    volume: Math.floor(Math.random() * 80 + 40),
  }));

const generateTickerPrices = () =>
  TICKERS.map(t => ({
    ...t,
    price: +(t.base * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2),
    change: +(Math.random() * 4 - 2).toFixed(2),
  }));

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [chartData, setChartData] = useState(generateChartData());
  const [tickerPrices, setTickerPrices] = useState(generateTickerPrices());
  const [tickerOffset, setTickerOffset] = useState(0);
  const [time, setTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('');
  const [sentimentScore, setSentimentScore] = useState(0.74);
  const [nlpProcessed, setNlpProcessed] = useState(14823);
  const [activeAlerts, setActiveAlerts] = useState(7);

  useEffect(() => {
    const clock = setInterval(() => {
      const now = new Date();
      setTime(now);
      const h = now.getHours();
      setMarketStatus(h >= 9 && h < 16 ? 'OPEN' : h >= 4 && h < 9 ? 'PRE-MKT' : h >= 16 && h < 20 ? 'AFTER-HRS' : 'CLOSED');
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setTickerPrices(generateTickerPrices());
      setSentimentScore(+(Math.random() * 0.4 + 0.55).toFixed(2));
      setNlpProcessed(p => p + Math.floor(Math.random() * 12 + 3));
      setActiveAlerts(Math.floor(Math.random() * 5 + 5));
      setChartData(generateChartData());
    }, 4000);
    return () => clearInterval(dataInterval);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => setTickerOffset(o => o - 1), 30);
    return () => clearInterval(ticker);
  }, []);

  const statusColor = marketStatus === 'OPEN' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : marketStatus === 'PRE-MKT' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-slate-400 bg-slate-500/10 border-slate-500/20';

  const MODULES = [
    { id: 'news', icon: '📰', label: 'News NLP', desc: 'NER & sentiment extraction', color: 'blue', count: '4 articles' },
    { id: 'earnings', icon: '💰', label: 'Earnings', desc: 'Risk & tone analysis', color: 'emerald', count: '2 reports' },
    { id: 'predictor', icon: '🎯', label: 'Predictor', desc: 'Directional forecasting', color: 'purple', count: '89% acc' },
    { id: 'qa', icon: '🤖', label: 'AI Agent', desc: 'RAG-powered Q&A', color: 'amber', count: 'Online' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio', desc: 'P&L & allocation', color: 'cyan', count: '6 holdings' },
    { id: 'heatmap', icon: '🗺️', label: 'Heatmap', desc: 'Sector & watchlist', color: 'rose', count: '30 tickers' },
    { id: 'risk', icon: '⚠️', label: 'Risk Calc', desc: 'VaR & Sharpe ratio', color: 'orange', count: 'Ready' },
    { id: 'calendar', icon: '📅', label: 'Calendar', desc: 'Macro & earnings events', color: 'indigo', count: '5 events' },
    { id: 'compare', icon: '🔀', label: 'Compare', desc: 'Multi-ticker sentiment', color: 'teal', count: '5 tickers' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5',
    purple: 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5',
    amber: 'border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5',
    rose: 'border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/5',
    orange: 'border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5',
    teal: 'border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/5',
  };

  const iconColorMap: Record<string, string> = {
    blue: 'bg-blue-500/15 text-blue-400', emerald: 'bg-emerald-500/15 text-emerald-400',
    purple: 'bg-purple-500/15 text-purple-400', amber: 'bg-amber-500/15 text-amber-400',
    cyan: 'bg-cyan-500/15 text-cyan-400', rose: 'bg-rose-500/15 text-rose-400',
    orange: 'bg-orange-500/15 text-orange-400', indigo: 'bg-indigo-500/15 text-indigo-400',
    teal: 'bg-teal-500/15 text-teal-400',
  };

  const textColorMap: Record<string, string> = {
    blue: 'text-blue-400', emerald: 'text-emerald-400', purple: 'text-purple-400',
    amber: 'text-amber-400', cyan: 'text-cyan-400', rose: 'text-rose-400',
    orange: 'text-orange-400', indigo: 'text-indigo-400', teal: 'text-teal-400',
  };

  return (
    <div className="space-y-5 pb-10">

      {/* TOP BAR: Clock + Status + KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Clock */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Clock</p>
          <div>
            <p className="text-2xl font-black mono text-white tracking-tight">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
          <span className={`self-start text-[9px] font-black px-2 py-1 rounded-full border ${statusColor}`}>{marketStatus || 'LOADING'}</span>
        </div>

        {/* KPI Cards */}
        {[
          { label: 'NLP Sentiment', value: sentimentScore.toFixed(2), sub: sentimentScore > 0.65 ? '▲ Bullish Bias' : sentimentScore > 0.45 ? '→ Neutral' : '▼ Bearish Bias', color: sentimentScore > 0.65 ? 'text-emerald-400' : sentimentScore > 0.45 ? 'text-slate-300' : 'text-rose-400' },
          { label: 'Docs Processed', value: nlpProcessed.toLocaleString(), sub: '▲ Live ingestion', color: 'text-blue-400' },
          { label: 'Active Signals', value: activeAlerts.toString(), sub: `${activeAlerts > 5 ? 'High' : 'Normal'} alert volume`, color: activeAlerts > 5 ? 'text-amber-400' : 'text-slate-300' },
          { label: 'Model Accuracy', value: '91.4%', sub: '▲ +0.3% this week', color: 'text-purple-400' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161b22] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-all">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
            <p className={`text-2xl font-black mono ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] text-slate-500">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* LIVE TICKER TAPE */}
      <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center">
          <div className="px-3 py-2 bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest shrink-0">LIVE</div>
          <div className="overflow-hidden flex-1 relative">
            <div
              className="flex items-center gap-8 py-2 px-4 whitespace-nowrap transition-none"
              style={{ transform: `translateX(${tickerOffset % 800}px)` }}
            >
              {[...tickerPrices, ...tickerPrices].map((t, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-black text-white">{t.symbol}</span>
                  <span className="text-[11px] mono text-slate-300">{t.price.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold ${t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.change >= 0 ? '▲' : '▼'} {Math.abs(t.change)}%
                  </span>
                  <span className="text-slate-700">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID: Chart + Movers + Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Sentiment Chart */}
        <div className="lg:col-span-2 bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Intraday Sentiment Index</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">NLP score across all ingested documents (24h)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Live</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2530" vertical={false} />
                <XAxis dataKey="time" stroke="#374151" fontSize={9} tick={{ fill: '#4b5563' }} tickLine={false} interval={3} />
                <YAxis stroke="#374151" fontSize={9} tick={{ fill: '#4b5563' }} tickLine={false} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '10px', fontSize: '11px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sentiment" stroke="#3b82f6" fill="url(#sentGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Movers */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Top Movers</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Today</span>
          </div>
          <div className="space-y-3">
            {TOP_MOVERS.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-300">{m.ticker.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{m.ticker}</p>
                    <p className="text-[9px] text-slate-500">{m.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white mono">${m.price}</p>
                  <p className={`text-[10px] font-bold ${m.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change >= 0 ? '+' : ''}{m.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIGNALS + EVENTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent NLP Signals */}
        <div className="lg:col-span-2 bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Recent NLP Signals</h3>
            <button onClick={() => onNavigate('predictor')} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">View All →</button>
          </div>
          <div className="space-y-2">
            {RECENT_SIGNALS.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#0d1117] border border-white/5 hover:border-white/10 transition-all">
                <span className="text-[10px] font-bold text-slate-600 mono w-10 shrink-0">{s.time}</span>
                <span className="text-xs font-black text-white w-12 shrink-0">{s.ticker}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                  s.signal === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400' :
                  s.signal === 'BEARISH' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>{s.signal}</span>
                <p className="text-[11px] text-slate-400 flex-1 truncate">{s.reason}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">{s.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">Upcoming Events</h3>
            <button onClick={() => onNavigate('calendar')} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Calendar →</button>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0d1117] border border-white/5 hover:border-white/10 transition-all">
                <span className="text-lg">{e.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{e.event}</p>
                  <p className="text-[10px] text-slate-500">{e.date}</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                  e.impact === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{e.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODULE GRID */}
      <div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4">All Modules</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className={`bg-[#161b22] border rounded-2xl p-4 text-left transition-all group ${colorMap[mod.color]}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${iconColorMap[mod.color]}`}>
                {mod.icon}
              </div>
              <p className="text-xs font-bold text-white mb-0.5">{mod.label}</p>
              <p className="text-[10px] text-slate-500 leading-tight mb-2">{mod.desc}</p>
              <p className={`text-[10px] font-bold ${textColorMap[mod.color]}`}>{mod.count}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
