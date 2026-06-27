import React, { useState } from "react";
import { Plus, Trash2, Check, Sparkles, Trophy, Award, Activity, Flame } from "lucide-react";
import { Habit } from "../types";

interface HabitsTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onUpdateHabit: (id: string, updates: any) => void;
  onToggleHabitDay: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  token: string;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function HabitsTracker({ habits, onAddHabit, onUpdateHabit, onToggleHabitDay, onDeleteHabit, token, onShowToast }: HabitsTrackerProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("productivity");
  const [adding, setAdding] = useState(false);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setAdding(true);
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, category })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onAddHabit(data.habit);
      setName("");
      if (onShowToast) {
        onShowToast("New behavioral feedback loop is initialized in database!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Failed to save habit: ${e.message}`, "error");
      } else {
        console.warn(`Failed to save habit: ${e.message}`);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggleCheck = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Invoke parent component update callback
      onToggleHabitDay(habitId);
      if (onShowToast) {
        onShowToast("Habit consistency logs checked off!", "success");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Toggle failed: ${e.message}`, "error");
      } else {
        console.warn(`Toggle failed: ${e.message}`);
      }
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Neural Habits Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">
          Lock in essential daily habits, check in routines, and monitor consistency streak stability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Create Habit Form & Medal list */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">Establish Routine</h3>
            
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Habit Title</label>
                <input 
                  id="habit-form-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cardio run / 30m code"
                  className="w-full bg-[#0F172A] border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                <select
                  id="habit-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="productivity">Productivity Blocks</option>
                  <option value="health">Physical Health</option>
                  <option value="learning">Skill Acquisition</option>
                  <option value="mindset">Mindful Focus</option>
                </select>
              </div>

              <button
                id="btn-submit-habit"
                type="submit"
                disabled={adding}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                {adding ? "Deploying..." : "Engage Neural Path"}
              </button>
            </form>
          </div>

          {/* Trophy list */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-sm font-extrabold text-white">Daily Streak Reward</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Maintain a 7+ day consecutive streak on any focus block to unlock the special +10 focus booster status.
            </p>
          </div>
        </div>

        {/* Right Columns: Habits Grid and Checkers */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-md font-bold text-white border-b border-slate-800 pb-4 mb-6">Routine Check-in Board</h3>

            <div className="space-y-4">
              {habits.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No neural habits found. Launch an everyday routine block!</p>
              ) : (
                habits.map((habit) => {
                  const todayChecked = habit.performance[habit.performance.length - 1];
                  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

                  return (
                    <div 
                      key={habit.id}
                      className="p-4 bg-slate-900/35 rounded-2xl border border-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:border-slate-800"
                    >
                      {/* Left: Streak icon, text */}
                      <div className="flex items-center space-x-3.5 max-w-md">
                        <button
                          onClick={() => handleToggleCheck(habit.id)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                            todayChecked
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow shadow-emerald-500/10"
                              : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                          }`}
                          title="Click to toggle check today"
                        >
                          <Check className="w-5 h-5" />
                        </button>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-200 text-sm">{habit.name}</span>
                            <span className="text-[10px] font-mono text-slate-500 capitalize bg-[#0F172A] border border-slate-850 px-1.5 py-0.5 rounded">
                              {habit.category}
                            </span>
                          </div>

                          {/* Streak Flame representation */}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-yellow-400 font-bold flex items-center space-x-1">
                              <Flame className="w-4 h-4 shrink-0 fill-current text-orange-500" />
                              <span>{habit.streak} day streak</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Consistency: <span className="text-cyan-400 font-bold">{habit.consistency}%</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Dot Performance sequence, delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-850">
                        {/* 7 Days performance dots */}
                        <div className="flex items-center space-x-1.5">
                          {habit.performance.map((checked, pIdx) => (
                            <div 
                              key={pIdx} 
                              className="text-center"
                              title={checked ? "Completed habit block" : "Skipped habit mark"}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                                checked 
                                  ? "bg-emerald-500 shadow shadow-emerald-500/20" 
                                  : "bg-slate-800"
                              }`} />
                              <span className="text-[9px] text-slate-600 font-bold mt-1 block">
                                {weekdays[pIdx]}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Trash */}
                        <button
                          onClick={() => onDeleteHabit(habit.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete habit metric log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
