"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ChevronLeft,
  PenLine,
  MousePointer2,
  Group as GroupIcon,
  Eraser,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Step 1: welcome illustration (centered modal only) ─────────────────────

function IllustrationWelcome() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <motion.rect
        x="30" y="20" width="260" height="145" rx="6"
        stroke="#1A7FA8" strokeWidth="2.5" fill="#EEF3F8"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
      />
      {[
        { d: "M 30 90 L 180 90" },
        { d: "M 180 20 L 180 90" },
        { d: "M 180 90 L 180 165" },
        { d: "M 180 90 L 290 90" },
      ].map((p, i) => (
        <motion.path
          key={i} d={p.d} stroke="#374151" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
      {[
        { x: 95, y: 52, text: "Meeting A" },
        { x: 230, y: 52, text: "Open Office" },
        { x: 95, y: 130, text: "Break Room" },
        { x: 230, y: 130, text: "Focus" },
      ].map((l, i) => (
        <motion.text
          key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="10"
          fill="#1A7FA8" fontWeight="600"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 + i * 0.18, duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
        >
          {l.text}
        </motion.text>
      ))}
      {[{ x: 60, y: 30 }, { x: 270, y: 25 }, { x: 155, y: 155 }].map((s, i) => (
        <motion.text
          key={i} x={s.x} y={s.y} textAnchor="middle" fontSize="12" fill="#00C9A7"
          animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: 2 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          ✦
        </motion.text>
      ))}
    </svg>
  );
}

// ─── Mock toolbar (matches FloorCanvas bottom bar layout) ───────────────────

const MOCK_TOOLS: { id: string; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "pen", icon: PenLine, label: "Draw" },
  { id: "group", icon: GroupIcon, label: "Group" },
  { id: "eraser", icon: Eraser, label: "Erase" },
];

function MockFloatingToolbar({ highlightPen }: { highlightPen: boolean }) {
  return (
    <div
      className="pointer-events-none flex items-center gap-1 rounded-2xl border border-border bg-surface shadow-2xl shadow-black/15 px-2 py-1.5"
      aria-hidden
    >
      {MOCK_TOOLS.map(({ id, icon: Icon, label }) => {
        const isPen = id === "pen";
        const active = isPen && highlightPen;
        return (
          <div
            key={id}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150",
              active
                ? "bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-surface"
                : "text-text-muted",
            )}
            title={label}
          >
            <Icon size={17} />
            {isPen && highlightPen && (
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-xl border-2 border-accent"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </div>
        );
      })}
      <div className="mx-1 h-6 w-px bg-border" />
      <div className="h-9 w-9 rounded-xl bg-surface-2/50" />
    </div>
  );
}

/** `public/mock/floorplan-oslo.svg` viewBox — highlight geometry must match this space */
const FLOOR_VB = { w: 1600, h: 720 } as const;

/** SVG-space rect → CSS % inside a box with the same aspect ratio as the floor SVG */
function svgRectToPct(x: number, y: number, width: number, height: number) {
  const { w: vw, h: vh } = FLOOR_VB;
  return {
    left: `${(x / vw) * 100}%`,
    top: `${(y / vh) * 100}%`,
    width: `${(width / vw) * 100}%`,
    height: `${(height / vh) * 100}%`,
  } as const;
}

function svgPointToPct(cx: number, cy: number) {
  const { w: vw, h: vh } = FLOOR_VB;
  return { left: `${(cx / vw) * 100}%`, top: `${(cy / vh) * 100}%` } as const;
}

/** Adjacent rooms from SVG: 23 Annen leietager + 30 Trapp (share vertical wall at x=840) */
const DEMO_GROUP_ROOM_A = { x: 560, y: 200, w: 280, h: 140 } as const;
const DEMO_GROUP_ROOM_B = { x: 840, y: 200, w: 100, h: 140 } as const;
const DEMO_GROUP_HULL  = { x: 560, y: 200, w: 380, h: 140 } as const;

/** Single-room demo: Samtalerom forsterket (rect in SVG) */
const DEMO_SINGLE_ROOM = { x: 220, y: 480, w: 130, h: 120 } as const;

/** Stage width below this: stack guide card under highlights instead of beside */
const CARD_BESIDE_STAGE_MIN_PX = 520;

