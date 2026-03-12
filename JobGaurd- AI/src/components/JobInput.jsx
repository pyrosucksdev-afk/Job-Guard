import { useState } from 'react';
import axios from 'axios';

export default function JobInput({ onResult, onLoading, isLoading }) {
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobUrl.trim() && !jobText.trim()) {
      setError('Please provide a job URL or paste the job description.');
      return;
    }

    setError('');
    onLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/analyze-job', {
        job_url: jobUrl.trim(),
        job_text: jobText.trim(),
      });
      onResult({ ...response.data, url: jobUrl.trim() || 'Pasted description' });
    } catch (err) {
      // Fallback mock response for development/demo when backend isn't running
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        const mockScore = Math.floor(Math.random() * 100);
        const mockFlags = mockScore < 50
          ? ['Generic greeting detected', 'Suspicious email domain', 'Unrealistic salary range', 'AI-generated language detected']
          : mockScore < 85
          ? ['Generic greeting detected', 'Unverified company name']
          : [];
        const mockRisk = mockScore >= 85 ? 'Low' : mockScore >= 50 ? 'Medium' : 'High';
        onResult({
          trust_score: mockScore,
          risk_level: mockRisk,
          flags: mockFlags,
          url: jobUrl.trim() || 'Pasted description',
          _demo: true,
        });
      } else {
        setError('Analysis failed. Please check your connection and try again.');
        onLoading(false);
      }
    }
  };

  return (
    <section className="input-section">
      <div className="card">
        <div className="card-title">Analyze Job Posting</div>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="input-group">
          <div>
            <label className="field-label" htmlFor="job-url">Job URL</label>
            <input
              id="job-url"
              type="url"
              className="input-field"
              placeholder="https://jobs.example.com/posting/12345"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="job-text">Job Description</label>
            <textarea
              id="job-text"
              className="input-field"
              placeholder="Paste the full job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          <span className="btn-inner">
            {isLoading ? (
              <>
                <span style={{ fontSize: '0.85em' }}>⏳</span>
                Analyzing…
              </>
            ) : (
              <>
                <span style={{ fontSize: '0.85em' }}>🔍</span>
                Analyze Job
              </>
            )}
          </span>
        </button>
      </div>
    </section>
  );
}
