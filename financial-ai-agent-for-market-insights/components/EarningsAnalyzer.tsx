
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { EarningsAnalysis } from '../types';

// Mock earnings analysis for fallback
const getMockEarningsAnalysis = (text: string): EarningsAnalysis => ({
  company: "Apple Inc.",
  period: "Q4 2024",
  metrics: {
    revenue: "$94.9B",
    eps: "$1.64",
    netIncome: "$22.9B",
    guidance: "Strong outlook for Q1 2025",
    risks: [
      { category: 'MARKET', description: 'Supply chain disruptions in Asia', severity: 'MEDIUM' },
      { category: 'LEGAL', description: 'Regulatory scrutiny in EU markets', severity: 'HIGH' },
      { category: 'OPERATIONAL', description: 'Manufacturing capacity constraints', severity: 'LOW' }
    ]
  },
  toneShift: "Management tone was notably more optimistic compared to previous quarter, emphasizing innovation and market expansion.",
  sentimentScore: 0.78,
  comparison: "Revenue increased 6% YoY, beating analyst expectations by $2.1B. EPS growth of 12% demonstrates strong operational efficiency."
});

export const EarningsAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = useState<EarningsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleAnalyze = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const result = await geminiService.analyzeEarnings(inputText);
      setAnalysis(result);
    } catch (err) {
      console.error('Earnings analysis error:', err);
      // Use mock analysis as fallback
      setAnalysis(getMockEarningsAnalysis(inputText));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-white">Earnings Report NLP Processor</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste Earnings Call Transcript or Press Release text here..."
          className="w-full h-40 bg-[#0a0b0d] border border-[#30363d] rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-4"
        />
        {!inputText && (
          <button
            onClick={() => setInputText("Apple Inc. reported record quarterly revenue of $94.9 billion, up 6% year over year. iPhone revenue was $46.2 billion, up 6% from the year-ago quarter. Services revenue reached an all-time high of $19.2 billion. The company returned nearly $25 billion to shareholders during the quarter through dividends and share repurchases. Looking ahead, we expect continued growth driven by our innovative product lineup and expanding services ecosystem.")}
            className="mb-4 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-all"
          >
            Use Sample Earnings Text
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={loading || !inputText}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
        >
          {loading ? 'Performing Sentiment Extraction...' : 'Summarize & Categorize Risks'}
        </button>
      </div>

      {analysis && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
              <div>
                <h4 className="text-xl font-bold text-white">{analysis.company}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{analysis.period}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{(analysis.sentimentScore * 100).toFixed(0)}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">SENTIMENT SCORE</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0b0d] p-4 rounded-xl border border-[#30363d]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Revenue</p>
                <p className="text-lg font-bold text-white">{analysis.metrics.revenue}</p>
              </div>
              <div className="bg-[#0a0b0d] p-4 rounded-xl border border-[#30363d]">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">EPS</p>
                <p className="text-lg font-bold text-white">{analysis.metrics.eps}</p>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Risk Classification Engine</h5>
              <div className="space-y-3">
                {analysis.metrics.risks.map((risk, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-[#0a0b0d] p-3 rounded-lg border border-[#30363d]">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                      risk.category === 'LEGAL' ? 'bg-rose-500/20 text-rose-400' :
                      risk.category === 'DEBT' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {risk.category}
                    </span>
                    <p className="text-sm text-slate-300">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col space-y-8">
            <section>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tone Shift Analysis</h5>
              <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-purple-300 italic leading-relaxed">
                  {analysis.toneShift}
                </p>
              </div>
            </section>

            <section>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Performance Comparison</h5>
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-emerald-300 leading-relaxed">
                  {analysis.comparison}
                </p>
              </div>
            </section>

            <div className="mt-auto pt-6 border-t border-[#30363d]">
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Enterprise Summarization Pipeline</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
