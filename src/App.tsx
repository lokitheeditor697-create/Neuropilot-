import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Grid, 
  Calendar, 
  Flame, 
  ShieldAlert, 
  ListTodo, 
  Settings, 
  MessageSquare, 
  Bell, 
  Sparkles,
  Award,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Task, Goal, Habit, ScheduleItem, Notification, SimulationState } from "./types";

import LandingPage from "./components/LandingPage";
import AuthView from "./components/AuthView";
import NeuroPilotLogo from "./components/NeuroPilotLogo";

import DashboardHome from "./components/DashboardHome";
import TaskPlanner from "./components/TaskPlanner";
import GoalPlanner from "./components/GoalPlanner";
import RiskPredictor from "./components/RiskPredictor";
import ScheduleGenerator from "./components/ScheduleGenerator";
import HabitsTracker from "./components/HabitsTracker";
import SettingsView from "./components/SettingsView";
import AIChatPanel from "./components/AIChatPanel";
import ProductTour from "./components/ProductTour";

export default function App() {
  // Session states
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("neuropilot_token");
    } catch (e) {
      console.warn("localStorage is blocked in this environment:", e);
      return null;
    }
  });
  const [user, setUser] = useState<any>(null);

  // Elite Dynamic Toast State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "warning" | "error" }[]>([]);
  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };
  
  // Navigation states
  const [appMode, setAppMode] = useState<"landing" | "auth" | "workspace">(token ? "workspace" : "landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<string>("dashboard_main");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductTourOpen, setIsProductTourOpen] = useState(false);

  // Workspace simulation states for interactive metrics demo
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    fatigueOverride: 50,
    scopeCreepOverride: 40,
    meetingLoadOverride: 30,
    slippedMilestoneCount: 0
  });
  const [chatPromptOverride, setChatPromptOverride] = useState<string>("");

  // Synchronized dataset states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Workspace alert flags
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Sync session on mount
  useEffect(() => {
    if (token) {
      syncSession();
    }
  }, [token]);

  const syncSession = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        console.warn("Session expired (401), logging out.");
        handleLogout();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data.user);
      setAppMode("workspace");
      
      // Load entire user data segments
      await loadUserData();
    } catch (e: any) {
      console.warn("Failed to sync session (network issue or server offline):", e);
      // Only log out if it's explicitly an authentication credential failure
      if (e.message && e.message.includes("401")) {
        handleLogout();
      } else {
        showToast("Unable to connect to server. Running in offline mode.", "warning");
      }
    }
  };

  const loadUserData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSegment = async (url: string, setter: (data: any) => void, fallback: any, key: string) => {
      try {
        const res = await fetch(url, { headers });
        if (res.status === 401) {
          console.warn(`Unauthorized on segment: ${url}`);
          return;
        }
        if (!res.ok) {
          console.warn(`Failed to fetch segment ${url}: status ${res.status}`);
          return;
        }
        const data = await res.json();
        setter(data[key] || fallback);
      } catch (err) {
        console.error(`Error loading segment ${url}:`, err);
      }
    };

    try {
      await Promise.all([
        fetchSegment("/api/tasks", setTasks, [], "tasks"),
        fetchSegment("/api/goals", setGoals, [], "goals"),
        fetchSegment("/api/habits", setHabits, [], "habits"),
        fetchSegment("/api/schedules", (data) => setScheduleItems(data?.items || []), null, "schedule"),
        fetchSegment("/api/notifications", setNotifications, [], "notifications")
      ]);
    } catch (err) {
      console.error("Failed to retrieve user workspace data:", err);
    }
  };

  // Auth Callbacks
  const handleAuthSuccess = (newToken: string, activeUser: any) => {
    setToken(newToken);
    setUser(activeUser);
    setAppMode("workspace");
    setActiveTab("dashboard_main");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("neuropilot_token");
      localStorage.removeItem("neuropilot_user");
    } catch (e) {
      console.warn("localStorage removal is blocked:", e);
    }
    setToken(null);
    setUser(null);
    setAppMode("landing");
  };

  // State modification triggers across panels
  const handleAddNewTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      showToast("Workspace task updated successfully!", "success");
    } catch (e: any) {
      showToast(`Status modify failed: ${e.message}`, "error");
    }
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: "todo" | "inprogress" | "completed") => {
    const nextStatus = currentStatus === "completed" ? "todo" : "completed";
    handleUpdateTaskStatus(taskId, { status: nextStatus });
  };

  const handleDeleteTaskObj = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Teardown error");

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast("Task removed from active queues", "info");
    } catch (e: any) {
      showToast(`Clear action failed: ${e.message}`, "error");
    }
  };

  const handleAddNewGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    showToast("New smart target locked!", "success");
  };

  const handleUpdateGoalObj = async (goalId: string, updates: any) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setGoals((prev) => prev.map((g) => (g.id === goalId ? data.goal : g)));
      showToast("Milestone updated in Firestore database", "success");
    } catch (e: any) {
      showToast(`Failed to save milestone shifts: ${e.message}`, "error");
    }
  };

  const handleDeleteGoalObj = async (goalId: string) => {
    try {
      await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      showToast("Target archived and deleted", "info");
    } catch (e) {
      showToast("Failed to delete goal.", "error");
    }
  };

  const handleAddNewHabit = (h: Habit) => {
    setHabits((prev) => [...prev, h]);
  };

  const handleToggleHabitPerformance = (habitId: string) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id === habitId) {
        const p = [...h.performance];
        const statusToday = p[p.length - 1];
        p[p.length - 1] = !statusToday;
        
        let revisedStreak = h.streak;
        if (p[p.length - 1]) {
          revisedStreak += 1;
        } else {
          revisedStreak = Math.max(0, revisedStreak - 1);
        }

        const consistency = Math.round((p.filter(Boolean).length / p.length) * 100);

        return { ...h, performance: p, streak: revisedStreak, consistency };
      }
      return h;
    }));
  };

  const handleDeleteHabitObj = async (habitId: string) => {
    await fetch(`/api/habits/${habitId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Schedule timeline update sync
  const handleUpdateScheduleItemsList = async (items: ScheduleItem[]) => {
    setScheduleItems(items);
    try {
      await fetch("/api/schedules/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: new Date().toISOString().substring(0, 10),
          items
        })
      });
    } catch (e) {
      console.warn("Failed schedule update syncing");
    }
  };

  const handleGenNewItemsSchedule = (items: ScheduleItem[]) => {
    handleUpdateScheduleItemsList(items);
  };

  // Voice Command Event Router callback
  const handleVoiceCommandActions = (command: string) => {
    if (command === "create_task") {
      setActiveTab("tasks_planner");
    } else if (command === "generate_schedule") {
      setActiveTab("schedule_timeline");
    } else if (command === "show_deadlines") {
      setActiveTab("risk_alerts");
    }
  };

  const handleReadAllNotifications = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowNotificationsDropdown(false);
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.warn("Notify error");
    }
  };

  if (appMode === "landing") {
    return (
      <LandingPage 
        onGetStarted={() => { setAuthMode("signup"); setAppMode("auth"); }} 
        onLogin={() => { setAuthMode("login"); setAppMode("auth"); }} 
      />
    );
  }

  if (appMode === "auth") {
    return (
      <AuthView
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onBackToHome={() => setAppMode("landing")}
      />
    );
  }

  // Count unread notifications
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col md:flex-row relative">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-400/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Mobile Sidebar backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Left Sidebar Navigation Drawer */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-[#0B0F19] border-r border-slate-900 flex flex-col shrink-0 z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Brand Banner */}
        <div className="p-6 border-b border-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <NeuroPilotLogo className="w-8 h-8" iconClassName="w-4 h-4" />
            <span className="font-bold text-md text-white tracking-widest font-sans">
              NeuroPilot
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono scale-95 font-bold px-1.5 py-0.5 rounded hidden sm:inline-block">
              Active
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-slate-500 hover:text-white md:hidden"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard_main", label: "Dashboard", icon: Grid },
            { id: "tasks_planner", label: "Task Prioritizer", icon: Clock },
            { id: "goals_kanban", label: "Goal Planner", icon: ListTodo },
            { id: "risk_alerts", label: "Deadline Predictor", icon: ShieldAlert },
            { id: "schedule_timeline", label: "Scheduler & Repair", icon: Calendar },
            { id: "habits_board", label: "Neural Habits", icon: Flame },
            { id: "chat_advisor", label: "AI Advisor Chat", icon: MessageSquare },
            { id: "settings_profile", label: "System settings", icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide capitalize transition-all ${
                  isTabActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/15 font-bold shadow-sm shadow-blue-500/5" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/30 border border-transparent"
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isTabActive ? "text-blue-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile Card Footer details */}
        {user && (
          <div className="p-4 border-t border-slate-900/90 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center space-x-3 truncate">
              <img 
                src={user?.profile?.avatar} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full border border-slate-800 object-cover shrink-0"
              />
              <div className="truncate">
                <span className="font-bold text-xs text-white block truncate">{user?.name}</span>
                <span className="text-[9px] text-slate-500 block truncate">{user?.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-all shrink-0"
              title="Terminate active session tokens"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Toolbar */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-4 sm:px-6 bg-[#0E1322]/30 relative z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 mr-2 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl relative transition-all text-slate-400 hover:text-white md:hidden"
              title="Open Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-[11px] uppercase font-mono tracking-widest text-slate-500 hidden sm:inline-block">NeuroPilot Workspace</span>
            <span className="text-slate-700 font-bold hidden sm:inline-block">/</span>
            <span className="text-xs font-bold text-slate-300 capitalize font-mono">
              {activeTab.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center space-x-3.5 relative">
            {/* Product Tour Button */}
            <button
              id="header-product-tour-btn"
              onClick={() => setIsProductTourOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all hover:brightness-110 active:scale-95"
              title="Explore every menu and feature with our interactive guided walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tour</span>
            </button>

            {/* Notification alert Bell */}
            <button
              id="top-marquee-bell-btn"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700/60 rounded-xl relative transition-all text-slate-400 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer overlay */}
            {showNotificationsDropdown && (
              <div id="notif-dropdown-drawer" className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Productivity Alerts ({unreadNotifCount})</span>
                  <button 
                    onClick={handleReadAllNotifications}
                    className="text-[10px] text-blue-400 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">No warnings currently logged.</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl text-xs border leading-relaxed ${
                          n.read ? "bg-slate-900/30 border-slate-850/50 opacity-60" : "bg-slate-900/60 border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`${n.type === "critical" ? "text-red-400 font-bold" : "text-cyan-300 font-bold"}`}>
                            {n.title}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Display workspace tab render block */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          {activeTab === "dashboard_main" && (
            <DashboardHome 
              user={user}
              tasks={tasks}
              onToggleTask={handleToggleTaskStatus}
              scheduleItems={scheduleItems}
              onNavigateToTab={(tab) => {
                if (tab === "tasks") setActiveTab("tasks_planner");
                if (tab === "schedule") setActiveTab("schedule_timeline");
              }}
              onShowToast={showToast}
              simulationState={simulationState}
            />
          )}

          {activeTab === "tasks_planner" && (
            <TaskPlanner 
              tasks={tasks}
              onAddTask={handleAddNewTask}
              onUpdateTask={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTaskObj}
              token={token || ""}
              onShowToast={showToast}
            />
          )}

          {activeTab === "goals_kanban" && (
            <GoalPlanner 
              goals={goals}
              onAddGoal={handleAddNewGoal}
              onUpdateGoal={handleUpdateGoalObj}
              onDeleteGoal={handleDeleteGoalObj}
              token={token || ""}
              onShowToast={showToast}
            />
          )}

          {activeTab === "risk_alerts" && (
            <RiskPredictor 
              tasks={tasks}
              onNavigateToTab={(tab) => {
                if (tab === "tasks") setActiveTab("tasks_planner");
              }}
              simulationState={simulationState}
            />
          )}

          {activeTab === "schedule_timeline" && (
            <ScheduleGenerator 
              scheduleItems={scheduleItems}
              onGenerateNewSchedule={handleGenNewItemsSchedule}
              onUpdateScheduleItems={handleUpdateScheduleItemsList}
              token={token || ""}
              onShowToast={showToast}
              simulationState={simulationState}
            />
          )}

          {activeTab === "habits_board" && (
            <HabitsTracker 
              habits={habits}
              onAddHabit={handleAddNewHabit}
              onUpdateHabit={handleUpdateGoalObj}
              onToggleHabitDay={handleToggleHabitPerformance}
              onDeleteHabit={handleDeleteHabitObj}
              token={token || ""}
              onShowToast={showToast}
            />
          )}

          {activeTab === "chat_advisor" && (
            <AIChatPanel 
              token={token || ""}
              onVoiceCommandTrigger={handleVoiceCommandActions}
              onShowToast={showToast}
              prefilledPrompt={chatPromptOverride}
              onClearPrefilledPrompt={() => setChatPromptOverride("")}
            />
          )}

          {activeTab === "settings_profile" && (
            <SettingsView 
              user={user}
              token={token || ""}
              onUpdateProfile={(updatedUser) => setUser(updatedUser)}
              onLogout={handleLogout}
              tasks={tasks}
              goals={goals}
              habits={habits}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modern Floating Toasts Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isError = toast.type === "error";
            const isWarn = toast.type === "warning";
            const isInfo = toast.type === "info";
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                className="pointer-events-auto w-full"
              >
                <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 bg-[#0B0F19]/95 ${
                  isError 
                    ? "border-red-500/30 text-red-100 shadow-red-950/20" 
                    : isWarn 
                    ? "border-amber-500/30 text-amber-100 shadow-amber-950/20"
                    : isInfo
                    ? "border-blue-500/30 text-blue-100 shadow-blue-950/20"
                    : "border-emerald-500/30 text-emerald-100 shadow-emerald-950/20"
                }`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isError 
                      ? "bg-red-500/10 text-red-400" 
                      : isWarn 
                      ? "bg-amber-500/10 text-amber-400"
                      : isInfo
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {isError ? (
                      <AlertCircle className="w-4.5 h-4.5" />
                    ) : isWarn ? (
                      <ShieldAlert className="w-4.5 h-4.5" />
                    ) : isInfo ? (
                      <Info className="w-4.5 h-4.5" />
                    ) : (
                      <CheckCircle className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                      Coprocessor status
                    </p>
                    <p className="text-sm text-slate-100 mt-0.5 leading-snug">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Interactive Guided Product Tour overlay */}
      {isProductTourOpen && (
        <ProductTour 
          onClose={() => setIsProductTourOpen(false)}
          onGetStarted={() => setIsProductTourOpen(false)}
        />
      )}

    </div>
  );
}
