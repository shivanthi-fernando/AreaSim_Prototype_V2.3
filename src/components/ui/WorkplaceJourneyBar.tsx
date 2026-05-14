"use client";

import { cn } from "@/lib/utils";

// ─── Step icons (each uses its step's brand color) ─────────────────────────────

function IconCountCollect() {
  // Purple — grid/spreadsheet
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2"  y="2"  width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.85"/>
      <rect x="12" y="2"  width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.65"/>
      <rect x="2"  y="9"  width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.65"/>
      <rect x="12" y="9"  width="8" height="5" rx="1.2" fill="#6D5FAD" fillOpacity="0.45"/>
      <rect x="2"  y="16" width="8" height="3" rx="1.2" fill="#6D5FAD" fillOpacity="0.32"/>
      <rect x="12" y="16" width="8" height="3" rx="1.2" fill="#6D5FAD" fillOpacity="0.22"/>
      {/* 3D bottom edge */}
      <rect x="2"  y="6"  width="8" height="1.5" rx="0" fill="#3D2F8A" fillOpacity="0.18"/>
      <rect x="12" y="6"  width="8" height="1.5" rx="0" fill="#3D2F8A" fillOpacity="0.12"/>
    </svg>
  );
}

function IconAnalysis() {
  // Amber — bar chart
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* bars with 3D bottom shadow */}
      <rect x="2"  y="15" width="3.5" height="5"  rx="0.8" fill="#C47A2C" fillOpacity="0.7"/>
      <rect x="2"  y="19" width="3.5" height="1"  rx="0"   fill="#7A4A10" fillOpacity="0.25"/>
      <rect x="7"  y="10" width="3.5" height="10" rx="0.8" fill="#C47A2C" fillOpacity="0.82"/>
      <rect x="7"  y="19" width="3.5" height="1"  rx="0"   fill="#7A4A10" fillOpacity="0.25"/>
      <rect x="12" y="5"  width="3.5" height="15" rx="0.8" fill="#C47A2C" fillOpacity="0.95"/>
      <rect x="12" y="19" width="3.5" height="1"  rx="0"   fill="#7A4A10" fillOpacity="0.25"/>
      {/* axes */}
      <rect x="17" y="2"  width="1"   height="18" rx="0.5" fill="#C47A2C" fillOpacity="0.18"/>
      <rect x="1"  y="20" width="18"  height="1"  rx="0.5" fill="#C47A2C" fillOpacity="0.18"/>
    </svg>
  );
}

function IconWorkplaceConcept() {
  // Green — 4-zone squares
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2"  y="2"  width="8" height="8" rx="1.5" fill="#139485" fillOpacity="0.7"/>
      <rect x="12" y="2"  width="8" height="8" rx="1.5" fill="#3B82F6" fillOpacity="0.65"/>
      <rect x="2"  y="12" width="8" height="8" rx="1.5" fill="#E05D8B" fillOpacity="0.65"/>
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#C47A2C" fillOpacity="0.65"/>
      {/* 3D bottom edge on each */}
      <rect x="2"  y="9"  width="8" height="1" rx="0" fill="#0A6E61" fillOpacity="0.2"/>
      <rect x="12" y="9"  width="8" height="1" rx="0" fill="#1E3E8A" fillOpacity="0.2"/>
      <rect x="2"  y="19" width="8" height="1" rx="0" fill="#A02060" fillOpacity="0.2"/>
      <rect x="12" y="19" width="8" height="1" rx="0" fill="#7A4A10" fillOpacity="0.2"/>
    </svg>
  );
}

function IconRoomProgram() {
  // Blue — calendar grid
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="1.5" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="1.3"/>
      {/* 3D bottom */}
      <rect x="3" y="19" width="16" height="1" rx="0.5" fill="#1E3E8A" fillOpacity="0.18"/>
      <path d="M7 2v4M15 2v4" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M2 9h18" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4"/>
      <rect x="5"   y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.65"/>
      <rect x="9.5" y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.45"/>
      <rect x="14"  y="12" width="3" height="3" rx="0.5" fill="#3B82F6" fillOpacity="0.45"/>
    </svg>
  );
}

function IconDesignPhase() {
  // Rose — blueprint floor plan
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="1.5" width="19" height="19" rx="1.8" fill="#E05D8B" fillOpacity="0.07" stroke="#E05D8B" strokeWidth="1.3" strokeDasharray="2.5 2"/>
      {/* 3D offset */}
      <rect x="2.5" y="20" width="17" height="1" rx="0.5" fill="#A02060" fillOpacity="0.15"/>
      <rect x="3.5" y="3.5" width="6"  height="8"  rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12"/>
      <rect x="11"  y="3.5" width="7.5" height="5" rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12"/>
      <rect x="3.5" y="13" width="15"  height="5.5" rx="0.8" stroke="#E05D8B" strokeWidth="1.1" fill="#E05D8B" fillOpacity="0.12"/>
    </svg>
  );
}

