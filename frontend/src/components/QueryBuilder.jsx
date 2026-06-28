import React, { useState } from 'react';
import { queryAPI } from '../api';
import { Sparkles, Play, DatabaseZap, AlertTriangle } from 'lucide-react';
import DataVisualization from './DataVisualization';
import './QueryBuilder.css';

export default function QueryBuilder({ user }) {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [results, setResults] = useState(null);
  
  const [generating, setGenerating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!naturalLanguage.trim()) return;
    setGenerating(true);
    setError('');
    setResults(null);
    try {
      const res = await queryAPI.generate(naturalLanguage);
      setGeneratedSql(res.data.sql_query);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate SQL');
    } finally {
      setGenerating(false);
    }
  };

  const handleExecute = async () => {
    if (!generatedSql.trim()) return;
    setExecuting(true);
    setError('');
    try {
      const res = await queryAPI.execute(generatedSql);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to execute query (Safety Check or Syntax Error)');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="query-builder glass-panel">
      
      {/* Natural Language Input */}
      <div className="qb-section">
        <label className="qb-label">
          <Sparkles size={16} color="var(--accent-primary)" /> Ask your database a question
        </label>
        <div className="qb-input-row">
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Show all active users with the admin role..."
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={user.role_id === 4 || user.role_id === 5}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleGenerate} 
            disabled={generating || user.role_id === 4 || user.role_id === 5}
          >
            {generating ? 'Generating...' : 'Generate SQL'}
          </button>
        </div>
      </div>

      {/* SQL Editor / Display */}
      <div className="qb-section" style={{ marginTop: '24px' }}>
        <label className="qb-label">
          <DatabaseZap size={16} color="var(--warning)" /> Generated SQL
        </label>
        <textarea
          className="input-field sql-editor"
          value={generatedSql}
          onChange={(e) => setGeneratedSql(e.target.value)}
          placeholder="-- Generated SQL will appear here..."
          rows={5}
          disabled={user.role_id === 4 || user.role_id === 5}
        />
        <div className="qb-actions">
          <button 
            className="btn btn-secondary execute-btn" 
            onClick={handleExecute} 
            disabled={executing || !generatedSql.trim() || user.role_id === 4 || user.role_id === 5}
          >
            {executing ? 'Executing...' : <><Play size={16} /> Execute Query</>}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="qb-error">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Results Table / Visualizations */}
      {results && (
        <div className="qb-results">
          <div className="results-header">
            <h4>Results</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-success">{results.status}</span>
              <span className="badge badge-info">{results.result_rows} rows affected</span>
            </div>
          </div>
          
          {results.data && results.data.length > 0 ? (
            <DataVisualization data={results.data} />
          ) : (
            <p className="no-data">No data returned or query was a write operation.</p>
          )}
        </div>
      )}
    </div>
  );
}
