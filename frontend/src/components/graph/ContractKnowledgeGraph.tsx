import React, { useState } from 'react';
import { GitGraph, AlertTriangle, ShieldCheck, FileText, Info } from 'lucide-react';

export const ContractKnowledgeGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('c1');

  const nodes = [
    { id: 'c1', label: 'Termination Clause', type: 'Clause', risk: 'High', details: 'Requires 60-day notice. Breach triggers penalty clause c2.' },
    { id: 'c2', label: 'Penalty Clause ($50k)', type: 'Financial', risk: 'High', details: 'Mandates $50,000 liquid damages. Subject to liability cap c3.' },
    { id: 'c3', label: 'Liability Cap ($1M)', type: 'Legal', risk: 'Medium', details: 'Limits cumulative damages to $1,000,000 USD.' },
    { id: 'c4', label: 'Cyber Insurance ($2M)', type: 'Compliance', risk: 'Low', details: 'Requires active $2,000,000 cyber insurance policy.' },
    { id: 'c5', label: 'SLA Uptime (99.9%)', type: 'Operational', risk: 'Medium', details: 'Failure below 99.5% triggers SLA penalty credit.' },
    { id: 'c6', label: 'Auto-Renewal (30 Days)', type: 'Lifecycle', risk: 'High', details: 'Locks in non-cancellable 12-month extension window.' }
  ];

  const links = [
    { source: 'c1', target: 'c2', relation: 'Triggers penalty upon breach' },
    { source: 'c2', target: 'c3', relation: 'Subject to maximum cap' },
    { source: 'c3', target: 'c4', relation: 'Requires back-to-back coverage' },
    { source: 'c5', target: 'c2', relation: 'Failure triggers penalty credit' },
    { source: 'c6', target: 'c1', relation: 'Locks termination window' }
  ];

  const activeNodeObj = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl">
            <GitGraph className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Contract Knowledge Graph
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
                RELATIONAL GRAPH
              </span>
            </h2>
            <p className="text-xs text-slate-400">Visualize how clauses, penalties, liabilities, and insurance interact</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Visual Graph Canvas */}
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-6 relative min-h-[320px] flex items-center justify-center overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            Inter-clause Mapping Network
          </div>

          <svg className="w-full h-72">
            {/* Draw Links */}
            <line x1="80" y1="70" x2="220" y2="70" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="220" y1="70" x2="360" y2="70" stroke="#6366f1" strokeWidth="2" />
            <line x1="360" y1="70" x2="360" y2="200" stroke="#10b981" strokeWidth="2" />
            <line x1="80" y1="200" x2="220" y2="70" stroke="#f59e0b" strokeWidth="2" />
            <line x1="80" y1="200" x2="80" y2="70" stroke="#ef4444" strokeWidth="2" />

            {/* Render Nodes */}
            {nodes.map((node, idx) => {
              const coords = [
                { x: 80, y: 70 },
                { x: 220, y: 70 },
                { x: 360, y: 70 },
                { x: 360, y: 200 },
                { x: 220, y: 200 },
                { x: 80, y: 200 }
              ][idx];

              const isSelected = selectedNode === node.id;
              const riskColor = node.risk === 'High' ? '#ef4444' : node.risk === 'Medium' ? '#f59e0b' : '#10b981';

              return (
                <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer">
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 22 : 18}
                    fill="#1e293b"
                    stroke={isSelected ? '#818cf8' : riskColor}
                    strokeWidth={isSelected ? 4 : 2}
                    className="transition-all hover:r-24"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 32}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {node.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Panel */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs text-violet-400 mb-2">
              <FileText className="w-4 h-4" />
              <span>{activeNodeObj.type} Element</span>
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-2">{activeNodeObj.label}</h3>

            <div className="mb-4">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                activeNodeObj.risk === 'High'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : activeNodeObj.risk === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {activeNodeObj.risk} Impact Level
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {activeNodeObj.details}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">Direct Relationships:</span>
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Connected to 2 dependent contract terms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
