import { getUsage } from '../lib/storage';

export default function UsageStats() {
  const usage = getUsage();
  
  return (
    <div className="usage-stats">
      <div className="stat">
        <div className="stat-value">{usage.total}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Generated</div>
      </div>
      <div className="stat">
        <div className="stat-value">
          {Object.values(usage.byModel).reduce((a, b) => a + b, 0)}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>This Session</div>
      </div>
      <div className="stat">
        <div className="stat-value">{Object.keys(usage.byModel).length}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Models Used</div>
      </div>
    </div>
  );
}
