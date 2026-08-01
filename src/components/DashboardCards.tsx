import React from 'react';
import { ScreeningResult } from '../types';
import { BarChart3, Filter, Target, TrendingUp, BarChart } from 'lucide-react';

interface DashboardCardsProps {
  results: ScreeningResult[];
}

export default function DashboardCards({ results }: DashboardCardsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[#1e293b] rounded-xl bg-[#111827]">
        <BarChart className="w-12 h-12 text-[#64748b] mb-4" />
        <h3 className="text-[#f1f5f9] font-medium mb-1">No Data Available</h3>
        <p className="text-[#94a3b8] text-sm">Run a screening to see your executive dashboard</p>
      </div>
    );
  }

  const totalScreened = results.length;
  const passedFilters = results.filter(r => !r.decision.includes('SCREENED OUT') && !r.decision.includes('ERROR')).length;
  const deepDiveTargets = results.filter(r => r.decision.includes('DEEP DIVE')).length;
  
  const validScores = results.map(r => typeof r.score === 'number' ? r.score : parseInt(r.score as string)).filter(n => !isNaN(n));
  const avgScore = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : '-';

  const scoreBands = { low: 0, med: 0, high: 0 };
  validScores.forEach(s => {
    if (s <= 3) scoreBands.low++;
    else if (s <= 6) scoreBands.med++;
    else scoreBands.high++;
  });
  
  const topPicks = [...results]
    .filter(r => typeof r.score === 'number' ? !isNaN(r.score) : !isNaN(parseInt(r.score)))
    .sort((a, b) => {
      const sa = typeof a.score === 'number' ? a.score : parseInt(a.score as string);
      const sb = typeof b.score === 'number' ? b.score : parseInt(b.score as string);
      return sb - sa;
    })
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500">
            <BarChart3 className="w-16 h-16" />
          </div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">Total Screened</p>
          <p className="text-3xl font-bold text-white">{totalScreened}</p>
          <div className="w-full h-1 bg-blue-500/20 absolute bottom-0 left-0">
             <div className="h-full bg-blue-500 w-full" />
          </div>
        </div>
        
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <Filter className="w-16 h-16" />
          </div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">Passed Filters</p>
          <p className="text-3xl font-bold text-white">{passedFilters}</p>
          <div className="w-full h-1 bg-amber-500/20 absolute bottom-0 left-0">
             <div className="h-full bg-amber-500" style={{width: `${(passedFilters/totalScreened)*100}%`}} />
          </div>
        </div>
        
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <Target className="w-16 h-16" />
          </div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">Deep Dive Targets</p>
          <p className="text-3xl font-bold text-white">{deepDiveTargets}</p>
          <div className="w-full h-1 bg-emerald-500/20 absolute bottom-0 left-0">
             <div className="h-full bg-emerald-500" style={{width: `${(deepDiveTargets/totalScreened)*100}%`}} />
          </div>
        </div>
        
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500">
            <TrendingUp className="w-16 h-16" />
          </div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">Avg M&A Score</p>
          <p className="text-3xl font-bold text-white">{avgScore}</p>
          <div className="w-full h-1 bg-purple-500/20 absolute bottom-0 left-0">
             <div className="h-full bg-purple-500" style={{width: `${(parseFloat(avgScore as string)/10)*100}%`}} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Funnel */}
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6">
          <h3 className="text-[#f1f5f9] font-medium mb-6">Pipeline Conversion</h3>
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex justify-between text-xs mb-1 text-[#94a3b8]">
                <span>Total Evaluated</span>
                <span>{totalScreened} (100%)</span>
              </div>
              <div className="h-8 w-full bg-blue-500/20 rounded flex items-center justify-center">
                 <div className="h-full bg-blue-600/50 w-full rounded" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-3/4 flex justify-between text-xs mb-1 text-[#94a3b8]">
                <span>Passed Quant</span>
                <span>{passedFilters} ({Math.round(passedFilters/totalScreened*100) || 0}%)</span>
              </div>
              <div className="h-8 w-3/4 bg-amber-500/20 rounded flex items-center justify-center">
                 <div className="h-full bg-amber-600/50 w-full rounded" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-1/2 flex justify-between text-xs mb-1 text-[#94a3b8]">
                <span>Shortlisted</span>
                <span>{deepDiveTargets} ({Math.round(deepDiveTargets/totalScreened*100) || 0}%)</span>
              </div>
              <div className="h-8 w-1/2 bg-emerald-500/20 rounded flex items-center justify-center">
                 <div className="h-full bg-emerald-600/50 w-full rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-6">
          <h3 className="text-[#f1f5f9] font-medium mb-6">Score Distribution</h3>
          <div className="h-48 flex items-end space-x-4">
             <div className="flex-1 flex flex-col items-center group">
               <div className="w-full bg-rose-500/80 rounded-t transition-all group-hover:bg-rose-400" style={{height: `${(scoreBands.low / Math.max(1, validScores.length)) * 100}%`, minHeight: scoreBands.low > 0 ? '20px' : '0'}} />
               <span className="text-xs text-[#94a3b8] mt-2 group-hover:text-[#f1f5f9]">1-3 ({scoreBands.low})</span>
             </div>
             <div className="flex-1 flex flex-col items-center group">
               <div className="w-full bg-amber-500/80 rounded-t transition-all group-hover:bg-amber-400" style={{height: `${(scoreBands.med / Math.max(1, validScores.length)) * 100}%`, minHeight: scoreBands.med > 0 ? '20px' : '0'}} />
               <span className="text-xs text-[#94a3b8] mt-2 group-hover:text-[#f1f5f9]">4-6 ({scoreBands.med})</span>
             </div>
             <div className="flex-1 flex flex-col items-center group">
               <div className="w-full bg-emerald-500/80 rounded-t transition-all group-hover:bg-emerald-400" style={{height: `${(scoreBands.high / Math.max(1, validScores.length)) * 100}%`, minHeight: scoreBands.high > 0 ? '20px' : '0'}} />
               <span className="text-xs text-[#94a3b8] mt-2 group-hover:text-[#f1f5f9]">7-10 ({scoreBands.high})</span>
             </div>
          </div>
        </div>
      </div>

      {/* Top Picks */}
      {topPicks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-[#f1f5f9] mb-4">Top AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPicks.map((pick, i) => (
              <div key={i} className="bg-[#1a1f35] border border-[#1e293b] rounded-xl p-5 border-l-4 border-l-emerald-500 hover:bg-[#222845] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{pick.ticker}</h4>
                    <p className="text-xs text-[#94a3b8] truncate">{pick.companyName || pick.sector}</p>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-400 text-sm font-bold px-2.5 py-1 rounded">
                    {pick.score}/10
                  </div>
                </div>
                <p className="text-sm text-[#f1f5f9] line-clamp-3 text-ellipsis opacity-80 leading-relaxed">
                  {pick.findings}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
