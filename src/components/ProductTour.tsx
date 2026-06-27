import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Cpu, 
  Activity, 
  Clock, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Bot, 
  AlertCircle,
  Video,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductTourProps {
  onClose: () => void;
  onGetStarted: () => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  narratorText: string;
  icon: React.ComponentType<any>;
  duration: number; // seconds
}

export default function ProductTour({ onClose, onGetStarted }: ProductTourProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [narratorSpeaking, setNarratorSpeaking] = useState(false);
  
  // Custom interactive sub-states for live screen simulations
  const [simulatedRisk, setSimulatedRisk] = useState(72);
  const [repaired, setRepaired] = useState(false);
  const [commandText, setCommandText] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ role: "user" | "advisor"; text: string }>>([
    { role: "user", text: "My milestone is slipping due to client backlog delay" }
  ]);
  const [habits, setHabits] = useState([
    { name: "Deep Work Block", done: false },
    { name: "Post-Lunch Review", done: true },
    { name: "Cognitive Check-in", done: false }
  ]);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync available speech voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const updateVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const steps: TourStep[] = [
    {
      title: "Introduction to NeuroPilot",
      subtitle: "YOUR COGNITIVE WORKSPACE COPROCESSOR",
      description: "NeuroPilot is a personalized workspace assistant designed to optimize your task execution. Rather than a standard static agenda list, it translates your habits, mental energy, and schedule deadlines into a balanced, self-healing productivity system.",
      narratorText: "Welcome to NeuroPilot, your cognitive workspace co-processor. In today's overwhelming professional landscape, traditional checklist apps fail because they are static and ignore your brain's natural energy cycles. NeuroPilot is designed to bridge that gap.",
      icon: Sparkles,
      duration: 13
    },
    {
      title: "The Static Workflow Problem",
      subtitle: "WHY TYPICAL TO-DO LISTS FAIL",
      description: "Most professionals suffer from cognitive drift and sudden timeline collisions. Standard calendar tools fail to adapt to delays or exhaustion. Slipped milestones pile up undetected, causing severe burnout or missed project timelines.",
      narratorText: "Here is the critical problem we solve. Traditional planners don't protect your mental energy, leading to cognitive fatigue and sudden timeline collisions. When milestone delays pile up, static schedules drift into crisis, forcing you into high-stress burnout.",
      icon: AlertCircle,
      duration: 15
    },
    {
      title: "Active Cognitive Workspace",
      subtitle: "REAL-TIME ENERGY & FOCUS METRICS",
      description: "By tracking focus capacities, subjective exhaustion, and daily routines, NeuroPilot estimates your mental budget. It maintains state across session reloads, linking habits with live energy models.",
      narratorText: "To solve this, NeuroPilot introduces the Active Cognitive Dashboard. It charts your real-time fatigue and focus reserves, translating your routine check-ins and habits into an active energy budget, so you work only when your mind is at its sharpest.",
      icon: Activity,
      duration: 14
    },
    {
      title: "Sentry Timeline Collision Monitor",
      subtitle: "PREDICTIVE LATENCY & BACKLOG ANALYSIS",
      description: "Our predictive telemetry continuously measures ongoing task velocity. If a delayed milestone threatens to collide with upcoming deliveries, Sentry calculates the slippage risk and warns you immediately.",
      narratorText: "Next is our predictive Sentry telemetry. Instead of discovering delays when it's too late, NeuroPilot constantly estimates delivery risks. It measures task velocity to warn you of upcoming scheduling collisions before they jeopardize your launch.",
      icon: TrendingUp,
      duration: 14
    },
    {
      title: "Smart Self-Healing Scheduler",
      subtitle: "AUTONOMIC DAILY RESTORATION",
      description: "When latency collisions occur, the systems do not just warn you—they self-heal. One key click launches our Autonomic Scheduler to analyze priorities, restack calendar items, and move critical tasks earlier.",
      narratorText: "And here is the magic. When scheduling collisions occur, one click activates our self-healing scheduler. Powered by our Autonomic Time Engine, it automatically restructures your day, moving priority items earlier and protecting your deep work.",
      icon: Clock,
      duration: 15
    },
    {
      title: "Hands-Free Cognitive Coprocessor",
      subtitle: "INTEGRATED NATURAL DIALOGUE SESSION",
      description: "Formulate strategic goals or synthesize custom project kanban roadmaps naturally. Our AI Coprocessor is directly bound to your workspace, handling voice commands and manual text queries secure.",
      narratorText: "Finally, the omnipresent Autonomic Coprocessor is always available. You can speak naturally or type to generate structured roadmaps, request focus pacing advice, or seamlessly reschedule your entire list hands-free.",
      icon: Bot,
      duration: 14
    }
  ];

  const currentTourStep = steps[currentStep] || steps[0];

  // Stop currently speaking audio narration
  const stopNarration = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setNarratorSpeaking(false);
  };

  // Speak step description out loud
  const speakNarration = (index: number) => {
    stopNarration();
    if (audioMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    try {
      const step = steps[index] || steps[0];
      const text = step ? step.narratorText : "";
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices();
      
      // Select appropriate English premium sounding locale voice if available (favoring Google/MS clear natural soft voices)
      let selectedVoice = voices.find(v => v.lang.includes("en-US") && v.name.toLowerCase().includes("google"));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes("en-US") && v.name.toLowerCase().includes("natural"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("hazel"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith("en"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Fine tune for clear, pleasant, soft, natural narration flow
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      
      utterance.onstart = () => setNarratorSpeaking(true);
      utterance.onend = () => setNarratorSpeaking(false);
      utterance.onerror = () => setNarratorSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis blocked in this environment context", e);
    }
  };

  // Handle step index transitions
  const handleNextStep = () => {
    setProgress(0);
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setProgress(0);
    setCurrentStep(prev => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  // Effect for speech narration trigger on step change
  useEffect(() => {
    speakNarration(currentStep);
    return () => stopNarration();
  }, [currentStep, audioMuted, availableVoices]);

  // Effect for step timing progress loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const activeStep = steps[currentStep] || steps[0];
    const stepDurationMs = activeStep ? activeStep.duration * 1000 : 10000;
    const increment = (intervalMs / stepDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNextStep();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep]);

  // Handle simulated action parameters
  const runSelfRepair = () => {
    setRepaired(true);
    setSimulatedRisk(12);
  };

  const resetSimulation = () => {
    setRepaired(false);
    setSimulatedRisk(72);
  };

  const submitSimulatedChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) return;

    const userMsg = commandText;
    setChatLog(prev => [...prev, { role: "user", text: userMsg }]);
    setCommandText("");

    // Simulate rapid response from Autonomic Core
    setTimeout(() => {
      setChatLog(prev => [
        ...prev, 
        { role: "advisor", text: `I have analyzed your request: "${userMsg}". Optimizing roadmap checkpoints and allocating deep-work calendar blocks for the upcoming sprint automatically.` }
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#02050D]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl w-full bg-[#060B18] border border-slate-900 rounded-2xl shadow-2xl flex flex-col md:flex-row shadow-cyan-950/20 max-h-[95vh] overflow-hidden">
        
        {/* Playback Simulation Monitor Container (Left Side) */}
        <div className="flex-1 bg-[#030610] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900">
          
          {/* Header ribbon */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Product Stream</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2.5 font-mono text-[10px] text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold">AUTONOMIC CORES</span>
              <span>1080P @60FPS</span>
            </div>
          </div>

          {/* Core Interactive Screen Visual Screen Panel */}
          <div className="aspect-video w-full rounded-xl bg-slate-950/80 border border-slate-900 p-4.5 relative overflow-hidden flex flex-col justify-between shrink-0">
            
            {/* Ambient glows inside mock frame */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />

            {/* LIVE SIMULATION COMPONENT BASED ON STEP */}
            <div className="flex-1 flex flex-col justify-between relative z-10">
              
              {/* SLIDE 1: INTRODUCTION SYSTEM DISPLAY */}
              {currentStep === 0 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider animate-pulse">System Diagnostic Initiated</span>
                    <span className="text-emerald-400 text-[10px] font-bold">● COPROCESSOR ONLINE</span>
                  </div>

                  <div className="space-y-3 p-3 bg-slate-900/40 rounded-xl border border-cyan-500/10 relative overflow-hidden">
                    <div className="absolute top-1 right-1 p-1 px-1.5 bg-cyan-550/15 text-[8px] text-cyan-400 font-mono rounded">
                      VER 3.12
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-sans">NEUROPILOT WORKSPACE SECURED</h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono leading-relaxed">
                        User profile verified with Google Authentication. Cloud Firestore rules activated to protect personal workspace structures.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[9px] font-mono text-slate-500">
                      <span>User Snapshot ID: lokitheeditor</span>
                      <span className="text-cyan-400 font-bold">Heuristics: Active</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[9px] sm:text-[10px] font-mono">
                    <div className="p-2 rounded bg-[#0b1329] text-cyan-300 font-semibold">Auth: Google Sync</div>
                    <div className="p-2 rounded bg-[#0b1329] text-cyan-300 font-semibold">Data: Firestore</div>
                    <div className="p-2 rounded bg-[#0b1329] text-cyan-300 font-semibold">Logic: Autonomic Core</div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: THE STATIC WORKFLOW PROBLEM */}
              {currentStep === 1 && (
                <div className="space-y-3 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <span className="text-rose-450 font-bold uppercase tracking-wider">Unresolved Backlog Overload</span>
                    <span className="text-rose-400 text-[10px] uppercase font-mono animate-pulse font-bold">⚠️ 3 COLLISIONS DETECTED</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-rose-950/10 border border-rose-500/25 rounded-md flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] text-rose-450 font-mono font-bold block">OVERDUE • SLIPPED BLOCK</span>
                        <div className="text-xs text-slate-300 font-mono font-black">Integrate Secure API Connections</div>
                      </div>
                      <span className="text-[9px] bg-rose-500/10 text-rose-350 px-1 py-0.5 rounded font-mono font-bold">DELAYED 48h</span>
                    </div>

                    <div className="p-2 bg-rose-950/10 border border-rose-500/25 rounded-md flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] text-rose-450 font-mono font-bold block">DEADLINE CONFLICT</span>
                        <div className="text-xs text-slate-300 font-mono font-black">Design Cognitive Telemetry Board</div>
                      </div>
                      <span className="text-[9px] bg-rose-500/10 text-rose-350 px-1 py-0.5 rounded font-mono font-bold text-right leading-none">OVERLAPPING MEETINGS</span>
                    </div>
                  </div>

                  {/* Red Alert Banner */}
                  <div className="p-2 bg-rose-950/20 border border-rose-500/40 rounded-lg text-[10px] leading-relaxed text-rose-300 font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>Your static schedule has drifted. Fatigue level is forecast to rise to 87% with critical project delay risk.</span>
                  </div>
                </div>
              )}

              {/* SLIDE 3: ACTIVE COGNITIVE DASHBOARD (OLD 0) */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono">Dashboard Metric Workspace</span>
                    <span className="text-slate-500 text-[10px]">Session Persistent: Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Energy Meter */}
                    <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                      <div className="text-[9px] text-slate-500 font-mono mb-1">COGNITIVE ENERGY</div>
                      <div className="text-lg font-bold font-mono text-emerald-400">84% Optimal</div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[84%] transition-all" />
                      </div>
                    </div>

                    {/* Fatigue index */}
                    <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                      <div className="text-[9px] text-slate-500 font-mono mb-1">FATIGUE INDEX LIMIT</div>
                      <div className="text-lg font-bold font-mono text-cyan-400">32% Warning</div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-cyan-400 h-full w-[32%] transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Habit checklist interact */}
                  <div className="p-3 bg-[#080d1a] border border-cyan-500/15 rounded-lg">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">Routine Tracker Snapshot</span>
                      <span className="text-[9px] text-cyan-400 font-bold">Daily Log Completed: 66%</span>
                    </div>
                    <div className="space-y-1.5">
                      {habits.map((h, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            const clone = [...habits];
                            clone[i].done = !clone[i].done;
                            setHabits(clone);
                          }}
                          className="flex items-center space-x-2.5 p-0.5 px-1 hover:bg-slate-900/80 rounded transition-all cursor-pointer text-xs"
                        >
                          <input type="checkbox" checked={h.done} readOnly className="accent-cyan-400 rounded cursor-pointer" />
                          <span className={h.done ? "line-through text-slate-500 font-mono" : "text-slate-300 font-mono"}>{h.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 4: SENTRY RISK PREDICTION GUARD (OLD 1) */}
              {currentStep === 3 && (
                <div className="space-y-3.5 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <span className="text-rose-455 font-extrabold uppercase tracking-wide">AI Collision Calculator</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-mono">Telemetry Tracker Active</span>
                  </div>

                  <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-lg space-y-3 select-none">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono">Target Deadline Collision Coefficient:</span>
                      <span className="text-sm font-black text-rose-450 font-mono">{simulatedRisk}%</span>
                    </div>

                    {/* Latency interactive slider inside tour */}
                    <div className="space-y-1">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={simulatedRisk} 
                        onChange={(e) => setSimulatedRisk(parseInt(e.target.value))}
                        className="w-full accent-rose-500 bg-slate-800 h-1 rounded-full cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                        <span>MIN COLLISION (ON TIME)</span>
                        <span>MAX CRISIS (DANGER)</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning advice box */}
                  <div className={`p-2 rounded-lg border flex items-start space-x-2.5 transition-colors ${simulatedRisk > 50 ? "bg-rose-950/15 border-rose-500/30" : "bg-cyan-950/10 border-cyan-500/20"}`}>
                    <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${simulatedRisk > 50 ? "text-rose-400 animate-bounce" : "text-cyan-400"}`} />
                    <p className="text-[11px] leading-relaxed text-slate-300 font-mono">
                      {simulatedRisk > 50 
                        ? "CRITICAL: Multiple deep work blocks overlapping next Friday. Deadline slippage is forecast at 82%. Initiate smart repair plan!" 
                        : "METRIC RESTORED: Latency is within safe parameters. AI models forecast high completion rates."}
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 5: SMART SCHEDULE GENERATOR (OLD 2) */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <span className="text-cyan-400 font-extrabold uppercase">Calendar Repair Console</span>
                    <span className="text-slate-500 text-[10px]">Autonomic Optimisation</span>
                  </div>

                  {/* Visual calendar state simulation */}
                  <div className="grid grid-cols-4 gap-2">
                    {["Mo", "Tu", "We", "Th"].map((day, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded p-1.5 text-center">
                        <div className="text-[8px] text-slate-500 font-mono mb-1">{day}</div>
                        <div className={`text-[10px] py-1 rounded font-mono ${repaired ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"}`}>
                          {repaired ? "Allocated" : "Slipped"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#080d19] border border-cyan-500/15 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">Self-Repair Diagnosis</div>
                      <p className="text-xs text-slate-300 mt-1 font-mono">{repaired ? "✨ Timeline aligned. Calendar repaired." : "⚠️ Overlapping delays require optimization."}</p>
                    </div>

                    {!repaired ? (
                      <button 
                        onClick={runSelfRepair}
                        className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded shadow-lg transition-all animate-bounce"
                      >
                        Repair Workspace
                      </button>
                    ) : (
                      <button 
                        onClick={resetSimulation}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[9px] uppercase tracking-wider py-1.5 px-3 rounded transition-all"
                      >
                        Reset Demo
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SLIDE 6: INTERACTIVE AUTONOMIC CHAT (OLD 3) */}
              {currentStep === 5 && (
                <div className="flex-1 flex flex-col justify-between space-y-3 overflow-hidden animate-fade-in text-left">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-900">
                    <div className="flex items-center space-x-1.5">
                      <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-white font-extrabold uppercase font-mono text-[11px]">Coprocessor Node Session</span>
                    </div>
                    <span className="text-cyan-400 text-[9px] font-bold">Autonomic Core Synced</span>
                  </div>

                  {/* Tiny chat log */}
                  <div className="flex-1 bg-slate-950 rounded p-2 overflow-y-auto space-y-2 min-h-[90px] max-h-[120px] text-[10px] sm:text-[11px] font-mono select-none">
                    {chatLog.map((c, i) => (
                      <div key={i} className={`flex flex-col ${c.role === "user" ? "items-end" : "items-start"}`}>
                        <span className={`text-[8px] font-bold ${c.role === "user" ? "text-cyan-400" : "text-purple-400"}`}>
                          {c.role === "user" ? "USER_PROMPT" : "AUTONOMIC_ADVISOR"}
                        </span>
                        <div className={`p-1.5 rounded-lg mt-0.5 max-w-[90%] font-mono ${c.role === "user" ? "bg-slate-900 border border-slate-850 text-slate-300" : "bg-cyan-950/20 border border-cyan-500/20 text-cyan-300"}`}>
                          {c.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive input form inside tour */}
                  <form onSubmit={submitSimulatedChat} className="flex gap-2">
                    <input 
                      type="text" 
                      value={commandText}
                      onChange={(e) => setCommandText(e.target.value)}
                      placeholder="Try commanding: 'Repair roadmap schedule'..."
                      className="flex-1 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded text-[10px] text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs px-2.5 font-bold rounded shrink-0">
                      Send
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Simulated Live Video Control Ribbon (inside screen aspect overlay) */}
            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping" />
                <span className="text-slate-400">Live Simulation Syncing</span>
              </span>
              <span>Tour Progress: {currentTourStep ? currentTourStep.title : ""}</span>
            </div>
          </div>

          {/* Sub player bar controller */}
          <div className="mt-5 space-y-3.5">
            {/* Timeline slider bar */}
            <div className="relative w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            {/* Media controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 text-cyan-450 fill-cyan-450/20" />}
                </button>
                <button 
                  onClick={handlePrevStep}
                  className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={handleNextStep}
                  className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => {
                    setProgress(0);
                    speakNarration(currentStep);
                  }}
                  className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-slate-300 transition-all cursor-pointer"
                  title="Re-play Narration"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Audio and TTS narration speaker indicator */}
              <div className="flex items-center space-x-2.5">
                {narratorSpeaking && (
                  <span className="inline-flex space-x-0.5 items-center">
                    <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-4 bg-cyan-300 animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
                  </span>
                )}
                
                <button 
                  onClick={() => setAudioMuted(!audioMuted)}
                  className={`p-2 border rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer text-xs ${audioMuted ? "border-slate-800 text-slate-500" : "border-cyan-500/20 hover:bg-cyan-950/10 text-cyan-400"}`}
                >
                  {audioMuted ? <VolumeX className="w-4.5 h-4.5 animate-pulse" /> : <Volume2 className="w-4.5 h-4.5" />}
                  <span className="font-mono text-[10px] hidden sm:inline uppercase font-bold">{audioMuted ? "Voice Muted" : "Voice On"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Narrative Step Explainer Panel (Right Side) */}
        <div className="w-full md:w-[380px] p-5 sm:p-6 bg-[#060D1A] flex flex-col justify-between overflow-y-auto relative">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">GUIDED PRODUCT TOUR</span>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors"
                id="close-product-tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step navigation display / metadata */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wide font-mono">
                Slide {currentStep + 1} of {steps.length}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans tracking-tight">
                {currentTourStep ? currentTourStep.title : ""}
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold font-mono">
                {currentTourStep ? currentTourStep.subtitle : ""}
              </p>
            </div>

            {/* Detailed prose */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              {currentTourStep ? currentTourStep.description : ""}
            </p>

            {/* Stepper Dot Selector Matrix */}
            <div className="flex items-center space-x-2 pt-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProgress(0);
                    setCurrentStep(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${currentStep === i ? "w-6 bg-cyan-400" : "w-2 bg-slate-800 hover:bg-slate-700"}`}
                />
              ))}
            </div>
          </div>

          {/* Action Footer Call to Actions */}
          <div className="mt-8 pt-5 border-t border-slate-900/90 space-y-3">
            <button
              onClick={onGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 hover:from-blue-500 hover:via-cyan-400 hover:to-cyan-300 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md group flex items-center justify-center space-x-1"
            >
              <span>Instant Launch Engine</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <p className="text-center text-[10px] text-slate-500">
              Persistent synchronization with Firestore active database keys.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
