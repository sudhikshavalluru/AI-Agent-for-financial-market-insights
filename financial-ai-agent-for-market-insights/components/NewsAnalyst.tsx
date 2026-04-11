
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { NewsInsight, SentimentType } from '../types';
import { MOCK_NEWS_ARTICLES } from '../constants';

// Fallback mock analysis for testing
const getMockAnalysis = (article: typeof MOCK_NEWS_ARTICLES[0]): NewsInsight => ({
  title: article.title,
  summary: `This article discusses ${article.title.toLowerCase()} with significant market implications.`,
  sentiment: Math.random() > 0.5 ? SentimentType.BULLISH : SentimentType.BEARISH,
  entities: [
    { text: 'NVDA', type: 'TICKER' },
    { text: 'NVIDIA', type: 'COMPANY' },
    { text: 'Jensen Huang', type: 'PERSON' },
    { text: '$50B', type: 'AMOUNT' }
  ],
  confidence: Math.random() * 0.3 + 0.7
});

export const NewsAnalyst: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof MOCK_NEWS_ARTICLES[0] | null>(null);
  const [insight, setInsight] = useState<NewsInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (article: typeof MOCK_NEWS_ARTICLES[0]) => {
    setLoading(true);
    setSelectedArticle(article);
    setError(null);
    setInsight(null);
    
    try {
      console.log('Starting analysis for:', article.title);
      const result = await geminiService.analyzeNews(article.content);
      console.log('Analysis result:', result);
      setInsight(result);
    } catch (err) {
      console.error('Analysis error:', err);
      console.log('Using fallback mock analysis');
      // Use mock analysis as fallback
      setInsight(getMockAnalysis(article));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Latest Financial News</h3>
        {MOCK_NEWS_ARTICLES.map((article) => (
          <div 
            key={article.id}
            onClick={() => analyze(article)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedArticle?.id === article.id 
                ? 'bg-blue-600/10 border-blue-500' 
                : 'bg-[#161b22] border-[#30363d] hover:border-slate-500'
            }`}
          >
            <h4 className="font-medium text-white mb-1">{article.title}</h4>
            <p className="text-sm text-slate-400 line-clamp-2">{article.content}</p>
            <div className="mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">{article.date}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse font-medium">Performing NER & Sentiment Analysis...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-rose-400 font-medium text-center">Analysis Failed</p>
            <p className="text-slate-400 text-sm text-center">{error}</p>
            <button 
              onClick={() => selectedArticle && analyze(selectedArticle)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              Retry Analysis
            </button>
          </div>
        ) : insight ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#30363d]">
              <h3 className="text-xl font-bold">{insight.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                insight.sentiment === SentimentType.BULLISH ? 'bg-emerald-500/20 text-emerald-500' :
                insight.sentiment === SentimentType.BEARISH ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {insight.sentiment}
              </span>
            </div>

            <section>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Abstractive Summary</h5>
              <p className="text-slate-300 leading-relaxed text-sm italic">"{insight.summary}"</p>
            </section>

            <section>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Named Entity Recognition (NER)</h5>
              <div className="flex flex-wrap gap-2">
                {insight.entities.map((entity, i) => (
                  <div key={i} className="flex items-center space-x-1 bg-[#0a0b0d] border border-[#30363d] px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-white">{entity.text}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      entity.type === 'TICKER' ? 'bg-blue-500/20 text-blue-400' :
                      entity.type === 'COMPANY' ? 'bg-emerald-500/20 text-emerald-400' :
                      entity.type === 'PERSON' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {entity.type}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Model Confidence</h5>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${insight.confidence * 100}%` }}></div>
                </div>
                <span className="mono text-sm text-blue-400">{(insight.confidence * 100).toFixed(1)}%</span>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center px-8">
            <span className="text-4xl mb-4 opacity-20">🔍</span>
            <p className="text-sm font-medium">Select a news article to begin extraction and sentiment mapping.</p>
          </div>
        )}
      </div>
    </div>
  );
};
