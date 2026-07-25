import React, { useState } from 'react';
import { Sliders, DollarSign, TrendingDown, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

export const BusinessImpactSimulator: React.FC = () => {
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(60);
  const [liabilityCapPercent, setLiabilityCapPercent] = useState<number>(200);
  const [noticePeriodDays, setNoticePeriodDays] = useState<number>(90);
  const [slaUptime, setSlaUptime] = useState<number>(99.0);

  // Dynamic simulation math
  const daysDelta = paymentTermsDays - 30;
  const workingCapitalChange = -(daysDelta * 1.4);
  const cashFlowRiskScore = Math.max(10, Math.min(95, 20 + Math.round(daysDelta * 1.2)));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              AI Business Impact Simulator
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                WHAT-IF ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Simulate clause modifications to predict working capital, revenue, and dependency impacts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters Controls */}
        <div className="space-y-5 bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Interactive Clause Parameters
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Payment Terms:</span>
              <span className="font-bold text-indigo-300">{paymentTermsDays} Days</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={paymentTermsDays}
              onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Liability Cap (% Contract Value):</span>
              <span className="font-bold text-amber-300">{liabilityCapPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={liabilityCapPercent}
              onChange={(e) => setLiabilityCapPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Termination Notice Window:</span>
              <span className="font-bold text-blue-300">{noticePeriodDays} Days</span>
            </div>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={noticePeriodDays}
              onChange={(e) => setNoticePeriodDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Target SLA Commitment:</span>
              <span className="font-bold text-emerald-300">{slaUptime.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="95.0"
              max="99.9"
              step="0.1"
              value={slaUptime}
              onChange={(e) => setSlaUptime(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Dynamic Simulation Output */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Cash Flow Risk</span>
              <span className={`text-2xl font-extrabold ${cashFlowRiskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {cashFlowRiskScore}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Based on {paymentTermsDays}d payment terms</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Working Capital Impact</span>
              <span className={`text-2xl font-extrabold ${workingCapitalChange < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {workingCapitalChange.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Liquidity efficiency shift</span>
            </div>
          </div>

          {/* Business Impact Cascade Flow */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Predicted Business Cascade:</h4>
            
            <div className="flex items-center text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200">Payment Terms</span>
              <ArrowRight className="w-3.5 h-3.5 mx-2 text-indigo-400" />
              <span>{paymentTermsDays} Days</span>
            </div>

            <div className="flex items-center text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200">Working Capital</span>
              <ArrowRight className="w-3.5 h-3.5 mx-2 text-amber-400" />
              <span className={workingCapitalChange < 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                Decreases by {Math.abs(workingCapitalChange).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200">Cash Flow Risk</span>
              <ArrowRight className="w-3.5 h-3.5 mx-2 text-rose-400" />
              <span className="text-rose-400 font-semibold">+{cashFlowRiskScore}% Risk Level</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
