
import React from 'react';
import { SentimentType } from './types';

export const APP_THEME = {
  primary: '#3b82f6',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  bg: '#0a0b0d',
  card: '#161b22',
  border: '#30363d'
};

export const MOCK_NEWS_ARTICLES = [
  {
    id: '1',
    title: 'NVIDIA CEO Announces New Blackwell AI Infrastructure',
    content: 'NVIDIA (NVDA) CEO Jensen Huang unveiled a massive expansion of the Blackwell platform today at the GTC conference. Revenue expectations for the next quarter have surged as hyperscalers like Microsoft and Meta ramp up orders.',
    date: '2024-10-25'
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Cut in December',
    content: 'Jerome Powell indicated that inflation metrics are cooling faster than expected, potentially leading to a 25 basis point cut in the upcoming December meeting.',
    date: '2024-10-24'
  },
  {
    id: '3',
    title: 'Apple Reports Record Q4 Revenue Driven by iPhone 16 Sales',
    content: 'Apple Inc. (AAPL) reported record-breaking Q4 revenue of $94.9B, surpassing analyst estimates. iPhone 16 sales exceeded expectations in emerging markets, while services revenue hit an all-time high of $24.2B.',
    date: '2024-10-23'
  },
  {
    id: '4',
    title: 'Tesla Cybertruck Production Ramp Faces Supply Chain Delays',
    content: 'Tesla (TSLA) disclosed that Cybertruck production targets for Q1 2025 may be missed due to battery cell shortages from Panasonic. Analysts downgraded the stock citing margin pressure and increasing EV competition from BYD.',
    date: '2024-10-22'
  }
];

export const MOCK_PORTFOLIO = [
  { ticker: 'AAPL', name: 'Apple Inc.', shares: 50, buyPrice: 165.20, currentPrice: 189.45, sentiment: SentimentType.BULLISH, change: 2.3 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', shares: 20, buyPrice: 420.00, currentPrice: 875.30, sentiment: SentimentType.BULLISH, change: 4.1 },
  { ticker: 'TSLA', name: 'Tesla Inc.', shares: 30, buyPrice: 250.00, currentPrice: 198.70, sentiment: SentimentType.BEARISH, change: -1.8 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 15, buyPrice: 310.00, currentPrice: 415.20, sentiment: SentimentType.BULLISH, change: 0.9 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', shares: 25, buyPrice: 130.00, currentPrice: 182.50, sentiment: SentimentType.NEUTRAL, change: 0.2 },
  { ticker: 'META', name: 'Meta Platforms', shares: 10, buyPrice: 280.00, currentPrice: 512.40, sentiment: SentimentType.BULLISH, change: 3.2 },
];

export const MOCK_WATCHLIST = [
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 175.30, change: 1.4, sentiment: SentimentType.BULLISH, alert: 'Earnings beat expected' },
  { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.50, change: -0.6, sentiment: SentimentType.NEUTRAL, alert: 'Fed rate decision pending' },
  { ticker: 'NFLX', name: 'Netflix Inc.', price: 680.20, change: 5.2, sentiment: SentimentType.BULLISH, alert: 'Subscriber growth surge' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', price: 142.80, change: -2.1, sentiment: SentimentType.BEARISH, alert: 'Margin compression risk' },
  { ticker: 'DIS', name: 'Walt Disney Co.', price: 95.40, change: 0.8, sentiment: SentimentType.NEUTRAL, alert: 'Streaming profitability watch' },
];

export const HEATMAP_DATA = [
  { sector: 'Technology', stocks: [
    { ticker: 'AAPL', change: 2.3 }, { ticker: 'MSFT', change: 0.9 }, { ticker: 'NVDA', change: 4.1 }, { ticker: 'AMD', change: -2.1 }, { ticker: 'INTC', change: -0.5 }
  ]},
  { sector: 'Finance', stocks: [
    { ticker: 'JPM', change: -0.6 }, { ticker: 'GS', change: 1.2 }, { ticker: 'BAC', change: -1.1 }, { ticker: 'MS', change: 0.4 }
  ]},
  { sector: 'Consumer', stocks: [
    { ticker: 'AMZN', change: 0.2 }, { ticker: 'TSLA', change: -1.8 }, { ticker: 'NKE', change: 1.5 }, { ticker: 'MCD', change: 0.3 }
  ]},
  { sector: 'Healthcare', stocks: [
    { ticker: 'JNJ', change: 0.7 }, { ticker: 'PFE', change: -0.9 }, { ticker: 'UNH', change: 2.1 }, { ticker: 'ABBV', change: 1.3 }
  ]},
  { sector: 'Energy', stocks: [
    { ticker: 'XOM', change: -0.3 }, { ticker: 'CVX', change: 0.5 }, { ticker: 'COP', change: -1.4 }
  ]},
  { sector: 'Media', stocks: [
    { ticker: 'NFLX', change: 5.2 }, { ticker: 'DIS', change: 0.8 }, { ticker: 'META', change: 3.2 }, { ticker: 'GOOGL', change: 1.4 }
  ]},
];
