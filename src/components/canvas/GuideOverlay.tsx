"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

// ─── Illustrations ────────────────────────────────────────────────────────────

function WelcomeIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[70,140,210].map(x => <line key={x} x1={x} y1="10" x2={x} y2="98" stroke="#E5EAF0" strokeWidth="0.8"/>)}
      {[36,72].map(y => <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="#E5EAF0" strokeWidth="0.8"/>)}
      <rect x="26" y="15" width="76" height="52" rx="3" fill="rgba(10,79,110,0.09)" stroke="#0A4F6E" strokeWidth="1.5"/>
      <text x="64" y="44" textAnchor="middle" fontSize="8" fill="#0A4F6E" fontWeight="600">Office A</text>
      <rect x="112" y="15" width="60" height="52" rx="3" fill="rgba(0,201,167,0.12)" stroke="#00C9A7" strokeWidth="1.5"/>
      <text x="142" y="44" textAnchor="middle" fontSize="8" fill="#0A4F6E" fontWeight="600">Meeting</text>
      <rect x="182" y="15" width="72" height="52" rx="3" fill="rgba(146,133,202,0.10)" stroke="#9285CA" strokeWidth="1.5"/>
      <text x="218" y="44" textAnchor="middle" fontSize="8" fill="#0A4F6E" fontWeight="600">Lobby</text>
      <rect x="82" y="74" width="116" height="22" rx="11" fill="#9285CA"/>
      <text x="140" y="89" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">3 Rooms mapped</text>
    </svg>
  );
}

function DrawRoomIllustration() {
  const pts: [number,number][] = [[52,84],[52,30],[160,30],[192,60],[192,84]];
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[70,140,210].map(x => <line key={x} x1={x} y1="8" x2={x} y2="100" stroke="#E5EAF0" strokeWidth="0.8"/>)}
      {[36,72].map(y => <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="#E5EAF0" strokeWidth="0.8"/>)}
      <rect x="204" y="16" width="52" height="40" rx="2" fill="rgba(10,79,110,0.05)" stroke="#0A4F6E" strokeWidth="1" strokeDasharray="4 3"/>
      <motion.polygon
        points={pts.map(p => p.join(",")).join(" ")}
        fill="rgba(10,79,110,0.12)" stroke="#0A4F6E" strokeWidth="2"
        initial={{opacity:0}} animate={{opacity:1}}
        transition={{delay:1.8, duration:0.4, repeat:Infinity, repeatDelay:2.5}}
      />
      {pts.map((pt, i) => {
        const next = pts[(i+1) % pts.length];
        return <motion.line key={i} x1={pt[0]} y1={pt[1]} x2={next[0]} y2={next[1]}
          stroke="#0A4F6E" strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}}
          transition={{delay:0.3+i*0.25, duration:0.22, repeat:Infinity, repeatDelay:2.5}}/>;
      })}
      {pts.map((pt, i) => (
        <motion.circle key={i} cx={pt[0]} cy={pt[1]} r={i===0?5:3.5}
          fill={i===0?"#00C9A7":"#0A4F6E"} stroke="white" strokeWidth="1.5"
          initial={{scale:0}} animate={{scale:1}}
          transition={{delay:0.3+i*0.25, duration:0.18, type:"spring", repeat:Infinity, repeatDelay:2.5}}/>
      ))}
    </svg>
  );
}

function NameCountIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="46" y="10" width="188" height="88" rx="4" fill="rgba(0,201,167,0.10)" stroke="#00C9A7" strokeWidth="1.5"/>
      <rect x="68" y="20" width="96" height="16" rx="8" fill="#00C9A7"/>
      <text x="116" y="31" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">Conference Room</text>
      <circle cx="100" cy="66" r="10" fill="rgba(146,133,202,0.15)" stroke="#9285CA" strokeWidth="1.5"/>
      <circle cx="100" cy="62" r="3.5" fill="#9285CA"/>
      <path d="M93 74 Q100 68 107 74" stroke="#9285CA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="136" cy="66" r="10" fill="rgba(146,133,202,0.15)" stroke="#9285CA" strokeWidth="1.5"/>
      <circle cx="136" cy="62" r="3.5" fill="#9285CA"/>
      <path d="M129 74 Q136 68 143 74" stroke="#9285CA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <motion.g animate={{scale:[1,1.08,1]}} transition={{duration:1.3, repeat:Infinity, repeatDelay:0.8}}
        style={{transformOrigin:"185px 62px"}}>
        <circle cx="185" cy="62" r="16" fill="#9285CA"/>
        <text x="185" y="67" textAnchor="middle" fontSize="15" fill="white" fontWeight="700">2</text>
      </motion.g>
    </svg>
  );
}

function GroupZonesIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.rect x="22" y="7" width="236" height="94" rx="7"
        fill="transparent" stroke="#00C9A7" strokeWidth="2" strokeDasharray="8 5"
        animate={{opacity:[0.3,1,0.3]}} transition={{duration:2.2, repeat:Infinity}}
      />
      <text x="37" y="22" fontSize="8" fill="#00C9A7" fontWeight="700">Zone A — Marketing</text>
      <rect x="34" y="27" width="98" height="62" rx="3" fill="rgba(10,79,110,0.08)" stroke="#0A4F6E" strokeWidth="1.5"/>
      <text x="83" y="61" textAnchor="middle" fontSize="8" fill="#0A4F6E" fontWeight="600">Office 1</text>
      <rect x="144" y="27" width="102" height="62" rx="3" fill="rgba(146,133,202,0.10)" stroke="#9285CA" strokeWidth="1.5"/>
      <text x="195" y="61" textAnchor="middle" fontSize="8" fill="#0A4F6E" fontWeight="600">Office 2</text>
    </svg>
  );
}

