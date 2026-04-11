
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { NewsAnalyst } from './components/NewsAnalyst';
import { EarningsAnalyzer } from './components/EarningsAnalyzer';
import { StockPredictor } from './components/StockPredictor';
import { QAAgent } from './components/QAAgent';
import { LandingPage } from './components/LandingPage';
import { PortfolioTracker } from './components/PortfolioTracker';
import { MarketHeatmap } from './components/MarketHeatmap';
import { RiskCalculator } from './components/RiskCalculator';
import { MacroCalendar } from './components/MacroCalendar';
import { SentimentComparison } from './components/SentimentComparison';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isLoggedIn) {
    return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'news': return <NewsAnalyst />;
      case 'earnings': return <EarningsAnalyzer />;
      case 'predictor': return <StockPredictor />;
      case 'qa': return <QAAgent />;
      case 'portfolio': return <PortfolioTracker />;
      case 'heatmap': return <MarketHeatmap />;
      case 'risk': return <RiskCalculator />;
      case 'calendar': return <MacroCalendar />;
      case 'compare': return <SentimentComparison />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)}>
      {renderContent()}
    </Layout>
  );
};

export default App;
