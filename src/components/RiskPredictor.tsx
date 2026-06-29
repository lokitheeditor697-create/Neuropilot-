import React from "react";
import { ShieldAlert, TrendingDown, Clock, HelpCircle, Activity, Sparkles, CheckSquare, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Task } from "../types";

interface RiskPredictorProps {
  tasks: Task[];
  onNavigateToTab: (tab: string) => void;
  simulationState?: any;
}

export default function RiskPredictor({ tasks, onNavigateToTab, simulationState }: RiskPredictorProps) {
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  
  // Apply simulation state overrides if active (Option A)
  const simulatedPendingTasks = pendingTasks.map(t => {
    if (simulationState?.isActive) {
      const riskMultiplier = simulationState.scopeCreepOverride / 100;
      const fatigueMultiplier = simulationState.fatigueOverride / 100;
      const estimatedSimRisk = Math.min(100, Math.round(t.riskScore + (100 - t.riskScore) * riskMultiplier + (fatigueMultiplier * 15)));
      const estimatedSimPriority = Math.min(100, Math.round(t.priorityScore + (100 - t.priorityScore) * (simulationState.meetingLoadOverride / 150)));
      return {
        ...t,
        riskScore: estimatedSimRisk,
        priorityScore: estimatedSimPriority
      };
    }
    return t;
  });

  // Categorization counts based on active dataset
  const criticalTasks = simulatedPendingTasks.filter((t) => t.riskScore >= 75);
  const highTasks = simulatedPendingTasks.filter((t) => t.riskScore >= 50 && t.riskScore < 75);
  const mediumTasks = simulatedPendingTasks.filter((t) => t.riskScore >= 25 && t.riskScore < 50);
  const lowTasks = simulatedPendingTasks.filter((t) => t.riskScore < 25);

  // Prepare custom chart representation vectors
  const chartData = simulatedPendingTasks.map((t) => ({
    name: t.name.length > 20 ? t.name.substring(0, 18) + "..." : t.name,
    "Deadline Risk (%)": t.riskScore,
    "Priority Score": t.priorityScore
  }));

  // Smart suggestions helper list based on critical alerts
  const generateMitigations = () => {
    if (criticalTasks.length === 0) {
      return [
        { id: "m1", text: "Optimal risk matrix: Keep deep focus times stable to prevent slip thresholds." },
        { id: "m2", text: "Maintain habits streaks - consistency reduces long-term complexity stress." }
      ];
    }

    const mitigations = [];
    if (criticalTasks.length > 0) {
      mitigations.push({
        id: "m_crit_1",
        text: `Urgent recommendation: Delegate or reduce scope on "${criticalTasks[0].name}" (${criticalTasks[0].riskScore}% risk). Task estimate exceeds remaining hours-to-deadline ratio.`
      });
    }
    if (criticalTasks.length > 1) {
      mitigations.push({
        id: "m_crit_2",
        text: `Reschedule support: Move less critical items like "${mediumTasks[0]?.name || "regular reading habit"}" lower to clear a 4-hour uninterrupted code window.`
      });
    } else {
      mitigations.push({
        id: "m_crit_3",
        text: "Calibrate break blocks: Padding your day with structured recess intervals decreases neurological fatigue delay rates by up to 25%."
      });
    }

    return mitigations;
  };

  const mitigations = generateMitigations();

  return (
    <div className="space-y-8">
      {/* Upper info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">Deadline Risk Predictor</h1>
          <p className="text-slate-400 text-sm mt-1">
            Generative cognitive forecasting measuring estimate buffers against remaining lock hours.
          </p>
        </div>
        
        <div className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Active Forecast Vector Engine: v1.0.8</span>
        </div>
      </div>

      {/* Grid of Alert meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Critical Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-850 bg-gradient-to-br from-red-950/20 to-[#1E293B]/70 relative">
          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">Critical Hazard</span>
          <span className="text-4xl font-extrabold text-white mt-2 block">{criticalTasks.length}</span>
          <p className="text-[11px] text-slate-400 mt-2">Tasks with slip index &ge; 75%</p>
        </div>

        {/* High Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-yellow-950/20 to-[#1E293B]/70 relative">
          <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">High Danger</span>
          <span className="text-4xl font-extrabold text-white mt-2 block">{highTasks.length}</span>
          <p className="text-[11px] text-slate-400 mt-2">Tasks with slip index 50% — 74%</p>
        </div>

        {/* Medium Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Stable Alert</span>
          <span className="text-4xl font-extrabold text-white mt-2 block">{mediumTasks.length}</span>
          <p className="text-[11px] text-slate-400 mt-2">Tasks with slip index 25% — 49%</p>
        </div>

        {/* Low Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Safe Standard</span>
          <span className="text-4xl font-extrabold text-white mt-2 block">{lowTasks.length}</span>
          <p className="text-[11px] text-slate-400 mt-2">Tasks with slip index &lt; 25%</p>
        </div>
      </div>

      {/* Main breakdown and chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recharts BarChart - Left 3 Columns */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Risk vs. Priority Evaluation</h3>
            <p className="text-xs text-slate-400">Aim to complete tasks high in priority with elevated risk index vectors first</p>
          </div>

          <div className="w-full h-72 text-slate-300">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No active task metrics to evaluate on chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Deadline Risk (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Priority Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Advisory mitigations list and slip tracker - Right 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Advisor Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-[#1E293B]/60 to-[#0F172A]/80">
            <div className="flex items-center space-x-2 text-cyan-400 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">AI Risk Advisory Panel</h3>
            </div>

            <div className="space-y-4">
              {mitigations.map((it) => (
                <div key={it.id} className="p-3 bg-[#0F172A]/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {it.text}
                </div>
              ))}
            </div>
          </div>

          {/* Critical Risk List scrollable */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Deadline Slip Probability List</h3>

            <div className="space-y-3">
              {simulatedPendingTasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">All clear! No pending tasks at risk.</p>
              ) : (
                simulatedPendingTasks
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map((t) => (
                    <div key={t.id} className="p-3 bg-slate-900/45 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                      <div className="max-w-[70%]">
                        <span className="font-extrabold text-slate-200 block truncate">{t.name}</span>
                        <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                          Estimate: {t.estimatedTime}h • Due: {new Date(t.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-mono font-black ${
                          t.riskScore >= 75 ? "text-red-500" :
                          t.riskScore >= 50 ? "text-yellow-500" :
                          "text-emerald-500"
                        }`}>
                          {t.riskScore}% Slip
                        </span>
                        
                        <button
                          onClick={() => onNavigateToTab("tasks")}
                          className="text-[9px] text-blue-400 hover:underline block mt-1 font-semibold"
                        >
                          Modify Scope
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
