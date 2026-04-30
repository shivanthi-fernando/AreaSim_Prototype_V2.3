"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, Mail, ArrowLeft, ArrowRight, Upload, FileText, Building2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Step1Project } from "@/components/onboarding/Step1Project";
import { Step3Lease } from "@/components/onboarding/Step3Lease";
import { Step3FloorPlans } from "@/components/onboarding/Step3FloorPlans";
import { Step6Done } from "@/components/onboarding/Step6Done";
import { useOnboardingStore } from "@/store/onboarding";

// ─── Consultant Modal ─────────────────────────────────────────────────────────
const CONSULTANTS = [
  {
    name: "Håvard Røyne",
    title: "CEO & Partner",
    bio: "Extensive management and project leadership experience from Gjensidige NOR, OBOS Basale, Aberdeen Standard Investment, and Statsbygg.",
    phone: "+47 90 09 01 70",
    email: "havard@areasim.no",
    photo: "https://areasim.ai/images/team/haavard.jpg",
  },
  {
    name: "Mads Dyrseth",
    title: "COO & Partner",
    bio: "One of Norway's foremost analysts on government leases, with expertise in financial analysis, consulting, and commercial property from Statsbygg and SVV.",
    phone: "+47 97 40 78 49",
    email: "mads@areasim.no",
    photo: "https://areasim.ai/images/team/mads.jpg",
  },
];

