import yahooFinance from 'yahoo-finance2';

async function testMetrics() {
  const ticker = 'SFM';
  console.log(`Fetching metrics for ${ticker}...`);
  const summary = await yahooFinance.quoteSummary(ticker, { 
    modules: ['financialData', 'defaultKeyStatistics'] 
  });
  
  const financialData = summary.financialData || {};
  const defaultKeyStatistics = summary.defaultKeyStatistics || {};
  
  const evToEbitda = defaultKeyStatistics.enterpriseToEbitda;
  const evToSales = defaultKeyStatistics.enterpriseToRevenue;
  let netDebtToEbitda;
  if (financialData.ebitda && financialData.ebitda > 0 && financialData.totalDebt !== undefined && financialData.totalCash !== undefined) {
    netDebtToEbitda = (financialData.totalDebt - financialData.totalCash) / financialData.ebitda;
  }
  
  console.log('EV/EBITDA:', evToEbitda != null ? evToEbitda.toFixed(1) + 'x' : 'N/A');
  console.log('EV/Sales:', evToSales != null ? evToSales.toFixed(1) + 'x' : 'N/A');
  console.log('Net Debt/EBITDA:', netDebtToEbitda != null ? netDebtToEbitda.toFixed(1) + 'x' : 'N/A');
}

testMetrics().catch(console.error);
