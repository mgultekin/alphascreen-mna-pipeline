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
        className="relative w-full max-w-lg bg-[#0d1117] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Accent header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#1e293b] bg-gradient-to-br from-[#111827] to-[#0d1117]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#64748b] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-white text-lg tracking-wider">ALPHA<span className="font-light">SCREEN</span></span>
          </div>
          <h2 id="onboarding-title" className="text-2xl font-bold text-white leading-snug">
            Automated M&amp;A deal sourcing
          </h2>
          <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
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
              <h3 className="text-sm font-semibold text-[#f1f5f9]">Try it instantly</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">Load a real sample run — no sign-up, no key required.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f1f5f9]">Run it live with your own key</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Paste a free Gemini API key in the sidebar — it's stored only in your browser and never sent anywhere but Google.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f1f5f9]">No key? Still useful</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">You'll get full quantitative + SEC filing results; only the AI scoring is skipped.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-7 pb-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { onLoadDemo(); onClose(); }}
            className="flex-1 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center"
          >
            <FlaskConical className="w-4 h-4 mr-2" />
            Load sample results
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-medium text-[#94a3b8] bg-[#1a1f35] border border-[#1e293b] hover:text-white hover:border-[#334155] transition-all flex items-center justify-center"
          >
            Explore on my own
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