function ConsultantModal({ onClose, onDashboard }: { onClose: () => void; onDashboard: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-border transition-colors"
          >
            <X size={14} />
          </button>
          <h2 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
            Need a floor plan?
          </h2>
          <p className="text-sm text-text-muted font-body mt-1">
            Here are your options to get started with floor plans.
          </p>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Action points */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Your options</p>
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-surface-2/50">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text font-body">Get floor plan from your landlord</p>
                <p className="text-xs text-text-muted font-body mt-0.5 leading-relaxed">
                  Ask your building manager or landlord for the official floor plans they have on file. Most landlords are required to hold these documents.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-surface-2/50">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <ShoppingCart size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-text font-body">Buy a floor plan</p>
                <p className="text-xs text-text-muted font-body mt-0.5 leading-relaxed">
                  Our team can procure a professional, scan-ready floor plan for your building. Contact our consultants below to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Consultant contacts (no photos) */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Contact our experts</p>
            {CONSULTANTS.map((c) => (
              <div
                key={c.email}
                className="p-4 rounded-2xl border border-border bg-surface hover:border-primary/20 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{c.name}</p>
                    <p className="text-xs text-accent font-semibold font-body">{c.title}</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted font-body leading-relaxed mb-3">{c.bio}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-primary/5 hover:text-primary text-xs font-medium text-text-muted transition-colors border border-border">
                    <Phone size={12} /> {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-light text-xs font-medium transition-colors">
                    <Mail size={12} /> {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard redirect */}
          <div className="pt-2 border-t border-border space-y-3">
            <p className="text-xs text-text-muted font-body text-center">
              Already contacted our team? You can continue to your dashboard.
            </p>
            <button
              onClick={onDashboard}
              className="mx-auto flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors font-body"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const STEPS = [
  { label: "Create project", description: "Tell us about your project" },
  { label: "Add lease parameters",   description: "Add Lease parameters" },
  { label: "Add floor plans",  description: "Add floor plans" },
];

const stepMeta: Record<number, { title: string; subtitle: string; illuBg: string }> = {
  0: { title: "Create Your First Project",   subtitle: "Tell us about your building and location.",     illuBg: "from-blue-50 to-sky-100" },
  1: { title: "Add Lease Parameters",        subtitle: "Enter your area and cost details.",              illuBg: "from-blue-50 to-sky-100" },
  2: { title: "Add Floor Plans",             subtitle: "Upload and verify your floor plan layouts.",    illuBg: "from-indigo-50 to-blue-100" },
  3: { title: "Great you're all set!",       subtitle: "Your setup is complete.",                        illuBg: "from-green-50 to-teal-100" },
};

// ─── Shared Metric component ─────────────────────────────────────────────────

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-text-muted font-body">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.5, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-bold font-mono text-text leading-tight mt-0.5"
      >
        {value}
      </motion.p>
    </div>
  );
}

// ─── Step 1 — Create Project Panel ───────────────────────────────────────────

function _CreateProjectPanel() {
  const BENEFITS = [
    { label: "Map every room & zone",          color: "#00C896" },
    { label: "Track space utilisation",         color: "#7C3AED" },
    { label: "Get expert recommendations",      color: "#F5A623" },
  ];

  // 4 zone colors matching AreaSim's zone taxonomy
  const ZONES = [
    { x: 14,  y: 14,  w: 132, h: 86,  fill: "#00C896", label: "Collaboration", opacity: 0.14 },
    { x: 156, y: 14,  w: 148, h: 86,  fill: "#7C3AED", label: "Focus",          opacity: 0.14 },
    { x: 14,  y: 112, w: 78,  h: 96,  fill: "#FF5C3A", label: "Meeting",        opacity: 0.15 },
    { x: 104, y: 112, w: 200, h: 96,  fill: "#F5A623", label: "Open",           opacity: 0.14 },
  ];

  const DATA_POINTS = [
    { cx: 80,  cy: 57,  c: "#00C896" },
    { cx: 230, cy: 57,  c: "#7C3AED" },
    { cx: 53,  cy: 160, c: "#FF5C3A" },
    { cx: 204, cy: 160, c: "#F5A623" },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Hero */}
      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-2xl font-extrabold text-text leading-snug"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          We&apos;ll help you optimise your workplace.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-sm text-text-muted font-body leading-relaxed"
        >
          From floor plan to actionable insight — one platform, built for space professionals.
        </motion.p>
      </div>

      {/* Benefit chips */}
      <div className="flex flex-col gap-2">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.25 + i * 0.09 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ background: `${b.color}18`, border: `1px solid ${b.color}38` }}
          >
            <motion.div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: b.color }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
            <span className="text-xs font-semibold text-text font-body">{b.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Floor plan illustration */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="rounded-2xl overflow-hidden border border-border"
        style={{ background: "#F8F9FE" }}
      >
        <svg viewBox="0 0 320 224" className="w-full block" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DDE3F5" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="320" height="224" fill="#F8F9FE" />
          <rect width="320" height="224" fill="url(#cp-grid)" />

          {/* Zone fills */}
          {ZONES.map((z, i) => (
            <motion.rect
              key={`zf-${i}`}
              x={z.x} y={z.y} width={z.w} height={z.h} rx={6}
              fill={z.fill} opacity={0}
              animate={{ opacity: z.opacity }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            />
          ))}

          {/* Zone borders */}
          {ZONES.map((z, i) => (
            <rect
              key={`zb-${i}`}
              x={z.x} y={z.y} width={z.w} height={z.h} rx={6}
              fill="none" stroke={z.fill} strokeWidth={1.5} opacity={0.45}
            />
          ))}

          {/* Divider lines (walls) */}
          <line x1="148" y1="14" x2="148" y2="100" stroke="#C8D4EF" strokeWidth="1" />
          <line x1="14"  y1="105" x2="306" y2="105" stroke="#C8D4EF" strokeWidth="1" />
          <line x1="96"  y1="106" x2="96"  y2="208" stroke="#C8D4EF" strokeWidth="1" />

          {/* Desk icons — zone 1 collaboration (3 desks, teal) */}
          {[0, 1, 2].map(j => (
            <rect key={`d1-${j}`} x={22 + j * 40} y={38} width={28} height={14} rx={2}
              fill="#00C896" opacity={0.28} />
          ))}
          {/* Desk icons — zone 2 focus (4 desks, violet) */}
          {[0, 1, 2, 3].map(j => (
            <rect key={`d2-${j}`} x={162 + j * 34} y={38} width={26} height={14} rx={2}
              fill="#7C3AED" opacity={0.28} />
          ))}
          {/* Meeting table (coral) */}
          <rect x={22} y={132} width={60} height={36} rx={4} fill="#FF5C3A" opacity={0.22} />
          {/* Open area desks (amber) */}
          {[0, 1, 2, 3].map(j => (
            <rect key={`d4-${j}`} x={112 + j * 44} y={130} width={34} height={16} rx={2}
              fill="#F5A623" opacity={0.28} />
          ))}

          {/* Zone labels */}
          {ZONES.map((z, i) => (
            <text key={`lbl-${i}`}
              x={z.x + 8} y={z.y + 14}
              fontSize={8} fontWeight="700" fontFamily="monospace"
              fill={z.fill} opacity={0.85}
            >
              {z.label.toUpperCase()}
            </text>
          ))}

          {/* Animated scan pulse */}
          <motion.circle cx="160" cy="112" r="30"
            fill="none" stroke="#1A3C8F" strokeWidth="0.8"
            animate={{ r: [20, 90, 20], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Data point indicators (pulsing dots) */}
          {DATA_POINTS.map((p, i) => (
            <g key={`dp-${i}`}>
              <motion.circle cx={p.cx} cy={p.cy} r={4}
                fill={p.c}
                animate={{ r: [3.5, 5.5, 3.5], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
              />
              <motion.circle cx={p.cx} cy={p.cy} r={8}
                fill={p.c} opacity={0}
                animate={{ r: [4, 14, 4], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
              />
            </g>
          ))}
        </svg>

        {/* Legend row below the SVG */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 border-t border-border">
          {ZONES.map((z) => (
            <div key={z.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: z.fill }} />
              <span className="text-[9px] font-semibold font-mono text-text-muted">{z.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 2 — Lease Visual Panel ─────────────────────────────────────────────

// Floor-specific window colors (floor 3 = violet, floor 2 = amber, floor 1 = coral)

function LeaseVisualPanel() {
  const { leaseParams } = useOnboardingStore();

  const annualRent      = parseFloat(leaseParams.annualRent     || "0");
  const commonArea      = parseFloat(leaseParams.commonAreaCost || "0");
  const totalArea       = parseFloat(leaseParams.totalArea      || "0");
  const baseEmployees   = Math.max(leaseParams.targetHeadcount  || 1, 1);
  const consultants     = leaseParams.consultantsCount          || 0;
  const showConsultants = leaseParams.showConsultants           || false;
  const effectiveHead   = Math.max(baseEmployees + (showConsultants ? consultants * 0.5 : 0), 1);
  const totalCost       = annualRent + commonArea;
  const costPerSeat     = totalCost   / effectiveHead;
  const areaPerPerson   = totalArea   / effectiveHead;
  const hasData         = totalCost > 0 || totalArea > 0;

  const fmtNOK = (v: number) =>
    v > 0 ? `NOK ${Math.round(v).toLocaleString("no-NO")}` : "—";
  const fmtM2  = (v: number) =>
    v > 0 ? `${v.toFixed(1)} m²` : "—";

  return (
    <div className="w-full space-y-4">
      {/* ── Flat illustration ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border">
        <svg viewBox="0 0 320 210" className="w-full block" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lp-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6F4F1" />
              <stop offset="100%" stopColor="#EEF6FB" />
            </linearGradient>
            <marker id="lp-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#A8C4CE" />
            </marker>
            <marker id="lp-arr-l" markerWidth="5" markerHeight="5" refX="1" refY="2.5" orient="auto-start-reverse">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#A8C4CE" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="320" height="210" fill="url(#lp-bg)" />

          {/* Dot grid */}
          {[0,1,2,3,4,5,6,7].map(row =>
            [0,1,2,3,4,5,6,7,8,9,10,11].map(col => (
              <circle key={`d-${row}-${col}`} cx={16 + col * 27} cy={16 + row * 27} r={1.4} fill="#B4D4CB" opacity={0.45} />
            ))
          )}

          {/* ── Floor plan document ── */}
          {/* Paper shadow */}
          <rect x={122} y={48} width={162} height={130} rx={9} fill="rgba(0,0,0,0.06)" transform="translate(3,4)" />
          {/* Paper */}
          <rect x={122} y={48} width={162} height={130} rx={9} fill="white" stroke="#D4E2E8" strokeWidth={1.5} />

          {/* Zone: Collaboration (teal) */}
          <rect x={129} y={55} width={70} height={56} rx={5} fill="#00C9A7" opacity={0.18} />
          <rect x={129} y={55} width={70} height={56} rx={5} fill="none" stroke="#00C9A7" strokeWidth={1} opacity={0.5} />
          {/* Desk dots in zone */}
          <circle cx={152} cy={74} r={4} fill="#00C9A7" opacity={0.5} />
          <circle cx={165} cy={83} r={4} fill="#00C9A7" opacity={0.5} />
          <circle cx={178} cy={74} r={4} fill="#00C9A7" opacity={0.5} />
          <text x={164} y={103} textAnchor="middle" fontSize={7} fill="#007A65" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">COLLAB</text>

          {/* Zone: Focus (blue) */}
          <rect x={205} y={55} width={72} height={56} rx={5} fill="#1A7FA8" opacity={0.13} />
          <rect x={205} y={55} width={72} height={56} rx={5} fill="none" stroke="#1A7FA8" strokeWidth={1} opacity={0.4} />
          <circle cx={227} cy={76} r={3.5} fill="#1A7FA8" opacity={0.45} />
          <circle cx={241} cy={76} r={3.5} fill="#1A7FA8" opacity={0.45} />
          <circle cx={255} cy={76} r={3.5} fill="#1A7FA8" opacity={0.45} />
          <text x={241} y={103} textAnchor="middle" fontSize={7} fill="#0D5F80" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">FOCUS</text>

          {/* Zone: Meeting (coral/warm) */}
          <rect x={129} y={117} width={148} height={53} rx={5} fill="#FF6B6B" opacity={0.1} />
          <rect x={129} y={117} width={148} height={53} rx={5} fill="none" stroke="#FF6B6B" strokeWidth={1} opacity={0.4} />
          {/* Meeting table */}
          <ellipse cx={203} cy={144} rx={28} ry={14} fill="#FF6B6B" opacity={0.2} />
          <ellipse cx={203} cy={144} rx={28} ry={14} fill="none" stroke="#FF6B6B" strokeWidth={1.5} opacity={0.5} />
          <circle cx={179} cy={144} r={4} fill="#FF6B6B" opacity={0.45} />
          <circle cx={203} cy={130} r={4} fill="#FF6B6B" opacity={0.45} />
          <circle cx={227} cy={144} r={4} fill="#FF6B6B" opacity={0.45} />
          <text x={203} y={164} textAnchor="middle" fontSize={7} fill="#CC4444" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">MEETING</text>

          {/* Measurement line bottom */}
          <line x1={122} y1={186} x2={284} y2={186} stroke="#A8C4CE" strokeWidth={1}
            markerEnd="url(#lp-arr)" markerStart="url(#lp-arr-l)" />
          <text x={203} y={197} textAnchor="middle" fontSize={8} fill="#7A9BAA" fontFamily="monospace">
            {totalArea > 0 ? `${totalArea.toFixed(0)} m²` : "— m²"}
          </text>

          {/* ── Person figure (flat design) ── */}
          {/* Shadow */}
          <ellipse cx={76} cy={186} rx={26} ry={6} fill="rgba(0,0,0,0.08)" />
          {/* Legs */}
          <rect x={66} y={155} width={11} height={32} rx={5} fill="#1B4354" />
          <rect x={81} y={158} width={11} height={30} rx={5} fill="#1B4354" />
          {/* Clothing (teal shirt) */}
          <rect x={60} y={116} width={36} height={42} rx={11} fill="#00C9A7" />
          {/* Torso overlap for neck */}
          <rect x={67} y={112} width={22} height={12} rx={4} fill="#00C9A7" />
          {/* Arm reaching toward plan */}
          <path d="M 95 126 Q 112 121 122 128" stroke="#1B4354" strokeWidth={11} strokeLinecap="round" fill="none" />
          <path d="M 95 126 Q 112 121 122 128" stroke="#00C9A7" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.5} />
          {/* Other arm (at side) */}
          <path d="M 61 126 Q 48 134 46 148" stroke="#1B4354" strokeWidth={10} strokeLinecap="round" fill="none" />
          {/* Head */}
          <circle cx={78} cy={96} r={19} fill="#1B4354" />
          {/* Face highlight */}
          <ellipse cx={78} cy={103} rx={13} ry={10} fill="#F4C49A" />
          {/* Hair */}
          <path d="M 59 90 Q 78 72 97 90 Q 97 78 78 74 Q 59 78 59 90 Z" fill="#0D2B3C" />
          {/* Eyes */}
          <circle cx={72} cy={102} r={2} fill="#1B4354" />
          <circle cx={84} cy={102} r={2} fill="#1B4354" />
          {/* Smile */}
          <path d="M 73 108 Q 78 112 83 108" stroke="#1B4354" strokeWidth={1.5} fill="none" strokeLinecap="round" />

          {/* ── Decorative plant (bottom left) ── */}
          <rect x={17} y={168} width={7} height={26} rx={3} fill="#7BC4A8" />
          <ellipse cx={20} cy={164} rx={11} ry={12} fill="#4DAF88" />
          <ellipse cx={11} cy={170} rx={8} ry={9} fill="#4DAF88" opacity={0.85} />
          <ellipse cx={29} cy={170} rx={8} ry={9} fill="#4DAF88" opacity={0.85} />
          <circle cx={20} cy={156} r={5} fill="#3A9F78" />

          {/* ── Floating metric chips ── */}
          {/* Chip: cost per seat */}
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <rect x={148} y={10} width={108} height={28} rx={14} fill="white" stroke="#00C9A7" strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,201,167,0.18))" }} />
            <circle cx={166} cy={24} r={8} fill="#00C9A7" opacity={0.15} />
            <text x={166} y={28} textAnchor="middle" fontSize={8} fill="#00796B" fontWeight="800" fontFamily="monospace">NOK</text>
            <text x={248} y={28} textAnchor="end" fontSize={11} fill="#00796B" fontWeight="800" fontFamily="monospace">
              {hasData ? Math.round(costPerSeat).toLocaleString("no-NO") : "—"}
            </text>
            <text x={253} y={20} textAnchor="start" fontSize={6.5} fill="#7ACBBC" fontFamily="monospace">/seat</text>
          </motion.g>

          {/* Chip: area per person */}
          <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}>
            <rect x={45} y={14} width={82} height={24} rx={12} fill="white" stroke="#1A7FA8" strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 2px 6px rgba(26,127,168,0.15))" }} />
            <text x={86} y={30} textAnchor="middle" fontSize={9.5} fill="#0D5F80" fontWeight="700" fontFamily="monospace">
              {hasData ? `${areaPerPerson.toFixed(1)} m²` : "— m²"}
            </text>
          </motion.g>
        </svg>

        {/* Legend row */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          {[
            { color: "#00C9A7", label: "Collab" },
            { color: "#1A7FA8", label: "Focus" },
            { color: "#FF6B6B", label: "Meeting" },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: z.color, opacity: 0.8 }} />
              <span className="text-[8px] font-bold font-mono" style={{ color: z.color }}>{z.label}</span>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <span
          className="absolute top-3 right-3 text-[9px] font-bold font-mono tracking-widest uppercase rounded-full px-2.5 py-1"
          style={{ background: "rgba(0,201,167,0.1)", color: "#00796B", border: "1px solid rgba(0,201,167,0.3)" }}
        >
          Live preview
        </span>
      </div>

      {/* ── Cost metrics card ── */}
      <div
        className="rounded-xl p-4 space-y-3 border-2 transition-colors duration-300"
        style={{
          borderColor: hasData ? "#00C896"               : "var(--color-border)",
          background:  hasData ? "rgba(0,200,150,0.04)"  : "var(--color-surface-2)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ background: hasData ? "#00C896" : "var(--color-text-muted)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-text-muted">
            Cost overview
          </p>
        </div>

        {!hasData ? (
          <p className="text-xs text-text-muted font-body italic leading-relaxed">
            Slide or type to see your cost overview.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Cost per seat / year" value={fmtNOK(costPerSeat)} />
            <Metric label="Area per person"       value={fmtM2(areaPerPerson)} />
            <div className="col-span-2 pt-2 border-t border-dashed"
              style={{ borderColor: "rgba(0,200,150,0.25)" }}>
              <Metric label="Total annual cost" value={fmtNOK(totalCost)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IlluStep6() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      {[
        { x: 60,  y: 50,  color: "#60A5FA", size: 8 },
        { x: 100, y: 35,  color: "#34D399", size: 6 },
        { x: 180, y: 40,  color: "#F59E0B", size: 7 },
        { x: 230, y: 60,  color: "#A78BFA", size: 9 },
        { x: 240, y: 120, color: "#F472B6", size: 6 },
        { x: 55,  y: 140, color: "#34D399", size: 8 },
        { x: 80,  y: 200, color: "#60A5FA", size: 5 },
        { x: 210, y: 200, color: "#F59E0B", size: 7 },
        { x: 250, y: 170, color: "#A78BFA", size: 6 },
      ].map((p, i) => (
        <motion.rect key={i} x={p.x} y={p.y} width={p.size} height={p.size} rx={p.size / 3} fill={p.color}
          animate={{ y: [p.y, p.y + 12, p.y], rotate: [0, 180, 360], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }} />
      ))}
      <motion.circle cx="150" cy="120" r="60" fill="white" stroke="#D1FAE5" strokeWidth="2.5"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,201,167,0.2))" }}
        animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="150" y="145" textAnchor="middle" fontSize="11" fill="#0D1B2A" fontWeight="800">Setup Complete!</text>
      {["Map Rooms", "Count Occupants", "Analyse & Report"].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.18 }}>
          <rect x="76" y={198 + i * 18} width="148" height="14" rx="7"
            fill={["#DBEAFE", "#D1FAE5", "#FEF9C3"][i]} />
          <text x="150" y={208 + i * 18} textAnchor="middle" fontSize="8" fontWeight="600"
            fill={["#1D4ED8", "#15803D", "#854D0E"][i]}>
            {i + 1}. {s}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = [
  null,                  // Step 1 (create project) — right column hidden, no illustration needed
  null,                  // Step 2 uses LeaseBenchmarkPanel (rendered separately)
  null,                  // Step 3 (floor plans) has no illustration
  <IlluStep6 key={3} />, // Done illustration
];

const slideVariants = {
  enterRight: { opacity: 0, x: 32 },
  center:     { opacity: 1, x: 0 },
  exitLeft:   { opacity: 0, x: -32 },
  enterLeft:  { opacity: 0, x: -32 },
  exitRight:  { opacity: 0, x: 32 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, setStep } = useOnboardingStore();
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const isLastStep = currentStep === 3;
  const isStep3 = currentStep === 2;    // Add Floor Plans step
  const isLeaseStep = currentStep === 1; // Add Lease Parameters step
  const isCreateStep = currentStep === 0; // Create Project step
  const meta = stepMeta[currentStep];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <Logo size="sm" />
        <LanguageSelector />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl space-y-7">
          {/* Step indicator */}
          {!isLastStep && <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setStep} />}

          {/* Split card */}
          <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">

            {/* Full-width header: create project + lease steps */}
            {(isCreateStep || isLeaseStep) && !isLastStep && (
              <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border">
                <p className="text-xs font-semibold text-text-muted font-mono uppercase tracking-widest mb-1">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h1 className="text-xl sm:text-2xl text-text"
                  style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                  {meta.title}
                </h1>
                <p className="text-sm text-text-muted font-body mt-1">{meta.subtitle}</p>
              </div>
            )}

            <div className={`grid grid-cols-1 ${isLastStep || isStep3 || isCreateStep ? "" : "lg:grid-cols-2"}`}>

              {/* ── Left: form ────────────────────────────────────────── */}
              <div className={`flex flex-col ${isLastStep || isStep3 || isLeaseStep || isCreateStep ? "" : "border-b lg:border-b-0 lg:border-r border-border"}`}>
                {/* Step header — only for step 3 (floor plans) which still uses the in-column header */}
                {!isLastStep && !isLeaseStep && !isCreateStep && (
                  <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border">
                    <p className="text-xs font-semibold text-text-muted font-mono uppercase tracking-widest mb-1">
                      Step {currentStep + 1} of {STEPS.length}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <h1 className="text-xl sm:text-2xl font-700 text-text"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                        {meta.title}
                      </h1>
                      {isStep3 && (
                        <button
                          type="button"
                          onClick={() => setShowConsultantModal(true)}
                          className="shrink-0 text-sm font-medium text-text-muted hover:text-primary underline underline-offset-2 transition-colors font-body"
                        >
                          Don&apos;t have a floor plan?
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-text-muted font-body mt-1">{meta.subtitle}</p>
                  </div>
                )}

                {/* Form content */}
                <div className="px-6 sm:px-8 py-7 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      variants={slideVariants}
                      initial="enterRight"
                      animate="center"
                      exit="exitLeft"
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Create project: centered form, no right column */}
                      {currentStep === 0 && (
                        <div className="max-w-lg mx-auto">
                          <Step1Project onNext={nextStep} />
                        </div>
                      )}
                      {currentStep === 1 && <Step3Lease onNext={nextStep} />}
                      {currentStep === 2 && <Step3FloorPlans onNext={nextStep} onBack={prevStep} />}
                      {currentStep === 3 && <Step6Done />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Right: illustration or live preview (hidden for create, last, step3) ── */}
              <div className={`${isLastStep || isStep3 || isCreateStep ? "hidden" : "hidden lg:flex"} ${
                isLeaseStep
                  ? "bg-bg items-start p-6 overflow-y-auto"
                  : `items-center justify-center bg-gradient-to-br ${meta.illuBg} px-8 py-10 min-h-[420px]`
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full"
                  >
                    {isLeaseStep ? (
                      <LeaseVisualPanel />
                    ) : (
                      <>
                        <div className="max-w-xs mx-auto">
                          {ILLUSTRATIONS[currentStep]}
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-5 text-center"
                        >
                          <span className="inline-block rounded-full bg-white/70 border border-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-text/70 font-body">
                            {meta.subtitle}
                          </span>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Full-width upload + button footer for lease step */}
            {isLeaseStep && (
              <>
                {/* Upload area */}
                <div className="px-6 sm:px-8 pt-2 pb-6 border-t border-border">
                  <label className="text-sm font-medium text-text font-body block mb-1.5 pt-5">
                    Add lease contract and additional agreements (e.g. parking, storage)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 py-7 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-text-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text">Click to upload PDFs</p>
                      <p className="text-xs text-text-muted mt-0.5">or drag and drop · multiple files supported</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) setUploadedFiles((prev) => [...prev, ...files]);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-surface-2/60 group"
                        >
                          <FileText size={14} className="text-primary shrink-0" />
                          <span className="flex-1 text-xs font-medium text-text truncate min-w-0">{file.name}</span>
                          <span className="text-[10px] text-text-muted font-mono shrink-0">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <button
                            type="button"
                            onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="px-6 sm:px-8 py-5 border-t border-border flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    onClick={prevStep}
                    icon={<ArrowLeft size={16} />}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    type="submit"
                    form="lease-form"
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Progress dots (mobile only) */}
          <div className="lg:hidden flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-primary" : i < currentStep ? "w-2 bg-accent" : "w-2 bg-border"
                }`} />
            ))}
          </div>
        </div>
      </main>

      {/* Consultant Modal */}
      <AnimatePresence>
        {showConsultantModal && (
          <ConsultantModal
            onClose={() => setShowConsultantModal(false)}
            onDashboard={() => router.push("/dashboard")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
