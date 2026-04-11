import React, { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const RISK_PROFILES = {
  Conservative: { market: 20, credit: 15, liquidity: 10, operational: 25, regulatory: 30 },
  Moderate: { market: 45, credit: 35, liquidity: 30, operational: 40, regulatory: 50 },
  Aggressive: { market: 80, credit: 65, liquidity: 55, operational: 60, regulatory: 70 },
};

export const RiskCalculator: React.FC = () => {
  const [investment, setInvestment] = useState('10000');
  const [horizon, setHorizon] = useState('12');
  const [profile, setProfile] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [calculated, setCalculated] = useState(false);

  const riskData = Object.entries(RISK_PROFILES[profile]).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const inv = parseFloat(investment) || 0;
  const hor = parseInt(horizon) || 1;
  const riskMultiplier = profile === 'Conservative' ? 0.06 : profile === 'Moderate' ? 0.12 : 0.22;
  const expectedReturn = (inv * riskMultiplier * (hor / 12)).toFixed(2);
  const maxDrawdown = (inv * (profile === 'Conservative' ? 0.05 : profile === 'Moderate' ? 0.15 : 0.35)).toFixed(2);
  const sharpeRatio = profile === 'Conservative' ? '0.82' : profile === 'Moderate' ? '1.24' : '1.67';
  const varValue = (inv * (profile === 'Conservative' ? 0.03 : profile === 'Moderate' ? 0.08 : 0.18)).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Risk Parameters</h3>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Investment Amount ($)</label>
            <input
              type="number"
              value={investment}
              onChange={e => setInvestment(e.target.value)}
              className="w-full bg-[#0a0b0d] border border-[#30363d] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Horizon (Months)</label>
            <input
              type="number"
              value={horizon}
              onChange={e => setHorizon(e.target.value)}
              className="w-full bg-[#0a0b0d] border border-[#30363d] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Moderate', 'Aggressive'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setProfile(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    profile === p
                      ? p === 'Conservative' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : p === 'Moderate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCalculated(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm text-white transition-all shadow-lg shadow-blue-600/20"
          >
            Calculate Risk Profile
          </button>
        </div>

        {/* Radar Chart */}
        <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Risk Exposure Radar</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskData}>
                <PolarGrid stroke="#30363d" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Results */}
      {calculated && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Expected Return', value: `+$${parseFloat(expectedReturn).toLocaleString()}`, color: 'text-emerald-400', sub: `Over ${horizon} months` },
            { label: 'Max Drawdown', value: `-$${parseFloat(maxDrawdown).toLocaleString()}`, color: 'text-rose-400', sub: 'Worst case scenario' },
            { label: 'Sharpe Ratio', value: sharpeRatio, color: 'text-blue-400', sub: 'Risk-adjusted return' },
            { label: 'Value at Risk', value: `$${parseFloat(varValue).toLocaleString()}`, color: 'text-amber-400', sub: '95% confidence (VaR)' },
          ].map((item, i) => (
            <div key={i} className="bg-[#161b22] border border-white/5 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
              <p className={`text-xl font-black mono ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
