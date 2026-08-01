async function testAPI() {
  const url = 'http://127.0.0.1:3000/api/batch-screen';
  const payload = {
    tickers: ['SFM', 'KR', 'AAPL'],
    config: {
      maxMarketCap: 0,
      minEbitda: 0,
      maxPeRatio: 0,
      minRevenueGrowth: 0,
      analystRole: 'cross-sector M&A acquisitions',
      userCriteria: 'Solid growth and strong margins'
    }
  };

  console.log('Sending request...');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  // wait a bit for SSE to print server logs
  await new Promise(r => setTimeout(r, 10000));
}
testAPI().catch(console.error);
