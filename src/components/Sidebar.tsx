import React, { useState } from 'react';
import { ScreeningConfig } from '../types';
import { PRESETS, DEFAULT_PRESET, THESIS_ANGLES } from '../presets';
import { Settings, Play, ChevronDown, Activity, DollarSign, Layers, KeyRound, Eye, EyeOff, FlaskConical } from 'lucide-react';

interface SidebarProps {
  config: ScreeningConfig;
  setConfig: React.Dispatch<React.SetStateAction<ScreeningConfig>>;
  onRun: () => void;
  isRunning: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onLoadDemo: () => void;
}

export default function Sidebar({ config, setConfig, onRun, isRunning, apiKey, onApiKeyChange, onLoadDemo }: SidebarProps) {
  const [presetId, setPresetId] = useState(DEFAULT_PRESET.id);
  const [thesisId, setThesisId] = useState('default');
  const [showKey, setShowKey] = useState(false);

  // Selecting a sector preset seeds tickers, criteria, filters, and the AI
  // analyst persona. Everything stays editable afterwards.
  const applyPreset = (id: string) => {
    const p = PRESETS.find(x => x.id === id);
    if (!p) return;
    setPresetId(id);
    setThesisId('default');
    setConfig(prev => ({
      ...prev,
      tickers: p.tickers,
      userCriteria: p.criteria,
      analystRole: p.analystRole,
      maxMarketCap: p.filters.maxMarketCap,
      minEbitda: p.filters.minEbitda,
      maxPeRatio: p.filters.maxPeRatio,
      minRevenueGrowth: p.filters.minRevenueGrowth,
    }));
  };

  // Selecting a thesis angle swaps only the qualitative criteria. "Sector
  // default" restores the current preset's thesis; "Custom" leaves the text
  // as-is for free editing.
  const applyThesis = (id: string) => {
    setThesisId(id);
    if (id === 'custom') return;
    let text = '';
    if (id === 'default') {
      text = PRESETS.find(x => x.id === presetId)?.criteria ?? '';
    } else {
      text = THESIS_ANGLES.find(x => x.id === id)?.text ?? '';
    }
    setConfig(prev => ({ ...prev, userCriteria: text }));
  };

  return (
    <div className="w-80 h-full flex flex-col bg-[#0d1117] border-r border-[#1e293b] text-[#94a3b8]">
      <div className="p-6 border-b border-[#1e293b] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-bold text-white text-lg tracking-wider">ALPHA<span className="font-light">SCREEN</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider mb-4 flex items-center">
            <KeyRound className="w-4 h-4 mr-2 text-emerald-500" /> Gemini API Key
          </h3>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                className="w-full bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg pl-3 pr-9 py-2 text-xs font-mono outline-none focus:border-blue-500"
                value={apiKey}
                onChange={e => onApiKeyChange(e.target.value)}
                placeholder="Paste your Gemini API key"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                className="absolute right-2 top-2 text-[#64748b] hover:text-[#94a3b8]"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              {apiKey.trim()
                ? <span className="text-emerald-500/90">✓ Stored in your browser only — never sent anywhere but Google.</span>
                : <>No key set — you'll get quantitative results only. </>}
              {' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get a free key →</a>
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-emerald-500" /> Sector Playbook
          </h3>
          <div className="relative">
            <select
              className="w-full bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-blue-500"
              value={presetId}
              onChange={e => applyPreset(e.target.value)}
            >
              {PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#64748b] pointer-events-none" />
          </div>
          <p className="mt-2 text-[11px] text-[#64748b] leading-relaxed">
            <span className="text-emerald-500/90 font-medium">AI lens:</span> {config.analystRole}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-emerald-500" /> Targets
          </h3>
          <div className="space-y-2">
            <label className="block text-xs text-[#64748b]">Tickers (comma separated)</label>
            <textarea
              className="w-full h-24 bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg p-3 text-xs font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              value={config.tickers}
              onChange={e => setConfig({ ...config, tickers: e.target.value })}
              placeholder="AAPL, MSFT, GOOG..."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-emerald-500" /> Quant Filters
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#64748b]">
                <span>Max Market Cap</span>
                <span className="text-[#f1f5f9]">{config.maxMarketCap > 0 ? `$${config.maxMarketCap}B` : 'Off'}</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-[#64748b]" />
                <input
                  type="number"
                  className="w-full bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={config.maxMarketCap}
                  onChange={e => setConfig({ ...config, maxMarketCap: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#64748b]">
                <span>Min EBITDA Margin</span>
                <span className="text-[#f1f5f9]">{config.minEbitda !== 0 ? `${config.minEbitda}%` : 'Off'}</span>
              </label>
              <input
                type="range"
                min="-20" max="50"
                value={config.minEbitda}
                onChange={e => setConfig({ ...config, minEbitda: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#64748b]">
                <span>Max P/E Ratio</span>
                <span className="text-[#f1f5f9]">{config.maxPeRatio > 0 ? `${config.maxPeRatio}x` : 'Off'}</span>
              </label>
              <input
                type="number"
                className="w-full bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={config.maxPeRatio}
                onChange={e => setConfig({ ...config, maxPeRatio: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#64748b]">
                <span>Min Rev Growth</span>
                <span className="text-[#f1f5f9]">{config.minRevenueGrowth !== 0 ? `${config.minRevenueGrowth}%` : 'Off'}</span>
              </label>
              <input
                type="range"
                min="-20" max="100"
                value={config.minRevenueGrowth}
                onChange={e => setConfig({ ...config, minRevenueGrowth: Number(e.target.value) })}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-emerald-500" /> Qualitative Thesis
          </h3>
          <div className="space-y-3">
            <div className="relative">
              <select
                className="w-full bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-blue-500"
                value={thesisId}
                onChange={e => applyThesis(e.target.value)}
              >
                <option value="default">Sector default</option>
                {THESIS_ANGLES.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
                <option value="custom">Custom (edit below)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#64748b] pointer-events-none" />
            </div>
            <textarea
              className="w-full h-36 bg-[#1a1f35] text-[#f1f5f9] border border-[#1e293b] rounded-lg p-3 text-xs leading-relaxed focus:border-blue-500 outline-none transition-all resize-none"
              value={config.userCriteria}
              onChange={e => {
                setConfig({ ...config, userCriteria: e.target.value });
                setThesisId('custom');
              }}
              placeholder="Describe your ideal acquisition target for this sector..."
            />
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-[#1e293b] shrink-0 bg-[#0d1117]">
        <button
          onClick={onRun}
          disabled={isRunning || !config.tickers.trim()}
          className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Screen...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" fill="currentColor" />
              Execute Pipeline
            </>
          )}
        </button>
        <button
          onClick={onLoadDemo}
          disabled={isRunning}
          className="w-full mt-3 py-2.5 rounded-lg text-sm font-medium text-[#94a3b8] bg-[#1a1f35] border border-[#1e293b] hover:text-white hover:border-[#334155] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          <FlaskConical className="w-4 h-4 mr-2" />
          Load sample results
        </button>
      </div>
    </div>
  );
}
