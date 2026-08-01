import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { ScreeningConfig, ScreeningResult } from './types';
import { DEFAULT_PRESET } from './presets';
import { DEMO_RESULTS } from './demoData';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import ResultsTable from './components/ResultsTable';
import ProgressIndicator from './components/ProgressIndicator';
import OnboardingOverlay from './components/OnboardingOverlay';

const API_KEY_STORAGE = 'alphascreen_gemini_key';
const ONBOARDED_STORAGE = 'alphascreen_onboarded';

function App() {
  const [config, setConfig] = useState<ScreeningConfig>({
    tickers: DEFAULT_PRESET.tickers,
    maxMarketCap: DEFAULT_PRESET.filters.maxMarketCap,
    minEbitda: DEFAULT_PRESET.filters.minEbitda,
    maxPeRatio: DEFAULT_PRESET.filters.maxPeRatio,
    minRevenueGrowth: DEFAULT_PRESET.filters.minRevenueGrowth,
    userCriteria: DEFAULT_PRESET.criteria,
    analystRole: DEFAULT_PRESET.analystRole
  });

  // The visitor's Gemini key lives only in their browser (localStorage) and is
  // sent with each request; it is never persisted or logged server-side.
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const saveApiKey = (key: string) => {
    setApiKey(key);
    if (key.trim()) localStorage.setItem(API_KEY_STORAGE, key.trim());
    else localStorage.removeItem(API_KEY_STORAGE);
  };

  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'results'>('dashboard');
  const [progress, setProgress] = useState({ current: 0, total: 0, statusText: '', currentTicker: '' });

  // Show the welcome overlay on first visit only (dismissal persists in the browser).
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !localStorage.getItem(ONBOARDED_STORAGE));
  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDED_STORAGE, '1');
    setShowOnboarding(false);
  };

  // Load bundled sample results — lets visitors explore the full UI without a key.
  const loadDemo = () => {
    setIsDemo(true);
    setIsRunning(false);
    setResults(DEMO_RESULTS);
    setProgress({ current: DEMO_RESULTS.length, total: DEMO_RESULTS.length, statusText: 'Sample data loaded', currentTicker: '' });
    setActiveTab('dashboard');
  };

  const runScreening = async () => {
    setIsRunning(true);
    setIsDemo(false);
    setResults([]);
    const tickerList = config.tickers.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    setProgress({ current: 0, total: tickerList.length, statusText: 'Initializing pipeline...', currentTicker: '' });

    try {
      const response = await fetch('/api/batch-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers: tickerList,
          maxMarketCap: config.maxMarketCap,
          minEbitda: config.minEbitda,
          maxPeRatio: config.maxPeRatio,
          minRevenueGrowth: config.minRevenueGrowth,
          userCriteria: config.userCriteria,
          analystRole: config.analystRole,
          apiKey
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const newResults: ScreeningResult[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === 'result') {
                newResults.push(event.data);
                setResults([...newResults]);
                setProgress(prev => ({ ...prev, current: newResults.length, currentTicker: event.data.ticker, statusText: `Analyzed ${event.data.ticker}` }));
              } else if (event.type === 'progress') {
                setProgress(prev => ({ ...prev, statusText: event.message, currentTicker: event.ticker || '' }));
              } else if (event.type === 'done') {
                setProgress(prev => ({ ...prev, current: prev.total, statusText: '✅ Screening Complete' }));
              }
            } catch (err) {
              console.error('Error parsing SSE', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE failed, falling back to sequential:', error);
      // Fallback
      const newResults: ScreeningResult[] = [];
      for (const ticker of tickerList) {
        setProgress(prev => ({ ...prev, currentTicker: ticker, statusText: `Analyzing ${ticker}...` }));
        try {
          const res = await fetch('/api/screen-ticker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticker,
              maxMarketCap: config.maxMarketCap,
              minEbitda: config.minEbitda,
              maxPeRatio: config.maxPeRatio,
              minRevenueGrowth: config.minRevenueGrowth,
              userCriteria: config.userCriteria,
              analystRole: config.analystRole,
              apiKey
            })
          });
          const data = await res.json();
          newResults.push(data);
          setResults([...newResults]);
          setProgress(prev => ({ ...prev, current: newResults.length }));
        } catch (err) {
          console.error(`Error screening ${ticker}`, err);
        }
      }
      setProgress(prev => ({ ...prev, statusText: '✅ Screening Complete' }));
    }
    
    setIsRunning(false);
    if (results.length === 0) {
        setActiveTab('results');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0e1a] text-[#f1f5f9]">
      {showOnboarding && (
        <OnboardingOverlay onClose={dismissOnboarding} onLoadDemo={loadDemo} />
      )}
      <Sidebar
        config={config}
        setConfig={setConfig}
        onRun={runScreening}
        isRunning={isRunning}
        apiKey={apiKey}
        onApiKeyChange={saveApiKey}
        onLoadDemo={loadDemo}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-6 border-b border-[#1e293b] bg-[#0a0e1a]/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            AlphaScreen
          </h1>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 bg-[#1a1f35] p-1 rounded-lg border border-[#1e293b]">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-[#222845] text-white' : 'text-[#94a3b8] hover:text-white'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'results' ? 'bg-[#222845] text-white' : 'text-[#94a3b8] hover:text-white'}`}
                onClick={() => setActiveTab('results')}
              >
                Pipeline
              </button>
            </div>
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1a1f35] border border-transparent hover:border-[#1e293b] transition-colors"
              aria-label="How it works"
              title="How it works"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
          {isRunning && (
            <div className="mb-8">
              <ProgressIndicator 
                current={progress.current} 
                total={progress.total} 
                statusText={progress.statusText} 
                currentTicker={progress.currentTicker} 
              />
            </div>
          )}

          {isDemo && (
            <div className="mb-6 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 text-blue-200 text-sm animate-fade-in flex items-start">
              <span className="mr-2">🔎</span>
              <span>
                <b className="text-blue-100">Sample data</b> — a saved food-retail screening run, shown so you can explore the full interface without a key.
                Add your own Gemini API key in the sidebar and hit <b>Execute Pipeline</b> to run a live screen on any tickers and sector.
              </span>
            </div>
          )}

          {!isDemo && results.some(r => r.decision?.includes('ERROR') && /crumb|too many requests|429|failed to get/i.test(r.findings || '')) && (
            <div className="mb-6 p-4 rounded-lg bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm animate-fade-in flex items-start">
              <span className="mr-2">🛰️</span>
              <span>
                <b className="text-rose-100">Live market data is being rate-limited.</b> Yahoo Finance throttles requests from shared cloud servers (like this demo host),
                so live screening may fail here. Click <b>Load sample results</b> in the sidebar for a full real run, or run the app locally (residential IPs aren't throttled).
                SEC EDGAR and the AI analysis are unaffected — this only limits the Yahoo quote step.
              </span>
            </div>
          )}

          {!isDemo && results.some(r => r.aiStatus === 'badkey') && (
            <div className="mb-6 p-4 rounded-lg bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm animate-fade-in flex items-start">
              <span className="mr-2">🔑</span>
              <span>
                <b className="text-rose-100">Invalid API key.</b> Gemini rejected the key — double-check it in the sidebar.
                You can get a free key at <span className="underline">aistudio.google.com/apikey</span>. Quantitative + SEC results are still shown below.
              </span>
            </div>
          )}

          {!isDemo && results.some(r => r.aiStatus === 'nokey') && (
            <div className="mb-6 p-4 rounded-lg bg-amber-900/20 border border-amber-500/30 text-amber-300 text-sm animate-fade-in flex items-start">
              <span className="mr-2">💡</span>
              <span>
                <b className="text-amber-200">Quantitative results only</b> — no Gemini API key set, so AI strategic scoring was skipped.
                Add a free key in the sidebar for the AI analysis, or click <b>Load sample results</b> to see it in action.
              </span>
            </div>
          )}

          {!isDemo && results.some(r => r.aiStatus === 'quota') && (
            <div className="mb-6 p-4 rounded-lg bg-amber-900/20 border border-amber-500/30 text-amber-300 text-sm animate-fade-in flex items-start">
              <span className="mr-2">⚠️</span>
              <span>
                <b className="text-amber-200">AI quota reached</b> — showing quantitative results only for {results.filter(r => r.aiStatus === 'quota').length} company(ies).
                Financial filters and SEC data are unaffected. The Gemini free tier allows 20 requests/day; add billing or retry later for AI strategic scoring.
              </span>
            </div>
          )}

          {!isRunning && progress.total > 0 && progress.current === progress.total && (
            <div className="mb-8 p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-sm animate-fade-in flex items-center">
              <span className="mr-2">✨</span> Pipeline analysis complete. Identified {results.filter(r => r.decision.includes('DEEP DIVE')).length} target(s) for deep dive.
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <DashboardCards results={results} />
          ) : (
            <ResultsTable results={results} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
