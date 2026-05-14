"use client";

import { cn } from "@/lib/utils";

// ─── Step icons ────────────────────────────────────────────────────────────────
function IconCountCollect() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2"  width="8" height="5" rx="1.2" fill="#139485" fillOpacity="0.75"/>
      <rect x="12" y="2" width="8" height="5" rx="1.2" fill="#139485" fillOpacity="0.5"/>
      <rect x="2" y="9"  width="8" height="5" rx="1.2" fill="#139485" fillOpacity="0.5"/>
      <rect x="12" y="9" width="8" height="5" rx="1.2" fill="#139485" fillOpacity="0.35"/>
      <rect x="2" y="16" width="8" height="3"  rx="1.2" fill="#139485" fillOpacity="0.25"/>
      <rect x="12" y="16" width="8" height="3" rx="1.2" fill="#139485" fillOpacity="0.18"/>
    </svg>
  );
}

function IconAnalysis() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2"  y="15" width="3.5" height="5"  rx="0.8" fill="#C47A2C" fillOpacity="0.55"/>
      <rect x="7"  y="10" width="3.5" height="10" rx="0.8" fill="#C47A2C" fillOpacity="0.7"/>
      <rect x="12" y="5"  width="3.5" height="15" rx="0.8" fill="#C47A2C" fillOpacity="0.85"/>
      <rect x="17" y="2"  width="1"   height="18" rx="0.5" fill="#C47A2C" fillOpacity="0.15"/>
      <rect x="1"  y="20" width="18"  height="1"  rx="0.5" fill="#C47A2C" fillOpacity="0.15"/>
      <path d="M3.75 13 8.75 8 13.75 3" stroke="#C47A2C" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="1.5 1.5"/>
    </svg>
  );
}

function IconWorkplaceConcept() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2"  y="2"  width="8" height="8" rx="1.5" fill="#6D5FAD" fillOpacity="0.55"/>
      <rect x="12" y="2"  width="8" height="8" rx="1.5" fill="#3B82F6" fillOpacity="0.5"/>
      <rect x="2"  y="12" width="8" height="8" rx="1.5" fill="#E05D8B" fillOpacity="0.5"/>
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.5"/>
    </svg>
  );
}

function IconRoomProgram() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="1.5" stroke="#3B82F6" strokeWidth="1.3" fill="none"/>
      <path d="M7 2v4M15 2v4" stroke="#3B82F6" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M2 9h18" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.35"/>
      <rect x="5"  y="12" width="3.5" height="3.5" rx="0.6" fill="#3B82F6" fillOpacity="0.55"/>
      <rect x="9.5" y="12" width="3.5" height="3.5" rx="0.6" fill="#3B82F6" fillOpacity="0.35"/>
      <rect x="14" y="12" width="3.5" height="3.5" rx="0.6" fill="#3B82F6" fillOpacity="0.35"/>
    </svg>
  );
}

function IconDesignPhase() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="1.5" width="19" height="19" rx="1.8" stroke="#E05D8B" strokeWidth="1.2" strokeDasharray="2.5 2"/>
      <rect x="3.5" y="3.5" width="6"  height="8"  rx="0.8" stroke="#E05D8B" strokeWidth="1" strokeOpacity="0.65"/>
      <rect x="11"  y="3.5" width="7.5" height="5" rx="0.8" stroke="#E05D8B" strokeWidth="1" strokeOpacity="0.65"/>
      <rect x="3.5" y="13" width="15" height="5.5" rx="0.8" stroke="#E05D8B" strokeWidth="1" strokeOpacity="0.65"/>
    </svg>
  );
}

