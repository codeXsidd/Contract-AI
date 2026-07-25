import React, { useState } from 'react';
import { Radio, AlertOctagon, CheckCircle2, AlertTriangle, FileWarning, ArrowUpRight } from 'lucide-react';

export const RegulatoryRadarView: React.FC = () => {
  const [selectedReg, setSelectedReg] = useState<string>('reg-1');

  const updates = [
    {
      id: 'reg-1',
      regulation: 'Digital Personal Data Protection (DPDP) Rule 2023',
      jurisdiction: 'India / Global Data Handling',
      effectiveDate: '2026-09-01',
      severity: 'High',
      summary: 'Mandates explicit consent records and strict 72-hour breach notification protocols for all data processor vendor contracts.',
      affectedCount: 23,
      affectedContracts: [
        { title: 'Master Service Agreement - TechCorp', type: 'Service Agreement', risk: 'High Action Required' },
        { title: 'Cloud Infrastructure SLA - AWS Partner', type: 'SLA', risk: 'High Action Required' },
        { title: 'Vendor Data Processing Addendum - Acme', type: 'DPA', risk: 'Medium Action Required' }
      ]
    },
    {
      id: 'reg-2',
      regulation: 'EU AI Act - High Risk System Governance',
      jurisdiction: 'European Union',
      effectiveDate: '2026-11-15',
      severity: 'Critical',
      summary: 'Requires explicit AI disclosure, logging, and liability assignment clauses for automated data processing software vendors.',
      affectedCount: 14,
      affectedContracts: [
        { title: 'SaaS Platform Agreement - DataMetrics', type: 'SaaS', risk: 'Critical Action Required' }
      ]
    },
    {
      id: 'reg-3',
      regulation: 'HIPAA Security Rule Update (Cyber Resilience)',
      jurisdiction: 'United States (Healthcare)',
      effectiveDate: '2026-10-01',
      severity: 'Medium',
      summary: 'Requires Business Associate Agreements (BAAs) to include mandatory quarterly vulnerability remediation SLAs.',
      affectedCount: 8,
      affectedContracts: []
    }
  ];

  const activeReg = updates.find(u => u.id === selectedReg) || updates[0];

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl animate-pulse">
              <Radio className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                AI Regulatory Radar
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                  REAL-TIME MONITORING
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically monitors global regulatory changes (DPDP, GDPR, HIPAA, EU AI Act) against active contracts
              </p>
            </div>
          </div>

          <div className="flex space-x-6 text-right">
            <div>
              <span className="text-xs text-slate-400 block">Scanned Contracts</span>
              <span className="text-xl font-bold text-slate-100">142</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Require Modification</span>
              <span className="text-xl font-bold text-rose-400">45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Regulatory Updates List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Active Compliance Alerts:</h2>
          {updates.map((reg) => {
            const isSelected = reg.id === selectedReg;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedReg(reg.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-rose-950/30 border-rose-500/50 text-white shadow-lg ring-1 ring-rose-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    reg.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {reg.severity} Priority
                  </span>
                  <span className="text-xs font-bold text-rose-400">{reg.affectedCount} Contracts</span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-1">{reg.regulation}</h3>
                <p className="text-xs text-slate-400 mt-1">{reg.jurisdiction}</p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Affected Contracts & Detail Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100">{activeReg.regulation}</h2>
            <p className="text-xs text-slate-400 mt-1">{activeReg.summary}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Existing Repository Contracts Requiring Action ({activeReg.affectedContracts.length})</span>
              <span className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1">
                Batch Update All <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </h3>

            <div className="space-y-2.5">
              {activeReg.affectedContracts.length > 0 ? (
                activeReg.affectedContracts.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                    <div className="flex items-center space-x-3">
                      <FileWarning className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{c.title}</h4>
                        <span className="text-xs text-slate-400">{c.type}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      {c.risk}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                  All contracts match current HIPAA compliance requirements.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
