import { LABELED_SET } from './labeled-set';
import { spawn, spawnSync } from 'child_process';

// server.kill() only signals the `npm` parent — on Windows the tsx/vite child
// (the actual :3000 server) survives and keeps the event loop alive, hanging the
// script. Kill the whole process tree instead.
function stopServer(server: ReturnType<typeof spawn>) {
  if (server.pid === undefined) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try { server.kill('SIGKILL'); } catch { /* already gone */ }
  }
}

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
    stopServer(server);
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
    stopServer(server);
  }

  console.log('\n--- Backtest Results ---');
  let acquiredScores: number[] = [];
  let controlScores: number[] = [];
  let acquiredVuln: number[] = [];
  let controlVuln: number[] = [];
  let validResults = 0;
  
  const counts: Record<string, any> = {
    Acquired: { High: 0, Medium: 0, Low: 0 },
    Control: { High: 0, Medium: 0, Low: 0 }
  };

  const mapVuln = (v: string | undefined) => {
    if (v === 'High') return 3;
    if (v === 'Medium') return 2;
    if (v === 'Low') return 1;
    return null;
  };

  for (const item of LABELED_SET) {
    const result = results.find(r => r.ticker === item.ticker);
    const score = result?.score;
    const numericScore = typeof score === 'number' ? score : null;
    const vulnLabel = result?.targetVulnerability || 'N/A';
    const numericVuln = mapVuln(result?.targetVulnerability);
    
    console.log(`${item.ticker.padEnd(6)} | ${item.category.padEnd(9)} | Fit: ${numericScore !== null ? String(numericScore).padEnd(4) : 'N/A '} | Vuln: ${vulnLabel.padEnd(6)} | ${item.note}`);
    if (result && result.findings && numericScore === null) {
      console.log(`         (${result.findings})`);
    }
    
    if (numericScore !== null) {
      if (item.category === 'Acquired') acquiredScores.push(numericScore);
      else controlScores.push(numericScore);
      validResults++;
    }
    
    if (numericVuln !== null) {
      if (item.category === 'Acquired') acquiredVuln.push(numericVuln);
      else controlVuln.push(numericVuln);
      
      if (vulnLabel === 'High') counts[item.category].High++;
      else if (vulnLabel === 'Medium') counts[item.category].Medium++;
      else if (vulnLabel === 'Low') counts[item.category].Low++;
    }
  }

  if (validResults === 0 && acquiredVuln.length === 0) {
    console.log('\nNo results retrieved. (Missing Gemini API key or quota exceeded?)');
    process.exit(1);
  }

  const meanAcq = acquiredScores.reduce((a, b) => a + b, 0) / (acquiredScores.length || 1);
  const meanCtrl = controlScores.reduce((a, b) => a + b, 0) / (controlScores.length || 1);
  const separation = meanAcq - meanCtrl;

  const meanAcqVuln = acquiredVuln.reduce((a, b) => a + b, 0) / (acquiredVuln.length || 1);
  const meanCtrlVuln = controlVuln.reduce((a, b) => a + b, 0) / (controlVuln.length || 1);
  const separationVuln = meanAcqVuln - meanCtrlVuln;

  const allScores = [...acquiredScores, ...controlScores].sort((a, b) => a - b);
  const median = allScores[Math.floor(allScores.length / 2)] || 0;
  const acqHits = acquiredScores.filter(s => s > median).length;
  const hitRate = (acqHits / (acquiredScores.length || 1)) * 100;

  console.log('\n--- Summary: Fit Score ---');
  console.log(`Mean Acquired Fit: ${meanAcq.toFixed(2)}`);
  console.log(`Mean Control Fit:  ${meanCtrl.toFixed(2)}`);
  console.log(`Separation:        ${separation > 0 ? '+' : ''}${separation.toFixed(2)} pts`);
  console.log(`Hit Rate (Acquired > Median): ${hitRate.toFixed(0)}%`);

  console.log('\n--- Summary: Target Vulnerability (High=3, Med=2, Low=1) ---');
  console.log(`Mean Acquired Vuln: ${meanAcqVuln.toFixed(2)} (n=${acquiredVuln.length})`);
  console.log(`Mean Control Vuln:  ${meanCtrlVuln.toFixed(2)} (n=${controlVuln.length})`);
  console.log(`Separation:         ${separationVuln > 0 ? '+' : ''}${separationVuln.toFixed(2)} pts`);
  
  console.log(`\nAcquired Distribution: High: ${counts.Acquired.High} | Med: ${counts.Acquired.Medium} | Low: ${counts.Acquired.Low}`);
  console.log(`Control Distribution:  High: ${counts.Control.High} | Med: ${counts.Control.Medium} | Low: ${counts.Control.Low}`);

  const allVulnScores = [...acquiredVuln, ...controlVuln].sort((a, b) => a - b);
  const medianVuln = allVulnScores[Math.floor(allVulnScores.length / 2)] || 0;
  const acqVulnHits = acquiredVuln.filter(s => s > medianVuln).length;
  const hitRateVuln = (acqVulnHits / (acquiredVuln.length || 1)) * 100;
  console.log(`Hit Rate (Acquired > Median): ${hitRateVuln.toFixed(0)}%`);

  // Force a clean exit — dangling child/stdio handles otherwise keep Node alive.
  process.exit(0);
}

runBacktest().catch(err => {
  console.error(err);
  process.exit(1);
});
