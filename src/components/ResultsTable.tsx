import React, { useState } from 'react';
import { ScreeningResult } from '../types';
import { ChevronUp, ChevronDown, ChevronRight, Download, Info } from 'lucide-react';

interface ResultsTableProps {
  results: ScreeningResult[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<keyof ScreeningResult>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-[#1e293b] rounded-xl bg-[#111827]">
        <div className="w-16 h-16 border border-[#1e293b] rounded flex items-center justify-center mb-4 bg-[#1a1f35]">
           <div className="w-10 h-1 bg-[#1e293b] mb-2" />
           <div className="w-10 h-1 bg-[#1e293b] mb-2" />
           <div className="w-10 h-1 bg-[#1e293b]" />
        </div>
        <p className="text-[#94a3b8]">No results yet. Run a screening to populate the pipeline.</p>
      </div>
    );
  }

  const handleSort = (key: keyof ScreeningResult) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (sortKey === 'score') {
      valA = typeof valA === 'number' ? valA : parseInt(valA as string) || 0;
      valB = typeof valB === 'number' ? valB : parseInt(valB as string) || 0;
    }

    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    const headers = ['Ticker', 'Company', 'Market Cap (B)', 'EBITDA Margin', 'P/E', 'Rev Growth', 'Score', 'Decision', 'Findings', 'Risk Factors'];
    const csvRows = [headers.join(',')];
    
