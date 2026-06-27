import React from "react";
import { motion } from "motion/react";
import { Cpu } from "lucide-react";

interface NeuroPilotLogoProps {
  className?: string;
  iconClassName?: string;
}

export default function NeuroPilotLogo({ 
  className = "w-10 h-10", 
  iconClassName = "w-5 h-5" 
}: NeuroPilotLogoProps) {
  return (
    <div className={`relative ${className} group cursor-pointer shrink-0`}>
      {/* Tech spinning outer aura */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/30 via-indigo-500/10 to-cyan-400/30 blur-md opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
      />
      
      {/* Secondary system ring */}
      <svg className="absolute inset-0 w-full h-full text-cyan-400/70 group-hover:text-cyan-300 transition-colors duration-300" viewBox="0 0 100 100">
        <motion.circle 
          cx="50" 
          cy="50" 
          r="44" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeDasharray="16 12 4 10"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      
      {/* Inner glowing pilot capsule */}
      <div className="absolute inset-1.5 rounded-xl bg-[#090D16] border border-cyan-500/40 flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-md">
        <Cpu className={`${iconClassName} text-cyan-400 animate-pulse`} />
      </div>
    </div>
  );
}
