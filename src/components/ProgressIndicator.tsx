import React, { useEffect, useState } from 'react';
import { Loader2, Activity } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  statusText: string;
  currentTicker?: string;
}

export default function ProgressIndicator({ current, total, statusText, currentTicker }: ProgressIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const avgTimePerTicker = current > 0 ? elapsed / current : 2.5; 
  const remaining = total - current;
  const estimatedSecondsLeft = Math.round(remaining * avgTimePerTicker);

  const formatTime = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6 shadow-2xl animate-fade-in relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Activity className="w-24 h-24 text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-emerald-500" />
              AI Pipeline Execution
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">{statusText}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              {pct}%
            </div>
            <div className="text-xs text-[#64748b]">
              {current} of {total} Processed
            </div>
          </div>
        </div>

        <div className="w-full h-3 bg-[#0a0e1a] rounded-full overflow-hidden mb-4 border border-[#1e293b]">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out relative"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-[#64748b]">
          <div className="flex items-center space-x-2">
            <span>Elapsed: <span className="text-[#f1f5f9]">{formatTime(elapsed)}</span></span>
            <span>•</span>
            <span>Est. Remaining: <span className="text-[#f1f5f9]">{estimatedSecondsLeft > 0 ? formatTime(estimatedSecondsLeft) : '...'}</span></span>
          </div>
          
          {currentTicker && (
            <div className="flex items-center bg-[#222845] px-2.5 py-1 rounded-md border border-[#1e293b]">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-2"></div>
              Analyzing <span className="font-mono text-[#f1f5f9] ml-1 font-bold">{currentTicker}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
