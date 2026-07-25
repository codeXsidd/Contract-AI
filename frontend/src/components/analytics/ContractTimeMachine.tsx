import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, TrendingUp, ChevronRight, ShieldAlert } from 'lucide-react';

interface TimeMachineProps {
  contractId: string;
}

export const ContractTimeMachine: React.FC<TimeMachineProps> = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(6); // Default 6 months

  const timelineData = [
    {
      months: 0,
      label: 'Today',
      riskScore: 28,
      riskLevel: 'Low Risk',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      triggers: ['Standard service terms active', "All liability caps within baseline ($1M)"]
    },
    {
      months: 3,
      label: '3 Months Later',
      riskScore: 38,
      riskLevel: 'Moderate Risk',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      triggers: ['Quarterly compliance review due', 'SLA rebate threshold audit opens']
    },
    {
      months: 6,
      label: '6 Months Later',
      riskScore: 65,
      riskLevel: 'High Risk',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      triggers: [
        'Vendor pricing indexation escalates +15% automatically',
        'Cyber Security Liability Policy expires',
        '90-Day Non-Renewal notice window activates'
      ]
    },
    {
      months: 12,
      label: '12 Months Later',
      riskScore: 82,
      riskLevel: 'Critical Risk',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      triggers: [
        'Automatic 3-Year multi-term renewal locks in without opt-out',
        'Uncapped indemnity penalty clause becomes active',
        'Data retention compliance mandate breach ($50k fine risk)'
      ]
    }
  ];

  const currentSnapshot = timelineData.find(t => t.months === selectedPeriod) || timelineData[2];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Contract Time Machine
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                PREDICTIVE AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">Simulate legal, financial, and compliance risk escalations into the future</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Today Risk</span>
          <span className="text-xl font-bold text-emerald-400">28%</span>
        </div>
      </div>

      {/* Interactive Time Selector */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {timelineData.map((t) => {
          const isActive = selectedPeriod === t.months;
          return (
            <button
              key={t.months}
              onClick={() => setSelectedPeriod(t.months)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-medium mb-1 flex items-center justify-between">
                <span>{t.label}</span>
                {t.months === 0 && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </div>
              <div className="text-lg font-bold text-slate-100">
                {t.riskScore}% <span className="text-xs font-normal opacity-70">Risk</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Snapshot Details Panel */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-200">Predicted State: {currentSnapshot.label}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${currentSnapshot.color}`}>
            {currentSnapshot.riskLevel}
          </span>
        </div>

        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Escalation Root Cause Breakdown:
        </h4>

        <div className="space-y-2.5">
          {currentSnapshot.triggers.map((trigger, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-sm text-slate-300">
              <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <span>{trigger}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
