import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export interface AnimatedMasteryBarProps {
  masteryPercentage: number;
  barWidthClass?: string;
  isMobile?: boolean;
  showLabel?: boolean;
}

export default function AnimatedMasteryBar({ 
  masteryPercentage, 
  barWidthClass = 'w-28 sm:w-36', 
  isMobile = false,
  showLabel = true 
}: AnimatedMasteryBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(masteryPercentage);
  const [recentGain, setRecentGain] = useState<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevPercentageRef = useRef(masteryPercentage);

  // Detect score updates and trigger celebratory visual feedback
  useEffect(() => {
    if (masteryPercentage !== prevPercentageRef.current) {
      const diff = masteryPercentage - prevPercentageRef.current;
      prevPercentageRef.current = masteryPercentage;
      if (diff > 0) {
        setRecentGain(diff);
        setIsPulsing(true);
        const pulseTimer = setTimeout(() => setIsPulsing(false), 1600);
        const gainTimer = setTimeout(() => setRecentGain(null), 3000);
        return () => {
          clearTimeout(pulseTimer);
          clearTimeout(gainTimer);
        };
      }
    }
  }, [masteryPercentage]);

  // Smooth numerical count-up animation
  useEffect(() => {
    const startVal = displayPercentage;
    const targetVal = masteryPercentage;
    if (startVal === targetVal) return;

    const duration = 850; // ms for smooth human-friendly count
    const startTime = performance.now();
    let frameId: number;

    const animateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startVal + (targetVal - startVal) * ease);
      setDisplayPercentage(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateNumber);
      } else {
        setDisplayPercentage(targetVal);
      }
    };

    frameId = requestAnimationFrame(animateNumber);
    return () => cancelAnimationFrame(frameId);
  }, [masteryPercentage]);

  return (
    <div className="relative select-none w-full">
      <motion.div
        animate={isPulsing ? { scale: [1, 1.05, 0.98, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`flex items-center space-x-2 sm:space-x-2.5 p-2 rounded-xl border-2 transition-all duration-300 ${
          isPulsing
            ? 'bg-lime-50 border-[#78c222] ring-4 ring-[#78c222]/30 shadow-[0_0_12px_rgba(120,194,34,0.5)]'
            : 'bg-[#fefaf0] border-[#560e51] shadow-[2px_2px_0px_0px_#560e51]'
        }`}
      >
        <div className="flex items-center gap-1 shrink-0">
          <Sparkles className={`h-3.5 w-3.5 transition-colors ${isPulsing ? 'text-[#78c222] fill-[#78c222] animate-bounce' : 'text-[#9b2c98]'}`} />
          {showLabel && (
            <span className="text-[10px] font-mono font-black uppercase text-[#560e51]">
              Mastery:
            </span>
          )}
        </div>

        <div className={`relative h-3 sm:h-3.5 flex-1 min-w-[60px] ${barWidthClass} bg-fuchsia-100 border border-[#560e51] rounded-full overflow-hidden shrink-0`}>
          {/* Animated fill bar using spring transition */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#78c222] via-[#8ae625] to-[#78c222] rounded-full relative overflow-hidden"
            initial={false}
            animate={{ width: `${displayPercentage}%` }}
            transition={{
              type: 'spring',
              stiffness: 45,
              damping: 14,
              mass: 0.8
            }}
          >
            {/* Glowing leading edge tip */}
            {displayPercentage > 3 && (
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full shadow-[0_0_6px_#fff]" />
            )}

            {/* Shimmer sweep effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-full h-full"
              initial={{ x: '-100%' }}
              animate={isPulsing ? { x: ['-100%', '200%'] } : { x: '-100%' }}
              transition={{ duration: 1.0, ease: 'easeInOut', repeat: isPulsing ? 2 : 0 }}
            />
          </motion.div>
        </div>

        <span className="text-xs font-black uppercase font-mono text-[#560e51] min-w-[2.5rem] text-right shrink-0">
          {displayPercentage}%
        </span>
      </motion.div>

      {/* Floating score update indicator (+X% Mastery) */}
      <AnimatePresence>
        {recentGain !== null && (
          <motion.div
            key="gain-toast"
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: isMobile ? -28 : -24, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? -42 : -36, scale: 0.8 }}
            transition={{ duration: 0.45, ease: 'backOut' }}
            className="absolute -top-1 right-0 bg-[#78c222] text-[#560e51] border-2 border-[#560e51] text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#560e51] flex items-center gap-1 z-40 pointer-events-none whitespace-nowrap"
          >
            <Sparkles className="h-2.5 w-2.5 fill-current text-[#560e51] animate-spin" />
            <span>+{recentGain}% Mastery!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
