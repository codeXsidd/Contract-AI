import React from 'react';
import { Activity, AlertTriangle, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const HealthScoreTimeline: React.FC = () => {
  const data = [
    { month: 'Jan', score: 95, reason: 'Contract Executed' },
    { month: 'Feb', score: 93, reason: 'Minor SLA delay' },
    { month: 'Mar', score: 82, reason: 'DPDP rule flagged' },
    { month: 'Apr', score: 80, reason: 'Quarterly review' },
    { month: 'May', score: 74, reason: 'Sub-vendor compliance gap' },
    { month: 'Jun', score: 65, reason: 'Insurance renewal pending' },
    { month: 'Jul', score: 68, reason: 'Risk mitigation applied' },
    { month: 'Aug', score: 60, reason: 'Auto-renewal trigger' },
    { month: 'Sep', score: 41, reason: 'Price indexation activates' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Contract Health Score Timeline
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                HISTORIC & PROJECTED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Track contract health degradation over time with AI explanations</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <TrendingDown className="w-4 h-4" />
          <span>Health Dropped -30%</span>
        </div>
      </div>

      <div className="h-64 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 8, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Explanation Timeline List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">January (95%)</span>
          <p className="text-xs text-slate-300">Contract signed with baseline compliance and standard terms.</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl">
          <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">June (65%)</span>
          <p className="text-xs text-slate-300">Cyber insurance policy expiration drops health score by 15%.</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl">
          <span className="text-[10px] text-rose-400 font-bold uppercase block mb-1">September (41%)</span>
          <p className="text-xs text-slate-300">Unhedged pricing indexation triggers critical health warning.</p>
        </div>
      </div>
    </div>
  );
};