function FloorPlanStage({
  children,
  interactiveOverlay,
}: {
  children: React.ReactNode;
  interactiveOverlay?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-5xl rounded-2xl border border-white/20 shadow-xl",
        interactiveOverlay ? "overflow-visible" : "overflow-hidden",
      )}
      style={{ aspectRatio: `${FLOOR_VB.w} / ${FLOOR_VB.h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mock/floorplan-oslo.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        style={{ filter: "brightness(0.92) saturate(0.85)" }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-t from-[#0A1929]/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">{children}</div>
      {interactiveOverlay ? (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">{interactiveOverlay}</div>
      ) : null}
    </div>
  );
}

// ─── Floor demo: two rooms + grouping (step 4) ──────────────────────────────

function FloorGroupDemo({ cardSlot }: { cardSlot: React.ReactNode }) {
  const a    = svgRectToPct(DEMO_GROUP_ROOM_A.x, DEMO_GROUP_ROOM_A.y, DEMO_GROUP_ROOM_A.w, DEMO_GROUP_ROOM_A.h);
  const b    = svgRectToPct(DEMO_GROUP_ROOM_B.x, DEMO_GROUP_ROOM_B.y, DEMO_GROUP_ROOM_B.w, DEMO_GROUP_ROOM_B.h);
  const hull = svgRectToPct(DEMO_GROUP_HULL.x,  DEMO_GROUP_HULL.y,  DEMO_GROUP_HULL.w,  DEMO_GROUP_HULL.h);
  const cxA  = DEMO_GROUP_ROOM_A.x + DEMO_GROUP_ROOM_A.w / 2;
  const cxB  = DEMO_GROUP_ROOM_B.x + DEMO_GROUP_ROOM_B.w / 2;
  const midY = DEMO_GROUP_ROOM_A.y + DEMO_GROUP_ROOM_A.h / 2;
  const linkLeft  = cxA / FLOOR_VB.w;
  const linkWidth = (cxB - cxA) / FLOOR_VB.w;

  const hx = DEMO_GROUP_HULL.x;
  const hy = DEMO_GROUP_HULL.y;
  const hw = DEMO_GROUP_HULL.w;
  const hh = DEMO_GROUP_HULL.h;
  const hullCx = hx + hw / 2;
  const hullCy = hy + hh / 2;

  const stageWrapRef = useRef<HTMLDivElement>(null);
  const [narrowStage, setNarrowStage] = useState(true);

  useLayoutEffect(() => {
    const el = stageWrapRef.current;
    if (!el) return;
    const measure = () => {
      setNarrowStage(el.getBoundingClientRect().width < CARD_BESIDE_STAGE_MIN_PX);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardAnchorStyle: React.CSSProperties = narrowStage
    ? {
        left: `${(hullCx / FLOOR_VB.w) * 100}%`,
        top: `${((hy + hh + 8) / FLOOR_VB.h) * 100}%`,
        transform: "translateX(-50%)",
      }
    : {
        left: `${((hx + hw + 10) / FLOOR_VB.w) * 100}%`,
        top: `${(hullCy / FLOOR_VB.h) * 100}%`,
        transform: "translateY(-50%)",
      };

  return (
    <div className="relative flex h-full min-h-[280px] w-full flex-1 items-center justify-center p-6 pb-12 pt-6 md:p-10 md:pb-14">
      <div ref={stageWrapRef} className="relative w-full max-w-5xl">
        <FloorPlanStage
          interactiveOverlay={
            <div
              className="pointer-events-auto absolute w-[min(22rem,calc(100%-0.75rem))] max-w-[calc(100vw-2rem)]"
              style={cardAnchorStyle}
            >
              {cardSlot}
            </div>
          }
        >
          <motion.div
            className="absolute box-border border-2 border-[#0A4F6E]/90 bg-[rgba(10,79,110,0.2)]"
            style={{ ...a, borderRadius: 2 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(0,201,167,0.35)",
                "0 0 0 10px rgba(0,201,167,0)",
                "0 0 0 0 rgba(0,201,167,0.35)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold leading-tight text-[#0A4F6E] drop-shadow-sm sm:text-[11px]"
            style={svgPointToPct(cxA, DEMO_GROUP_ROOM_A.y + DEMO_GROUP_ROOM_A.h / 2)}
          >
            23 · Annen leietager
          </span>

          <motion.div
            className="absolute box-border border-2 border-[#0A4F6E]/90 bg-[rgba(10,79,110,0.2)]"
            style={{ ...b, borderRadius: 2 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(0,201,167,0.35)",
                "0 0 0 10px rgba(0,201,167,0)",
                "0 0 0 0 rgba(0,201,167,0.35)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
          />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold leading-tight text-[#0A4F6E] drop-shadow-sm sm:text-[11px]"
            style={svgPointToPct(cxB, DEMO_GROUP_ROOM_B.y + DEMO_GROUP_ROOM_B.h / 2)}
          >
            30 · Trapp
          </span>

          <motion.div
            className="absolute box-border border-2 border-dashed border-[#0F7663] bg-[rgba(15,118,99,0.07)]"
            style={{ ...hull, borderRadius: 3 }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: [0, 1, 1, 0.88, 1], scale: [0.98, 1, 1, 0.99, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute flex justify-center"
            style={{
              left: `${((DEMO_GROUP_HULL.x + DEMO_GROUP_HULL.w / 2) / FLOOR_VB.w) * 100}%`,
              top: `${((DEMO_GROUP_HULL.y - 8) / FLOOR_VB.h) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <motion.div
              className="rounded-full bg-[#0F7663] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md sm:px-3 sm:text-[10px]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: [0, 1, 1, 1, 0], y: [4, 0, 0, 0, 2] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.12, 0.5, 0.85, 1] }}
            >
              Meeting zone
            </motion.div>
          </div>

          <div
            className="absolute h-[3px] sm:h-1"
            style={{
              left: `${linkLeft * 100}%`,
              top: `${(midY / FLOOR_VB.h) * 100}%`,
              width: `${linkWidth * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <motion.div
              className="h-full w-full origin-left rounded-full bg-accent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 0.85, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.55, 0.75] }}
            />
          </div>
        </FloorPlanStage>
      </div>
    </div>
  );
}

// ─── Floor demo: single room zone (step 5) ───────────────────────────────────

function FloorSingleRoomDemo({ cardSlot }: { cardSlot: React.ReactNode }) {
  const { x, y, w, h } = DEMO_SINGLE_ROOM;
  const room = svgRectToPct(x, y, w, h);
  const pad  = 6;
  const zone = svgRectToPct(x - pad, y - pad, w + pad * 2, h + pad * 2);
  const cx   = x + w / 2;
  const cy   = y + h / 2;

  const stageWrapRef = useRef<HTMLDivElement>(null);
  const [narrowStage, setNarrowStage] = useState(true);

  useLayoutEffect(() => {
    const el = stageWrapRef.current;
    if (!el) return;
    const measure = () => {
      setNarrowStage(el.getBoundingClientRect().width < CARD_BESIDE_STAGE_MIN_PX);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardAnchorStyle: React.CSSProperties = narrowStage
    ? {
        left: `${(cx / FLOOR_VB.w) * 100}%`,
        top: `${((y + h + 8) / FLOOR_VB.h) * 100}%`,
        transform: "translateX(-50%)",
      }
    : {
        left: `${((x + w + 10) / FLOOR_VB.w) * 100}%`,
        top: `${(cy / FLOOR_VB.h) * 100}%`,
        transform: "translateY(-50%)",
      };

  return (
    <div className="relative flex h-full min-h-[280px] w-full flex-1 items-center justify-center p-6 pb-12 pt-6 md:p-10 md:pb-14">
      <div ref={stageWrapRef} className="relative w-full max-w-5xl">
        <FloorPlanStage
          interactiveOverlay={
            <div
              className="pointer-events-auto absolute w-[min(22rem,calc(100%-0.75rem))] max-w-[calc(100vw-2rem)]"
              style={cardAnchorStyle}
            >
              {cardSlot}
            </div>
          }
        >
          <motion.div
            className="absolute box-border border-2 border-[#6D28D9]/90 bg-[rgba(109,40,217,0.12)]"
            style={{ ...room, borderRadius: 2 }}
            animate={{
              borderColor: ["rgba(109,40,217,0.95)", "rgba(91,33,182,0.75)", "rgba(109,40,217,0.95)"],
              boxShadow: [
                "0 0 0 0 rgba(139,92,246,0.45)",
                "0 0 0 10px rgba(139,92,246,0)",
                "0 0 0 0 rgba(139,92,246,0.45)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute box-border border-2 border-dashed border-violet-500 bg-[rgba(139,92,246,0.06)]"
            style={{ ...zone, borderRadius: 3 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.008, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold leading-tight text-[#5B21B6] drop-shadow-sm sm:text-[11px]"
            style={svgPointToPct(cx, cy)}
          >
            4 · Samtalerom
          </span>
        </FloorPlanStage>
      </div>
    </div>
  );
}

// ─── Step copy ───────────────────────────────────────────────────────────────

interface GuideStep {
  id: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
  illustrationBg: string;
}

const steps: GuideStep[] = [
  {
    id: 1,
    title: "Welcome to Your Canvas!",
    description:
      "We'll guide you step by step to create your first project. You'll learn how to mark rooms, group zones, and start counting — the core of AreaSim's workspace analysis.",
    illustration: <IllustrationWelcome />,
    illustrationBg: "bg-gradient-to-br from-[#EEF3F8] to-[#E0ECF5]",
  },
  {
    id: 2,
    title: "Mark Rooms with the Pen Tool",
    description:
      "Select the Draw Room tool in the floating toolbar (bottom center). Click on the canvas to place polygon points — each click adds a corner. Double-click or click the first point to close the shape.",
    illustration: null,
    illustrationBg: "",
  },
  {
    id: 3,
    title: "Name & Count Each Room",
    description:
      "Open the Rooms list from the header to name rooms, set categories, and track counting progress. After you close a polygon, you can also use the modal on the canvas to start room counting.",
    illustration: null,
    illustrationBg: "",
  },
  {
    id: 4,
    title: "Group Rooms into Zones",
    description:
      "Use the Group tool, select multiple room shapes, then name your zone. Selected rooms share a dashed boundary — here, rooms 23 and 30 on the Oslo sample plan.",
    illustration: null,
    illustrationBg: "",
  },
  {
    id: 5,
    title: "Single-Room Zones",
    description:
      "One room can be its own zone — ideal for reception, server rooms, or small meeting rooms. The highlight follows room 4 (Samtalerom) on this sample plan; your zone outline wraps that footprint.",
    illustration: null,
    illustrationBg: "",
  },
];

// ─── Guide card chrome (shared wrapper) ─────────────────────────────────────

function GuideCardChrome({
  step,
  total,
  onDot,
  onSkip,
  children,
  compact,
}: {
  step: number;
  total: number;
  onDot: (i: number) => void;
  onSkip: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl",
        compact ? "max-w-sm" : "w-full max-w-2xl",
      )}
    >
      <div className="flex items-center justify-between border-b border-[#E5EAF0] bg-white px-5 py-3">
        <div className="hidden items-center gap-1.5 sm:flex">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onDot(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-[#5B21B6]" : i < step ? "w-2 bg-[#C4B5FD]" : "w-2 bg-[#D0DDE6]",
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-[#5C7A8A]">
            {step + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="flex items-center gap-1.5 font-body text-sm text-[#5C7A8A] transition-colors hover:text-[#0D1B2A]"
          >
            <X size={14} /> Skip
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CanvasGuidePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isFirst = step === 0;
  const isLast  = step === steps.length - 1;

  const goNext = () => {
    if (isLast) router.push(`/project/${projectId}/floor/floor-1`);
    else setStep((s) => s + 1);
  };
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const skip   = () => router.push(`/project/${projectId}/floor/floor-1`);

  const navFooter = (
    <div className="flex items-center justify-between px-7 py-5">
      <div>
        {!isFirst && (
          <button
            type="button"
            onClick={goPrev}
            className="flex items-center gap-1.5 font-body text-sm text-[#5C7A8A] transition-colors hover:text-[#0D1B2A]"
          >
            <ChevronLeft size={15} /> Back
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 sm:hidden">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === step ? "w-5 bg-[#5B21B6]" : i < step ? "w-1.5 bg-[#C4B5FD]" : "w-1.5 bg-[#D0DDE6]",
            )}
          />
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={goNext}
        className="btn-3d flex items-center gap-2 rounded-full px-6 py-2.5 font-body text-sm font-semibold text-white"
      >
        {isLast ? "Start Annotating" : "Next"}
        <ArrowRight size={15} />
      </motion.button>
    </div>
  );

  const bodyBlock = (
    <div className="px-7 pt-5 pb-1">
      <div className="mb-2 inline-flex rounded-full border border-[#D0DDE6] bg-[#F7F9FC] px-2.5 py-0.5 font-body text-[11px] font-semibold text-[#5C7A8A]">
        Step {step + 1}
      </div>
      <h2
        className="mb-2 text-xl font-bold text-[#0D1B2A]"
        style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}
      >
        {current.title}
      </h2>
      <p className="mb-1 font-body text-sm leading-relaxed text-[#5C7A8A]">{current.description}</p>
      {navFooter}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background floor */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mock/floorplan-oslo.svg"
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[filter] duration-500",
            step === 0 && "scale-105",
            step === 0
              ? "blur-md brightness-[0.5] saturate-[0.7]"
              : "blur-[2px] brightness-[0.72] saturate-[0.8]",
          )}
        />
        <div className={cn("absolute inset-0", step === 0 ? "bg-[#0A1929]/60" : "bg-[#0A1929]/45")} />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: centred modal ── */}
        {step === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex h-full items-center justify-center p-4"
          >
            <GuideCardChrome step={step} total={steps.length} onDot={setStep} onSkip={skip}>
              <div
                className={`${current.illustrationBg} relative overflow-hidden border-b border-[#D0DDE6]`}
                style={{ height: "200px" }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {current.illustration}
                </div>
                <div className="absolute left-3 top-3 rounded-full border border-[#D0DDE6] bg-white/90 px-3 py-1 text-xs font-semibold text-[#5C7A8A] shadow-sm">
                  Step 1
                </div>
              </div>
              {bodyBlock}
            </GuideCardChrome>
          </motion.div>
        ) : (
          /* ── Steps 2-5: anchored-to-context layout ── */
          <motion.div
            key={`anchored-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex h-full flex-col"
          >
            {/* Step 3: mock header with Rooms list button */}
            {step === 2 && (
              <header className="relative z-30 flex shrink-0 items-center justify-end border-b border-[#E5EAF0]/80 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-sm">
                <div className="relative">
                  <motion.div
                    aria-hidden
                    className="pointer-events-none flex items-center gap-2 rounded-xl border border-primary bg-primary px-3 py-2 font-body text-sm font-medium text-white shadow-md"
                    animate={{ boxShadow: ["0 0 0 0 rgba(26,127,168,0.45)", "0 0 0 10px rgba(26,127,168,0)"] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <SlidersHorizontal size={14} />
                    <span className="hidden sm:inline">Rooms list</span>
                  </motion.div>

                  <div className="absolute right-0 top-full z-40 mt-3 w-[min(calc(100vw-2rem),22rem)] sm:w-80">
                    <GuideCardChrome step={step} total={steps.length} onDot={setStep} onSkip={skip} compact>
                      {bodyBlock}
                    </GuideCardChrome>
                  </div>
                </div>
              </header>
            )}

            <div className={cn("relative flex min-h-0 flex-1 flex-col", step === 2 && "z-0")}>
              {/* Step 4: floor group demo */}
              {step === 3 && (
                <FloorGroupDemo
                  cardSlot={
                    <GuideCardChrome step={step} total={steps.length} onDot={setStep} onSkip={skip} compact>
                      {bodyBlock}
                    </GuideCardChrome>
                  }
                />
              )}

              {/* Step 5: single-room zone demo */}
              {step === 4 && (
                <FloorSingleRoomDemo
                  cardSlot={
                    <GuideCardChrome step={step} total={steps.length} onDot={setStep} onSkip={skip} compact>
                      {bodyBlock}
                    </GuideCardChrome>
                  }
                />
              )}

              {/* Step 2: toolbar at bottom centre, card above it */}
              {step === 1 && (
                <div className="pointer-events-none flex flex-1 flex-col items-center justify-end px-3 pb-6 md:px-6 md:pb-10">
                  <div className="flex max-w-full flex-col-reverse items-center gap-4 sm:flex-row sm:items-end sm:justify-center sm:gap-5">
                    <div className="relative shrink-0">
                      <MockFloatingToolbar highlightPen />
                      <p className="mt-2 text-center font-body text-[11px] text-white/85">
                        Draw tool <span className="text-accent">(P)</span>
                      </p>
                    </div>
                    <div className="w-[min(calc(100vw-2rem),22rem)] shrink-0 sm:mb-1 sm:max-w-sm">
                      <GuideCardChrome step={step} total={steps.length} onDot={setStep} onSkip={skip} compact>
                        {bodyBlock}
                      </GuideCardChrome>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: filler behind the anchored header card */}
              {step === 2 && <div className="pointer-events-none flex-1" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