function IconOptimization() {
  // Green — trend line with dots
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* shadow path */}
      <path d="M2 17.5l5-5 3.5 2.5 5.5-7 4 3" stroke="#0A6E61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.18"/>
      {/* main path */}
      <path d="M2 16.5l5-5 3.5 2.5 5.5-7 4 3" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="19.5" cy="9" r="2.5" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.1"/>
      <path d="M2 20h18" stroke="#10B981" strokeWidth="0.8" strokeOpacity="0.2"/>
    </svg>
  );
}

// ─── Sparkle SVG (for score widget) ───────────────────────────────────────────
function Sparkle({ size = 10, color = "#C47A2C", opacity = 0.9 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 0L6.2 3.8L10 5L6.2 6.2L5 10L3.8 6.2L0 5L3.8 3.8Z" fill={color} />
    </svg>
  );
}

// ─── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "1-2",
    label: "STEP 1–2",
    name: "Count + Collect",
    Icon: IconCountCollect,
    color: "#6D5FAD",
    bg: "rgba(109,95,173,0.09)",
    border: "rgba(109,95,173,0.3)",
    activeBorder: "#6D5FAD",
    activeGradient: "linear-gradient(135deg, rgba(109,95,173,0.18) 0%, rgba(80,65,160,0.12) 100%)",
    shadow: "rgba(109,95,173,0.28)",
  },
  {
    id: "3",
    label: "STEP 3",
    name: "Analysis + Advice",
    Icon: IconAnalysis,
    color: "#C47A2C",
    bg: "rgba(196,122,44,0.09)",
    border: "rgba(196,122,44,0.3)",
    activeBorder: "#C47A2C",
    activeGradient: "linear-gradient(135deg, rgba(196,122,44,0.18) 0%, rgba(160,90,15,0.12) 100%)",
    shadow: "rgba(196,122,44,0.28)",
  },
  {
    id: "4",
    label: "STEP 4",
    name: "Workplace Concept",
    Icon: IconWorkplaceConcept,
    color: "#139485",
    bg: "rgba(19,148,133,0.09)",
    border: "rgba(19,148,133,0.3)",
    activeBorder: "#139485",
    activeGradient: "linear-gradient(135deg, rgba(19,148,133,0.18) 0%, rgba(10,110,97,0.12) 100%)",
    shadow: "rgba(19,148,133,0.28)",
  },
  {
    id: "5",
    label: "STEP 5",
    name: "Room Program",
    Icon: IconRoomProgram,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.09)",
    border: "rgba(59,130,246,0.3)",
    activeBorder: "#3B82F6",
    activeGradient: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(30,90,200,0.12) 100%)",
    shadow: "rgba(59,130,246,0.28)",
  },
  {
    id: "6",
    label: "STEP 6",
    name: "Design Phase",
    Icon: IconDesignPhase,
    color: "#E05D8B",
    bg: "rgba(224,93,139,0.09)",
    border: "rgba(224,93,139,0.3)",
    activeBorder: "#E05D8B",
    activeGradient: "linear-gradient(135deg, rgba(224,93,139,0.18) 0%, rgba(180,50,100,0.12) 100%)",
    shadow: "rgba(224,93,139,0.28)",
  },
  {
    id: "7",
    label: "STEP 7",
    name: "Optimisation",
    Icon: IconOptimization,
    color: "#10B981",
    bg: "rgba(16,185,129,0.09)",
    border: "rgba(16,185,129,0.3)",
    activeBorder: "#10B981",
    activeGradient: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(8,130,90,0.12) 100%)",
    shadow: "rgba(16,185,129,0.28)",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WorkplaceJourneyBarProps {
  activeStep?: StepId;
}

