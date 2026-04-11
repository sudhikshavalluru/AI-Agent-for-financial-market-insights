import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

export const APITest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string>('');

  const testAPI = async () => {
    setStatus('testing');
    try {
      const response = await geminiService.analyzeNews('Apple Inc. reported strong quarterly earnings with revenue up 15%.');
      setResult(JSON.stringify(response, null, 2));
      setStatus('success');
    } catch (error) {
      setResult(`Error: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">Gemini API Test</h3>
      <button
        onClick={testAPI}
        disabled={status === 'testing'}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg mb-4"
      >
        {status === 'testing' ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {status !== 'idle' && (
        <div className={`p-4 rounded-lg ${
          status === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' :
          status === 'error' ? 'bg-rose-500/10 border border-rose-500/20' :
          'bg-blue-500/10 border border-blue-500/20'
        }`}>
          <div className={`text-xs font-bold mb-2 ${
            status === 'success' ? 'text-emerald-500' :
            status === 'error' ? 'text-rose-500' :
            'text-blue-500'
          }`}>
            {status === 'success' ? '✅ API Working' :
             status === 'error' ? '❌ API Error' :
             '🔄 Testing...'}
          </div>
          <pre className="text-xs text-slate-300 overflow-auto max-h-40">{result}</pre>
        </div>
      )}
    </div>
  );
};