function DoneIllustration() {
  return (
    <svg viewBox="0 0 280 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[70,140,210].map(x => <line key={x} x1={x} y1="8" x2={x} y2="66" stroke="#F0F4F8" strokeWidth="0.8"/>)}
      <rect x="22" y="12" width="72" height="50" rx="3" fill="rgba(0,201,167,0.12)" stroke="#00C9A7" strokeWidth="1.5"/>
      <rect x="104" y="12" width="72" height="50" rx="3" fill="rgba(0,201,167,0.12)" stroke="#00C9A7" strokeWidth="1.5"/>
      <rect x="186" y="12" width="72" height="50" rx="3" fill="rgba(0,201,167,0.12)" stroke="#00C9A7" strokeWidth="1.5"/>
      {([58,140,222] as number[]).map((cx,i) => (
        <motion.g key={i} initial={{scale:0}} animate={{scale:1}}
          transition={{delay:i*0.25, duration:0.3, type:"spring"}}>
          <circle cx={cx} cy="37" r="11" fill="#00C9A7"/>
          <path d={`M ${cx-5} 37 L ${cx-1} 41 L ${cx+5} 33`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </motion.g>
      ))}
      <rect x="52" y="72" width="176" height="24" rx="12" fill="#9285CA"/>
      <text x="140" y="88" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">Generate Room Program</text>
    </svg>
  );
}

// ─── Step data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Welcome to AreaSim",
    description: "Map your floor plan, draw rooms, count people, and generate area programs — all in one place.",
    aboveToolbar: false,
    cardLeft: undefined as string | undefined,
    arrowLeftPx: undefined as number | undefined,
    Illustration: WelcomeIllustration,
  },
  {
    title: "Draw Rooms",
    description: "Select the Pen tool below, then drag on the floor plan to outline a room.",
    aboveToolbar: true,
    // Shifts card so arrow at 58px from card-left lands on the Pen button
    // (toolbar is centered; pen button is ~184px left of screen center)
    cardLeft: "max(8px, calc(50% - 242px))" as string | undefined,
    arrowLeftPx: 58 as number | undefined,
    Illustration: DrawRoomIllustration,
  },
  {
    title: "Name & Count",
    description: "Tap any drawn room to give it a name and record the occupant count.",
    aboveToolbar: false,
    cardLeft: undefined as string | undefined,
    arrowLeftPx: undefined as number | undefined,
    Illustration: NameCountIllustration,
  },
  {
    title: "Group into Zones",
    description: "Use the Group tool below to select multiple rooms and bundle them into a named zone.",
    aboveToolbar: true,
    cardLeft: undefined as string | undefined,
    arrowLeftPx: undefined as number | undefined,
    Illustration: GroupZonesIllustration,
  },
  {
    title: "You're all set!",
    description: "When all rooms are counted, tap Room Program to generate your area report.",
    aboveToolbar: false,
    cardLeft: undefined as string | undefined,
    arrowLeftPx: undefined as number | undefined,
    Illustration: DoneIllustration,
  },
];

export const GUIDE_TOTAL = STEPS.length;

export function guideStepAboveToolbar(step: number) {
  return STEPS[step]?.aboveToolbar ?? false;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GuideOverlayProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function GuideOverlay({ step, onNext, onBack, onClose }: GuideOverlayProps) {
  const total = GUIDE_TOTAL;
  const current = STEPS[step];
  const { Illustration } = current;

  const card = (
    <motion.div
      key={step}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.17 }}
      className="relative w-72 rounded-2xl border border-[#E5EAF0] bg-white shadow-2xl"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors z-10"
      >
        <X size={13} />
      </button>

      <div className="p-4 pb-3">
        <span className="inline-block text-[10px] font-semibold text-[#9285CA] bg-[#F0EEFF] px-2 py-0.5 rounded-full font-body mb-2">
          Step {step + 1} of {total}
        </span>
        <h3 className="text-sm font-bold text-[#0D1B2A] font-body mb-1">{current.title}</h3>
        <p className="text-xs text-[#5A7184] font-body leading-relaxed mb-3">{current.description}</p>
        <div className="rounded-xl bg-[#F8FAFF] overflow-hidden" style={{ height: 108 }}>
          <Illustration />
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F5F9]">
        <button
          onClick={onBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-xs font-semibold font-body text-[#9285CA] disabled:opacity-30 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={13} /> Back
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === step ? 16 : 6,
                height: 6,
                background: i === step ? "#9285CA" : i < step ? "#C4B8E8" : "#D0DDE6",
              }}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="btn-3d rounded-full flex items-center gap-1.5 text-xs font-semibold font-body px-3 py-1.5 text-white"
        >
          {step >= total - 1 ? "Done" : "Next"} <ArrowRight size={13} />
        </button>
      </div>

      {/* CSS arrow pointing down to toolbar */}
      {current.aboveToolbar && (
        <div
          style={{
            position: "absolute",
            bottom: -9,
            left: current.arrowLeftPx !== undefined ? current.arrowLeftPx : "50%",
            transform: current.arrowLeftPx !== undefined ? "none" : "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
            borderTop: "9px solid #E5EAF0",
          }}
        >
          <div style={{ position: "absolute", top: -8, left: -8, width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: "8px solid white" }}
          />
        </div>
      )}
    </motion.div>
  );

  if (current.aboveToolbar) {
    return (
      <div
        className="absolute bottom-[76px] z-50 pointer-events-auto"
        style={{ left: current.cardLeft ?? "50%", transform: current.cardLeft ? "none" : "translateX(-50%)" }}
      >
        <AnimatePresence mode="wait">{card}</AnimatePresence>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="relative pointer-events-auto">
        <AnimatePresence mode="wait">{card}</AnimatePresence>
      </div>
    </div>
  );
}
