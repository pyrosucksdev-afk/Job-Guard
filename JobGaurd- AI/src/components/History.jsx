function getScoreClass(score) {
  if (score >= 85) return 'safe';
  if (score >= 50) return 'warn';
  return 'danger';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncateUrl(url, maxLen = 45) {
  if (!url) return '—';
  try {
    const u = new URL(url);
    const clean = u.hostname + u.pathname;
    return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + '…' : url;
  }
}

export default function History({ history, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <section className="history-section">
      <div className="card">
        <div className="history-header">
          <div className="card-title" style={{ margin: 0 }}>Recent Analyses</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="history-count">{history.length} scan{history.length !== 1 ? 's' : ''}</span>
            <button className="clear-btn" onClick={onClear}>Clear</button>
          </div>
        </div>

        <div className="history-list">
          {history.map((item, i) => (
            <div key={i} className="history-item">
              <span className="history-url" title={item.url}>
                {truncateUrl(item.url)}
              </span>
              <span className={`history-score ${getScoreClass(item.trust_score)}`}>
                {item.trust_score}/100
              </span>
              <span className="history-date">{formatDate(item.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
