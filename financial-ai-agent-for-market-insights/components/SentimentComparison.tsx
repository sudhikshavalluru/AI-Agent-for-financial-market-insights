import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { SentimentType } from '../types';

const COMPARISON_DATA: Record<string, { weekly: { day: string; score: number }[]; sentiment: SentimentType; score: number; mentions: number; positiveRatio: number }> = {
  AAPL: {
    weekly: [
      { day: 'Mon', score: 0.72 }, { day: 'Tue', score: 0.68 }, { day: 'Wed', score: 0.75 },
      { day: 'Thu', score: 0.82 }, { day: 'Fri', score: 0.79 }, { day: 'Sat', score: 0.71 }, { day: 'Sun', score: 0.74 },
    ],
    sentiment: SentimentType.BULLISH, score: 0.74, mentions: 1842, positiveRatio: 0.74,
  },
  NVDA: {
    weekly: [
      { day: 'Mon', score: 0.88 }, { day: 'Tue', score: 0.91 }, { day: 'Wed', score: 0.85 },
      { day: 'Thu', score: 0.93 }, { day: 'Fri', score: 0.89 }, { day: 'Sat', score: 0.87 }, { day: 'Sun', score: 0.92 },
    ],
    sentiment: SentimentType.BULLISH, score: 0.89, mentions: 3241, positiveRatio: 0.89,
  },
  TSLA: {
    weekly: [
      { day: 'Mon', score: 0.38 }, { day: 'Tue', score: 0.42 }, { day: 'Wed', score: 0.35 },
      { day: 'Thu', score: 0.31 }, { day: 'Fri', score: 0.44 }, { day: 'Sat', score: 0.39 }, { day: 'Sun', score: 0.36 },
    ],
    sentiment: SentimentType.BEARISH, score: 0.38, mentions: 2156, positiveRatio: 0.38,
  },
  MSFT: {
    weekly: [
      { day: 'Mon', score: 0.65 }, { day: 'Tue', score: 0.70 }, { day: 'Wed', score: 0.68 },
      { day: 'Thu', score: 0.72 }, { day: 'Fri', score: 0.69 }, { day: 'Sat', score: 0.66 }, { day: 'Sun', score: 0.71 },
    ],
    sentiment: SentimentType.BULLISH, score: 0.69, mentions: 1523, positiveRatio: 0.69,
  },
  META: {
    weekly: [
      { day: 'Mon', score: 0.78 }, { day: 'Tue', score: 0.82 }, { day: 'Wed', score: 0.76 },
      { day: 'Thu', score: 0.85 }, { day: 'Fri', score: 0.80 }, { day: 'Sat', score: 0.77 }, { day: 'Sun', score: 0.83 },
    ],
    sentiment: SentimentType.BULLISH, score: 0.80, mentions: 1987, positiveRatio: 0.80,
  },
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const SentimentComparison: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['AAPL', 'NVDA', 'TSLA']);
  const tickers = Object.keys(COMPARISON_DATA);

  const toggleTicker = (t: string) => {
    setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 4 ? [...prev, t] : prev);
  };

  // Build combined chart data
  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    const point: Record<string, string | number> = { day };
    selected.forEach(t => {
      point[t] = COMPARISON_DATA[t].weekly.find(d => d.day === day)?.score ?? 0;
    });
    return point;
  });

  const barData = selected.map(t => ({
    ticker: t,
    score: +(COMPARISON_DATA[t].score * 100).toFixed(0),
    mentions: COMPARISON_DATA[t].mentions,
  }));

  return (
    <div className="space-y-6">
      {/* Ticker Selector */}
      <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Compare Tickers (max 4)</h3>
          <span className="text-[10px] text-slate-500">{selected.length}/4 selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map((t, i) => (
            <button
              key={t}
              onClick={() => toggleTicker(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selected.includes(t)
                  ? 'text-white border-transparent'
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10 hover:text-white'
              }`}
              style={selected.includes(t) ? { backgroundColor: COLORS[selected.indexOf(t)] + '33', borderColor: COLORS[selected.indexOf(t)] + '66', color: COLORS[selected.indexOf(t)] } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {selected.map((t, i) => {
          const data = COMPARISON_DATA[t];
          return (
            <div key={t} className="bg-[#161b22] border border-white/5 rounded-2xl p-5" style={{ borderColor: COLORS[i] + '33' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-white">{t}</span>
                <span className={`text-[9px] font-black px-2 py-1 rounded-full ${
                  data.sentiment === SentimentType.BULLISH ? 'bg-emerald-500/20 text-emerald-400' :
                  data.sentiment === SentimentType.BEARISH ? 'bg-rose-500/20 text-rose-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>{data.sentiment}</span>
              </div>
              <p className="text-2xl font-black mono" style={{ color: COLORS[i] }}>{(data.score * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-slate-500 mt-1">{data.mentions.toLocaleString()} mentions</p>
              <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${data.positiveRatio * 100}%`, backgroundColor: COLORS[i] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Line Chart */}
      <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">7-Day Sentiment Trend</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis dataKey="day" stroke="#4b5563" fontSize={10} fontWeight="bold" />
              <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              {selected.map((t, i) => (
                <Line key={t} type="monotone" dataKey={t} stroke={COLORS[i]} strokeWidth={2.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Sentiment Score vs Mentions</h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis dataKey="ticker" stroke="#4b5563" fontSize={10} fontWeight="bold" />
              <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" />
              <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', fontSize: '11px' }} />
              <Bar dataKey="score" name="Sentiment Score" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
