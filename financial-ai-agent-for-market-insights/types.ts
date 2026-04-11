
export enum SentimentType {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface Entity {
  text: string;
  type: 'COMPANY' | 'TICKER' | 'PERSON' | 'TERM' | 'AMOUNT';
}

export interface NewsInsight {
  title: string;
  summary: string;
  entities: Entity[];
  sentiment: SentimentType;
  confidence: number;
}

export interface RiskFactor {
  category: 'MARKET' | 'LEGAL' | 'DEBT' | 'OPERATIONAL';
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface EarningsMetrics {
  revenue: string;
  eps: string;
  netIncome: string;
  guidance: string;
  risks: RiskFactor[];
}

export interface EarningsAnalysis {
  company: string;
  period: string;
  metrics: EarningsMetrics;
  toneShift: string;
  sentimentScore: number;
  comparison: string;
}

export interface StockPrediction {
  ticker: string;
  outlook: SentimentType;
  confidence: number;
  reasoning: string;
  sentimentBreakdown: {
    news: number;
    earnings: number;
    macro: number;
  };
  volatilityForecast: 'STABLE' | 'MODERATE' | 'HIGH';
}

export interface QAResponse {
  answer: string;
  citations: {
    source: string;
    context: string;
  }[];
  reasoning: string;
}

export interface PortfolioStock {
  ticker: string;
  name: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  sentiment: SentimentType;
  change: number;
}

export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  sentiment: SentimentType;
  alert: string;
}
