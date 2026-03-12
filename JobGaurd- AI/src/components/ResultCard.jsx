import { useEffect, useState } from 'react';

function getScoreClass(score) {
  if (score >= 85) return 'safe';
  if (score >= 50) return 'warn';
  return 'danger';
}

function InfoRow({ label, value }) {
  if (!value || value === 'Not specified' || value === 'Unknown') return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 100, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default function ResultCard({ result }) {
  const [displayScore, setDisplayScore] = useState(0);
  const scoreClass = getScoreClass(result.trust_score);

  useEffect(() => {
    const target = result.trust_score;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplayScore(Math.min(Math.round((target / steps) * step), target));
      if (step >= steps) clearInterval(timer);
    }, 800 / steps);
    return () => clearInterval(timer);
  }, [result.trust_score]);

  const recColors = {
    'Apply Safely': 'var(--safe)',
    'Apply with Caution': 'var(--warn)',
    'Avoid': 'var(--danger)',
  };
  const recColor = recColors[result.recommendation] || 'var(--text-secondary)';

  return (
    <section className="result-section">
      <div className="card">
        <div className="card-title">Analysis Result</div>

        {/* Score + Risk */}
        <div className="score-header">
          <div className="score-display">
            <span className="score-label">Trust Score</span>
            <span className={`score-number ${scoreClass}`}>
              {displayScore}
              <span className="score-denominator"> / 100</span>
            </span>
            <div className="score-bar-wrap">
              <div className={`score-bar-fill ${scoreClass}`} style={{ width: `${displayScore}%` }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div className={`risk-badge ${scoreClass}`}>
              <span className="risk-dot" />
              {result.risk_level} Risk
            </div>
            {result.recommendation && (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: recColor, border: `1px solid ${recColor}44`, background: `${recColor}11`, padding: '5px 12px', borderRadius: 100 }}>
                {result.recommendation === 'Apply Safely' ? '✓' : result.recommendation === 'Apply with Caution' ? '⚡' : '✕'} {result.recommendation}
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        {(result.company_name !== 'Unknown' || result.job_title !== 'Unknown') && (
          <div style={{ margin: '20px 0', padding: '16px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Job Details</div>
            <InfoRow label="Company" value={result.company_name} />
            <InfoRow label="Job Title" value={result.job_title} />
            <InfoRow label="Location" value={result.location} />
            <InfoRow label="Salary" value={result.salary_range} />
            {result.page_title && <InfoRow label="Page Title" value={result.page_title} />}
          </div>
        )}

        {/* Summary */}
        {result.summary && (
          <div style={{ margin: '16px 0', padding: '14px 16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>AI Summary</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.summary}</p>
          </div>
        )}

        {/* Red Flags */}
        <div className="flags-section">
          <div className="flags-title">
            {result.flags?.length > 0
              ? `${result.flags.length} Red Flag${result.flags.length !== 1 ? 's' : ''} Detected`
              : 'Red Flags'}
          </div>
          {result.flags?.length > 0 ? (
            <ul className="flags-list">
              {result.flags.map((flag, i) => (
                <li key={i} className="flag-item" style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="flag-icon">⚠</span>{flag}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-flags">✓ No red flags detected — this posting looks legitimate</div>
          )}
        </div>

        {/* Positive Signals */}
        {result.positive_signals?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {result.positive_signals.length} Positive Signal{result.positive_signals.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.positive_signals.map((signal, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 8, fontSize: '0.875rem', color: '#a0f0c0' }}>
                  <span style={{ fontSize: '0.75rem' }}>✓</span>{signal}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
