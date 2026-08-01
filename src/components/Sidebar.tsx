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
    <div className="w-80 h-full flex flex-col bg-[#0d0d0f] border-r border-[#2b2b31] text-[#8a867d]">
      <div className="p-6 border-b border-[#2b2b31] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-3.5 bg-amber-500 animate-pulse"></div>
          <span className="font-bold text-[#ece9e4] text-base font-mono tracking-[0.2em]">ALPHA<span className="text-amber-500">SCREEN</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-[#ece9e4] uppercase tracking-wider mb-4 flex items-center">
            <KeyRound className="w-4 h-4 mr-2 text-amber-500" /> Gemini API Key
          </h3>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                className="w-full bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg pl-3 pr-9 py-2 text-xs font-mono outline-none focus:border-amber-500"
                value={apiKey}
                onChange={e => onApiKeyChange(e.target.value)}
                placeholder="Paste your Gemini API key"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                className="absolute right-2 top-2 text-[#585550] hover:text-[#8a867d]"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#585550] leading-relaxed">
              {apiKey.trim()
                ? <span className="text-amber-500/90">✓ Stored in your browser only — never sent anywhere but Google.</span>
                : <>No key set — you'll get quantitative results only. </>}
              {' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Get a free key →</a>
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#ece9e4] uppercase tracking-wider mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-amber-500" /> Sector Playbook
          </h3>
          <div className="relative">
            <select
              className="w-full bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-amber-500"
              value={presetId}
              onChange={e => applyPreset(e.target.value)}
            >
              {PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#585550] pointer-events-none" />
          </div>
          <p className="mt-2 text-[11px] text-[#585550] leading-relaxed">
            <span className="text-amber-500/90 font-medium">AI lens:</span> {config.analystRole}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#ece9e4] uppercase tracking-wider mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-amber-500" /> Targets
          </h3>
          <div className="space-y-2">
            <label className="block text-xs text-[#585550]">Tickers (comma separated)</label>
            <textarea
              className="w-full h-24 bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg p-3 text-xs font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
              value={config.tickers}
              onChange={e => setConfig({ ...config, tickers: e.target.value })}
              placeholder="AAPL, MSFT, GOOG..."
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[#ece9e4] uppercase tracking-wider mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-amber-500" /> Quant Filters
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#585550]">
                <span>Max Market Cap</span>
                <span className="text-[#ece9e4]">{config.maxMarketCap > 0 ? `$${config.maxMarketCap}B` : 'Off'}</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-[#585550]" />
                <input
                  type="number"
                  className="w-full bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-500"
                  value={config.maxMarketCap}
                  onChange={e => setConfig({ ...config, maxMarketCap: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#585550]">
                <span>Min EBITDA Margin</span>
                <span className="text-[#ece9e4]">{config.minEbitda !== 0 ? `${config.minEbitda}%` : 'Off'}</span>
              </label>
              <input
                type="range"
                min="-20" max="50"
                value={config.minEbitda}
                onChange={e => setConfig({ ...config, minEbitda: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#585550]">
                <span>Max P/E Ratio</span>
                <span className="text-[#ece9e4]">{config.maxPeRatio > 0 ? `${config.maxPeRatio}x` : 'Off'}</span>
              </label>
              <input
                type="number"
                className="w-full bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                value={config.maxPeRatio}
                onChange={e => setConfig({ ...config, maxPeRatio: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-xs text-[#585550]">
                <span>Min Rev Growth</span>
                <span className="text-[#ece9e4]">{config.minRevenueGrowth !== 0 ? `${config.minRevenueGrowth}%` : 'Off'}</span>
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
          <h3 className="text-sm font-semibold text-[#ece9e4] uppercase tracking-wider mb-4 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-amber-500" /> Qualitative Thesis
          </h3>
          <div className="space-y-3">
            <div className="relative">
              <select
                className="w-full bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg p-2.5 text-sm appearance-none outline-none focus:border-amber-500"
                value={thesisId}
                onChange={e => applyThesis(e.target.value)}
              >
                <option value="default">Sector default</option>
                {THESIS_ANGLES.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
                <option value="custom">Custom (edit below)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-[#585550] pointer-events-none" />
            </div>
            <textarea
              className="w-full h-36 bg-[#16161a] text-[#ece9e4] border border-[#2b2b31] rounded-lg p-3 text-xs leading-relaxed focus:border-amber-500 outline-none transition-all resize-none"
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

      <div className="p-6 border-t border-[#2b2b31] shrink-0 bg-[#0d0d0f]">
        <button
          onClick={onRun}
          disabled={isRunning || !config.tickers.trim()}
          className="w-full py-3 rounded-md font-semibold font-mono uppercase tracking-wider text-sm text-[#0a0a0c] bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
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
          className="w-full mt-3 py-2.5 rounded-lg text-sm font-medium text-[#8a867d] bg-[#16161a] border border-[#2b2b31] hover:text-white hover:border-[#334155] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          <FlaskConical className="w-4 h-4 mr-2" />
          Load sample results
        </button>
        <a
          href="https://www.buymeacoffee.com/mgultekin"
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-center text-[11px] font-mono tracking-wide text-[#585550] hover:text-amber-500 transition-colors"
        >
          ☕ Support this project
        </a>
      </div>
    </div>
  );
}
