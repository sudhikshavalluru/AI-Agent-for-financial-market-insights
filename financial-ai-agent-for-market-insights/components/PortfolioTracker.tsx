
import React, { useState } from 'react';
import { MOCK_PORTFOLIO } from '../constants';
import { SentimentType, PortfolioStock } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const PortfolioTracker: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>(MOCK_PORTFOLIO);
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const totalValue = portfolio.reduce((sum, s) => sum + s.shares * s.currentPrice, 0);
  const totalCost = portfolio.reduce((sum, s) => sum + s.shares * s.buyPrice, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = ((totalPnL / totalCost) * 100).toFixed(2);

  const pieData = portfolio.map(s => ({ name: s.ticker, value: +(s.shares * s.currentPrice).toFixed(2) }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const addStock = () => {
    if (!ticker || !shares || !buyPrice) return;
    const price = parseFloat(buyPrice);
    setPortfolio(prev => [...prev, {
      ticker: ticker.toUpperCase(),
      name: ticker.toUpperCase(),
      shares: parseInt(shares),
      buyPrice: price,
      currentPrice: +(price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2),
      sentiment: SentimentType.NEUTRAL,
      change: +(Math.random() * 4 - 2).toFixed(2),
    }]);
    setTicker(''); setShares(''); setBuyPrice('');
  };

  const removeStock = (t: string) => setPortfolio(prev => prev.filter(s => s.ticker !== t));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-white' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400' },
          { label: 'Return %', value: `${totalPnL >= 0 ? '+' : ''}${totalPnLPct}%`, color: totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400' },
        ].map((card, i) => (
          <div key={i} className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{card.label}</p>
            <p className={`text-2xl font-black mono ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Holdings</h3>
          <div className="space-y-2">
            {portfolio.map((stock) => {
              const pnl = (stock.currentPrice - stock.buyPrice) * stock.shares;
              const pnlPct = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice * 100).toFixed(1);
              return (
                <div key={stock.ticker} className="flex items-center justify-between p-3 bg-[#0a0b0d] rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] font-black text-blue-400">{stock.ticker.slice(0,2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{stock.ticker}</p>
                      <p className="text-[10px] text-slate-500">{stock.shares} shares @ ${stock.buyPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-white">${stock.currentPrice}</p>
                      <p className={`text-[10px] font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}% today
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}
                      </p>
                      <p className={`text-[10px] font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{pnlPct}%</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full ${
                      stock.sentiment === SentimentType.BULLISH ? 'bg-emerald-500/20 text-emerald-400' :
                      stock.sentiment === SentimentType.BEARISH ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>{stock.sentiment}</span>
                    <button onClick={() => removeStock(stock.ticker)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all text-xs">✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Stock */}
          <div className="mt-4 flex gap-2">
            <input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="TICKER" className="w-24 bg-[#0a0b0d] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase" />
            <input value={shares} onChange={e => setShares(e.target.value)} placeholder="Shares" type="number" className="w-24 bg-[#0a0b0d] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
            <input value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="Buy Price" type="number" className="w-28 bg-[#0a0b0d] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
            <button onClick={addStock} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition-all">+ Add</button>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Allocation</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-slate-400 font-bold">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