function IconOptimization() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 16l5-5 3.5 2.5 5.5-7 4 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="19" cy="7" r="2.5" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1"/>
      <path d="M2 20h18" stroke="#10B981" strokeWidth="0.8" strokeOpacity="0.25"/>
      <rect x="2" y="5" width="5" height="2" rx="0.5" fill="#10B981" fillOpacity="0.3"/>
      <rect x="2" y="8" width="3.5" height="2" rx="0.5" fill="#10B981" fillOpacity="0.2"/>
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
    color: "#139485",
    bg: "rgba(19,148,133,0.09)",
    border: "rgba(19,148,133,0.28)",
    activeBorder: "#139485",
  },
  {
    id: "3",
    label: "STEP 3",
    name: "Analysis + Advice",
    Icon: IconAnalysis,
    color: "#C47A2C",
    bg: "rgba(196,122,44,0.09)",
    border: "rgba(196,122,44,0.28)",
    activeBorder: "#C47A2C",
  },
  {
    id: "4",
    label: "STEP 4",
    name: "Workplace Concept",
    Icon: IconWorkplaceConcept,
    color: "#6D5FAD",
    bg: "rgba(109,95,173,0.09)",
    border: "rgba(109,95,173,0.28)",
    activeBorder: "#6D5FAD",
  },
  {
    id: "5",
    label: "STEP 5",
    name: "Room Program",
    Icon: IconRoomProgram,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.09)",
    border: "rgba(59,130,246,0.28)",
    activeBorder: "#3B82F6",
  },
  {
    id: "6",
    label: "STEP 6",
    name: "Design Phase",
    Icon: IconDesignPhase,
    color: "#E05D8B",
    bg: "rgba(224,93,139,0.09)",
    border: "rgba(224,93,139,0.28)",
    activeBorder: "#E05D8B",
  },
  {
    id: "7",
    label: "STEP 7",
    name: "Optimisation",
    Icon: IconOptimization,
    color: "#10B981",
    bg: "rgba(16,185,129,0.09)",
    border: "rgba(16,185,129,0.28)",
    activeBorder: "#10B981",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WorkplaceJourneyBarProps {
  activeStep?: StepId;
}

export function WorkplaceJourneyBar({ activeStep = "1-2" }: WorkplaceJourneyBarProps) {
  const activeIdx = STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="w-full bg-[#FDFBF7] border-b border-[#E8E2D8] px-4 py-2 flex items-center gap-1.5 shrink-0 overflow-x-auto">

      {/* ── GO badge ── */}
      <div
        className="shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-xl"
        style={{ background: "#1F2A24", minWidth: 46 }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">GO</span>
        <span className="text-[8px] font-semibold text-white/55 mt-[3px]">Start</span>
      </div>

      {/* ── Steps ── */}
      {STEPS.map((step, i) => {
        const isActive = step.id === activeStep;
        const isPast = i < activeIdx;
        const { Icon } = step;

        return (
          <div key={step.id} className="flex items-center gap-1 shrink-0">

            {/* Chevron connector */}
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" className="shrink-0">
              <path
                d="M1.5 1.5l6 5.5-6 5.5"
                stroke={isActive ? step.color : isPast ? step.color : "#C8C0B8"}
                strokeOpacity={isActive ? 1 : isPast ? 0.6 : 1}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Step card */}
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200",
                isActive && "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
                !isActive && !isPast && "opacity-55"
              )}
              style={{
                background: step.bg,
                borderColor: isActive ? step.activeBorder : step.border,
                borderWidth: isActive ? "1.5px" : "1px",
              }}
            >
              {/* Icon box */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: `1px solid ${step.border}`,
                }}
              >
                <Icon />
              </div>

              {/* Text */}
              <div>
                <p
                  className="text-[8px] font-bold uppercase tracking-[0.09em] leading-none"
                  style={{ color: step.color }}
                >
                  {step.label}
                </p>
                <p
                  className="text-[11.5px] font-semibold leading-tight mt-[3px] whitespace-nowrap"
                  style={{
                    color: isActive ? step.color : isPast ? step.color : "#6B7C73",
                    fontFamily: "var(--font-manrope)",
                    opacity: isPast ? 0.75 : 1,
                  }}
                >
                  {step.name}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Potential Score widget ── */}
      <div className="ml-auto shrink-0 pl-2">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{ background: "linear-gradient(135deg, #1ab09f 0%, #0c7466 100%)" }}
        >
          {/* Shield icon */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
              <path
                d="M8.5 1L1 4.5V9.8C1 14.4 4.3 18.6 8.5 19.5C12.7 18.6 16 14.4 16 9.8V4.5L8.5 1Z"
                fill="rgba(255,255,255,0.22)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1"
              />
              <path
                d="M5.5 10l2.5 2.5 4-4.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Score info */}
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/65 leading-none">
              Your Potential Score
            </p>
            <p
              className="text-[18px] font-black text-white leading-tight mt-[2px]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              385
              <span className="text-[11px] font-medium text-white/55"> / 1,000</span>
            </p>
            {/* Progress bar + level */}
            <div className="flex items-center gap-2 mt-1.5">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.22)", width: 72 }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "38.5%",
                    background: "linear-gradient(90deg, #A8F5E0 0%, #4ADBB8 100%)",
                  }}
                />
              </div>
              <span className="text-[8px] font-semibold text-white/60 whitespace-nowrap font-body">
                Lv.1 · Explorer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
