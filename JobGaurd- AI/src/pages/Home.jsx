import { useState } from 'react';
import JobInput from '../components/JobInput';
import ResultCard from '../components/ResultCard';
import History from '../components/History';
import LoadingState from '../components/LoadingState';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleResult = (data) => {
    setResult(data);
    setIsLoading(false);
    setHistory((prev) => [
      {
        url: data.url,
        trust_score: data.trust_score,
        risk_level: data.risk_level,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleLoading = (val) => {
    setIsLoading(val);
    if (val) setResult(null);
  };

  const handleClear = () => setHistory([]);

  return (
    <main>
      <JobInput
        onResult={handleResult}
        onLoading={handleLoading}
        isLoading={isLoading}
      />

      {isLoading && <LoadingState />}

      {result && !isLoading && <ResultCard result={result} />}

      {history.length > 0 && (
        <>
          <div className="section-divider" />
          <History history={history} onClear={handleClear} />
        </>
      )}
    </main>
  );
}
