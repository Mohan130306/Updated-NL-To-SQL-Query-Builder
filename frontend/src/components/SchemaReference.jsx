import React, { useState } from 'react';
import { Database, ChevronDown, ChevronRight, Table, Key, Link as LinkIcon, Info } from 'lucide-react';
import './SchemaReference.css';

const SCHEMA_DATA = [
  {
    name: 'users',
    description: 'Stores user registration, credentials, and active states.',
    columns: [
      { name: 'id', type: 'INT', key: 'PK', desc: 'Unique user identifier.' },
      { name: 'email', type: 'VARCHAR(255)', key: 'UK', desc: 'Login email address.' },
      { name: 'first_name', type: 'VARCHAR(100)', desc: "User's first name." },
      { name: 'last_name', type: 'VARCHAR(100)', desc: "User's last name." },
      { name: 'role_id', type: 'INT', key: 'FK', desc: 'Links user to a specific role.' },
      { name: 'created_at', type: 'DATETIME', desc: 'User registration timestamp.' },
      { name: 'is_active', type: 'BOOLEAN', desc: 'Active status of the user account.' }
    ],
    relations: [
      { from: 'role_id', to: 'roles.id', label: 'Many users belong to one role' }
    ]
  },
  {
    name: 'roles',
    description: 'Defines roles for Role-Based Access Control (RBAC).',
    columns: [
      { name: 'id', type: 'INT', key: 'PK', desc: 'Unique role identifier.' },
      { name: 'name', type: 'VARCHAR(50)', key: 'UK', desc: "Role name ('admin', 'developer', etc.)." },
      { name: 'description', type: 'VARCHAR(255)', desc: 'Explanation of role capabilities.' }
    ],
    relations: []
  },
  {
    name: 'permissions',
    description: 'Defines specific SQL capabilities permitted for each role.',
    columns: [
      { name: 'id', type: 'INT', key: 'PK', desc: 'Unique permission identifier.' },
      { name: 'role_id', type: 'INT', key: 'FK', desc: 'Role bound to this permission.' },
      { name: 'permission', type: 'VARCHAR(50)', desc: "Operation name ('SELECT', 'INSERT', 'DROP', etc.)." }
    ],
    relations: [
      { from: 'role_id', to: 'roles.id', label: 'Many permissions map to one role' }
    ]
  },
  {
    name: 'query_history',
    description: 'Logs all executed SQL queries for audit.',
    columns: [
      { name: 'id', type: 'INT', key: 'PK', desc: 'Unique log entry identifier.' },
      { name: 'user_id', type: 'INT', key: 'FK', desc: 'The user who executed this query.' },
      { name: 'query_text', type: 'TEXT', desc: 'The executed SQL command.' },
      { name: 'execution_time', type: 'DATETIME', desc: 'Timestamp of query execution.' },
      { name: 'status', type: 'VARCHAR(20)', desc: "Execution status ('success' or 'failed')." },
      { name: 'result_rows', type: 'INT', desc: 'Number of rows affected or returned.' }
    ],
    relations: [
      { from: 'user_id', to: 'users.id', label: 'Many logs belong to one user' }
    ]
  },
  {
    name: 'saved_queries',
    description: 'Stores reusable SQL queries saved by users.',
    columns: [
      { name: 'id', type: 'INT', key: 'PK', desc: 'Unique saved query identifier.' },
      { name: 'user_id', type: 'INT', key: 'FK', desc: 'Owner of the saved query.' },
      { name: 'query_name', type: 'VARCHAR(255)', desc: 'Friendly name of the saved query.' },
      { name: 'query_text', type: 'TEXT', desc: 'The saved SQL statement.' },
      { name: 'created_at', type: 'DATETIME', desc: 'Timestamp of creation.' }
    ],
    relations: [
      { from: 'user_id', to: 'users.id', label: 'Many saved queries belong to one user' }
    ]
  }
];

export default function SchemaReference({ onToggleHistory }) {
  const [expandedTable, setExpandedTable] = useState(null);

  const toggleTable = (tableName) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  return (
    <div className="schema-sidebar glass-panel">
      <div className="schema-header">
        <div className="schema-title-wrapper">
          <Database size={18} color="var(--accent-cyan)" />
          <h3>Schema Reference</h3>
        </div>
        <button className="toggle-sidebar-btn" onClick={onToggleHistory}>
          Show History
        </button>
      </div>

      <div className="schema-list">
        {SCHEMA_DATA.map((table) => {
          const isExpanded = expandedTable === table.name;
          return (
            <div key={table.name} className={`schema-table-item ${isExpanded ? 'expanded' : ''}`}>
              <div className="table-summary" onClick={() => toggleTable(table.name)}>
                <div className="table-summary-left">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <Table size={16} color="var(--accent-purple)" />
                  <span className="table-name-label">{table.name}</span>
                </div>
                <span className="cols-count">{table.columns.length} cols</span>
              </div>

              {isExpanded && (
                <div className="table-details">
                  <p className="table-desc">{table.description}</p>
                  
                  <div className="columns-grid-header">
                    <span>Column</span>
                    <span>Type</span>
                    <span>Desc</span>
                  </div>
                  
                  <div className="columns-list">
                    {table.columns.map((col) => (
                      <div key={col.name} className="column-row">
                        <div className="col-name-box">
                          {col.key && (
                            <span className={`key-badge ${col.key.toLowerCase()}`}>
                              {col.key}
                            </span>
                          )}
                          <span className="col-name-txt">{col.name}</span>
                        </div>
                        <span className="col-type-txt">{col.type}</span>
                        <span className="col-desc-txt">{col.desc}</span>
                      </div>
                    ))}
                  </div>

                  {table.relations.length > 0 && (
                    <div className="table-relations-section">
                      <h4><LinkIcon size={12} /> Relationships</h4>
                      {table.relations.map((rel, idx) => (
                        <div key={idx} className="relation-row">
                          <span className="rel-path">
                            <code>{rel.from}</code> ➔ <code>{rel.to}</code>
                          </span>
                          <span className="rel-desc">{rel.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="schema-info-footer">
        <Info size={14} />
        <span>Keys represent table relationships.</span>
      </div>
    </div>
  );
}
