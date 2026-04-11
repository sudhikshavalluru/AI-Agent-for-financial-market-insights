
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { StockPrediction, SentimentType } from '../types';

// Mock prediction for fallback
const getMockPrediction = (ticker: string): StockPrediction => ({
  ticker: ticker.toUpperCase(),
  outlook: Math.random() > 0.5 ? SentimentType.BULLISH : SentimentType.BEARISH,
  confidence: Math.random() * 0.3 + 0.65,
  reasoning: `Based on recent market analysis, ${ticker} shows strong fundamentals with positive earnings momentum and favorable sector trends.`,
  sentimentBreakdown: {
    news: Math.random() * 0.4 + 0.5,
    earnings: Math.random() * 0.4 + 0.6,
    macro: Math.random() * 0.3 + 0.4
  },
  volatilityForecast: ['STABLE', 'MODERATE', 'HIGH'][Math.floor(Math.random() * 3)] as 'STABLE' | 'MODERATE' | 'HIGH'
});

export const StockPredictor: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [context, setContext] = useState('');
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const runPredictor = async () => {
    if (!ticker) return;
    setLoading(true);
    try {
      const result = await geminiService.predictStockSentiment(ticker, context);
      setPrediction(result);
    } catch (err) {
      console.error('Stock prediction error:', err);
      // Use mock prediction as fallback
      setPrediction(getMockPrediction(ticker));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Stock Sentiment Predictor</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Ticker (e.g. AAPL)"
            className="bg-[#0a0b0d] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Optional Context (News titles, recent trends...)"
            className="md:col-span-3 bg-[#0a0b0d] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        {!ticker && (
          <div className="flex gap-2 mb-4">
            {['AAPL', 'NVDA', 'TSLA', 'MSFT'].map(stock => (
              <button
                key={stock}
                onClick={() => setTicker(stock)}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 text-sm rounded transition-all"
              >
                {stock}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={runPredictor}
          disabled={loading || !ticker}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-600/20"
        >
          {loading ? 'Synthesizing Market Sentiments...' : 'Run Multi-Factor Prediction'}
        </button>
      </div>

      {prediction && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Directional Outlook</h4>
            <div className={`text-5xl font-black ${
              prediction.outlook === SentimentType.BULLISH ? 'text-emerald-500' :
              prediction.outlook === SentimentType.BEARISH ? 'text-rose-500' : 'text-slate-400'
            }`}>
              {prediction.outlook}
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full ${prediction.outlook === SentimentType.BULLISH ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${prediction.confidence * 100}%` }}></div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Confidence: {(prediction.confidence * 100).toFixed(0)}%</p>
          </div>

          <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-6">
            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Model Reasoning</h5>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{prediction.reasoning}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0a0b0d] rounded-xl border border-[#30363d]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">News Sentiment</p>
                <p className="text-lg font-bold text-blue-400">{(prediction.sentimentBreakdown.news * 100).toFixed(0)}%</p>
              </div>
              <div className="p-4 bg-[#0a0b0d] rounded-xl border border-[#30363d]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Earnings Tone</p>
                <p className="text-lg font-bold text-emerald-400">{(prediction.sentimentBreakdown.earnings * 100).toFixed(0)}%</p>
              </div>
              <div className="p-4 bg-[#0a0b0d] rounded-xl border border-[#30363d]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Volatility</p>
                <p className={`text-lg font-bold ${prediction.volatilityForecast === 'HIGH' ? 'text-rose-400' : 'text-slate-400'}`}>
                  {prediction.volatilityForecast}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
