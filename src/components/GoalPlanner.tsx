import React, { useState } from "react";
import { Sparkles, Layers, ListTodo, ChevronRight, CheckSquare, Brain, Plus, Trash2, Award } from "lucide-react";
import { Goal } from "../types";

interface GoalPlannerProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (id: string, updates: any) => void;
  onDeleteGoal: (id: string) => void;
  token: string;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function GoalPlanner({ goals, onAddGoal, onUpdateGoal, onDeleteGoal, token, onShowToast }: GoalPlannerProps) {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(goals[0]?.id || null);
  
  // Create Goal form
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [category, setCategory] = useState<any>("personal");
  
  // Custom draft milestones input
  const [draftMilestones, setDraftMilestones] = useState("");

  // AI Planner generation
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [kanbanPhases, setKanbanPhases] = useState<any[] | null>(null);

  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Convert draft lines to milestones array structure
    const milestoneLines = draftMilestones
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      name,
      objective,
      category,
      milestones: milestoneLines.length > 0 ? milestoneLines : ["Define Scope", "Execute Alpha", "Verify Output"]
    };

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onAddGoal(data.goal);
      setActiveGoalId(data.goal.id);
      
      // Reset state
      setName("");
      setObjective("");
      setDraftMilestones("");
      if (onShowToast) {
        onShowToast("New product roadmap is locked in database successfully!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Error creating goal: ${e.message}`, "error");
      } else {
        console.warn(`Error creating goal: ${e.message}`);
      }
    }
  };

  const handleGenerateKanbanPlan = async () => {
    if (!activeGoal) return;
    setGeneratingRoadmap(true);
    setKanbanPhases(null);

    try {
      const response = await fetch("/api/ai/plan-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          goalName: activeGoal.name,
          objective: activeGoal.objective
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setKanbanPhases(data.phases);

      // Injecting generated phases as actual goal milestones to persist
      const newMilestones = data.phases.map((ph: any, idx: number) => ({
        id: `m-gen-${Date.now()}-${idx}`,
        name: `[${ph.stage}] ${ph.title} (${ph.duration}h)`,
        completed: false
      }));

      onUpdateGoal(activeGoal.id, {
        milestones: newMilestones,
        progress: 0,
        prediction: "Sprinting with AI generated Kanban roadmaps"
      });
      if (onShowToast) {
        onShowToast("Strategic milestones parsed & populated into Kanban board!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`AI Goal planner error: ${e.message}`, "error");
      } else {
        console.warn(`AI Goal planner error: ${e.message}`);
      }
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeGoal) return;
    const updatedMilestones = activeGoal.milestones.map((m) => {
      if (m.id === milestoneId) {
        return { ...m, completed: !m.completed };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    onUpdateGoal(activeGoal.id, {
      milestones: updatedMilestones,
      progress
    });
  };

  // Kanban Stage Columns builder
  const standardStages = [
    { key: "Research", label: "1. Research", color: "border-t-sky-500 hover:shadow-sky-500/10" },
    { key: "Design", label: "2. Design", color: "border-t-purple-500 hover:shadow-purple-500/10" },
    { key: "Development", label: "3. Dev", color: "border-t-indigo-500 hover:shadow-indigo-500/10" },
    { key: "Testing", label: "4. Testing", color: "border-t-yellow-500 hover:shadow-yellow-500/10" },
    { key: "Deployment", label: "5. Deploy", color: "border-t-emerald-500 hover:shadow-emerald-500/10" },
    { key: "Presentation", label: "6. Pitch", color: "border-t-rose-500 hover:shadow-rose-500/10" }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">AI Goal Planner</h1>
        <p className="text-slate-400 text-sm mt-1">
          Plan long-term metrics and automatically generate broken-down 6-stage roadmaps using Autonomic Coprocessor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Goals drawer/selector */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Core Objectives</h3>
            
            <div className="space-y-2">
              {goals.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No active goals registered yet.</p>
              ) : (
                goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { setActiveGoalId(g.id); setKanbanPhases(null); }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeGoalId === g.id 
                        ? "bg-slate-800/80 border-blue-500 shadow shadow-blue-500/10 text-white" 
                        : "bg-slate-900/30 border-slate-850 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-sm block truncate pr-2">{g.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 bg-slate-900/60 font-mono text-slate-400">
                        {g.category}
                      </span>
                    </div>
                    {/* Progress Slider bar */}
                    <div className="mt-2.5 flex items-center space-x-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full text-xs" style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{g.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Create Goal Form */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Launch New Goal Target</h3>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Goal Title</label>
                <input 
                  id="goal-form-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Learn React state structures"
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Core Objective</label>
                <input 
                  id="goal-form-objective"
                  type="text" 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What is validation success?"
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  id="goal-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="personal">Personal Development</option>
                  <option value="startup">Startup Launch</option>
                  <option value="learning">Continuous Learning</option>
                  <option value="health">Physical Health</option>
                  <option value="career">Career Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Initial Milestones (1 / line)</label>
                <textarea 
                  id="goal-form-milestones"
                  value={draftMilestones}
                  onChange={(e) => setDraftMilestones(e.target.value)}
                  placeholder="Understand basic useState&#10;Incorporate state context&#10;Build custom hooks"
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50 h-16 resize-none"
                />
              </div>

              <button
                id="btn-submit-goal"
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                Track Core Objective
              </button>
            </form>
          </div>
        </div>

        {/* Right Active Goal Detail & Kanban Display - 3 Columns */}
        <div className="lg:col-span-3 space-y-6">
          {activeGoal ? (
            <div className="space-y-6">
              {/* Active Goal Header */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{activeGoal.category} Milestone tracker</span>
                    <h2 className="text-2xl font-black text-white mt-1">{activeGoal.name}</h2>
                    {activeGoal.objective && (
                      <p className="text-sm text-slate-400 mt-2 italic">" {activeGoal.objective} "</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-stretch sm:self-auto">
                    <button
                      id="btn-generate-ai-kanban"
                      onClick={handleGenerateKanbanPlan}
                      disabled={generatingRoadmap}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{generatingRoadmap ? "Breaking down goal..." : "Generate AI Kanban"}</span>
                    </button>
                    <button
                      id="btn-delete-goal-active"
                      onClick={() => { onDeleteGoal(activeGoal.id); setActiveGoalId(null); }}
                      className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs font-mono">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block">Milestones count:</span>
                      <span className="text-white font-bold">{activeGoal.milestones.length} active</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block">Progress Rating:</span>
                      <span className="text-white font-bold">{activeGoal.progress}% completed</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block">Completion Predict:</span>
                      <span className="text-indigo-300 font-bold max-w-full truncate block" title={activeGoal.prediction}>{activeGoal.prediction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kanban visual Board */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">6-Phase AI Kanban Roadmap</h3>
                  <span className="text-[10px] font-mono text-slate-500">Left-to-right sequencing</span>
                </div>

                {/* Columns Scroll view container */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4 max-w-full">
                  {standardStages.map((stage, sIdx) => {
                    // Try to extract milestone matches
                    const matchingMilestones = activeGoal.milestones.filter((m) => 
                      m.name.toUpperCase().includes(`[${stage.key.toUpperCase()}]`) ||
                      m.name.toUpperCase().includes(stage.key.toUpperCase()) ||
                      (sIdx === 0 && !m.name.includes("[")) // default unmatched to first slot
                    );

                    return (
                      <div 
                        key={stage.key}
                        className={`bg-slate-900/60 p-3 rounded-2xl border-t-4 border-slate-800 ${stage.color} min-h-[220px] transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-300 block mb-2 tracking-wide truncate">
                            {stage.label}
                          </span>

                          <div className="space-y-2 mt-2">
                            {matchingMilestones.length === 0 ? (
                              <div className="py-8 text-center text-[10px] text-slate-600 italic">
                                Ready to analyze
                              </div>
                            ) : (
                              matchingMilestones.map((m) => (
                                <div 
                                  key={m.id}
                                  onClick={() => handleToggleMilestone(m.id)}
                                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                    m.completed 
                                      ? "bg-blue-950/10 border-blue-900/40 text-slate-500 line-through" 
                                      : "bg-slate-800/40 border-slate-800 text-slate-200 hover:border-slate-700/80"
                                  }`}
                                >
                                  <span className="text-[11px] font-medium leading-snug block">
                                    {m.name.replace(`[${stage.key}]`, "").trim()}
                                  </span>
                                  <div className="flex items-center space-x-1.5 mt-2 justify-between">
                                    <span className="text-[9px] font-mono text-slate-500">Click toggle</span>
                                    <span className={`w-2 h-2 rounded-full ${m.completed ? "bg-blue-500" : "bg-slate-700"}`} />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {matchingMilestones.length > 0 && (
                          <div className="mt-4 pt-2 border-t border-slate-800/40 flex justify-between items-center text-[9px] font-mono text-slate-500">
                            <span>Completes:</span>
                            <span>{matchingMilestones.filter(m => m.completed).length} / {matchingMilestones.length}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones checklists backup */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center space-x-1.5">
                  <ListTodo className="w-5 h-5 text-blue-400" />
                  <span>Objective Milestone Checklist</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeGoal.milestones.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                        m.completed 
                          ? "bg-slate-900/60 border-slate-800/40 text-slate-500" 
                          : "bg-slate-900/20 border-slate-800 text-slate-200 hover:border-slate-700/80"
                      }`}
                    >
                      <button
                        className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          m.completed ? "bg-blue-600 border-blue-500 text-white" : "border-slate-600"
                        }`}
                      >
                        {m.completed && <CheckSquare className="w-3 h-3" />}
                      </button>
                      <span className={`text-xs ${m.completed ? "line-through text-slate-600" : "font-semibold text-slate-300"}`}>
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center glass-panel p-8 rounded-2xl border border-slate-800">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400">No active goals focused</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                Select an existing objective from the left drawer or configure a new roadmap strategy to active the AI sequence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
