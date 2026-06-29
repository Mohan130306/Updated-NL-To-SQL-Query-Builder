import React, { useEffect, useState } from 'react';
import { queryAPI } from '../api';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import './HistorySidebar.css';

export default function HistorySidebar({ fullWidth = false, onToggleSchema }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await queryAPI.getHistory();
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    // In a real app we'd poll or use websockets to keep this fresh
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="history-sidebar glass-panel" style={fullWidth ? { width: '100%', height: '100%', borderLeft: 'none' } : {}}>
      <div className="history-header" style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={18} />
          <h3>Query History</h3>
        </div>
        {!fullWidth && onToggleSchema && (
          <button className="toggle-sidebar-btn" onClick={onToggleSchema}>
            Show Schema
          </button>
        )}
      </div>
      
      <div className="history-list">
        {loading && history.length === 0 ? (
          <p className="history-empty">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="history-empty">No queries executed yet.</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-item-header">
                {item.status === 'success' ? (
                  <CheckCircle2 size={14} color="var(--success)" />
                ) : (
                  <XCircle size={14} color="var(--danger)" />
                )}
                <span className="history-time">
                  {new Date(item.execution_time).toLocaleTimeString()}
                </span>
              </div>
              <div className="history-sql">
                {item.query_text}
              </div>
              {item.status === 'success' && (
                <div className="history-rows">{item.result_rows} rows</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
