/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';

function MonteCarloPi() {
  const [threads, setThreads] = useState(6);
  const [iterations, setIterations] = useState(7);
  const [benchmarkIterations, setBenchmarkIterations] = useState(2);
  const [results, setResults] = useState<{ id: string; text: string }[]>([]);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [results]);

  const runBenchmark = (b: number, totalPi: number, totalTime: number) => {
    const startTime = performance.now();
    const workers: Worker[] = [];
    const itersPerThread = Math.floor(10 ** iterations / threads);
    let totalIn = 0;
    let completedWorkers = 0;

    const handleWorkerMessage = (e: MessageEvent) => {
      totalIn += e.data;
      completedWorkers += 1;
      if (completedWorkers === threads) {
        const pi = (4.0 * totalIn) / (itersPerThread * threads);
        const elapsedTime = performance.now() - startTime;
        const newTotalPi = totalPi + pi;
        const newTotalTime = totalTime + elapsedTime;

        setResults((prevResults) => [
          ...prevResults,
          {
            id: `${pi}-${elapsedTime}-${threads}-${itersPerThread}`,
            text: `Pi: ${pi}`,
          },
          {
            id: `${elapsedTime}-${pi}-${threads}-${itersPerThread}`,
            text: `Elapsed time: ${elapsedTime.toFixed(0)} ms`,
          },
          {
            id: `${threads}-${pi}-${elapsedTime}-${itersPerThread}`,
            text: `Threads: ${threads}`,
          },
          {
            id: `${itersPerThread}-${pi}-${elapsedTime}-${threads}`,
            text: `Iterations per thread: ${itersPerThread}`,
          },
          {
            id: `${itersPerThread * threads}-${pi}-${elapsedTime}-${threads}`,
            text: `Total iterations: ${itersPerThread * threads}`,
          },
          { id: `separator-${b}`, text: '---' },
        ]);

        if (b < benchmarkIterations - 1) {
          runBenchmark(b + 1, newTotalPi, newTotalTime);
        } else {
          const avgPi = newTotalPi / benchmarkIterations;
          const avgTime = newTotalTime / benchmarkIterations;
          setResults((prevResults) => [
            ...prevResults,
            {
              id: `avg-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: 'Average Results',
            },
            {
              id: `avg-pi-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: `Average Pi: ${avgPi}`,
            },
            {
              id: `avg-time-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: `Average elapsed time: ${avgTime.toFixed(0)} ms`,
            },
            {
              id: `avg-threads-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: `Threads: ${threads}`,
            },
            {
              id: `avg-iters-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: `Iterations per thread: ${itersPerThread}`,
            },
            {
              id: `avg-total-iters-${avgPi}-${avgTime}-${threads}-${itersPerThread}`,
              text: `Total iterations: ${itersPerThread * threads}`,
            },
          ]);
        }
      }
    };

    for (let t = 0; t < threads; t += 1) {
      const worker = new Worker(new URL('./worker.js', import.meta.url));
      workers.push(worker);
      worker.postMessage({ iters: itersPerThread });
      worker.onmessage = handleWorkerMessage;
    }
  };

  const handleStart = () => {
    setResults([]);
    runBenchmark(0, 0, 0);
  };

  return (
    <div className="container">
      <div id="input-section">
        <h3>Monte Carlo Pi Benchmark</h3>
        <div className="form-group">
          <label htmlFor="threads">Number of Threads:</label>
          <input
            type="number"
            id="threads"
            min="1"
            max="16"
            value={threads}
            onChange={(e) => setThreads(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="iterations">
            Number of Iterations (Power of 10):
          </label>
          <input
            type="number"
            id="iterations"
            min="1"
            max="8"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="benchmark-iterations">Benchmark Iterations:</label>
          <input
            type="number"
            id="benchmark-iterations"
            min="1"
            max="100"
            value={benchmarkIterations}
            onChange={(e) =>
              setBenchmarkIterations(parseInt(e.target.value, 10))
            }
          />
        </div>
        <button type="button" onClick={handleStart}>
          Start Benchmark
        </button>
      </div>
      <div id="results-section">
        {results.map((result) => (
          <p key={result.id}>{result.text}</p>
        ))}
        <div ref={resultsEndRef} />
      </div>
    </div>
  );
}

export default MonteCarloPi;