    results.forEach(r => {
      const row = [
        r.ticker,
        `"${r.companyName || ''}"`,
        r.marketCapB,
        r.ebitdaMargin,
        r.peRatio || '',
        r.revGrowthPct || '',
        r.score,
        `"${r.decision}"`,
        `"${r.findings?.replace(/"/g, '""') || ''}"`,
        `"${r.riskFactors?.replace(/"/g, '""') || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alphascreen-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof ScreeningResult }) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1 inline" /> : <ChevronDown className="w-4 h-4 ml-1 inline" />;
  };

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1e293b] shadow-xl overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#1a1f35]">
        <h2 className="font-semibold text-[#f1f5f9]">Pipeline Results ({results.length})</h2>
        <div className="flex space-x-2">
          <button onClick={exportCSV} className="flex items-center px-3 py-1.5 text-sm bg-[#222845] text-[#f1f5f9] rounded border border-[#1e293b] hover:bg-[#333b5c] transition">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#94a3b8]">
          <thead className="text-xs uppercase bg-[#1a1f35] text-[#64748b] border-b border-[#1e293b]">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('ticker')}>
                Ticker <SortIcon columnKey="ticker" />
              </th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('marketCapB')}>
                Mkt Cap <SortIcon columnKey="marketCapB" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('score')}>
                Score <SortIcon columnKey="score" />
              </th>
              <th className="px-4 py-3 w-1/4">AI Rationale</th>
              <th className="px-4 py-3 cursor-pointer hover:text-white transition" onClick={() => handleSort('decision')}>
                Decision <SortIcon columnKey="decision" />
              </th>
              <th className="px-4 py-3">Sources</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, idx) => {
              const isExpanded = expandedRow === result.ticker;
              const isDeepDive = result.decision.includes('DEEP DIVE');
              const isDiscard = result.decision.includes('DISCARD');
              
              const scoreNum = typeof result.score === 'number' ? result.score : parseInt(result.score as string);
              const scoreColor = isNaN(scoreNum) ? 'bg-gray-500' : scoreNum >= 7 ? 'bg-emerald-500' : scoreNum >= 4 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <React.Fragment key={result.ticker}>
                  <tr 
                    className={`border-b border-[#1e293b] hover:bg-[#1a1f35] transition-colors cursor-pointer ${isExpanded ? 'bg-[#1a1f35]' : 'bg-[#0d1117]'}`}
                    onClick={() => setExpandedRow(isExpanded ? null : result.ticker)}
                  >
                    <td className="px-4 py-3">
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90 text-emerald-500' : 'text-[#64748b]'}`} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#f1f5f9]">{result.ticker}</div>
                      <div className="text-[10px] truncate w-24 opacity-70">{result.companyName}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{result.sector || '-'}</td>
                    <td className="px-4 py-3 font-medium">${result.marketCapB.toFixed(2)}B</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{result.score}</span>
                        {!isNaN(scoreNum) && (
                          <div className="w-12 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                            <div className={`h-full ${scoreColor}`} style={{ width: `${(scoreNum/10)*100}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 text-xs opacity-90">{result.findings}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded shadow-sm flex items-center w-max
                        ${isDeepDive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                          isDiscard ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                          'bg-gray-800 text-gray-400 border border-gray-700'}`}
                      >
                        {result.decision}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-1">
                       {result.dataSources?.includes('Yahoo Finance') && <span className="px-1.5 py-0.5 bg-purple-900/40 text-purple-300 text-[9px] rounded">YF</span>}
                       {result.secData && <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-300 text-[9px] rounded">SEC</span>}
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-[#111827] border-b-2 border-emerald-500/20 shadow-inner">
                      <td colSpan={8} className="p-0">
                        <div className="p-6 animate-slide-up grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Left Col: Metrics */}
                          <div className="space-y-4">
                            <h4 className="text-white font-medium text-sm border-b border-[#1e293b] pb-2">Quantitative Profile</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-[#1a1f35] p-3 rounded border border-[#1e293b]">
                                <div className="text-[#64748b] mb-1">Mkt Cap</div>
                                <div className="text-white font-medium">${result.marketCapB}B</div>
                              </div>
                              <div className="bg-[#1a1f35] p-3 rounded border border-[#1e293b]">
                                <div className="text-[#64748b] mb-1">EBITDA Mgn</div>
                                <div className="text-white font-medium">{result.ebitdaMargin}%</div>
                              </div>
                              <div className="bg-[#1a1f35] p-3 rounded border border-[#1e293b]">
                                <div className="text-[#64748b] mb-1">P/E Ratio</div>
                                <div className="text-white font-medium">{result.peRatio || 'N/A'}</div>
                              </div>
                              <div className="bg-[#1a1f35] p-3 rounded border border-[#1e293b]">
                                <div className="text-[#64748b] mb-1">Rev Growth</div>
                                <div className="text-white font-medium">{result.revGrowthPct || 'N/A'}%</div>
                              </div>
                            </div>
                            
                            {result.secData && result.secData.xbrlFacts && (
                              <div className="mt-4 pt-4 border-t border-[#1e293b]">
                                <h4 className="text-white font-medium text-xs mb-2 flex items-center justify-between">
                                  SEC EDGAR Financials (XBRL)
                                  <span className="text-[9px] text-blue-400 font-normal">CIK: {result.secData.cik}</span>
                                </h4>
                                <div className="text-xs space-y-1">
                                  {result.secData.xbrlFacts.revenue != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Revenue:</span> <span>${(result.secData.xbrlFacts.revenue / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.xbrlFacts.grossProfit != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Gross Profit:</span> <span>${(result.secData.xbrlFacts.grossProfit / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.xbrlFacts.operatingIncome != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Operating Income:</span> <span>${(result.secData.xbrlFacts.operatingIncome / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.xbrlFacts.netIncome != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Net Income:</span> <span>${(result.secData.xbrlFacts.netIncome / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.xbrlFacts.totalAssets != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Total Assets:</span> <span>${(result.secData.xbrlFacts.totalAssets / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.xbrlFacts.stockholdersEquity != null && (
                                    <div className="flex justify-between"><span className="text-[#64748b]">Equity:</span> <span>${(result.secData.xbrlFacts.stockholdersEquity / 1e6).toFixed(0)}M</span></div>
                                  )}
                                  {result.secData.recentFilings?.[0] && (
                                    <div className="mt-2 pt-2 border-t border-[#1e293b] text-[10px] text-blue-400">
                                      Latest: {result.secData.recentFilings[0].form} ({result.secData.recentFilings[0].filingDate})
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Middle Col: AI Analysis */}
                          <div className="space-y-4 lg:col-span-2">
                            <h4 className="text-white font-medium text-sm border-b border-[#1e293b] pb-2">AI Diligence Rationale</h4>
                            
                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded text-sm">
                              <h5 className="text-emerald-400 text-xs font-bold mb-1 uppercase tracking-wider">Key Findings</h5>
                              <p className="text-[#f1f5f9] leading-relaxed">{result.findings}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-rose-900/10 border border-rose-500/20 p-3 rounded text-sm">
                                <h5 className="text-rose-400 text-xs font-bold mb-1 uppercase tracking-wider">Risk Factors</h5>
                                <p className="text-[#e2e8f0] opacity-90 text-xs">{result.riskFactors || 'Not explicitly identified.'}</p>
                              </div>
                              <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded text-sm">
                                <h5 className="text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider">Growth Drivers</h5>
                                <p className="text-[#e2e8f0] opacity-90 text-xs">{result.growthDrivers || 'Not explicitly identified.'}</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
