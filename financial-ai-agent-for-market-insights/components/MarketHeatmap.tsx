
import React, { useState } from 'react';
import { HEATMAP_DATA, MOCK_WATCHLIST } from '../constants';
import { SentimentType, WatchlistItem } from '../types';

export const MarketHeatmap: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [newTicker, setNewTicker] = useState('');

  const getHeatColor = (change: number) => {
    if (change >= 3) return 'bg-emerald-500 text-white';
    if (change >= 1) return 'bg-emerald-600/70 text-emerald-100';
    if (change >= 0) return 'bg-emerald-900/60 text-emerald-300';
    if (change >= -1) return 'bg-rose-900/60 text-rose-300';
    if (change >= -3) return 'bg-rose-600/70 text-rose-100';
    return 'bg-rose-500 text-white';
  };

  const addToWatchlist = () => {
    if (!newTicker.trim()) return;
    const t = newTicker.toUpperCase();
    if (watchlist.find(w => w.ticker === t)) { setNewTicker(''); return; }
    const change = +(Math.random() * 6 - 3).toFixed(2);
    setWatchlist(prev => [...prev, {
      ticker: t, name: t, price: +(Math.random() * 500 + 50).toFixed(2),
      change, sentiment: change > 0.5 ? SentimentType.BULLISH : change < -0.5 ? SentimentType.BEARISH : SentimentType.NEUTRAL,
      alert: 'Manually added to watchlist'
    }]);
    setNewTicker('');
  };

  const removeFromWatchlist = (ticker: string) => setWatchlist(prev => prev.filter(w => w.ticker !== ticker));

  return (
    <div className="space-y-8">
      {/* Heatmap */}
      <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Market Heatmap</h3>
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Bearish</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Bullish</span>
          </div>
        </div>
        <div className="space-y-4">
          {HEATMAP_DATA.map((sector) => (
            <div key={sector.sector}>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">{sector.sector}</p>
              <div className="flex flex-wrap gap-2">
                {sector.stocks.map((stock) => (
                  <div
                    key={stock.ticker}
                    className={`rounded-xl px-4 py-3 min-w-[80px] text-center transition-all hover:scale-105 cursor-default ${getHeatColor(stock.change)}`}
                  >
                    <p className="text-xs font-black">{stock.ticker}</p>
                    <p className="text-[10px] font-bold mt-0.5">{stock.change >= 0 ? '+' : ''}{stock.change}%</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Watchlist & Alerts</h3>
          <div className="flex gap-2">
            <input
              value={newTicker}
              onChange={e => setNewTicker(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addToWatchlist()}
              placeholder="Add ticker..."
              className="bg-[#0a0b0d] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-32 uppercase"
            />
            <button onClick={addToWatchlist} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition-all">+ Watch</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {watchlist.map((item) => (
            <div key={item.ticker} className="bg-[#0a0b0d] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group relative">
              <button
                onClick={() => removeFromWatchlist(item.ticker)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all text-xs"
              >✕</button>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-black text-white">{item.ticker}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{item.name}</p>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-full ${
                  item.sentiment === SentimentType.BULLISH ? 'bg-emerald-500/20 text-emerald-400' :
                  item.sentiment === SentimentType.BEARISH ? 'bg-rose-500/20 text-rose-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>{item.sentiment}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-lg font-black text-white mono">${item.price}</span>
                <span className={`text-xs font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1.5">
                <span className="text-amber-400 text-[10px]">⚡</span>
                <p className="text-[10px] text-amber-300 font-medium">{item.alert}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
