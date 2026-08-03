import { LABELED_SET } from './labeled-set';
import { spawn } from 'child_process';

async function runBacktest() {
  console.log('Starting Backtest...');
  
  // Assume server is not running and spawn it
  console.log('Spawning local dev server...');
  const server = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'pipe' });
  let isServerReady = false;

  server.stdout.on('data', (data) => {
    if (data.toString().includes('http://localhost:3000')) {
      isServerReady = true;
    }
  });

  server.stderr.on('data', (data) => {
    // some logs might go to stderr
  });

  // wait for server to be ready (up to 15 seconds)
  let retries = 30;
  while (!isServerReady && retries > 0) {
    await new Promise(r => setTimeout(r, 500));
    retries--;
  }

  if (!isServerReady) {
    console.error('Failed to start local server, or it took too long.');
    server.kill();
    process.exit(1);
  }
  
  console.log('Server is ready. Starting evaluation...');

  const results: any[] = [];
  const tickers = LABELED_SET.map(x => x.ticker);

  const reqBody = {
    tickers,
    maxMarketCap: 0,
    minEbitda: 0,
    maxPeRatio: 0,
    minRevenueGrowth: 0,
    userCriteria: 'General strategic fit, solid fundamentals, and attractive valuation for an acquisition.',
    analystRole: 'cross-sector M&A acquisitions'
  };

  try {
    const res = await fetch('http://127.0.0.1:3000/api/batch-screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    });

    const text = await res.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'result') {
            results.push(data.data);
          }
        } catch (e) {
          // ignore parse errors for incomplete lines if any
        }
      }
    }
  } catch (err) {
    console.error('Error connecting to the server:', err);
  } finally {
    // Kill the server
    console.log('Stopping dev server...');
    server.kill();
  }

  console.log('\n--- Backtest Results ---');
  let acquiredScores: number[] = [];
  let controlScores: number[] = [];
  let validResults = 0;

  for (const item of LABELED_SET) {
    const result = results.find(r => r.ticker === item.ticker);
    const score = result?.score;
    const numericScore = typeof score === 'number' ? score : null;
    
    console.log(`${item.ticker.padEnd(6)} | ${item.category.padEnd(9)} | Score: ${numericScore !== null ? numericScore : 'N/A'} | ${item.note}`);
    if (result && result.findings && numericScore === null) {
      console.log(`         (${result.findings})`);
    }
    
    if (numericScore !== null) {
      if (item.category === 'Acquired') acquiredScores.push(numericScore);
      else controlScores.push(numericScore);
      validResults++;
    }
  }

  if (validResults === 0) {
    console.log('\nNo numeric scores retrieved. (Missing Gemini API key or quota exceeded?)');
    process.exit(1);
  }

  const meanAcq = acquiredScores.reduce((a, b) => a + b, 0) / (acquiredScores.length || 1);
  const meanCtrl = controlScores.reduce((a, b) => a + b, 0) / (controlScores.length || 1);
  const separation = meanAcq - meanCtrl;

  const allScores = [...acquiredScores, ...controlScores].sort((a, b) => a - b);
  const median = allScores[Math.floor(allScores.length / 2)] || 0;
  
  const acqHits = acquiredScores.filter(s => s > median).length;
  const hitRate = (acqHits / (acquiredScores.length || 1)) * 100;

  console.log('\n--- Summary ---');
  console.log(`Mean Acquired Score: ${meanAcq.toFixed(2)}`);
  console.log(`Mean Control Score:  ${meanCtrl.toFixed(2)}`);
  console.log(`Separation:          ${separation > 0 ? '+' : ''}${separation.toFixed(2)} pts`);
  console.log(`Hit Rate (Acquired > Median): ${hitRate.toFixed(0)}%`);
}

runBacktest().catch(err => {
  console.error(err);
  process.exit(1);
});
