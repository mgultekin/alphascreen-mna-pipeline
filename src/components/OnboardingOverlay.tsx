import React from 'react';
import { X, FlaskConical, KeyRound, BarChart3, ArrowRight } from 'lucide-react';

interface OnboardingOverlayProps {
  onClose: () => void;
  onLoadDemo: () => void;
}

/**
 * First-visit welcome overlay. Explains what the tool does and the three ways to
 * use it (demo / bring-your-own-key / quantitative-only). Dismissal is persisted
 * by the parent via localStorage so it only appears once.
 */
export default function OnboardingOverlay({ onClose, onLoadDemo }: OnboardingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="relative w-full max-w-lg bg-[#0d0d0f] border border-[#2b2b31] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Accent header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#2b2b31] bg-gradient-to-br from-[#101012] to-[#0d0d0f]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#585550] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-1.5 h-3.5 bg-amber-500 animate-pulse" />
            <span className="font-bold text-[#ece9e4] text-base font-mono tracking-[0.2em]">ALPHA<span className="text-amber-500">SCREEN</span></span>
          </div>
          <h2 id="onboarding-title" className="text-2xl font-bold text-white leading-snug">
            Automated M&amp;A deal sourcing
          </h2>
          <p className="text-sm text-[#8a867d] mt-2 leading-relaxed">
            Screen listed companies against your acquisition thesis — combining live financials
            (Yahoo Finance), official filings (SEC EDGAR), and AI strategic scoring (Google Gemini)
            into a ranked shortlist in seconds.
          </p>
        </div>

        {/* Three ways to use */}
        <div className="p-7 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ece9e4]">Try it instantly</h3>
              <p className="text-xs text-[#8a867d] leading-relaxed">Load a real sample run — no sign-up, no key required.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ece9e4]">Run it live with your own key</h3>
              <p className="text-xs text-[#8a867d] leading-relaxed">
                Paste a free Gemini API key in the sidebar — it's stored only in your browser and never sent anywhere but Google.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#ece9e4]">No key? Still useful</h3>
              <p className="text-xs text-[#8a867d] leading-relaxed">You'll get full quantitative + SEC filing results; only the AI scoring is skipped.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-7 pb-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { onLoadDemo(); onClose(); }}
            className="flex-1 py-2.5 rounded-md font-semibold font-mono uppercase tracking-wider text-xs text-[#0a0a0c] bg-amber-500 hover:bg-amber-400 transition-colors flex items-center justify-center"
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Load sample results
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-medium text-[#8a867d] bg-[#16161a] border border-[#2b2b31] hover:text-white hover:border-[#334155] transition-all flex items-center justify-center"
          >
            Explore on my own
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
