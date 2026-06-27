import React, { useState } from "react";
import { Sparkles, Calendar, Clock, AlertTriangle, ArrowDown, ArrowUp, RefreshCw, CheckCircle, Eye, CornerDownRight, Brain, Plus, Trash2, Edit2, Check, X, Activity, ChevronRight } from "lucide-react";
import { ScheduleItem } from "../types";

interface ScheduleGeneratorProps {
  scheduleItems: ScheduleItem[];
  onGenerateNewSchedule: (items: ScheduleItem[]) => void;
  onUpdateScheduleItems: (items: ScheduleItem[]) => void;
  token: string;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  simulationState?: any;
}

export default function ScheduleGenerator({ scheduleItems, onGenerateNewSchedule, onUpdateScheduleItems, token, onShowToast, simulationState }: ScheduleGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [repairExplanation, setRepairExplanation] = useState<string | null>(null);
  
  // Before and After view for scheduling repairs
  const [beforeItems, setBeforeItems] = useState<ScheduleItem[] | null>(null);

  // Manual Custom Scheduling States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newCategory, setNewCategory] = useState<"focus" | "task" | "break" | "habit">("task");

  // Editing Item Details Space
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Adaptive Cognitive Pattern States
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    observations: string[];
    adjustments: string[];
    recommendedBlocks: ScheduleItem[];
  } | null>(null);

  // Recalibrate start/end times sequentially starting from 09:00 AM daily
  const recalibrateTimelineTimes = (itemsList: ScheduleItem[]) => {
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0); // start daily baseline Clock at 09:00 AM

    return itemsList.map((item) => {
      const hours = currentTime.getHours();
      const mins = currentTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      const displayMins = mins.toString().padStart(2, "0");
      
      const revisedTime = `${displayHours.toString().padStart(2, "0")}:${displayMins} ${ampm}`;
      
      currentTime.setMinutes(currentTime.getMinutes() + item.duration);

      return {
        ...item,
        time: revisedTime
      };
    });
  };

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    setRepairExplanation(null);
    setBeforeItems(null);

    try {
      const response = await fetch("/api/ai/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onGenerateNewSchedule(data.items);
      if (onShowToast) {
        onShowToast("Autonomic schedule timeline optimized completed successfully!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Schedule builder failed: ${e.message}`, "error");
      } else {
        console.warn(`Schedule builder failed: ${e.message}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleTriggerRepair = async (missedItemLabel: string) => {
    setRepairing(true);
    setRepairExplanation(null);
    setBeforeItems([...scheduleItems]); // Save current state for before and after display

    try {
      const response = await fetch("/api/ai/repair-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ missedTaskLabel: missedItemLabel })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setRepairExplanation(data.explanation);
      onUpdateScheduleItems(data.repairedItems);
      if (onShowToast) {
        onShowToast("Coprocessor successfully repaired calendar schedule!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`AI Repair error: ${e.message}`, "error");
      } else {
        console.warn(`AI Repair error: ${e.message}`);
      }
    } finally {
      setRepairing(false);
    }
  };

  const handleRunAdaptiveAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/ai/analyze-and-adapt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAnalysisResult({
        observations: data.observations || [],
        adjustments: data.adjustments || [],
        recommendedBlocks: data.recommendedBlocks || []
      });

      if (onShowToast) {
        onShowToast("AI Adaptation completed multi-day work pattern learning!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Cognitive analysis failed: ${e.message}`, "error");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyAdaptivePlan = () => {
    if (!analysisResult) return;
    const recalibrated = recalibrateTimelineTimes(analysisResult.recommendedBlocks);
    onUpdateScheduleItems(recalibrated);
    setAnalysisResult(null);
    if (onShowToast) {
      onShowToast("Adaptive cognitive plan is now active on your daily timeline!", "success");
    }
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: ScheduleItem = {
      id: `si-manual-${Date.now()}`,
      time: "09:00 AM", // Recalibrated on next line
      label: newLabel,
      duration: Number(newDuration),
      category: newCategory,
      status: "pending"
    };

    const updatedList = [...scheduleItems, newItem];
    const recalibratedList = recalibrateTimelineTimes(updatedList);
    
    onUpdateScheduleItems(recalibratedList);
    setNewLabel("");
    setShowAddForm(false);

    if (onShowToast) {
      onShowToast("Custom schedule item added successfully!", "success");
    }
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.label.trim()) return;

    const updatedList = scheduleItems.map((it) => {
      if (it.id === editingItem.id) {
        return editingItem;
      }
      return it;
    });

    const recalibratedList = recalibrateTimelineTimes(updatedList);
    onUpdateScheduleItems(recalibratedList);
    setEditingItem(null);

    if (onShowToast) {
      onShowToast("Schedule item modified successfully!", "success");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedList = scheduleItems.filter(it => it.id !== itemId);
    const recalibratedList = recalibrateTimelineTimes(updatedList);
    onUpdateScheduleItems(recalibratedList);
    setEditingItem(null);
    if (onShowToast) {
      onShowToast("Removed schedule slot", "info");
    }
  };

  // Up/Down index shifting to emulate dynamic drag-and-drop
  const handleShiftItem = (index: number, direction: "up" | "down") => {
    const updated = [...scheduleItems];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    // Check bounds
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const adjusted = recalibrateTimelineTimes(updated);
    onUpdateScheduleItems(adjusted);
  };

  const handleToggleComplete = (itemId: string) => {
    const updated = scheduleItems.map((it) => {
      if (it.id === itemId) {
        return { ...it, status: it.status === "completed" ? "pending" : "completed" as any };
      }
      return it;
    });
    onUpdateScheduleItems(updated);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            <span>Dynamic Scheduler & Repair</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Construct synchronized daily agendas, build custom/AI slots, and run multi-day cognitive pattern analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-trigger-ai-schedule-gen"
            onClick={handleGenerateSchedule}
            disabled={generating}
            className="bg-[#0F172A] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow"
            title="Generate custom AI schedule from pending tasks and habits"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{generating ? "Calibrating..." : "Generate baseline Agenda"}</span>
          </button>

          <button
            id="btn-run-adaptive-analysis"
            onClick={handleRunAdaptiveAnalysis}
            disabled={analyzing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow"
            title="Analyze multi-day status tracking data to adapt future planner slots"
          >
            <Brain className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>{analyzing ? "Analyzing Daily Work..." : "AI Adaptive Analysis & Plan"}</span>
          </button>
        </div>
      </div>

      {simulationState?.isActive && (
        <div className="p-5 rounded-2xl border border-red-500/30 bg-red-950/20 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-sm font-extrabold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>SIMULATED CALENDAR COLLISION IN PROGRESS</span>
            </h4>
            <p className="text-xs text-slate-300">
              Biometrics indicate <strong>{simulationState.fatigueOverride}% fatigue</strong> combined with <strong>{simulationState.scopeCreepOverride}% scope drift</strong>. Overlapping slots detected in today's focus blocks. Use our Autonomic Repair engine to heal this timeline automatically!
            </p>
          </div>
          <button
            onClick={() => {
              if (scheduleItems.length > 0) {
                handleTriggerRepair(scheduleItems[0].label);
              } else {
                handleGenerateSchedule();
              }
            }}
            className="px-4 py-2 bg-red-650 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-500/10 shrink-0"
          >
            Run Autonomic Repair
          </button>
        </div>
      )}

      {/* MULTI-DAY COGNITIVE ANALYSIS RESULT EXPLANATORY TAB */}
      {analysisResult && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-[#1E1B4B]/80 to-[#0F172A]/90 animate-fadeIn relative">
          <button 
            onClick={() => setAnalysisResult(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all"
            title="Close analysis report"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-indigo-400 mb-4">
            <Activity className="w-5 h-5" />
            <h3 className="text-md font-extrabold tracking-tight text-white uppercase">AI Cognitive Work Pattern Assessment Report</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observations (Learned Habits)</h4>
              <ul className="space-y-2">
                {analysisResult.observations.map((obs, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-indigo-400 mt-1 shrink-0">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Adaptive Adjustments Engineered</h4>
              <ul className="space-y-2">
                {analysisResult.adjustments.map((adj, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-400 mt-1 shrink-0">✓</span>
                    <span>{adj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-indigo-900/30 pt-4">
            <h4 className="text-xs font-mono text-indigo-300 uppercase tracking-widest mb-3">Proposed Daily Template Blueprint Preview:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {analysisResult.recommendedBlocks.map((block, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-slate-950/60 rounded-lg text-[11px] border border-slate-800">
                  <span className="text-slate-500 font-mono mr-1.5">{block.time}</span>
                  <span className="text-slate-200 font-medium">{block.label}</span>
                  <span className="text-[9px] uppercase font-mono ml-2 text-indigo-400 bg-indigo-950/40 px-1 py-0.5 rounded">
                    {block.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 leading-normal">
                Ready to calibrate your live timeline model to fit these exact cognitive adaptations?
              </p>
              
              <button 
                onClick={handleApplyAdaptivePlan}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply & Re-Schedule Accordingly</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Logs explanation banner */}
      {repairExplanation && (
        <div id="repair-explanation-card" className="glass-panel p-5 rounded-2xl border-2 border-cyan-500 bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 animate-fadeIn relative">
          <span className="absolute top-4 right-4 text-[9px] text-cyan-300 font-mono tracking-wider bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded">
            CALIBRATOR EXECUTED SUCCESSFULLY
          </span>
          <h3 className="text-sm font-extrabold text-white mb-2 flex items-center space-x-1.5">
            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>NeuroPilot AI Dynamic Repair Log</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {repairExplanation}
          </p>
        </div>
      )}

      {/* Before and After comparative splits */}
      {beforeItems && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* Before */}
          <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-4">Agenda Before repair run:</span>
            <div className="space-y-2 opacity-50">
              {beforeItems.map((it) => (
                <div key={it.id} className="p-3 bg-slate-950 text-slate-400 border border-slate-800 text-xs rounded-xl flex justify-between">
                  <span>{it.time} • {it.label}</span>
                  <span className="text-[10px] uppercase font-mono">{it.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-cyan-900/20">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-4">Agenda After repair run:</span>
            <div className="space-y-2">
              {scheduleItems.map((it) => (
                <div key={it.id} className="p-3 bg-slate-950/80 text-white border border-slate-850 text-xs rounded-xl flex justify-between">
                  <span>{it.time} • {it.label}</span>
                  <span className={`text-[10px] uppercase font-mono font-bold ${it.status === "rescheduled" ? "text-cyan-400" : "text-slate-400"}`}>
                    {it.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Schedule Timeline view */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-md font-bold text-white">Daily Timeline ({scheduleItems.length} slots)</h3>
            <p className="text-xs text-slate-400">Order sequentially by arrow keys, edit any custom details or click Missed to repair</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3  py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-705 text-xs text-slate-200 font-bold rounded-xl transition-all flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>{showAddForm ? "Close Form" : "Add Custom Slot"}</span>
            </button>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">Starts 09:00 AM</span>
          </div>
        </div>

        {/* MANUAL SCHEDULING FORM */}
        {showAddForm && (
          <form onSubmit={handleAddCustomItem} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-1.5 text-slate-100 text-xs font-bold border-b border-slate-850 pb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Configure Custom Schedule Block Object</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Block Title Label / Description</label>
                <input 
                  type="text" 
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Design Roadmap Audit or Client Prep"
                  className="w-full bg-[#0F172A] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Block Duration (minutes)</label>
                <select 
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-[#0F172A] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 hour (60m)</option>
                  <option value={90}>1.5 hours (90m)</option>
                  <option value={120}>2 hours (120m)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Category Code</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="focus">Focus Block</option>
                  <option value="task">Operational Task</option>
                  <option value="habit">Habit Routine</option>
                  <option value="break">Break / Energy Restore</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
              >
                Add Slot to Schedule
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {scheduleItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              No schedule blocks populated. Generate baseline or add customized slots.
            </div>
          ) : (
            scheduleItems.map((item, idx) => {
              const isEditing = editingItem?.id === item.id;

              if (isEditing) {
                return (
                  <form 
                    key={item.id} 
                    onSubmit={handleSaveEditItem}
                    className="p-4 bg-slate-950 rounded-2xl border border-blue-900/40 space-y-4 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="text-[11px] text-blue-400 font-mono uppercase">Editing Schedule Slot ID: {item.id}</span>
                      <button 
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Label text</label>
                        <input 
                          type="text"
                          value={editingItem.label}
                          onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                          className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Duration (min)</label>
                        <select 
                          value={editingItem.duration}
                          onChange={(e) => setEditingItem({ ...editingItem, duration: Number(e.target.value) })}
                          className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                        >
                          <option value={15}>15m</option>
                          <option value={30}>30m</option>
                          <option value={45}>45m</option>
                          <option value={60}>60m (1hr)</option>
                          <option value={90}>90m</option>
                          <option value={120}>120m</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Category</label>
                        <select 
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                          className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                        >
                          <option value="focus">Focus</option>
                          <option value="task">Task</option>
                          <option value="habit">Habit</option>
                          <option value="break">Break</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-all text-xs flex items-center space-x-1"
                        title="Delete slot entirely"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Slot</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1.5 bg-slate-850 text-slate-300 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                );
              }

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all ${
                    item.status === "completed" 
                      ? "bg-slate-950 border-slate-900 text-slate-500" 
                      : item.status === "rescheduled"
                      ? "bg-cyan-950/5 border-cyan-900/20 text-slate-200"
                      : "bg-slate-900/35 border-slate-800 hover:border-slate-700/60 text-slate-200"
                  }`}
                >
                  {/* Item meta */}
                  <div className="flex items-start space-x-4 max-w-[80%]">
                    <div className="px-3 py-1.5 bg-[#0F172A] rounded-xl border border-slate-850 shrink-0 text-center text-xs font-mono font-bold text-blue-400">
                      {item.time}
                    </div>

                    <div>
                      <span className={`text-sm font-bold block ${item.status === "completed" ? "line-through text-slate-500" : ""}`}>
                        {item.label}
                      </span>
                      
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1.5 font-mono">
                        <span className="uppercase">{item.category} Block</span>
                        <span>•</span>
                        <span>{item.duration} Min block</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-850">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleShiftItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 px-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-705 disabled:opacity-30 rounded-lg text-slate-400 transition-all"
                        title="Shift slot earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShiftItem(idx, "down")}
                        disabled={idx === scheduleItems.length - 1}
                        className="p-1 px-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-705 disabled:opacity-30 rounded-lg text-slate-400 transition-all"
                        title="Shift slot later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingItem({ ...item })}
                        className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-lg"
                        title="Edit slot details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          item.status === "completed" 
                            ? "bg-slate-850 text-slate-500" 
                            : "bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                        }`}
                      >
                        {item.status === "completed" ? "Completed" : "Mark Done"}
                      </button>

                      {item.status !== "completed" && item.category !== "break" && (
                        <button
                          id={`btn-repair-missed-${idx}`}
                          onClick={() => handleTriggerRepair(item.label)}
                          disabled={repairing}
                          className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/30 text-xs text-red-400 rounded-lg font-bold transition-all flex items-center space-x-1"
                          title="AI Repair: Shunt item and repair schedule structure"
                        >
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Missed</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
