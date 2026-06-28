import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LayoutGrid, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Download } from 'lucide-react';
import './DataVisualization.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function DataVisualization({ data }) {
  const [viewMode, setViewMode] = useState('table'); // 'table', 'bar', 'line', 'pie'
  
  if (!data || data.length === 0) return null;

  // Determine potential chart keys
  const keys = Object.keys(data[0]);
  const numberKeys = keys.filter(key => typeof data[0][key] === 'number');
  const stringKeys = keys.filter(key => typeof data[0][key] === 'string');
  
  const xAxisKey = stringKeys.length > 0 ? stringKeys[0] : keys[0];
  const yAxisKey = numberKeys.length > 0 ? numberKeys[0] : (keys.length > 1 ? keys[1] : null);

  const canChart = yAxisKey !== null && data.length <= 50;

  const handleExportCSV = () => {
    const header = keys.join(',');
    const rows = data.map(row => keys.map(k => {
      const val = row[k];
      return typeof val === 'string' ? `"${val}"` : val;
    }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
  };

  return (
    <div className="data-vis-container">
      <div className="vis-header">
        <div className="vis-tabs">
          <button className={`vis-tab ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
            <LayoutGrid size={16} /> Table
          </button>
          {canChart && (
            <>
              <button className={`vis-tab ${viewMode === 'bar' ? 'active' : ''}`} onClick={() => setViewMode('bar')}>
                <BarChart2 size={16} /> Bar
              </button>
              <button className={`vis-tab ${viewMode === 'line' ? 'active' : ''}`} onClick={() => setViewMode('line')}>
                <LineChartIcon size={16} /> Line
              </button>
              <button className={`vis-tab ${viewMode === 'pie' ? 'active' : ''}`} onClick={() => setViewMode('pie')}>
                <PieChartIcon size={16} /> Pie
              </button>
            </>
          )}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="vis-content">
        {viewMode === 'table' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {keys.map(key => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {keys.map((key, j) => (
                      <td key={j}>{row[key] !== null ? String(row[key]) : 'NULL'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'bar' && canChart && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey={xAxisKey} stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Bar dataKey={yAxisKey} fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'line' && canChart && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey={xAxisKey} stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }} />
                <Line type="monotone" dataKey={yAxisKey} stroke="var(--success)" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'pie' && canChart && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey={yAxisKey} nameKey={xAxisKey}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
