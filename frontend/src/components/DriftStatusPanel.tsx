import { useEffect, useState } from 'react';

interface DriftReport {
  providerName: string;
  driftDetected: boolean;
  addedKeys: string[];
  removedKeys: string[];
  typeChanges: Array<{ key: string; oldType: string; newType: string }>;
  baselineCapturedAt: string;
  newCapturedAt: string;
}

interface DriftResult {
  provider: string;
  status: 'no-baseline' | 'no-drift' | 'drift' | 'error' | 'skipped';
  report?: DriftReport;
  error?: string;
  capturedAt: string;
}

interface DriftStatus {
  lastCheckedAt: string;
  cachedUntil: string;
  results: DriftResult[];
}

export function DriftStatusPanel() {
  const [status, setStatus] = useState<DriftStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/demo/drift-status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch drift status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/demo/drift-status/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert(`Rate limited: ${data.message}`);
      } else {
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusGlyph = (s: string) => {
    switch (s) {
      case 'no-drift':
        return '✓';
      case 'drift':
        return '⚠';
      case 'no-baseline':
        return '◐';
      case 'error':
        return '✗';
      case 'skipped':
        return ' ';
      default:
        return '?';
    }
  };

  const getRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  if (loading) return <div className="drift-panel">Loading drift status...</div>;
  if (!status) return null;

  const summary = status.results.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="drift-panel">
      <div className="drift-header" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <h3>API Drift Detection</h3>
        <div className="drift-summary">
          {summary['no-drift'] && <span className="status-ok">[✓] {summary['no-drift']} OK</span>}
          {summary['drift'] && <span className="status-drift">[⚠] {summary['drift']} drift</span>}
          {summary['no-baseline'] && <span className="status-baseline">[◐] {summary['no-baseline']} baseline</span>}
          {summary['error'] && <span className="status-error">[✗] {summary['error']} errors</span>}
          {summary['skipped'] && <span className="status-skip">[ ] {summary['skipped']} skipped</span>}
        </div>
        <div className="drift-time">Last checked: {getRelativeTime(status.lastCheckedAt)}</div>
        <button onClick={(e) => { e.stopPropagation(); handleRefresh(); }} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh now'}
        </button>
      </div>

      {expanded && (
        <div className="drift-details">
          {status.results.map((result) => (
            <div key={result.provider} className={`drift-result drift-${result.status}`}>
              <div className="drift-provider">
                <span className="drift-glyph">[{getStatusGlyph(result.status)}]</span>
                <strong>{result.provider}</strong>
                <span className="drift-status-label">{result.status}</span>
              </div>
              {result.error && <div className="drift-error">Error: {result.error}</div>}
              {result.report && (
                <div className="drift-report">
                  {result.report.addedKeys.length > 0 && (
                    <div className="drift-change">
                      Added keys: {result.report.addedKeys.join(', ')}
                    </div>
                  )}
                  {result.report.removedKeys.length > 0 && (
                    <div className="drift-change">
                      Removed keys: {result.report.removedKeys.join(', ')}
                    </div>
                  )}
                  {result.report.typeChanges.length > 0 && (
                    <div className="drift-change">
                      Type changes:{' '}
                      {result.report.typeChanges
                        .map((tc) => `${tc.key} (${tc.oldType} → ${tc.newType})`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .drift-panel {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        .drift-header h3 {
          margin: 0 0 8px 0;
        }
        .drift-summary {
          display: flex;
          gap: 12px;
          margin: 8px 0;
          flex-wrap: wrap;
        }
        .drift-summary span {
          font-family: monospace;
          font-size: 14px;
        }
        .status-ok { color: #28a745; }
        .status-drift { color: #ffc107; }
        .status-baseline { color: #6c757d; }
        .status-error { color: #dc3545; }
        .status-skip { color: #999; }
        .drift-time {
          font-size: 13px;
          color: #666;
          margin: 8px 0;
        }
        .drift-header button {
          margin-top: 8px;
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .drift-header button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .drift-details {
          margin-top: 16px;
          border-top: 1px solid #ddd;
          padding-top: 16px;
        }
        .drift-result {
          margin: 8px 0;
          padding: 8px;
          border-left: 3px solid #ccc;
          background: white;
        }
        .drift-no-drift { border-left-color: #28a745; }
        .drift-drift { border-left-color: #ffc107; }
        .drift-no-baseline { border-left-color: #6c757d; }
        .drift-error { border-left-color: #dc3545; }
        .drift-provider {
          display: flex;
          gap: 8px;
          align-items: center;
          font-family: monospace;
        }
        .drift-status-label {
          background: #eee;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 12px;
        }
        .drift-error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 4px;
        }
        .drift-report {
          margin-top: 8px;
          font-size: 13px;
          color: #555;
        }
        .drift-change {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
}
