import React, { useState } from "react";
import { Sparkles, Calendar, Clock, AlertTriangle, Plus, Trash2, ListFilter, HelpCircle, CheckCircle2 } from "lucide-react";
import { Task } from "../types";

interface TaskPlannerProps {
  tasks: Task[];
  onAddTask: (task: any) => void;
  onUpdateTask: (id: string, updates: any) => void;
  onDeleteTask: (id: string) => void;
  token: string;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function TaskPlanner({ tasks, onAddTask, onUpdateTask, onDeleteTask, token, onShowToast }: TaskPlannerProps) {
  // Navigation filters
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "completed">("all");

  // Form parameters
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16));
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [importance, setImportance] = useState<"high" | "medium" | "low">("medium");

  // AI scoring state
  const [runningAI, setRunningAI] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleRunAIAnalysis = async () => {
    if (!name) {
      if (onShowToast) {
        onShowToast("Please enter a task name first code field.", "warning");
      } else {
        console.warn("Please key in a task name first.");
      }
      return;
    }
    setRunningAI(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          deadline,
          estimatedTime: estimatedHours,
          importance
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAiResult(data);
      if (onShowToast) {
        onShowToast("Autonomic coprocessor analyzed priority & risk scores!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`AI Prioritizer error: ${e.message}`, "error");
      } else {
        console.warn(`AI Prioritizer error: ${e.message}`);
      }
    } finally {
      setRunningAI(false);
    }
  };

  const handleSaveTask = async () => {
    if (!name) return;

    const taskPayload = {
      name,
      description,
      deadline,
      estimatedTime: estimatedHours,
      importance,
      priorityScore: aiResult ? aiResult.priorityScore : 60,
      riskScore: aiResult ? aiResult.riskScore : 25,
      suggestedStartTime: aiResult ? aiResult.suggestedStartTime : "Tomorrow, 09:00 AM",
      details: {
        urgency: aiResult ? aiResult.urgency : 6,
        impact: aiResult ? aiResult.impact : 5,
        difficulty: aiResult ? aiResult.difficulty : 5,
        completionProbability: aiResult ? aiResult.completionProbability : 75
      }
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskPayload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Trigger callback
      onAddTask(data.task);

      // Clear Form state
      setName("");
      setDescription("");
      setAiResult(null);
      if (onShowToast) {
        onShowToast("New task stored successfully on Firebase Firestore!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Failed to save task: ${e.message}`, "error");
      } else {
        console.warn(`Failed to save task: ${e.message}`);
      }
    }
  };

  // Filter tasks list representation
  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Overview Head */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Prioritization Module</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add comprehensive tasks and run server-side prioritize vectors to build ideal schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form panel inputs - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-500" />
              <span>Initiate New Task</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Task Name
                </label>
                <input 
                  id="task-form-name"
                  type="text" 
                  placeholder="e.g., Integrate Auth gateway" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 pl-3 pr-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description / Sub-objectives
                </label>
                <textarea 
                  id="task-form-description"
                  placeholder="Briefly state complexity boundaries..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 pl-3 pr-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Dead Date & Time
                  </label>
                  <input 
                    id="task-form-deadline"
                    type="datetime-local" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Est. Effort (Hrs)
                  </label>
                  <input 
                    id="task-form-est"
                    type="number" 
                    min="1"
                    max="100"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 2)}
                    className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Stated Importance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setImportance(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize border transition-all ${
                        importance === lvl 
                          ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-sm" 
                          : "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex space-x-3">
                <button
                  id="btn-run-ai-prioritize"
                  type="button"
                  onClick={handleRunAIAnalysis}
                  disabled={runningAI || !name}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{runningAI ? "Calculating..." : "Run AI Prioritizer"}</span>
                </button>

                <button
                  id="btn-save-task-direct"
                  type="button"
                  onClick={handleSaveTask}
                  disabled={!name}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all disabled:opacity-45"
                >
                  Quick Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI scoring result panel or lists - Right 3 Columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Result Card */}
          {aiResult && (
            <div id="ai-analysis-feedback-card" className="glass-panel p-6 rounded-2xl border-2 border-blue-500 animate-fadeIn bg-gradient-to-br from-[#1E293B]/70 to-[#0F172A]/85 relative">
              <span className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/20 px-2 py-0.5 rounded-full">
                AI COPROCESSOR CALIBRATED
              </span>
              <h3 className="text-md font-bold text-white mb-4 flex items-center space-x-1.5">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>AI Cognitive Evaluation</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">Priority Score</span>
                  <span className="text-2xl font-extrabold text-blue-400">{aiResult.priorityScore}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Deadline Risk</span>
                  <span className={`text-2xl font-bold ${aiResult.riskScore > 65 ? "text-red-400" : "text-green-400"}`}>
                    {aiResult.riskScore}%
                  </span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Probability</span>
                  <span className="text-2xl font-extrabold text-indigo-400">{aiResult.completionProbability}%</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Suggested Start</span>
                  <span className="text-[11px] font-semibold text-cyan-300 block mt-1 truncate">{aiResult.suggestedStartTime}</span>
                </div>
              </div>

              {/* Sub parameters breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-xs font-mono">
                <div className="bg-[#0F172A] p-2 rounded border border-slate-850">
                  <span className="text-slate-500 block">Urgency:</span>
                  <span className="text-slate-200 mt-0.5 inline-block">{aiResult.urgency} / 10</span>
                </div>
                <div className="bg-[#0F172A] p-2 rounded border border-slate-850">
                  <span className="text-slate-500 block">Impact:</span>
                  <span className="text-slate-200 mt-0.5 inline-block">{aiResult.impact} / 10</span>
                </div>
                <div className="bg-[#0F172A] p-2 rounded border border-slate-850">
                  <span className="text-slate-500 block">Difficulty:</span>
                  <span className="text-slate-200 mt-0.5 inline-block">{aiResult.difficulty} / 10</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/20 rounded-xl border border-blue-900/30 text-xs text-slate-300 mb-4 leading-relaxed">
                <strong>RATIONALE:</strong> {aiResult.recommendation}
              </div>

              <button
                id="btn-confirm-save-ai"
                onClick={handleSaveTask}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold transition-all"
              >
                Accept & Commit Task To Roadmap
              </button>
            </div>
          )}

          {/* List panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
              <div>
                <h3 className="text-md font-bold text-white">Active Roadmap Tasks ({filteredTasks.length})</h3>
                <p className="text-xs text-slate-400">Review, configure completion flags, or drop items</p>
              </div>

              {/* Status Filters */}
              <div className="flex bg-[#0F172A] p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto">
                {(["all", "todo", "inprogress", "completed"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilter(st)}
                    className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                      filter === st ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st === "inprogress" ? "Active" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks representation */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  <p>No task entries match this filter. Add new targets to watch prioritize scores.</p>
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <div 
                    key={t.id}
                    className="p-4 bg-slate-900/30 rounded-xl border border-slate-800/80 hover:border-slate-800 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="flex items-start space-x-3 max-w-[75%]">
                      <button
                        onClick={() => onUpdateTask(t.id, { status: t.status === "completed" ? "todo" : "completed" })}
                        className={`w-5 h-5 rounded border ${
                          t.status === "completed" ? "bg-blue-600/20 border-blue-500 flex items-center justify-center text-blue-400" : "border-slate-600 hover:border-blue-400"
                        } shrink-0 mt-0.5 transition-all`}
                      >
                        {t.status === "completed" && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <span className={`text-sm font-bold block ${t.status === "completed" ? "line-through text-slate-500" : "text-slate-200"}`}>
                          {t.name}
                        </span>
                        {t.description && (
                          <p className={`text-xs mt-1 leading-relaxed ${t.status === "completed" ? "text-slate-600" : "text-slate-400"}`}>
                            {t.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mt-2 font-mono">
                          <span className={`${
                            t.importance === "high" ? "text-red-400" : t.importance === "medium" ? "text-yellow-400" : "text-blue-400"
                          }`}>
                            {t.importance.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{t.estimatedTime} Hrs</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-0.5">
                            <Calendar className="w-3 h-3" />
                            <span className="truncate">{new Date(t.deadline).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between items-center sm:items-end shrink-0 gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-mono block">
                          Priority: <span className="text-blue-400 font-bold">{t.priorityScore}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          Risk: <span className={t.riskScore > 70 ? "text-red-400 font-bold" : "text-slate-500"}>{t.riskScore}%</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {t.status !== "completed" && (
                          <button
                            onClick={() => onUpdateTask(t.id, { status: t.status === "todo" ? "inprogress" : "todo" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded font-semibold transition-all"
                          >
                            {t.status === "todo" ? "Activate" : "Deactivate"}
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
