import React, { useState, useEffect, useRef } from "react";
import { Bot, Mic, Send, MessageSquare, VolumeX, Volume2, Command, Sparkles, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface AIChatPanelProps {
  token: string;
  onVoiceCommandTrigger: (command: string) => void;
  onShowToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
}

export default function AIChatPanel({ 
  token, 
  onVoiceCommandTrigger, 
  onShowToast,
  prefilledPrompt,
  onClearPrefilledPrompt
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Affirmative, Pilot. I am your NeuroPilot AI Chief of Staff. Give me general commands to navigate your roadmap. Tap 'Voice command' to try speaking directly, or ask me for scheduling advice.",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    }
  ]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (prefilledPrompt) {
      setInputText(prefilledPrompt);
      if (onClearPrefilledPrompt) {
        onClearPrefilledPrompt();
      }
    }
  }, [prefilledPrompt]);
  const [loading, setLoading] = useState(false);
  
  // Voice preferences
  const [isSynthesizing, setIsSynthesizing] = useState(true);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check speech recognition capability
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setSpeechSupported(true);
    }
    // Auto-scroll chat to bottom on new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle TTS speech synthesis out loud
  const speakLocalText = (text: string) => {
    try {
      if (!isSynthesizing || typeof window === "undefined" || !window.speechSynthesis) return;

      // Cancel currently speaking lines
      window.speechSynthesis.cancel();

      // Create prompt utterance
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to choose a high-end clear english locale voice if available
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find((v) => v.lang.includes("en-US") || v.lang.includes("en-GB"));
      if (premiumVoice) utterance.voice = premiumVoice;
      
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("Speech synthesis is unavailable or blocked in this window/iframe environment:", error);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    // VOICE COMMAND ENGINE PARSING SHORTCUTS
    const cleanLower = textToSend.toLowerCase();
    
    // Check command mappings
    if (cleanLower.includes("create task") || cleanLower.includes("create a task") || cleanLower.includes("add a task")) {
      setTimeout(() => {
        const replyText = "Understood. Switching environment tab and launching the Task Prioritizer panel.";
        setMessages((prev) => [...prev, {
          sender: "ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        }]);
        speakLocalText(replyText);
        setLoading(false);
        onVoiceCommandTrigger("create_task");
      }, 700);
      return;
    }

    if (cleanLower.includes("plan day") || cleanLower.includes("plan my day") || cleanLower.includes("show my day") || cleanLower.includes("generate schedule") || cleanLower.includes("generate study schedule")) {
      setTimeout(() => {
        const replyText = "Affirmative. Launching Schedule calibrations. Let me organize your daily slots sequentially.";
        setMessages((prev) => [...prev, {
          sender: "ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        }]);
        speakLocalText(replyText);
        setLoading(false);
        onVoiceCommandTrigger("generate_schedule");
      }, 700);
      return;
    }

    if (cleanLower.includes("show deadlines") || cleanLower.includes("show risks") || cleanLower.includes("risk predictor") || cleanLower.includes("predict")) {
      setTimeout(() => {
        const replyText = "Warning matrix active. Launching the Deadline Risk Predictor forecasting chart.";
        setMessages((prev) => [...prev, {
          sender: "ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        }]);
        speakLocalText(replyText);
        setLoading(false);
        onVoiceCommandTrigger("show_deadlines");
      }, 700);
      return;
    }

    // Connect to server AI Assistant Chat proxy
    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const aiReply: ChatMessage = {
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiReply]);
      speakLocalText(data.reply);
    } catch (e: any) {
      setMessages((prev) => [...prev, {
        sender: "ai",
        text: `Error contacting server processors: ${e.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // WEB SPEECH RECOGNITION API CLIENT ACTIVATION
  const handleToggleVoiceListening = () => {
    if (!speechSupported) {
      if (onShowToast) {
        onShowToast("Speech recognition is not supported in this browser environment.", "error");
      } else {
        console.warn("Web speech recognition is not supported in this browser version. Use text formatting instead.");
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("SpeechRecognition API is not available on this window context");
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setInputText(speechToText);
        // Automatically send the recognized speech
        handleSendMessage(speechToText);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech API error: ", e);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (error) {
      console.warn("Speech recognition failed to initialize or start:", error);
      if (onShowToast) {
        onShowToast("Speech recognition permission denied or blocked by sandbox iframe restrictions.", "warning");
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[580px] overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">NeuroPilot Advisor</span>
            <span className="text-[10px] text-cyan-400 block font-mono">Cognitive Co-Pilot v1.2</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* TTS Toggle button */}
          <button
            onClick={() => setIsSynthesizing(!isSynthesizing)}
            className={`p-2 rounded-lg transition-all ${isSynthesizing ? "bg-blue-600/20 text-blue-400" : "text-slate-500"}`}
            title={isSynthesizing ? "Mute TTS voice output" : "Unmute TTS voice output"}
          >
            {isSynthesizing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages Scroll container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed border relative group ${
              m.sender === "user" 
                ? "bg-blue-600 border-blue-500 text-white rounded-tr-none" 
                : "bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none"
            }`}>
              <p>{m.text}</p>
              <div className="flex items-center justify-between mt-2 text-[9px] opacity-60 font-mono">
                <span>{m.timestamp}</span>
                <span className="uppercase text-[8px] font-bold tracking-widest">{m.sender}</span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-2xl text-xs text-slate-500 font-mono flex items-center space-x-1">
              <span className="animate-pulse">Consulting neural priority channels...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Shortcuts Help bar */}
      <div className="px-4 py-1.5 bg-[#0F172A] border-t border-slate-850 flex items-center space-x-1.5 overflow-x-auto shrink-0 scrollbar-none">
        <Command className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-[10px] text-slate-500 font-mono uppercase font-bold shrink-0">Shortcuts:</span>
        {[
          { label: "Create a task", text: "Create a task" },
          { label: "Plan my day", text: "Plan my day" },
          { label: "Show deadlines", text: "Show deadlines" }
        ].map((tag, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(tag.text)}
            className="px-2 py-0.5 bg-slate-900 border border-slate-800 hover:border-blue-500/20 text-[9px] text-slate-400 hover:text-white rounded font-semibold transition-all shrink-0"
          >
            "{tag.label}"
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex items-center space-x-2.5"
        >
          {/* Micro option */}
          <button
            type="button"
            onClick={handleToggleVoiceListening}
            className={`p-2.5 rounded-xl border transition-all shrink-0 relative ${
              listening 
                ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" 
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Start Browser Web Speech Recognition voice control"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            id="chat-user-message-input"
            type="text"
            placeholder={listening ? "Listening... Speak now" : "Ask NeuroPilot prompt..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={listening}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500/50"
          />

          <button
            id="chat-submit-message-btn"
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-all shadow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
