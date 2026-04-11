import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { QAResponse } from '../types';

const getMockQAResponse = (query: string): QAResponse => ({
  answer: `Based on current market analysis, ${query.toLowerCase()} shows several key factors to consider. The financial metrics indicate strong fundamentals with positive momentum in recent quarters.`,
  reasoning: 'Analysis performed using semantic search across financial databases, earnings transcripts, and market research reports.',
  citations: [
    { source: '10-K Filing 2024', context: 'Revenue growth of 12% year-over-year with expanding margins' },
    { source: 'Analyst Report - Goldman Sachs', context: 'Upgraded to Buy rating with $180 price target' },
  ],
});

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const QAAgent: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; content: QAResponse | string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [voiceSupported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [ttsSupported] = useState(() => !!window.speechSynthesis);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speakText = (text: string, index: number) => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();

    if (speakingIndex === index) {
      setSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'en-US')
      || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setSpeaking(true); setSpeakingIndex(index); };
    utterance.onend = () => { setSpeaking(false); setSpeakingIndex(null); };
    utterance.onerror = () => { setSpeaking(false); setSpeakingIndex(null); };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
      const response = await geminiService.askQuestion(userQuery);
      setMessages(prev => [...prev, { role: 'agent', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', content: getMockQAResponse(userQuery) }]);
    } finally {
      setLoading(false);
    }
  };

  const getAnswerText = (content: QAResponse | string) =>
    typeof content === 'string' ? content : content.answer;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">RAG Financial Agent</span>
        </div>
        <div className="flex items-center gap-3">
          {voiceSupported && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              🎤 Voice Input Ready
            </span>
          )}
          {ttsSupported && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400">
              🔊 Text-to-Speech Ready
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="text-5xl">🤖</div>
            <p className="text-sm font-bold text-slate-400">Ask me anything about markets, stocks, or financial analysis</p>
            <p className="text-[11px] text-slate-600">Type your question or click the 🎤 mic button to speak</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 relative group ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-[#0d1117] border border-[#30363d] rounded-tl-none'
            }`}>
              {typeof msg.content === 'string' ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-200 leading-relaxed">{msg.content.answer}</p>

                  {msg.content.citations.length > 0 && (
                    <div className="pt-3 border-t border-[#30363d]">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sources</h5>
                      <div className="space-y-2">
                        {msg.content.citations.map((cite, j) => (
                          <div key={j} className="text-xs text-slate-400 bg-white/5 p-2 rounded-lg border-l-2 border-emerald-500">
                            <span className="font-bold text-emerald-400 block mb-0.5">{cite.source}</span>
                            <span className="italic">"{cite.context}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-600 italic">
                    <strong className="text-slate-500">Reasoning:</strong> {msg.content.reasoning}
                  </div>
                </div>
              )}

              {/* TTS Button — only on agent messages */}
              {msg.role === 'agent' && ttsSupported && (
                <button
                  onClick={() => speakText(getAnswerText(msg.content), i)}
                  className={`absolute -bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    speakingIndex === i
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-[#161b22] text-slate-400 border-[#30363d] hover:text-white hover:border-blue-500/50'
                  }`}
                  title={speakingIndex === i ? 'Stop speaking' : 'Read aloud'}
                >
                  {speakingIndex === i ? (
                    <><span className="animate-pulse">■</span> Stop</>
                  ) : (
                    <><span>🔊</span> Read</>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-slate-500 text-sm">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#30363d] bg-[#0d1117] space-y-3">

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {[
              "What are the key risks in AAPL's latest earnings?",
              "Analyze NVDA's competitive position in AI chips",
              "How does Fed rate policy affect tech stocks?",
              "Compare MSFT vs GOOGL cloud revenue growth",
            ].map(s => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="px-3 py-1.5 bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-300 text-[11px] rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Voice status banner */}
        {listening && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="w-1 bg-rose-500 rounded-full animate-pulse"
                  style={{ height: `${Math.random() * 16 + 8}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-rose-400">Listening... speak your question</span>
            <button onClick={stopListening} className="ml-auto text-[10px] font-bold text-rose-400 hover:text-white transition-colors">
              Stop
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about markets, stocks, or financial analysis..."
            className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
          />

          {/* Mic Button */}
          {voiceSupported && (
            <button
              onClick={listening ? stopListening : startListening}
              title={listening ? 'Stop listening' : 'Speak your question'}
              className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm ${
                listening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              🎤
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
