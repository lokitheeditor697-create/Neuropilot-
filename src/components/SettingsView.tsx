import React, { useState } from "react";
import { User, Eye, Sparkles, Download, Bell, Volume2, Save, LogOut } from "lucide-react";
import { Task, Goal, Habit } from "../types";

interface SettingsViewProps {
  user: any;
  onUpdateProfile: (updates: any) => void;
  onLogout: () => void;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  token: string;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function SettingsView({ user, onUpdateProfile, onLogout, tasks, goals, habits, token, onShowToast }: SettingsViewProps) {
  // Input fields
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.profile?.avatar || "");
  const [dailyFocusTarget, setDailyFocusTarget] = useState(user?.profile?.dailyFocusTarget || 240);

  // Settings selectors
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  // Avatar choices
  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      if (onShowToast) {
        onShowToast("Image size must be smaller than 1.5 MB.", "warning");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        if (onShowToast) {
          onShowToast("Custom image loaded! Submit the form to save profile settings.", "success");
        }
      }
    };
    reader.onerror = () => {
      if (onShowToast) {
        onShowToast("Failed to read selected image file.", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          avatar,
          dailyFocusTarget
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Invoke parent profile updater callback
      onUpdateProfile(data.user);
      if (onShowToast) {
        onShowToast("🔒 Profile settings successfully updated inside server database!", "success");
      } else {
        console.log("🔒 Profile settings successfully updated inside server database!");
      }
    } catch (e: any) {
      if (onShowToast) {
        onShowToast(`Failed to save profile: ${e.message}`, "error");
      } else {
        console.warn(`Failed to save profile: ${e.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // EXECUTIVE REPORT GENERATION MODULE
  const handleExportReport = () => {
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const openTasks = tasks.filter((t) => t.status !== "completed");
    const formattedDate = new Date().toLocaleDateString();

    let mdReport = `# NEUROPILOT EXECUTIVE PRODUCTIVITY REPORT\n`;
    mdReport += `Generated: ${formattedDate} | Pilot: ${user?.name || "Loki Editor"}\n`;
    mdReport += `==========================================================\n\n`;
    
    mdReport += `## 1. STRATEGIC METRICS SUMMARY\n`;
    mdReport += `- Completion Quotient: ${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%\n`;
    mdReport += `- Target Daily Focus Allocation: ${dailyFocusTarget} minutes\n`;
    mdReport += `- Current Active Tasks Count: ${openTasks.length} pending items\n\n`;

    mdReport += `## 2. HIGH PRIORITY TASKS ROADMAP\n`;
    if (openTasks.length === 0) {
      mdReport += `No pending tasks registered. Outstanding queue health!\n`;
    } else {
      openTasks.forEach((t) => {
        mdReport += `- [ ] **${t.name}** | Priority: ${t.priorityScore} | Risk level: ${t.riskScore}% | Est: ${t.estimatedTime}h\n`;
        if (t.description) mdReport += `   *"${t.description}"*\n`;
      });
    }
    mdReport += `\n`;

    mdReport += `## 3. CORE STRATEGIC GOALS PROGRESS\n`;
    if (goals.length === 0) {
      mdReport += `No long term objectives defined yet.\n`;
    } else {
      goals.forEach((g) => {
        mdReport += `* **${g.name}** (${g.progress}% Progress)\n`;
        mdReport += `  Objective: "${g.objective}"\n`;
        mdReport += `  AI Predicts: "${g.prediction}"\n`;
        g.milestones.forEach((m) => {
          mdReport += `    - [${m.completed ? "x" : " "}] ${m.name}\n`;
        });
        mdReport += `\n`;
      });
    }

    mdReport += `## 4. HABIT PATTERN COHERENCE\n`;
    if (habits.length === 0) {
      mdReport += `No active daily focus habits found.\n`;
    } else {
      habits.forEach((h) => {
        mdReport += `- **${h.name}** | Streak: ${h.streak} days | Consistency score: ${h.consistency}%\n`;
      });
    }

    mdReport += `\n\n==========================================================\n`;
    mdReport += `Report compiled securely via NeuroPilot Core Calculations Server.\n`;

    // File Downloader helper
    const blob = new Blob([mdReport], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NeuroPilot-ExecutiveReport-${formattedDate.replace(/\//g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-display">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure profile descriptors, daily focus parameters, notifications, and export strategic summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Profile Form - 2 Columns */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-6 flex items-center space-x-1.5">
              <User className="w-5 h-5 text-blue-400" />
              <span>Pilot Profile</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Display Name</label>
                <input 
                  id="settings-form-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Choose Profile Identifier Avatar</label>
                
                {/* Visual grid of presets */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
                  {avatarPresets.map((preset, idx) => (
                    <img 
                      key={idx}
                      src={preset} 
                      alt={`preset ${idx}`}
                      onClick={() => setAvatar(preset)}
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all hover:scale-105 object-cover ${avatar === preset ? "border-blue-500 shadow-md scale-105" : "border-slate-800 opacity-60 hover:opacity-100"}`}
                    />
                  ))}
                </div>

                {/* File Upload Section */}
                <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-900/40 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    {avatar && (
                      <img 
                        src={avatar} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 bg-slate-950 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Upload Custom Avatar</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, or SVG (max 1.5MB)</p>
                    </div>
                  </div>

                  <label className="cursor-pointer bg-[#0F172A] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 py-2 px-4 rounded-xl text-xs text-slate-300 font-bold transition-all inline-block text-center shrink-0">
                    <span>Choose Picture</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Daily Focus Target (Minutes)</label>
                <input 
                  id="settings-form-target"
                  type="number" 
                  min="30"
                  max="1440"
                  value={dailyFocusTarget}
                  onChange={(e) => setDailyFocusTarget(parseInt(e.target.value) || 240)}
                  className="w-full bg-[#0F172A] border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-850">
                <button
                  id="settings-save-btn"
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Changes..." : "Commit Profile Preferences"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preferences and toggles */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-2">Notification & Sound Protocols</h3>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/35 rounded-xl border border-slate-850 text-xs">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-200 block">Voice Synthesizer Feedback</span>
                  <span className="text-slate-500">Enable voice audio confirmations for assistant commands.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={enableVoice}
                onChange={(e) => setEnableVoice(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/35 rounded-xl border border-slate-850 text-xs">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-200 block">Intelligent Notification Marquee</span>
                  <span className="text-slate-500">Show dynamic slippage risk flags and focus indicators.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Data export / Executive actions - 1 Column */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden bg-gradient-to-b from-[#1E293B]/70 to-[#0F172A]/90">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl pointer-events-none" />
            <Download className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-md font-extrabold text-white mb-2">Executive Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
              Download your personalized milestones sequence, consistency streaks, and risk scores formatted nicely as an Executive Markdown Report.
            </p>

            <button
              id="settings-export-report-btn"
              onClick={handleExportReport}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Executive Report</span>
            </button>
          </div>

          {/* Account teardown logout */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Workspace Sessions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safe out log terminates local active security tokens securely.
            </p>
            <button
              id="settings-logout-btn"
              onClick={onLogout}
              className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
