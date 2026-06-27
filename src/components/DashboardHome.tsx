import React, { useState, useEffect } from "react";
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  RefreshCw, 
  Sparkles, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Task, ScheduleItem } from "../types";
import NeuroPilotLogo from "./NeuroPilotLogo";


interface DashboardHomeProps {
  tasks: Task[];
  onToggleTask: (taskId: string, currentStatus: "todo" | "inprogress" | "completed") => void;
  scheduleItems: ScheduleItem[];
  user: any;
  onNavigateToTab: (tab: string) => void;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  simulationState?: any;
}

export default function DashboardHome({ tasks, onToggleTask, scheduleItems, user, onNavigateToTab, onShowToast, simulationState }: DashboardHomeProps) {
  // Focus Timer States
  const [timerMode, setTimerMode] = useState<"work" | "short" | "long">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(145);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      // Completed, reward user
      if (timerMode === "work") {
        setTodayFocusMinutes((prev) => prev + 25);
        if (onShowToast) {
          onShowToast("🔒 Deep Work Block completed successfully! Focus score boosted.", "success");
        } else {
          console.log("🔒 Deep Work Block completed successfully! Daily focus time incremented.");
        }
      } else {
        if (onShowToast) {
          onShowToast("☕ Rest block completed. Ready to optimize your next project milestone?", "info");
        } else {
          console.log("☕ Rest block completed. Prepare your next focus sprint.");
        }
      }
      resetTimer();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, timerMode, onShowToast]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMode === "work" ? 25 * 60 : timerMode === "short" ? 5 * 60 : 15 * 60);
  };

  const handleModeChange = (mode: "work" | "short" | "long") => {
    setTimerMode(mode);
    setTimerRunning(false);
    setTimeLeft(mode === "work" ? 25 * 60 : mode === "short" ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculations for scores
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  // Custom Dynamic productivity score
  const calculatedProductivity = Math.min(100, Math.round((completionRate * 0.6) + (todayFocusMinutes / (user?.profile?.dailyFocusTarget || 240) * 40)));
  const productivityScore = simulationState?.isActive
    ? Math.max(12, Math.round(100 - simulationState.fatigueOverride - (simulationState.scopeCreepOverride * 0.2)))
    : calculatedProductivity;

  // Mock charts trend data
  const chartData = [
    { day: "Mon", focus: 90, target: 120 },
    { day: "Tue", focus: 155, target: 120 },
    { day: "Wed", focus: 180, target: 120 },
    { day: "Thu", focus: 210, target: 120 },
    { day: "Fri", focus: simulationState?.isActive ? Math.max(15, todayFocusMinutes - Math.round(simulationState.fatigueOverride * 0.8)) : todayFocusMinutes, target: 120 },
    { day: "Sat", focus: 45, target: 90 },
    { day: "Sun", focus: 20, target: 90 },
  ];

  // Dynamically generated AI suggestions helper
  const getAISuggestions = () => {
    const suggestions = [];

    if (simulationState?.isActive) {
      if (simulationState.fatigueOverride >= 70) {
        suggestions.push({
          id: "s_sim_fatigue",
          priority: "high",
          text: `🚨 High Biometric Alert: Simulated fatigue index is at ${simulationState.fatigueOverride}%. Cease high-intensity deliverables; we recommend an immediate 15-minute rest block.`
        });
      }
      if (simulationState.scopeCreepOverride >= 70) {
        suggestions.push({
          id: "s_sim_scope",
          priority: "high",
          text: `⚡ Simulated Scope Creep alert: Roadmap scope drift is at +${simulationState.scopeCreepOverride}%. Run Autonomic Schedule Repair to heal colliding timeline buffers.`
        });
      }
    }

    if (pendingTasks.length === 0) {
      if (suggestions.length === 0) {
        return [
          { id: "s1", priority: "low", text: "Outstanding achievement! You have cleared all pending task queues. Schedule next milestones." },
          { id: "s2", priority: "info", text: "Take a deep breath cycle to lower focus stress scores." }
        ];
      }
      return suggestions;
    }
    const urgentTask = pendingTasks.find((t) => t.priorityScore > 85);
    const highRiskTask = pendingTasks.find((t) => t.riskScore > 70);

    if (urgentTask) {
      suggestions.push({
        id: "s_urg",
        priority: "high",
        text: `Urgent priority bottleneck: Work on "${urgentTask.name}" first. This single action resolves ${urgentTask.priorityScore}% of daily schedule pressure.`
      });
    }

    if (highRiskTask) {
      suggestions.push({
        id: "s_risk",
        priority: "medium",
        text: `Overdue Warning: "${highRiskTask.name}" has ${highRiskTask.riskScore}% failure risk due to high complexity and immediate deadline bounds.`
      });
    }

    suggestions.push({
      id: "s_hab",
      priority: "info",
      text: "Starting your Deep Work block now increases your streak performance score by +15%."
    });

    return suggestions;
  };

  const aiSuggestions = getAISuggestions();

  // Weekly Calendar View Days Builder
  const getWeeklyDays = () => {
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    for (let i = -2; i <= 4; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push({
        name: weekdays[d.getDay()],
        num: d.getDate(),
        isToday: i === 0,
        hasEvents: i >= 0
      });
    }
    return days;
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-850/50 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <NeuroPilotLogo className="w-10 h-10" iconClassName="w-5 h-5" />
            <span>Welcome, {user?.name || "Loki Editor"}</span>
            <span className="text-xl">🚀</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            NeuroPilot has calculated 3 key schedule optimization opportunities for you today.
          </p>
        </div>

        <div className="flex space-x-3">
          <button 
            id="btn-nav-to-repair"
            onClick={() => onNavigateToTab("schedule")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 hover:from-blue-600/30 hover:to-cyan-500/20 text-cyan-300 rounded-lg text-sm font-semibold border border-cyan-500/20 transition-all flex items-center space-x-1"
          >
            <Brain className="w-4 h-4" />
            <span>Generate Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Stats Bento-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Productivity Score */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Cognitive Score</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold text-white">{productivityScore}</span>
              <span className="text-xs text-blue-400 font-mono">/ 100</span>
            </div>
            {/* Visual Indicator Progress bar */}
            <div className="w-full bg-slate-830 rounded-full h-1.5 mt-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" 
                style={{ width: `${productivityScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Current focus consistency is calculated at <span className="text-emerald-400 font-semibold">{completionRate}% completion rate</span>
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">Task Completion</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-white">{completionRate}%</span>
            <div className="text-xs text-slate-400 mt-3 flex items-center space-x-1">
              <span className="text-emerald-400 font-bold">{completedTasks.length} Done</span>
              <span>—</span>
              <span className="text-slate-400">{pendingTasks.length} Pending</span>
            </div>
          </div>
        </div>

        {/* Focus Timer Mini Progress */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Today's Focus Time</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-white">{todayFocusMinutes} <span className="text-xs text-slate-500 font-normal">mins</span></span>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-3">
              <div 
                className="bg-cyan-400 h-1 rounded-full" 
                style={{ width: `${Math.min(100, (todayFocusMinutes / (user?.profile?.dailyFocusTarget || 240)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Target goal: {user?.profile?.dailyFocusTarget || 240} mins / day
            </p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">Routine Consistency</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-extrabold text-white">88%</span>
            <p className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center space-x-1">
              <span>Stable Core Streaks (+12%)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Splites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Column Section: Today's Priorities + Recharts Trend Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recharts Analytics Area Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Productivity Trend Graph</h3>
                <p className="text-xs text-slate-400">Comparing focus durations against daily target expectations</p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span className="text-slate-400 mr-2">Focus Time</span>
                <span className="inline-block w-2.5 h-2.5 bg-slate-700 rounded-full" />
                <span className="text-slate-400">Target Bounds</span>
              </div>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="#3b82f6" fillOpacity={0.15} fill="url(#colorFocus)" strokeWidth={2.5} />
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Today's Prioritized Tasks</h3>
                <p className="text-xs text-slate-400">Intelligently organized by urgency vectors</p>
              </div>
              <button 
                id="btn-go-to-tasks"
                onClick={() => onNavigateToTab("tasks")}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-0.5"
              >
                <span>Manage Lists</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                  <p>All tasks completed for today! 🎉</p>
                  <button 
                    onClick={() => onNavigateToTab("tasks")} 
                    className="text-xs text-blue-400 hover:underline mt-2"
                  >
                    Add new challenges
                  </button>
                </div>
              ) : (
                pendingTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 hover:border-slate-700/50 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 max-w-[70%]">
                      <button
                        onClick={() => onToggleTask(task.id, task.status)}
                        className="w-5 h-5 rounded border border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 flex items-center justify-center transition-all shrink-0"
                      >
                        <div className="w-2.5 h-2.5 bg-transparent rounded" />
                      </button>
                      <div className="truncate">
                        <span className="text-slate-200 text-sm font-semibold truncate block">
                          {task.name}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                            task.importance === "high" ? "bg-red-500/10 text-red-400" :
                            task.importance === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-blue-500/10 text-blue-400"
                          }`}>
                            {task.importance.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{task.estimatedTime}hrs estimated</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-semibold text-slate-400 block">
                        Priority: <span className="text-blue-400">{task.priorityScore}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        Risk: <span className={task.riskScore > 65 ? "text-red-400 font-bold" : "text-slate-500"}>{task.riskScore}%</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column Section: Focus Timer + AI Recs Panel + Weekly calendar */}
        <div className="space-y-6">
          {/* Pomodoro Focus Timer */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 flex space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </div>

            <h3 className="text-md font-bold text-slate-200 uppercase tracking-widest mb-4">Focus Core Module</h3>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#0F172A] p-1 rounded-lg text-xs font-semibold mb-6">
              <button 
                onClick={() => handleModeChange("work")}
                className={`py-1.5 rounded-md transition-all ${timerMode === "work" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                Focus
              </button>
              <button 
                onClick={() => handleModeChange("short")}
                className={`py-1.5 rounded-md transition-all ${timerMode === "short" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                Short block
              </button>
              <button 
                onClick={() => handleModeChange("long")}
                className={`py-1.5 rounded-md transition-all ${timerMode === "long" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                Quiet gap
              </button>
            </div>

            {/* Display time */}
            <div className="text-5xl font-mono font-extrabold tracking-tight text-white mb-6">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center space-x-3">
              {timerRunning ? (
                <button 
                  id="btn-pause-timer"
                  onClick={pauseTimer}
                  className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button 
                  id="btn-start-timer"
                  onClick={startTimer}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1"
                >
                  <Play className="w-4 h-4 mr-0.5" />
                  <span>Sprint</span>
                </button>
              )}
              <button 
                id="btn-reset-timer"
                onClick={resetTimer}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-[#1E293B]/60 to-[#0F172A]/80">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">AI Recommendations</h3>
            </div>

            <div className="space-y-4">
              {aiSuggestions.map((s) => (
                <div 
                  key={s.id} 
                  className={`p-3.5 text-xs rounded-xl border leading-relaxed flex items-start space-x-2.5 ${
                    s.priority === "high" ? "bg-red-500/5 border-red-500/10 text-red-300" :
                    s.priority === "medium" ? "bg-yellow-500/5 border-yellow-500/10 text-yellow-300" :
                    "bg-[#0F172A] border-slate-800 text-slate-300"
                  }`}
                >
                  {s.priority === "high" && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Calendar Horizontal Row */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-300 mb-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Pilot Calendar</span>
            </div>

            <div className="flex justify-between items-center text-center">
              {getWeeklyDays().map((day, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded-xl text-xs w-9 transition-all cursor-pointer ${
                    day.isToday ? "bg-blue-600 text-white font-bold" : "hover:bg-slate-800/60 text-slate-400"
                  }`}
                >
                  <span className="block text-[10px] opacity-70 mb-0.5">{day.name}</span>
                  <span className="text-sm font-semibold block">{day.num}</span>
                  {day.hasEvents && (
                    <span className="inline-block w-1 h-1 bg-cyan-400 rounded-full mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
