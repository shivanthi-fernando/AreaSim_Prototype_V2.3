"use client";

import { cn } from "@/lib/utils";

// ─── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: "1-2", number: "1–2", label: "Count + Collect",         color: "#139485", bg: "#EAF5F3" },
  { id: "3",   number: "3",   label: "Analysis + Advice",       color: "#0A7A6B", bg: "#E0F2EE" },
  { id: "4",   number: "4",   label: "Workplace Concept",       color: "#6D5FAD", bg: "#F0EEFF" },
  { id: "5",   number: "5",   label: "Room Program",            color: "#C47A2C", bg: "#FDF0E4" },
  { id: "6",   number: "6",   label: "Design Phase",            color: "#3A6FB5", bg: "#EBF2FF" },
  { id: "7",   number: "7",   label: "Optimisation",            color: "#2C7A53", bg: "#EAF5EE" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface WorkplaceJourneyBarProps {
  /** Which step is currently active. Defaults to "1-2". */
  activeStep?: StepId;
}

export function WorkplaceJourneyBar({ activeStep = "1-2" }: WorkplaceJourneyBarProps) {
  return (
    <div className="w-full bg-[#FDFBF7] border-b border-[#E8E2D8] px-6 pt-5 pb-2.5 flex items-end justify-center shrink-0">
      <div className="flex items-end">
        {STEPS.map((step, i) => {
          const isActive = step.id === activeStep;
          const isPast = STEPS.findIndex((s) => s.id === activeStep) > i;

          return (
            <div key={step.id} className="flex items-center">
              {/* ── Step node ── */}
              <div className="flex flex-col items-center gap-1 relative">

                {/* "You are here" balloon — only on active */}
                {isActive && (
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap"
                    aria-hidden
                  >
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-[2px] rounded-full border"
                      style={{
                        color: step.color,
                        background: step.bg,
                        borderColor: step.color + "44",
                      }}
                    >
                      You are here
                    </span>
                    {/* tiny triangle pointing down */}
                    <svg
                      className="absolute -bottom-[6px] left-1/2 -translate-x-1/2"
                      width="8" height="5" viewBox="0 0 8 5" fill="none"
                    >
                      <path d="M4 5L0 0h8L4 5z" fill={step.bg} />
                    </svg>
                  </div>
                )}

                {/* Numbered circle */}
                <div
                  className={cn(
                    "w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200",
                    isActive
                      ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] ring-[2.5px] ring-white ring-offset-[1.5px]"
                      : isPast
                        ? "text-white opacity-70"
                        : "border-[1.5px] text-[#B0B8BC] bg-white"
                  )}
                  style={
                    isActive
                      ? { background: step.color }
                      : isPast
                        ? { background: step.color }
                        : { borderColor: "#D8D8D8" }
                  }
                >
                  {step.number}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[9.5px] font-medium leading-tight text-center whitespace-nowrap transition-all duration-200",
                    isActive ? "font-semibold" : isPast ? "opacity-60" : "text-[#B0B8BC]"
                  )}
                  style={isActive ? { color: step.color } : isPast ? { color: step.color } : {}}
                >
                  {step.label}
                </span>
              </div>

              {/* ── Connector ── */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center mb-3.5 mx-1.5">
                  <svg width="36" height="4" viewBox="0 0 36 4" fill="none">
                    <line
                      x1="0" y1="2" x2="36" y2="2"
                      stroke={isPast ? STEPS[i].color : "#D8D8D8"}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