export function WorkplaceJourneyBar({ activeStep = "1-2" }: WorkplaceJourneyBarProps) {
  const activeIdx = STEPS.findIndex((s) => s.id === activeStep);

  return (
    // No bg, no top border, no top padding — flush under navbar
    <div className="w-full px-4 pb-2 flex items-center gap-1.5 shrink-0 overflow-x-auto">

      {/* ── GO badge — dark pastel green ── */}
      <div
        className="shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
        style={{
          background: "linear-gradient(160deg, #2E7D5C 0%, #1F5C3C 100%)",
          minWidth: 46,
        }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">GO</span>
        <span className="text-[8px] font-semibold text-white/55 mt-[3px]">Start</span>
      </div>

      {/* ── Steps ── */}
      {STEPS.map((step, i) => {
        const isActive = step.id === activeStep;
        const isPast   = i < activeIdx;
        const { Icon } = step;

        return (
          <div key={step.id} className="flex items-center gap-1 shrink-0">

            {/* Chevron */}
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" className="shrink-0">
              <path
                d="M1.5 1.5l6 5.5-6 5.5"
                stroke={isActive ? step.color : isPast ? step.color : "#C8C0B8"}
                strokeOpacity={isPast ? 0.5 : 1}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Step card */}
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200",
                !isActive && !isPast && "opacity-65"
              )}
              style={{
                background: isActive ? step.activeGradient : step.bg,
                borderColor: isActive ? step.activeBorder : step.border,
                borderWidth: isActive ? "1.5px" : "1px",
                boxShadow: isActive
                  ? `0 3px 12px ${step.shadow}, 0 1px 3px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.5)`
                  : undefined,
              }}
            >
              {/* Icon box — 3D for active, slightly shaded for inactive */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(240,240,255,0.85) 100%)",
                        border: `1.5px solid ${step.activeBorder}`,
                        boxShadow: `0 2px 6px ${step.shadow}, inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.06)`,
                      }
                    : {
                        background: "rgba(255,255,255,0.70)",
                        border: `1px solid ${step.border}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                      }
                }
              >
                <Icon />
              </div>

              {/* Text */}
              <div>
                <p
                  className="text-[8px] font-bold uppercase tracking-[0.09em] leading-none"
                  style={{ color: step.color, opacity: isActive ? 1 : 0.8 }}
                >
                  {step.label}
                </p>
                <p
                  className="text-[11.5px] font-semibold leading-tight mt-[3px] whitespace-nowrap"
                  style={{
                    color: isActive ? step.color : "#5C6B73",
                    fontFamily: "var(--font-manrope)",
                    fontWeight: isActive ? 700 : 600,
                  }}
                >
                  {step.name}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Potential Score widget — gamification style ── */}
      <div className="ml-auto shrink-0 pl-2">
        <div
          className="relative flex items-center gap-3 px-4 py-2 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1F5C3C 0%, #2C7A53 50%, #1A4A6A 100%)",
            boxShadow: "0 3px 14px rgba(31,92,60,0.45), 0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {/* ── Sparkle decorations ── */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-1.5 right-[52px]">
              <Sparkle size={9} color="#C47A2C" opacity={0.95} />
            </div>
            <div className="absolute bottom-1.5 right-[70px]">
              <Sparkle size={6} color="#C47A2C" opacity={0.7} />
            </div>
            <div className="absolute top-2 right-[36px]">
              <Sparkle size={5} color="#F5E642" opacity={0.8} />
            </div>
            {/* colored dots */}
            <div className="absolute top-1.5 right-[44px] w-[5px] h-[5px] rounded-full" style={{ background: "#6D5FAD", opacity: 0.9 }} />
            <div className="absolute bottom-2 right-[42px] w-[4px] h-[4px] rounded-full" style={{ background: "#3B82F6", opacity: 0.9 }} />
            <div className="absolute top-3 right-[24px] w-[3px] h-[3px] rounded-full" style={{ background: "#E05D8B", opacity: 0.8 }} />
          </div>

          {/* Shield icon — purple gradient */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #7B6CC0 0%, #5244A0 100%)",
              border: "1.5px solid rgba(255,255,255,0.28)",
              boxShadow: "0 2px 8px rgba(80,60,180,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path
                d="M9 1L1.5 4.5V10C1.5 14.5 4.8 18.6 9 19.5C13.2 18.6 16.5 14.5 16.5 10V4.5L9 1Z"
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              {/* star inside shield */}
              <path
                d="M9 6.5l1 2.5h2.5l-2 1.5.8 2.5L9 11.5 6.7 13l.8-2.5-2-1.5H8Z"
                fill="#F5E642"
                stroke="#C47A2C"
                strokeWidth="0.4"
              />
            </svg>
          </div>

          {/* Score info */}
          <div className="relative z-10">
            <p className="text-[8px] font-bold uppercase tracking-widest leading-none" style={{ color: "rgba(255,255,255,0.6)" }}>
              Your Potential Score
            </p>
            <p
              className="text-[19px] font-black text-white leading-tight mt-[2px]"
              style={{ fontFamily: "var(--font-manrope)", textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
            >
              385
              <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}> / 1,000</span>
            </p>
            {/* Progress bar + level */}
            <div className="flex items-center gap-2 mt-1.5">
              <div
                className="h-[5px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.18)", width: 76 }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "38.5%",
                    background: "linear-gradient(90deg, #C47A2C 0%, #F5A623 60%, #F5E642 100%)",
                    boxShadow: "0 0 6px rgba(245,166,35,0.6)",
                  }}
                />
              </div>
              <span
                className="text-[8px] font-bold whitespace-nowrap"
                style={{ color: "#F5A623" }}
              >
                Lv.1 · Explorer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
