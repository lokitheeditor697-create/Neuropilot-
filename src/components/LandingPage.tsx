import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare,
  Bot,
  Layers,
  Sparkles,
  Award,
  Globe,
  Database,
  Calendar,
  Lock,
  Cpu,
  ChevronRight,
  Search,
  Check,
  Play,
  Volume2,
  CalendarDays,
  Target,
  BarChart3,
  Users,
  ChevronDown,
  Activity,
  Heart,
  X,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProductTour from "./ProductTour";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

import NeuroPilotLogo from "./NeuroPilotLogo";


// Ecosystem Integrations Marquee Data
const INTEGRATIONS = [
  { name: "Google Calendar Sync", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/10" },
  { name: "Firebase Cloud Store", icon: Database, color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/10" },
  { name: "Slack Event Webhooks", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/10" },
  { name: "GitHub Pull Automator", icon: Globe, color: "text-purple-400", bg: "bg-purple-500/5 border-purple-500/10" },
  { name: "Jira Priority Sync", icon: Layers, color: "text-cyan-500", bg: "bg-cyan-600/5 border-cyan-600/10" },
  { name: "Multi-User SSO Shield", icon: Lock, color: "text-rose-400", bg: "bg-rose-500/5 border-rose-500/10" },
  { name: "Autonomic Synapse Node", icon: Cpu, color: "text-blue-300", bg: "bg-blue-500/5 border-blue-550/10" },
];

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [activeVideoDemo, setActiveVideoDemo] = useState(false);
  const [riskSimulationVal, setRiskSimulationVal] = useState(30); // 0 to 100 slider value
  const [activeDemoTab, setActiveDemoTab] = useState<"dashboard" | "planner" | "calendar" | "insights" | "goals">("dashboard");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [faqExpanded, setFaqExpanded] = useState<number | null>(0);

  // Active step in timeline workflow
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // Stats Counter state hooks (Count up simulation)
  const [statCompletion, setStatCompletion] = useState(80);
  const [statTimeSaved, setStatTimeSaved] = useState(300);

  useEffect(() => {
    const timer1 = setInterval(() => {
      setStatCompletion(prev => (prev < 95 ? prev + 1 : 95));
    }, 45);
    const timer2 = setInterval(() => {
      setStatTimeSaved(prev => (prev < 522 ? prev + 4 : 522));
    }, 20);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  // Timeline Step detail elements
  const TIMELINE_STEPS = [
    { title: "Define Global Goal", desc: "Instantiate targets like 'Deliver Alpha Launch' or 'Deploy Core Engine'.", icon: Target, detailCode: "const goal = initGoal('Alpha Launch');" },
    { title: "Coprocessor Analysis", desc: "The autonomic intelligence engine parses complexity, timelines, and dependencies.", icon: Cpu, detailCode: "ai.examineRiskRatio(goal.milestones);" },
    { title: "Milestone Breakdown", desc: "Autonomous synthesis into structured tasks grouped by priority factors.", icon: Layers, detailCode: "const tasks = await ai.synthesize(goal);" },
    { title: "Continuous Scheduling", desc: "Direct injection of work intervals within your aligned active calendar.", icon: CalendarDays, detailCode: "calendar.optimizeSlots(tasks.highUrgency);" },
    { title: "Active Guardian", desc: "Ongoing delay risk modeling. Senses scheduling changes to prevent late work.", icon: ShieldAlert, detailCode: "if(risk > 0.45) dispatcher.dispatchWarn();" },
    { title: "Dynamic Repair", desc: "Automatic or single-click rescheduling repairs your active daily slots.", icon: Zap, detailCode: "calendar.performSelfCorrection(missedSlot);" },
    { title: "Goal Fulfilled", desc: "Milestones complete beautifully with high performance index visibility.", icon: CheckCircle, detailCode: "analytics.logCompletionRate(0.95);" }
  ];

  // FAQ data Array
  const FAQ_DATA = [
    {
      q: "Is the LLM API free and usable across multiple users?",
      a: "Yes! The integrated Autonomic Core leverages our built-in server proxy utilizing Google Cloud service connections. No user authentication keys are leaked to the client browser. Individual users have isolated database snapshots (fully secured with Firebase Authentication and Firestore rules), so dozens of global coworkers can operate concurrently without cross-site conflicts or billing overhead."
    },
    {
      q: "How does the active schedule repair system actually correct delays?",
      a: "When you miss a predefined focus period or manually drag a high-risk milestone back, our background coordinator processes task urgency constraints. It flags potential pipeline blockages, suggests updated priority rankings, and reschedules optimal work windows in seconds."
    },
    {
      q: "Does NeuroPilot store my calendar and security credentials?",
      a: "Your records, workflows, and task metrics are stored in your secure, user-owned Firestore collection protected by database rules. External sync blocks like Slack webhooks or calendar inputs use client-side authentication mechanisms, keeping your personal workflow perfectly confidential."
    },
    {
      q: "Can I customize the risk priority indices?",
      a: "Absolutely. NeuroPilot evaluates priority based on task weight, estimated delivery duration, and direct user-indicated deadlines, producing a logical score from 1 to 100. You can re-prioritize items inside the board settings at any point."
    },
    {
      q: "Is there built-in voice assistance?",
      a: "Yes! There is a high-speed speech-to-workspace input drawer inside your active Workspace, enabling you to vocally append cards, log habit marks, or schedule deep-work blocks hands-free."
    }
  ];

  // Filters FAQ matching questions
  const filteredFaq = FAQ_DATA.filter(item => 
    item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden relative">
      
      {/* Modern Grid Overlay Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,10,25,0.9),#030712)] z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#091026_1px,transparent_1px),linear-gradient(to_bottom,#091026_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* Cyber ambient cosmic light gradients */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/5 to-transparent blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-indigo-500/5 to-transparent blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-3/4 left-10 w-[600px] h-[600px] bg-gradient-to-br from-cyan-950/10 via-slate-900/5 to-transparent blur-[160px] pointer-events-none z-0" />

      {/* Navigation Header bar */}
      <nav id="startup-nav" className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-900/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo brand */}
            <div className="flex items-center space-x-3">
              <NeuroPilotLogo className="w-9 h-9" />
              <span className="text-lg font-black tracking-[0.25em] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-mono">
                NEUROPILOT
              </span>
            </div>
            
            {/* Nav links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-extrabold text-slate-400">
              <a href="#comparison" className="hover:text-cyan-400 transition-colors">Comparison</a>
              <a href="#showcase" className="hover:text-cyan-400 transition-colors">Risk Analyzer</a>
              <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
              <a href="#workflow" className="hover:text-cyan-400 transition-colors">How It Works</a>
              <a href="#product-demo" className="hover:text-cyan-400 transition-colors">Platform</a>
              <a href="#twin" className="hover:text-cyan-400 transition-colors">Twin Forecasting</a>
              <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <button 
                id="header-btn-login"
                onClick={onLogin} 
                className="text-slate-300 hover:text-white px-4.5 py-2 hover:bg-slate-900/70 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all border border-slate-800/60"
              >
                Sign In
              </button>
              <button 
                id="header-btn-join"
                onClick={onGetStarted} 
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:via-cyan-400 hover:to-cyan-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-950/40 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center space-x-1.5 text-[11px]">
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-20 lg:pt-32 lg:pb-36 flex flex-col items-center justify-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Top tag */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2.5 px-4.5 py-2 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/25 rounded-full text-xs text-cyan-400 mb-8 shadow-inner"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
            <span className="uppercase tracking-[0.2em] font-black text-[9px] font-mono">AUTONOMIC COGNITIVE TIME CO-PROCESSOR</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05]"
          >
            Predict Delays.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              Coprocess Your Time.
            </span>
          </motion.h1>

          <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto mb-10 leading-relaxed font-normal">
            NeuroPilot is the first agentic work assistant that reads your project roadmap, models your behavioral metrics, calculates deadline risk coefficients, and actively self-repairs daily focus schedules when slippage occurs.
          </p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16"
          >
            <button 
              id="hero-cta-unlock"
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:via-cyan-400 hover:to-cyan-300 text-slate-950 font-black uppercase tracking-wider text-xs px-8 py-4 px-10 rounded-xl shadow-xl shadow-cyan-950/60 hover:shadow-cyan-400/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              id="hero-cta-demo"
              onClick={() => setActiveVideoDemo(true)}
              className="w-full sm:w-auto text-slate-200 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 font-bold uppercase tracking-wider text-xs"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/30" />
              <span>Watch Product Tour</span>
            </button>
          </motion.div>

          {/* Floating Premium Interactive Workspace Mockup and Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800 border-t-cyan-500/30 bg-[#060a16]/90 p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl group"
          >
            {/* Top window ribbon */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-mono pl-3">NEUROPILOT_WORKSPACE_SIMULATOR_v2.5.exe</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-cyan-400 font-mono">Autonomic Nodes Linked</span>
              </div>
            </div>

            {/* Interactive Workspace panel core */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
              
              {/* Simulator controller (Left card inside mockup) */}
              <div className="lg:col-span-4 p-5 rounded-xl bg-slate-950/70 border border-slate-900/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <Gauge className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider font-mono">Real-Time Risk Simulator</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">Simulate Calendar Slippage</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                    Drag the slider to coordinate scheduling. See how NeuroPilot parses late milestones vs traditional passive lists.
                  </p>

                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span>Task Delay Latency</span>
                      <span className="text-cyan-400 font-mono font-bold">+{riskSimulationVal} Hours</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={riskSimulationVal} 
                      onChange={(e) => setRiskSimulationVal(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>0H (ON SCHEDULE)</span>
                      <span>100H (DANGER CRISIS)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-900">
                  <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-1.5">INTEGRATION CONTEXT</div>
                  <div className="bg-slate-900/40 rounded px-2.5 py-1.5 text-[10px] text-slate-300 font-mono flex items-center justify-between">
                    <span>Target Project:</span>
                    <span className="text-cyan-400 text-right font-extrabold">Alpha Release Roadmap</span>
                  </div>
                </div>
              </div>

              {/* Live reactive UI grid outputs (Middle + Right) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Visual Circle Meter (Urgency/Productivity) */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500">Task Performance Score</span>
                    <Activity className="w-4.5 h-4.5 text-cyan-400" />
                  </div>
                  
                  <div className="flex flex-col items-center py-2">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* Circle Path background */}
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="#111827" strokeWidth="6" />
                        <motion.circle 
                          cx="56" 
                          cy="56" 
                          r="48" 
                          fill="none" 
                          stroke={riskSimulationVal > 60 ? "#ef4444" : riskSimulationVal > 30 ? "#f59e0b" : "#22d3ee"} 
                          strokeWidth="7" 
                          strokeDasharray={300}
                          strokeDashoffset={300 - (300 * Math.max(10, 100 - riskSimulationVal)) / 100}
                          transition={{ type: "spring", stiffness: 60 }}
                        />
                      </svg>
                      {/* Inside details */}
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white font-mono">{Math.max(12, 100 - riskSimulationVal)}%</span>
                        <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">Health Coefficient</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deadline Risk Indicator Card */}
                <div className={`p-4 rounded-xl transition-all duration-300 ${riskSimulationVal > 50 ? "bg-rose-950/20 border-rose-500/30" : "bg-slate-950/40 border-slate-900"}`}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-500">System Sentry Guard</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${riskSimulationVal > 60 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : riskSimulationVal > 30 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"}`}>
                      {riskSimulationVal > 60 ? "CRITICAL RISK" : riskSimulationVal > 30 ? "EVALUATING" : "FULLY STABLE"}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <div className="text-slate-400 text-[10px] mb-1 font-mono uppercase">Calculated Slip Ratio</div>
                      <div className="text-xl font-bold font-mono tracking-tight text-white">{riskSimulationVal}% Risk</div>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${riskSimulationVal > 60 ? "bg-rose-500" : riskSimulationVal > 30 ? "bg-amber-500" : "bg-cyan-400"}`} style={{ width: `${riskSimulationVal}%` }} />
                    </div>

                    <p className="text-[10.5px] text-slate-400 leading-relaxed italic">
                      {riskSimulationVal > 60 ? '"Task latency exceeds critical path buffers. Initiate automatic workspace repairs."' : riskSimulationVal > 30 ? '"Warning: Overlapping deadlines detected late Thursday. Self-repair is recommended."' : '"All dependencies aligned. Safe milestones. Focus windows optimal."'}
                    </p>
                  </div>
                </div>

                {/* AI Autonomic Advice Dispatcher */}
                <div className="sm:col-span-2 p-4.5 rounded-xl bg-slate-950/80 border border-slate-900/95 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Autonomic Coprocessor Recommendation</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-mono">
                      {riskSimulationVal > 60 ? (
                        <span className="text-rose-400">🚨 ACTION MANDATE: 7 tasks sliding past deadline. Move 'Database Encryption Upgrade' 3 hours earlier. Apply deep work schedule repair?</span>
                      ) : riskSimulationVal > 30 ? (
                        <span className="text-amber-400">⚡ ALERT: 18-hour task overflow warning. Auto-repair is ready to optimize client meeting slots. Click to execute.</span>
                      ) : (
                        <span className="text-cyan-400">✨ OPTIMAL ROADMAP: Milestone progression index 98/100. Routine habit streaks verified. Daily focus schedule remains intact.</span>
                      )}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      </header>

      {/* Infinite Horizontal Integrations Ribbon Marquee */}
      <section id="marquee" className="py-7 bg-[#02050D] border-y border-slate-900/90 overflow-hidden relative z-10 w-full select-none">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#02050D] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#02050D] to-transparent z-20 pointer-events-none" />
        
        {/* Scrolling lane */}
        <div className="flex">
          <div className="flex space-x-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap shrink-0">
            {[...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx} 
                  className={`inline-flex items-center space-x-2.5 px-4.5 py-2.5 rounded-xl border ${item.bg} text-slate-300 font-mono text-xs`}
                >
                  <IconComp className={`w-4 h-4 ${item.color}`} />
                  <span className="tracking-widest uppercase font-extrabold text-[10px]">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Interactive Comparison/Problem Section */}
      <section id="comparison" className="py-28 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">ARCHITECTURAL EVOLUTION</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Interactive Comparison Paradigm
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Standard list applications remind you of tasks only after deadlines fail. NeuroPilot manages state, monitors slippage actively, and repairs schedule calendars proactively.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Traditional column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-950/30 border border-slate-900/60 relative group"
            >
              <div className="w-12 h-12 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 mb-6 group-hover:border-slate-700 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </div>
              
              <h4 className="text-lg font-bold text-slate-300 mb-2">Traditional Lists & Reminders</h4>
              <p className="text-[9px] uppercase tracking-widest text-[#ef4444] font-bold font-mono mb-6">Passive Ephemeral Loop</p>
              
              <div className="space-y-6">
                {[
                  { title: "❌ Static Task Checklists", desc: "Purely passive checkboxes that rely on absolute manual sorting. If you run behind schedule, check buttons slide silently out of view with zero alert parameters." },
                  { title: "❌ Ephemeral Memory Depletion", desc: "No continuous state. The moment you secure your tab or shut down, active history logs are lost with no cloud synchronization mechanics." },
                  { title: "❌ Isolated Manual Scheduling", desc: "No core calendar relationship. Forces users to constantly re-plan missed daily timeblocks manually, causing severe cognitive overhead." },
                  { title: "❌ Completely Blind to Risk", desc: "Oblivious to ongoing delays. Will not warn when a multi-day engineering backlog creates collision courses with client milestones tomorrow." }
                ].map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-slate-900 last:border-0 last:pb-0">
                    <h5 className="text-xs font-bold text-slate-400 font-mono uppercase">{item.title}</h5>
                    <p className="text-slate-500 text-[11.5px] mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* NeuroPilot premium neon glow column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-b from-[#081224] to-[#040813] border border-cyan-500/45 relative shadow-2xl shadow-cyan-950/20 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
              
              <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 mb-6">
                <Check className="w-6 h-6 text-cyan-300" />
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2">The NeuroPilot Platform</h4>
              <p className="text-[9px] uppercase tracking-widest text-[#00f2fe] font-black font-mono mb-6 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                <span>Autonomous Cognitive Coprocessor</span>
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "✅ AI-Assisted Priority Indexing", desc: "Estimates milestone priority parameters, risk weights, and active delays, re-prioritizing tasks intelligently utilizing server-side autonomic engines." },
                  { title: "✅ Elastic Cloud Synchronization", desc: "Fully persistent enterprise Firestore database integration. All habit trends, schedule entries, goals, and logs are tracked on Cloud." },
                  { title: "✅ Dynamic Schedule Repair Engine", desc: "Missed your morning focus block? NeuroPilot instantly repairs daily calendar nodes automatically, allocating new slots intelligently." },
                  { title: "✅ Sentry Deadline Risk Shield", desc: "Ongoing passive evaluation. Signals risk indicators beforehand to alert you of potential delay collapses before they occur." }
                ].map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-cyan-500/10 last:border-0 last:pb-0">
                    <h5 className="text-xs font-bold text-cyan-400 font-mono uppercase">{item.title}</h5>
                    <p className="text-slate-300 text-[11.5px] mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Primary WOW Factor: AI Risk Prediction Showcase */}
      <section id="showcase" className="py-24 bg-[#04070e] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual Analytics comparison panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-slate-800 bg-[#060a16] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-2xl rounded-full" />
                
                {/* Traditional State (Severe delay) */}
                <div className="pb-6 border-b border-slate-900">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-rose-400 font-mono tracking-widest uppercase">BEFORE NEUROPILOT (PREVALENT BOTTLENECK)</span>
                    <span className="text-xs font-mono text-slate-500">Manual Task Chaos</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-white">Engineering Milestone Slip</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Task priority alignment manual, warning alerts ignored, deadline missed entirely.</p>
                    </div>
                    {/* Circle meter */}
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      {/* Precise SVG Circular Gauge */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90 origin-center" viewBox="0 0 64 64">
                        {/* Faint background ring */}
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="4"
                          className="opacity-20"
                        />
                        {/* Progressive arc (82% of 163.36 is 133.95, offset is 29.41) */}
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="163.36"
                          strokeDashoffset="29.41"
                        />
                      </svg>
                      {/* Precise inner content with no layout wraps */}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <span className="text-[12px] font-black leading-none text-rose-500 font-mono">82%</span>
                        <span className="text-[8px] font-black leading-none text-rose-500/80 font-mono mt-0.5 uppercase tracking-wider">RISK</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure Active State (Calm, Repaired) */}
                <div className="pt-6 relative">
                  <div className="absolute inset-0 bg-cyan-950/5 blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">AFTER NEUROPILOT (AI ORCHESTRATION ACTIVE)</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">12ms Response Delay</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1">
                      <h4 className="text-md font-bold text-white">Timeline Aligned & Autorepaired</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">Slipped milestone parsed, voice command accepted, priority slots continuous.</p>
                    </div>
                    {/* Clean Circle meter */}
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0 bg-cyan-950/10 rounded-full">
                      {/* Precise SVG Circular Gauge */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90 origin-center" viewBox="0 0 64 64">
                        {/* Faint background ring */}
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        {/* Progressive arc (12% of 163.36 is 19.60, offset is 143.76) */}
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="163.36"
                          strokeDashoffset="143.76"
                        />
                      </svg>
                      {/* Pulse indicator exactly on top of the circle border */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-2 h-2 rounded-full bg-cyan-400 border border-[#060a16] shadow-lg animate-pulse z-20" />
                      {/* Precise inner content with no layout wraps */}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <span className="text-[12px] font-black leading-none text-cyan-400 font-mono">12%</span>
                        <span className="text-[8px] font-black leading-none text-cyan-400/80 font-mono mt-0.5 uppercase tracking-wider">RISK</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress Slider block */}
              <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 text-xs">Simulated Task Urgency Index</span>
                <span className="text-xs text-cyan-400 font-mono font-black uppercase">98% Success Probability</span>
              </div>
            </motion.div>

            {/* Storytelling details */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase font-mono">PREVENT DELAY SHRIEKS</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Predict Risk Coefficient Before It Collapses
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Most productivity software expects you to report progress perfectly. NeuroPilot monitors ongoing pipeline changes behind the scenes. If delayed blocks overlap with upcoming team metrics, our visual priority engine reorganizes work automatically.
              </p>
              
              <div className="space-y-4 pt-2">
                {[
                  "Real-time visual urgency calculations based on historic task completion patterns",
                  "Intelligent schedule repair shifts slots dynamically without deleting focus time",
                  "Enterprise Firestore persistence handles high volume team synchronicity"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-950/40 border border-cyan-500/35 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-xs uppercase tracking-widest font-black transition-all flex items-center space-x-2"
                >
                  <span>Benchmark Startup Speed</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Redesigned Features Bento Grid (Highlighting 8 major attributes) */}
      <section id="features" className="py-28 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">INTELLIGENT CORE SUITE</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              A Coprocessor For Active Performance
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Unlock our complete ecosystem of server-coordinated features. Designed for technical founders, operations teams, and scaling engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-cyan-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">AI Prioritization</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Reorganizes tasks continuously using historical completion patterns and deadline multipliers.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-cyan-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-blue-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all duration-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Deadline Risk Sentry</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Passive monitoring calculates real-time delay metrics to warn of upcoming milestone issues.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-blue-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-indigo-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all duration-300">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Smart Scheduling</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Structures daily schedules around your optimal working periods and baseline energy hours.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-indigo-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-emerald-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Dynamic Rescheduling</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Missed focus block? Instantly auto-repairs work slots gracefully to secure target goals.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-emerald-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-rose-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all duration-300">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Goal Center Sync</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Keep your high-level milestones in alignment with physical, daily habit loops to track trends.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-rose-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-purple-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all duration-300">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Speech Assistant</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Vocally append active tasks, check off habit loops, or reschedule meetings hands-free.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-purple-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-amber-500/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Productivity Twin</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Futuristic cognitive simulator predicts focus levels, efficiency trends, and energy forecasts.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-amber-500/5 blur-xl rounded-full" />
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-cyan-400/25 transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/20 hover:to-slate-950/50 group relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-5 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wide">Weekly Insights</h4>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">Generates real executive analytics reports indicating task velocity indices and goal scores.</p>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-cyan-400/5 blur-xl rounded-full" />
            </div>

          </div>

        </div>
      </section>

      {/* Modern Workflow Timeline (How it Works) */}
      <section id="workflow" className="py-24 bg-[#02050D] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">COGNITIVE COMPILING</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Sequential Automation Timeline
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Click each workflow phase or scroll to watch NeuroPilot synthesize goal milestones in chronological alignment.
            </p>
          </div>

          {/* Timeline track wrapper */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 border-b border-slate-900 pb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
              {TIMELINE_STEPS.map((step, idx) => {
                const stepIcon = step.icon;
                const IconComp = stepIcon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineStep(idx)}
                    className={`px-4 py-2.5 rounded-xl border flex items-center space-x-2.5 transition-all text-xs font-mono shrink-0 uppercase tracking-widest ${activeTimelineStep === idx ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400" : "bg-slate-950/20 border-slate-900 text-slate-500 hover:text-slate-300"}`}
                  >
                    <span>0{idx + 1}</span>
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{step.title.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Step block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimelineStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#060a16] border border-slate-900 rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 blur-3xl pointer-events-none" />
                
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                    <span>STAGE 0{activeTimelineStep + 1} OF 07</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  
                  <h4 className="text-xl sm:text-2xl font-black text-white">{TIMELINE_STEPS[activeTimelineStep].title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{TIMELINE_STEPS[activeTimelineStep].desc}</p>
                  
                  <div className="pt-4 flex items-center space-x-4">
                    <button 
                      onClick={() => setActiveTimelineStep(prev => (prev < 6 ? prev + 1 : 0))}
                      className="px-4 py-2 bg-slate-900 text-cyan-400 border border-slate-800 text-xs uppercase font-mono tracking-wider rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition-colors"
                    >
                      <span>Proceed Sequence</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated active logic terminal console (Right) */}
                <div className="md:col-span-5 p-5 rounded-xl bg-slate-950/90 border border-slate-900 font-mono text-[11px] text-slate-400 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 text-[10px] text-slate-500">
                    <span>PILOT_SYNTHE_NODE_A7_UP</span>
                    <span>ACTIVE</span>
                  </div>
                  <div className="text-cyan-400/80">&gt; initializing telemetry state...</div>
                  <div className="text-slate-300 font-semibold">{TIMELINE_STEPS[activeTimelineStep].detailCode}</div>
                  <div className="text-emerald-400/90">&gt; state: compiled with 100% precision</div>
                  <div className="text-slate-600">&gt; thread latency: 9ms index</div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Interactive Product Demo Section */}
      <section id="product-demo" className="py-24 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">LIVE MODULE SHOWCASE</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Tour the Sovereign Workspace
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Explore custom rendered mockups matching active modules inside your fully functional NeuroPilot setup.
            </p>
          </div>

          {/* Module navigation tabs */}
          <div className="max-w-4xl mx-auto flex justify-center space-x-3 mb-10 overflow-x-auto whitespace-nowrap pb-3 scrollbar-none">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "planner", label: "AI Kanban Planner", icon: Layers },
              { id: "calendar", label: "Adaptive Calendar", icon: CalendarDays },
              { id: "insights", label: "Insights Engine", icon: Target },
              { id: "goals", label: "Goal Center", icon: Award }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemoTab(tab.id as any)}
                  className={`px-5 py-3 rounded-xl border flex items-center space-x-2 text-xs font-bold transition-all relative ${activeDemoTab === tab.id ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-400" : "bg-slate-950/25 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reactive Module Screen mockup container */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-900 bg-[#060a16] p-6 shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {activeDemoTab === "dashboard" && (
                <motion.div
                  key="dashboard_demo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950/60 rounded-xl border border-slate-900 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">Main Control Center Dashboard</h4>
                      <p className="text-slate-400 text-xs mt-1">Gives an instant evaluation of task slips, habit counts, and productivity indices.</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">COGNITIVE COMPILER</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-900">
                      <div className="text-slate-500 text-[10px] font-mono uppercase mb-2">Completion success rate</div>
                      <div className="text-2xl font-bold text-white font-mono">94.8%</div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: "94.8%" }} />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-900">
                      <div className="text-slate-500 text-[10px] font-mono uppercase mb-2">Current Active Slipping ratio</div>
                      <div className="text-2xl font-bold text-rose-400 font-mono">11% Risk</div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: "11%" }} />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-900">
                      <div className="text-slate-500 text-[10px] font-mono uppercase mb-2">Total Habits Logged</div>
                      <div className="text-2xl font-bold text-indigo-400 font-mono">24 Consecutive Days</div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: "82%" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "planner" && (
                <motion.div
                  key="planner_demo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">Autonomic Task Synthesizer Kanban Board</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Synthesizes overall objectives automatically. Type in 'Deploy beta security locks' and the system breaks down research, dev, design, and analytics cards in seconds.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    {/* Columns mockup */}
                    {["To Do (Research Phase)", "In Progress (Development)", "Completed"].map((col, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-900">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest font-mono mb-3 pb-2 border-b border-slate-900">{col}</div>
                        
                        <div className="space-y-2.5">
                          <div className="p-2.5 bg-[#060a16] border border-slate-900 rounded-lg text-xs space-y-2">
                            <span className="text-[8px] bg-cyan-950/50 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded font-mono font-bold uppercase">Priority Index A</span>
                            <h5 className="font-bold text-slate-200">Synthesize Database Schemas</h5>
                          </div>
                          
                          {idx === 1 && (
                            <div className="p-2.5 bg-[#060a16] border border-cyan-500/20 rounded-lg text-xs space-y-2">
                              <span className="text-[8px] bg-rose-950/50 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded font-mono font-bold uppercase">Slipping Warn</span>
                              <h5 className="font-bold text-white">Deploy Core Firebase rules</h5>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "calendar" && (
                <motion.div
                  key="calendar_demo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">Continuous Adaptive Calendar Layout</h4>
                  <p className="text-slate-400 text-xs mb-4">Schedules tasks smoothly in physical hourly calendar layers, matching your optimal focus coefficients.</p>

                  <div className="space-y-3">
                    {[
                      { time: "09:00 AM - 10:30 AM", label: "Focus Work: Compile Server Architecture", state: "Active Slot", bg: "bg-cyan-950/20 border-cyan-500/25 text-cyan-400" },
                      { time: "11:00 AM - 12:30 PM", label: "Development: Deploy Router Gateway", state: "Continuous", bg: "bg-slate-950/40 border-slate-900 text-slate-300" },
                      { time: "02:00 PM - 03:30 PM", label: "Self-Diagnosis: Auto Slippage Audit", state: "Repaired Block", bg: "bg-indigo-950/20 border-indigo-500/20 text-indigo-400" }
                    ].map((slot, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border flex justify-between items-center ${slot.bg}`}>
                        <div className="flex items-center space-x-3.5">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-mono">{slot.time}</span>
                          <span className="text-xs font-bold pl-3">{slot.label}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest font-mono font-bold">{slot.state}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "insights" && (
                <motion.div
                  key="insights_demo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">Core Insights & Productivity Diagnosis</h4>
                  <p className="text-slate-400 text-xs">Parses daily completed streaks to diagnose performance statistics and goal ratios.</p>

                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-900 flex items-start gap-3.5">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Executive Diagnostics Summary</h5>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                        "Your average task latency dropped by 4.2 hours over the last 7 calendar days. Habit consistency scores indicate supreme focus periods between 09:00 AM and 11:30 AM. Weekly completion index registers at 94.8% success."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "goals" && (
                <motion.div
                  key="goals_demo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">High-Level Core Goal Center</h4>
                  <p className="text-slate-400 text-xs">Align large milestones (e.g. Q3 Launch, Health Index) with daily micro task nodes.</p>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Milestone Goal</span>
                        <h5 className="text-xs font-bold text-white">Perform Security Architecture Upgrade</h5>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 font-mono">100% Fulfilled</span>
                    </div>

                    <div className="p-4 bg-[#081224] border border-cyan-500/20 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold">In Progress Goal</span>
                        <h5 className="text-xs font-bold text-slate-200">Prepare Pitch Deck Deliverables</h5>
                      </div>
                      <span className="text-xs font-bold text-cyan-300 font-mono animate-pulse">45% Progress</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* Futuristic Digital Productivity Twin Showcase */}
      <section id="twin" className="py-24 bg-[#02050D] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Descriptive Content */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase font-mono">COGNITIVE COMPILING</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Your Sovereign Digital Productivity Twin
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                NeuroPilot simulates your cognitive workflow patterns over time. The integrated Autonomic Synapse Engine builds an advisory model representing your target energy ratios, optimal daily focus slots, and forecast completion rates to give warning parameters beforehand.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                  <h5 className="text-xs font-extrabold text-cyan-400 uppercase font-mono mb-1">94% Efficiency</h5>
                  <p className="text-slate-500 text-[10.5px]">Your average completed milestone index.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                  <h5 className="text-xs font-extrabold text-indigo-400 uppercase font-mono mb-1">09:30 AM Focus</h5>
                  <p className="text-slate-500 text-[10.5px]">Optimal synthesized window of efficiency.</p>
                </div>
              </div>
            </motion.div>

            {/* Twin futuristic visual widget grids */}
            <motion.div 
              initial={{ opacity: 0, hover: { scale: 1.01 } }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-slate-900 bg-[#060a16] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">COGNITIVE TWIN METRICS FRAME</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">NODE_TWIN_33</span>
              </div>

              <div className="space-y-4">
                {/* Visual meter 1 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono uppercase text-slate-400">
                    <span>Task Completion trends</span>
                    <span className="text-cyan-400 font-bold">96/100 Optimal</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: "96%" }} />
                  </div>
                </div>

                {/* Visual meter 2 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono uppercase text-slate-400">
                    <span>Target Focus Energy levels</span>
                    <span className="text-indigo-400 font-bold">82/100 Stabilized</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: "82%" }} />
                  </div>
                </div>

                {/* Visual meter 3 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono uppercase text-slate-400">
                    <span>Daily consistency forecast</span>
                    <span className="text-blue-400 font-bold">89% Stability</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "89%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900/90 flex gap-3 text-left">
                  <Bot className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-slate-400 text-[11px] leading-relaxed font-mono">
                    "Twin diagnostics suggest scheduling deep development blocks before noon Thursday to prevent 15hr bottleneck latency."
                  </p>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* Redesigned Statistics Counters */}
      <section id="stats" className="py-20 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            
            <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60">
              <div className="text-4xl sm:text-5xl font-black text-white font-mono">{statCompletion}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 font-mono">Task Completion Ratio</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60">
              <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">87.5%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 font-mono">Productivity Boost</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60">
              <div className="text-4xl sm:text-5xl font-black text-indigo-400 font-mono">10K+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 font-mono">Sovereign Tasks Solved</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60">
              <div className="text-4xl sm:text-5xl font-black text-blue-400 font-mono">{statTimeSaved} Hrs</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 font-mono">Weekly Hours Saved</div>
            </div>

          </div>
        </div>
      </section>

      {/* Redesigned Testimonials (Stripe/Linear styled Cards) */}
      <section className="py-24 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">ENDORSED BY BUILDERS</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Loved by Top Product Creators
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {[
              {
                name: "Marcus Vance",
                role: "Director of Product Engineering",
                company: "Vercel",
                quote: "NeuroPilot's active risk analysis completely eliminated slipped milestone tasks across our Q3 deployments. The Firestore client synchronicity is flawlessly responsive.",
                avatarBg: "from-purple-500 to-indigo-500"
              },
              {
                name: "Sophia Chen",
                role: "Lead Systems Architect",
                company: "Stripe",
                quote: "Managing scheduling windows used to be a full-time manual nightmare. The automatic schedule repair handles bottleneck collisions so smoothly. Absolutely spectacular design.",
                avatarBg: "from-blue-500 to-cyan-500"
              },
              {
                name: "Julian Sterling",
                role: "Operations Coordinator",
                company: "Linear",
                quote: "The Autonomic coprocessor analysis is highly surgical, predicting team task latency with massive precision. Setup takes less than 3 minutes.",
                avatarBg: "from-rose-500 to-amber-500"
              }
            ].map((testi, idx) => (
              <div key={idx} className="p-6.5 rounded-2xl bg-gradient-to-b from-slate-950/80 to-slate-950/30 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">"{testi.quote}"</p>
                
                <div className="flex items-center space-x-3 pb-3 border-t border-slate-900/60 pt-4">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${testi.avatarBg} text-white font-black text-xs flex items-center justify-center`}>
                    {testi.name.split(" ")[0][0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">{testi.name}</h5>
                    <p className="text-slate-500 text-[10px]">{testi.role}, <strong className="text-cyan-400">{testi.company}</strong></p>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Redesigned Pricing Section */}
      <section id="pricing" className="py-24 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">SCALABLE MEMBERSHIP</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Simple, Transparent Tiers
            </h3>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Unlock the continuous AI risk sentry, persistent databases, and adaptive rescheduling engines. No hidden add-ons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Tier 1 */}
            <div className="p-8 rounded-2xl bg-slate-950/30 border border-slate-900 flex flex-col justify-between shadow-2xl relative hover:border-slate-800 transition-colors">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  Starter Free
                </span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white font-mono">$0</span>
                  <span className="text-slate-500 ml-2 text-xs uppercase tracking-wider font-bold">Standard Free</span>
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Ideal to diagnostic personal productivity, baseline logs, and local checklists.</p>
                
                <ul className="mt-8 space-y-4 border-t border-slate-900/60 pt-6">
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Up to 15 concurrent active local tasks</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Standard habits tracking & logs</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Optimized workspace setup</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onGetStarted}
                className="mt-8 w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all font-mono"
              >
                Launch Starter Package
              </button>
            </div>

            {/* Tier 2 - Premium Highlighted */}
            <div className="p-8 rounded-2xl bg-[#081224] border border-cyan-500/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-lg font-mono">
                POPULAR CHOICE
              </div>
              
              <div>
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest font-mono bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded">
                  Cloud Professional
                </span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white font-mono">$9</span>
                  <span className="text-slate-400 ml-2 text-xs uppercase tracking-wider font-bold">/ Month</span>
                </div>
                <p className="text-slate-300 text-xs mt-3 leading-relaxed">Supreme sovereign capabilities powered by server-proxied Autonomic Synapse models.</p>
                
                <ul className="mt-8 space-y-4 border-t border-cyan-500/10 pt-6">
                  <li className="flex items-center space-x-3 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Infinite Cloud Firestore synchronization</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Autonomic Core Prioritizer & Synthesizer</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Continuous Deadline Risk Coefficient Sentry</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Elastic daily schedule self-repairs</span>
                  </li>
                </ul>
              </div>
              <button 
                id="btn-buy-pro"
                onClick={onGetStarted}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:via-cyan-400 hover:to-cyan-300 text-slate-950 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl shadow-lg shadow-cyan-950/40 transition-all transform hover:-translate-y-0.5 font-mono"
              >
                Initialize Pro Experience
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-8 rounded-2xl bg-slate-950/30 border border-slate-900 flex flex-col justify-between shadow-2xl relative hover:border-slate-800 transition-colors">
              <div>
                <span className="text-[10px] font-extrabold text-[#00f2fe] uppercase tracking-widest font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  Enterprise Teams
                </span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-white font-mono">$24</span>
                  <span className="text-slate-500 ml-2 text-xs uppercase tracking-wider font-bold">/ User / Mo</span>
                </div>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">Includes SSO integration controls, enterprise workspace maps, and team boards.</p>
                
                <ul className="mt-8 space-y-4 border-t border-slate-900/60 pt-6">
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Isolated private database clusters</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Dedicated SLA & SSO Auth policies</span>
                  </li>
                  <li className="flex items-center space-x-3 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    <span>Continuous collaborative gantt timelines</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={onGetStarted}
                className="mt-8 w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all font-mono"
              >
                Request Enterprise Auth
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Modern Accordion FAQ Section with LIVE Filter Search */}
      <section className="py-24 bg-[#030712] relative z-10 border-b border-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-3 font-mono">FAQ CONSOLE</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Frequently Queried Intel
            </h3>
            <p className="text-slate-400 text-sm mt-3">Search or type terms below to filter questions instantly.</p>
            
            {/* Filter Input */}
            <div className="mt-8 max-w-md mx-auto relative">
              <input 
                type="text" 
                placeholder="Type query to filter (e.g. Free, Autonomic, Security)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full bg-[#060a16] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-5 py-3.5 text-xs text-slate-150 outline-none leading-none pr-10 shrink-0 select-text"
              />
              <Search className="w-4.5 h-4.5 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-900 bg-slate-950/20 px-5 py-4.5 text-left">
                  <button
                    onClick={() => setFaqExpanded(faqExpanded === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono text-left focus:outline-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${faqExpanded === idx ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {faqExpanded === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed border-t border-slate-900/60 pt-3">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="text-center py-10 rounded-xl border border-slate-900 border-dashed text-slate-500 text-xs">
                No matching queries. Try searching something else.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Premium Cinematic closing Brand CTA Section */}
      <section className="py-28 bg-[#02050D] relative z-10 border-t border-slate-900 overflow-hidden text-center">
        {/* Sphere particle system simulations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-cyan-950/40 border border-cyan-500/20 rounded-full text-xs text-cyan-400 mb-6 font-mono"
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-[0.2em] font-black text-[9px]">Sovereign Core Activation awaits</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6">
            Stop Managing Tasks.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              Start Achieving Goals.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Eliminate task latency permanently. Instantly sync your calendar roadmap to a real duration-sensitive system that guards against slips autonomously.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:via-cyan-400 hover:to-cyan-300 text-slate-950 font-black uppercase tracking-wider text-xs px-10 py-5 rounded-xl shadow-xl shadow-cyan-950/50 transition-all font-mono"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setActiveVideoDemo(true)}
              className="w-full sm:w-auto text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-10 py-5 rounded-xl transition-all font-semibold uppercase text-xs font-mono"
            >
              Watch Video Tour (1:45)
            </button>
          </div>
        </div>
      </section>

      {/* Floating Video Drawer Modal layer */}
      <AnimatePresence>
        {activeVideoDemo && (
          <ProductTour 
            onClose={() => setActiveVideoDemo(false)} 
            onGetStarted={onGetStarted} 
          />
        )}
      </AnimatePresence>

      {/* Brand Footer */}
      <footer className="bg-[#02050D] border-t border-slate-950 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <NeuroPilotLogo className="w-8 h-8" />
            <span className="text-white font-black tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-mono">NEUROPILOT AI</span>
          </div>
          <div className="text-center md:text-right font-sans">
            <span>&copy; {new Date().getFullYear()} NeuroPilot. Created with optimal dark design ergonomics. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
