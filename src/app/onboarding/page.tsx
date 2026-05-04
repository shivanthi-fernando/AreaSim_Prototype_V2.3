"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, Mail, ArrowLeft, ArrowRight, Upload, FileText, Building2, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
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
                  <a href={`tel:${c.phone}`}
                    className="inline-flex items-center justify-center gap-2 font-body font-medium select-none cursor-pointer bg-surface-2 text-text hover:bg-border btn-3d-secondary border border-border rounded-full text-sm px-5 py-2.5 h-10 transition-all">
                    <Phone size={14} /> {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`}
                    className="inline-flex items-center justify-center gap-2 font-body font-medium select-none cursor-pointer bg-surface-2 text-text hover:bg-border btn-3d-secondary border border-border rounded-full text-sm px-5 py-2.5 h-10 transition-all">
                    <Mail size={14} /> {c.email}
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
            <div className="flex justify-center">
            <Button
              onClick={onDashboard}
              size="md"
            >
              Go to Dashboard
            </Button>
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

// ─── Step 1 — City Illustration Panel ────────────────────────────────────────

function CityIllusPanel() {
  return (
    <div className="relative w-full h-full flex flex-col justify-end" style={{ background: "linear-gradient(160deg, #EBF7F2 0%, #DFF0E8 60%, #D5EBE0 100%)", minHeight: 480 }}>
      <svg viewBox="0 0 560 540" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }}>
        <defs>
          <linearGradient id="ci-skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBF7F2"/>
            <stop offset="100%" stopColor="#DFF0E8"/>
          </linearGradient>
          <linearGradient id="ci-groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8E8D8"/>
            <stop offset="100%" stopColor="#B8DED0"/>
          </linearGradient>
          <radialGradient id="ci-glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#139485" stopOpacity=".15"/>
            <stop offset="100%" stopColor="#139485" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ci-glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1BA896" stopOpacity=".12"/>
            <stop offset="100%" stopColor="#1BA896" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ci-glow3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6D5FAD" stopOpacity=".1"/>
            <stop offset="100%" stopColor="#6D5FAD" stopOpacity="0"/>
          </radialGradient>
          <filter id="ci-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="ci-blur2"><feGaussianBlur stdDeviation="2"/></filter>
        </defs>

        <rect width="560" height="480" fill="url(#ci-skyGrad)"/>
        <rect x="0" y="340" width="560" height="140" fill="url(#ci-groundGrad)"/>
        <line x1="0" y1="342" x2="560" y2="342" stroke="rgba(19,148,133,.15)" strokeWidth="1"/>

        {/* Road */}
        <path d="M -20,380 C 80,370 140,360 200,355 S 320,350 400,345 S 510,340 580,335" fill="none" stroke="#B8D0C0" strokeWidth="36"/>
        <path d="M -20,380 C 80,370 140,360 200,355 S 320,350 400,345 S 510,340 580,335" fill="none" stroke="#C4D8CC" strokeWidth="32"/>
        <path d="M -20,380 C 80,370 140,360 200,355 S 320,350 400,345 S 510,340 580,335" fill="none" stroke="rgba(19,148,133,.3)" strokeWidth="1.5" strokeDasharray="22 14"/>
        <path d="M -20,366 C 80,356 140,346 200,341 S 320,336 400,331 S 510,326 580,321" fill="none" stroke="rgba(19,148,133,.2)" strokeWidth="1"/>
        <path d="M -20,394 C 80,384 140,374 200,369 S 320,364 400,359 S 510,354 580,349" fill="none" stroke="rgba(19,148,133,.2)" strokeWidth="1"/>

        {/* Glow pools */}
        <ellipse cx="110" cy="340" rx="70" ry="25" fill="url(#ci-glow1)" filter="url(#ci-blur4)"/>
        <ellipse cx="290" cy="335" rx="80" ry="22" fill="url(#ci-glow2)" filter="url(#ci-blur4)"/>
        <ellipse cx="450" cy="335" rx="65" ry="20" fill="url(#ci-glow3)" filter="url(#ci-blur4)"/>

        {/* Building Group 1 */}
        <rect x="34" y="210" width="52" height="130" fill="#A8D4BC" rx="2"/>
        <rect x="34" y="210" width="52" height="4" fill="#5BAA7A" rx="1"/>
        <g fill="rgba(56,134,94,.35)">
          <rect x="41" y="220" width="10" height="13" rx="1"/><rect x="57" y="220" width="10" height="13" rx="1"/><rect x="73" y="220" width="7" height="13" rx="1"/>
          <rect x="41" y="240" width="10" height="13" rx="1"/><rect x="57" y="240" width="10" height="13" rx="1"/><rect x="73" y="240" width="7" height="13" rx="1"/>
          <rect x="41" y="260" width="10" height="13" rx="1"/><rect x="57" y="260" width="10" height="13" rx="1"/><rect x="73" y="260" width="7" height="13" rx="1"/>
          <rect x="41" y="280" width="10" height="13" rx="1"/><rect x="57" y="280" width="10" height="13" rx="1"/><rect x="73" y="280" width="7" height="13" rx="1"/>
          <rect x="41" y="300" width="10" height="13" rx="1"/><rect x="57" y="300" width="10" height="13" rx="1"/>
        </g>
        <rect x="73" y="260" width="7" height="13" rx="1" fill="#139485" opacity=".5"/>
        <rect x="41" y="280" width="10" height="13" rx="1" fill="#139485" opacity=".4"/>
        <rect x="92" y="255" width="36" height="85" fill="#B8DCCB" rx="2"/>
        <rect x="92" y="255" width="36" height="3" fill="#5BAA7A"/>
        <g fill="rgba(56,134,94,.3)">
          <rect x="98" y="264" width="8" height="10" rx="1"/><rect x="112" y="264" width="8" height="10" rx="1"/>
          <rect x="98" y="282" width="8" height="10" rx="1"/><rect x="112" y="282" width="8" height="10" rx="1"/>
          <rect x="98" y="300" width="8" height="10" rx="1"/><rect x="112" y="300" width="8" height="10" rx="1"/>
        </g>
        <rect x="50" y="315" width="20" height="25" rx="10" fill="#8CC4A8"/>

        {/* Building Group 2: Amber */}
        <rect x="152" y="165" width="44" height="175" fill="#F0DFB8" rx="2"/>
        <rect x="152" y="165" width="44" height="4" fill="#D4920A" rx="1"/>
        <g fill="rgba(176,110,10,.35)">
          <rect x="158" y="175" width="9" height="12" rx="1"/><rect x="172" y="175" width="9" height="12" rx="1"/><rect x="183" y="175" width="7" height="12" rx="1"/>
          <rect x="158" y="195" width="9" height="12" rx="1"/><rect x="172" y="195" width="9" height="12" rx="1"/><rect x="183" y="195" width="7" height="12" rx="1"/>
          <rect x="158" y="215" width="9" height="12" rx="1"/><rect x="172" y="215" width="9" height="12" rx="1"/>
          <rect x="158" y="235" width="9" height="12" rx="1"/><rect x="172" y="235" width="9" height="12" rx="1"/>
          <rect x="158" y="255" width="9" height="12" rx="1"/><rect x="172" y="255" width="9" height="12" rx="1"/>
          <rect x="158" y="275" width="9" height="12" rx="1"/><rect x="172" y="275" width="9" height="12" rx="1"/>
          <rect x="158" y="295" width="9" height="12" rx="1"/><rect x="172" y="295" width="9" height="12" rx="1"/>
          <rect x="158" y="315" width="9" height="12" rx="1"/><rect x="172" y="315" width="9" height="12" rx="1"/>
        </g>
        <rect x="183" y="195" width="7" height="12" rx="1" fill="#B06E0A" opacity=".5"/>
        <rect x="158" y="235" width="9" height="12" rx="1" fill="#B06E0A" opacity=".4"/>
        <line x1="174" y1="165" x2="174" y2="148" stroke="#D4920A" strokeWidth="1.5"/>
        <circle cx="174" cy="146" r="3" fill="#D4920A" opacity=".8"/>

        {/* Building Group 2b: Blue */}
        <rect x="200" y="250" width="34" height="90" fill="#C0D5F0" rx="2"/>
        <rect x="200" y="250" width="34" height="3" fill="#3A6FB5" rx="1"/>
        <g fill="rgba(58,111,181,.35)">
          <rect x="206" y="260" width="8" height="10" rx="1"/><rect x="219" y="260" width="8" height="10" rx="1"/>
          <rect x="206" y="278" width="8" height="10" rx="1"/><rect x="219" y="278" width="8" height="10" rx="1"/>
          <rect x="206" y="296" width="8" height="10" rx="1"/><rect x="219" y="296" width="8" height="10" rx="1"/>
          <rect x="206" y="314" width="8" height="10" rx="1"/><rect x="219" y="314" width="8" height="10" rx="1"/>
        </g>
        <rect x="219" y="278" width="8" height="10" rx="1" fill="#3A6FB5" opacity=".5"/>

        {/* Building Group 3: Orange tower */}
        <rect x="264" y="135" width="56" height="205" fill="#F0DFB8" rx="2"/>
        <rect x="264" y="135" width="56" height="5" fill="#D4920A" rx="1"/>
        <g fill="rgba(176,110,10,.3)">
          <rect x="272" y="148" width="10" height="14" rx="1"/><rect x="288" y="148" width="10" height="14" rx="1"/><rect x="304" y="148" width="9" height="14" rx="1"/>
          <rect x="272" y="170" width="10" height="14" rx="1"/><rect x="288" y="170" width="10" height="14" rx="1"/><rect x="304" y="170" width="9" height="14" rx="1"/>
          <rect x="272" y="192" width="10" height="14" rx="1"/><rect x="288" y="192" width="10" height="14" rx="1"/><rect x="304" y="192" width="9" height="14" rx="1"/>
          <rect x="272" y="214" width="10" height="14" rx="1"/><rect x="288" y="214" width="10" height="14" rx="1"/><rect x="304" y="214" width="9" height="14" rx="1"/>
          <rect x="272" y="236" width="10" height="14" rx="1"/><rect x="288" y="236" width="10" height="14" rx="1"/>
          <rect x="272" y="258" width="10" height="14" rx="1"/><rect x="288" y="258" width="10" height="14" rx="1"/>
          <rect x="272" y="280" width="10" height="14" rx="1"/><rect x="288" y="280" width="10" height="14" rx="1"/>
          <rect x="272" y="302" width="10" height="14" rx="1"/><rect x="288" y="302" width="10" height="14" rx="1"/>
          <rect x="272" y="324" width="10" height="14" rx="1"/>
        </g>
        <rect x="304" y="148" width="9" height="14" rx="1" fill="#B06E0A" opacity=".5"/>
        <rect x="288" y="170" width="10" height="14" rx="1" fill="#B06E0A" opacity=".4"/>
        <rect x="272" y="192" width="10" height="14" rx="1" fill="#B06E0A" opacity=".45"/>
        <line x1="292" y1="135" x2="292" y2="110" stroke="rgba(176,110,10,.3)" strokeWidth="1"/>
        <circle cx="292" cy="108" r="5" fill="#D4920A" opacity=".4" filter="url(#ci-blur2)"/>
        <circle cx="292" cy="108" r="2.5" fill="#D4920A" opacity=".7"/>

        {/* Building Group 3b: Purple */}
        <rect x="326" y="200" width="38" height="140" fill="#D0CAF0" rx="2"/>
        <rect x="326" y="200" width="38" height="4" fill="#6D5FAD" rx="1"/>
        <g fill="rgba(109,95,173,.3)">
          <rect x="333" y="212" width="8" height="11" rx="1"/><rect x="347" y="212" width="9" height="11" rx="1"/>
          <rect x="333" y="231" width="8" height="11" rx="1"/><rect x="347" y="231" width="9" height="11" rx="1"/>
          <rect x="333" y="250" width="8" height="11" rx="1"/><rect x="347" y="250" width="9" height="11" rx="1"/>
          <rect x="333" y="269" width="8" height="11" rx="1"/><rect x="347" y="269" width="9" height="11" rx="1"/>
          <rect x="333" y="288" width="8" height="11" rx="1"/><rect x="347" y="288" width="9" height="11" rx="1"/>
          <rect x="333" y="307" width="8" height="11" rx="1"/><rect x="347" y="307" width="9" height="11" rx="1"/>
        </g>
        <rect x="347" y="231" width="9" height="11" rx="1" fill="#6D5FAD" opacity=".5"/>

        {/* Building Group 4: Right destination */}
        <rect x="390" y="230" width="80" height="110" fill="#A8D4BC" rx="3"/>
        <rect x="390" y="230" width="80" height="5" fill="#5BAA7A" rx="1"/>
        <g fill="rgba(19,148,133,.3)">
          <rect x="397" y="243" width="12" height="16" rx="1"/><rect x="415" y="243" width="12" height="16" rx="1"/><rect x="433" y="243" width="12" height="16" rx="1"/><rect x="451" y="243" width="12" height="16" rx="1"/>
          <rect x="397" y="267" width="12" height="16" rx="1"/><rect x="415" y="267" width="12" height="16" rx="1"/><rect x="433" y="267" width="12" height="16" rx="1"/><rect x="451" y="267" width="12" height="16" rx="1"/>
          <rect x="397" y="291" width="12" height="16" rx="1"/><rect x="415" y="291" width="12" height="16" rx="1"/><rect x="433" y="291" width="12" height="16" rx="1"/><rect x="451" y="291" width="12" height="16" rx="1"/>
          <rect x="469" y="243" width="14" height="16" rx="1"/><rect x="469" y="267" width="14" height="16" rx="1"/><rect x="469" y="291" width="14" height="16" rx="1"/>
        </g>
        <rect x="397" y="243" width="12" height="16" rx="1" fill="#139485" opacity=".5"/>
        <rect x="415" y="243" width="12" height="16" rx="1" fill="#139485" opacity=".45"/>
        <rect x="433" y="267" width="12" height="16" rx="1" fill="#139485" opacity=".4"/>
        <rect x="451" y="243" width="12" height="16" rx="1" fill="#139485" opacity=".5"/>
        <rect x="397" y="291" width="12" height="16" rx="1" fill="#139485" opacity=".4"/>
        <rect x="469" y="267" width="14" height="16" rx="1" fill="#139485" opacity=".45"/>
        <rect x="476" y="190" width="36" height="150" fill="#B0D4C0" rx="2"/>
        <rect x="476" y="190" width="36" height="4" fill="#5BAA7A" rx="1"/>
        <g fill="rgba(19,148,133,.3)">
          <rect x="482" y="202" width="8" height="12" rx="1"/><rect x="495" y="202" width="9" height="12" rx="1"/>
          <rect x="482" y="222" width="8" height="12" rx="1"/><rect x="495" y="222" width="9" height="12" rx="1"/>
          <rect x="482" y="242" width="8" height="12" rx="1"/><rect x="495" y="242" width="9" height="12" rx="1"/>
          <rect x="482" y="262" width="8" height="12" rx="1"/><rect x="495" y="262" width="9" height="12" rx="1"/>
          <rect x="482" y="282" width="8" height="12" rx="1"/><rect x="495" y="282" width="9" height="12" rx="1"/>
          <rect x="482" y="302" width="8" height="12" rx="1"/><rect x="495" y="302" width="9" height="12" rx="1"/>
        </g>
        <rect x="482" y="202" width="8" height="12" rx="1" fill="#139485" opacity=".5"/>
        <rect x="495" y="242" width="9" height="12" rx="1" fill="#139485" opacity=".4"/>

        {/* Trees */}
        <rect x="135" y="312" width="4" height="28" fill="#6A9E7A"/>
        <circle cx="137" cy="305" r="14" fill="#4DAF7C"/>
        <circle cx="137" cy="300" r="10" fill="#3A9E6A" opacity=".7"/>
        <rect x="242" y="318" width="4" height="22" fill="#6A9E7A"/>
        <circle cx="244" cy="312" r="12" fill="#4DAF7C"/>
        <circle cx="244" cy="307" r="8" fill="#3A9E6A" opacity=".6"/>
        <rect x="375" y="320" width="4" height="20" fill="#6A9E7A"/>
        <circle cx="377" cy="315" r="11" fill="#4DAF7C"/>
        <circle cx="377" cy="310" r="7.5" fill="#3A9E6A" opacity=".6"/>
        <rect x="524" y="318" width="3" height="22" fill="#6A9E7A"/>
        <circle cx="526" cy="312" r="10" fill="#4DAF7C"/>

        {/* Journey path */}
        <path d="M 85,162 Q 185,115 292,92 Q 390,95 430,193" fill="none" stroke="rgba(19,148,133,.2)" strokeWidth="1.5" strokeDasharray="8 6"/>
        <path d="M 185,133 l 5,-4 l 0,8" fill="rgba(19,148,133,.25)"/>
        <path d="M 335,98 l 5,-2 l -1,8" fill="rgba(19,148,133,.25)"/>

        {/* Step markers — moved up to create gap above buildings */}
        <circle cx="85" cy="163" r="32" fill="rgba(19,148,133,.12)" filter="url(#ci-blur4)"/>
        <circle cx="85" cy="163" r="22" fill="#139485"/>
        <circle cx="85" cy="163" r="22" fill="none" stroke="#4DAF7C" strokeWidth="2"/>
        <text x="85" y="167" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="-apple-system,sans-serif">1</text>
        <line x1="85" y1="141" x2="85" y2="126" stroke="#139485" strokeWidth="1.5"/>
        <rect x="64" y="118" width="82" height="16" fill="#139485" rx="4"/>
        <text x="105" y="129" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="white" fontFamily="-apple-system,sans-serif">YOU ARE HERE</text>

        <circle cx="292" cy="92" r="18" fill="rgba(176,110,10,.1)" filter="url(#ci-blur2)"/>
        <circle cx="292" cy="92" r="14" fill="#FDF3E0"/>
        <circle cx="292" cy="92" r="14" fill="none" stroke="#B06E0A" strokeWidth="1.8"/>
        <text x="292" y="96.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8A5000" fontFamily="-apple-system,sans-serif">2</text>

        <circle cx="430" cy="193" r="14" fill="#F0EEFF"/>
        <circle cx="430" cy="193" r="14" fill="none" stroke="#6D5FAD" strokeWidth="1.5" strokeDasharray="4 3"/>
        <text x="430" y="197.5" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgba(109,95,173,.7)" fontFamily="-apple-system,sans-serif">3</text>

        <text x="85" y="200" textAnchor="middle" fontSize="8" fill="#1F6644" fontWeight="600" fontFamily="-apple-system,sans-serif">CREATE PROJECT</text>
        <text x="292" y="132" textAnchor="middle" fontSize="8" fill="rgba(176,110,10,.7)" fontWeight="600" fontFamily="-apple-system,sans-serif">LEASE PARAMETERS</text>
        <text x="430" y="224" textAnchor="middle" fontSize="8" fill="rgba(109,95,173,.6)" fontWeight="600" fontFamily="-apple-system,sans-serif">FLOOR PLAN</text>

        <ellipse cx="190" cy="365" rx="8" ry="3" fill="rgba(19,148,133,.08)"/>
        <ellipse cx="350" cy="358" rx="8" ry="3" fill="rgba(19,148,133,.08)"/>
      </svg>

      {/* Caption overlay */}
      <div className="relative z-10 p-8" style={{ background: "linear-gradient(to top, rgba(235,247,242,0.95) 60%, transparent)" }}>
        <h2 className="text-2xl leading-snug mb-2" style={{ fontFamily: "var(--font-manrope)", color: "#1C2A24", letterSpacing: "-0.02em", fontWeight: 400 }}>
          Start your<br /><strong style={{ fontWeight: 600, color: "#1F6644" }}>workspace journey.</strong>
        </h2>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#4A6650" }}>
          Map where you are today — so we can show you where you could be tomorrow.
        </p>
        <div className="flex gap-2.5 mt-5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium" style={{ background: "#139485", color: "#fff" }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(255,255,255,.25)" }}>1</div>
            Create project
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border" style={{ background: "rgba(19,148,133,.08)", color: "#4A6650", borderColor: "rgba(19,148,133,.2)" }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(19,148,133,.1)" }}>2</div>
            Lease parameters
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border" style={{ background: "rgba(19,148,133,.05)", color: "#6A8070", borderColor: "rgba(19,148,133,.15)" }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(19,148,133,.07)" }}>3</div>
            Floor plan
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Lease Visual Panel ─────────────────────────────────────────────

// Floor-specific window colors (floor 3 = violet, floor 2 = amber, floor 1 = coral)


// ─── Custom onboarding stepper ────────────────────────────────────────────────
// Orange = current step (amber from illustration), Primary = completed

function OnboardingStepIndicator({ steps, currentStep, onStepClick }: {
  steps: { label: string; description?: string }[];
  currentStep: number;
  onStepClick?: (i: number) => void;
}) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => onStepClick?.(i)}
              className="flex items-center gap-2.5 outline-none group shrink-0"
            >
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all duration-200"
                style={{
                  background: done ? "var(--color-primary)" : active ? "#139485" : "var(--color-surface)",
                  border: (!done && !active) ? "1.5px solid var(--color-border)" : "none",
                  color: (done || active) ? "#fff" : "var(--color-text-muted)",
                  boxShadow: active ? "0 3px 12px rgba(19,148,133,.28)" : "none",
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : <span>{i + 1}</span>}
              </div>
              <div className="flex flex-col items-start">
                <span
                  className="text-xs font-semibold leading-tight"
                  style={{ color: done ? "var(--color-primary)" : active ? "#139485" : "var(--color-text-muted)" }}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] leading-tight" style={{ color: "var(--color-text-muted)" }}>
                    {step.description}
                  </span>
                )}
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2.5 h-0.5 rounded overflow-hidden" style={{ background: "var(--color-border)" }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{ background: "var(--color-primary)", width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── Market averages (Norway commercial office benchmarks) ───────────────────
const MKT_SPACE = 13;    // m² per person
const MKT_COST  = 60000; // NOK per person per year

function barColor(value: number, marketAvg: number): string {
  const ratio = marketAvg > 0 ? value / marketAvg : 1;
  if (ratio > 1.1)  return "#E46A6A"; // red — above market avg
  if (ratio < 0.9)  return "#4FBF9F"; // green — below market avg
  return "#F4C66E";                    // yellow — at market avg
}

function fmtNOK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000)     return Math.round(n / 1_000) + "k";
  return String(Math.round(n));
}

// ─── Single bar chart with x/y axes ─────────────────────────────────────────
function BarChart({ label, value, marketAvg, formatValue }: {
  label: string;
  value: number;
  marketAvg: number;
  formatValue: (n: number) => string;
}) {
  const color = barColor(value, marketAvg);
  const maxVal = Math.max(value * 1.3, marketAvg * 1.5);
  const barPct = maxVal > 0 ? Math.min(100, Math.max(4, (value / maxVal) * 100)) : 4;
  const refPct = maxVal > 0 ? Math.min(100, (marketAvg / maxVal) * 100) : 50;
  const midVal = maxVal / 2;

  return (
    <div className="flex-1 flex flex-col">
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide font-mono mb-2.5 shrink-0">{label}</p>
      <div className="flex gap-2 flex-1">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end shrink-0 pb-[22px]" style={{ width: 36, fontSize: 9, color: "var(--color-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
          <span>{formatValue(maxVal)}</span>
          <span>{formatValue(midVal)}</span>
          <span>0</span>
        </div>
        {/* Chart body + x-axis */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative flex-1 min-h-[100px] rounded-t-lg overflow-visible">
            {/* Dashed market avg line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed opacity-50"
              style={{ bottom: `${refPct}%`, borderColor: "var(--color-text-muted)" }}
            />
            {/* Bar */}
            <div
              className="absolute bottom-0 left-1/2 rounded-t-lg transition-all duration-500"
              style={{ width: 52, height: `${barPct}%`, background: color, transform: "translateX(-50%)", opacity: 0.88 }}
            />
            {/* Value above bar */}
            <motion.p
              key={value}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 font-bold font-mono text-[13px]"
              style={{ color, bottom: `calc(${barPct}% + 6px)`, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
            >
              {formatValue(value)}
            </motion.p>
          </div>
          {/* X-axis */}
          <div className="flex items-center justify-between pt-1.5 mt-1" style={{ borderTop: "1px solid var(--color-border)", fontSize: 9, color: "var(--color-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
            <span>your company</span>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <div className="w-[8px] h-[8px] rounded-[2px]" style={{ background: color }} />
                <span>you</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-[8px] h-[8px] rounded-[2px]" style={{ border: "1.5px dashed var(--color-text-muted)" }} />
                <span>market avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live lease preview content (left card of step 2) ────────────────────────
// ─── Shared hook for lease derived values ─────────────────────────────────────
function useLeaseMetrics() {
  const { leaseParams } = useOnboardingStore();
  const totalArea      = parseFloat(leaseParams.totalArea)      || 0;
  const annualRent     = parseFloat(leaseParams.annualRent)     || 0;
  const commonAreaCost = parseFloat(leaseParams.commonAreaCost) || 0;
  const employees      = leaseParams.targetHeadcount            || 0;
  const consultants    = leaseParams.consultantsCount           || 0;
  const showCon        = leaseParams.showConsultants            || false;
  const consultantFTE  = leaseParams.consultantFTE              ?? 0.5;
  const effectiveHC    = employees + (showCon ? consultants * consultantFTE : 0);
  const hcDisplay      = Math.round(effectiveHC * 10) / 10;
  const spacePerPerson = effectiveHC > 0 ? totalArea / effectiveHC : 0;
  const costPerPerson  = effectiveHC > 0 ? (annualRent + commonAreaCost) / effectiveHC : 0;
  const spaceColor     = barColor(spacePerPerson, MKT_SPACE);
  const costColor      = barColor(costPerPerson,  MKT_COST);
  const hasPotential   = spaceColor === "#E46A6A" || costColor === "#E46A6A";
  return { employees, consultants, showCon, consultantFTE, hcDisplay, spacePerPerson, costPerPerson, hasPotential };
}

// ─── Headcount card ───────────────────────────────────────────────────────────
function HeadcountCard() {
  const { employees, consultants, showCon, consultantFTE, hcDisplay } = useLeaseMetrics();
  const maxIcons = 30;
  const empIcons = Math.min(employees, maxIcons);
  const conIcons = showCon ? Math.min(consultants, maxIcons - empIcons) : 0;

  return (
    <div className="rounded-[14px] p-5 border" style={{ background: "linear-gradient(135deg, #E8F5EE 0%, #EDE9FA 100%)", borderColor: "#C8DED0" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-text font-body">Effective headcount</p>
        <motion.p key={hcDisplay} initial={{ opacity: 0.5, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="text-2xl font-bold font-mono leading-none" style={{ color: "#139485" }}>
          {hcDisplay % 1 === 0 ? hcDisplay.toFixed(0) : hcDisplay.toFixed(1)}
        </motion.p>
      </div>
      <div className="flex flex-wrap gap-[3px] mb-3 min-h-[22px]">
        {Array.from({ length: empIcons }).map((_, i) => (
          <svg key={`e${i}`} width="16" height="18" viewBox="0 0 16 18" fill="none">
            <circle cx="8" cy="5" r="3.5" fill="#139485"/><path d="M1 17c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#139485"/>
          </svg>
        ))}
        {Array.from({ length: conIcons }).map((_, i) => (
          <svg key={`c${i}`} width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ opacity: 0.4 }}>
            <circle cx="8" cy="5" r="3.5" fill="#9B8FD0"/><path d="M1 17c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#9B8FD0"/>
          </svg>
        ))}
        {(employees > maxIcons || (showCon && consultants > maxIcons - empIcons)) && (
          <span className="text-[10px] font-bold font-mono" style={{ color: "#139485" }}>+more</span>
        )}
      </div>
      <p className="text-[11px]" style={{ color: "#1F5C3C" }}>
        <span className="font-bold font-mono">{employees}</span>
        {showCon && consultants > 0 && (<> + <span className="font-bold font-mono">{consultants}</span> × {consultantFTE}</>)}
        <span className="ml-1 opacity-60">permanent{showCon && consultants > 0 ? " + consultants" : " employees"}</span>
      </p>
    </div>
  );
}

// ─── Efficiency charts + opportunity card ─────────────────────────────────────
function EfficiencyCard() {
  const { spacePerPerson, costPerPerson, hasPotential } = useLeaseMetrics();

  return (
    <div className="flex-1 rounded-[14px] border border-border bg-surface p-5 flex flex-col">
      <p className="text-sm font-medium text-text font-body mb-4">Efficiency charts</p>
      <div className="flex-1 flex flex-col gap-6">
        <BarChart label="Space efficiency · m² per person" value={spacePerPerson} marketAvg={MKT_SPACE} formatValue={(n) => `${n.toFixed(1)} m²`} />
        <BarChart label="Cost per employee · NOK / year"   value={costPerPerson}  marketAvg={MKT_COST}  formatValue={(n) => fmtNOK(n) + " NOK"} />
      </div>
      <div className="mt-6 rounded-[10px] border p-4 shrink-0"
        style={hasPotential ? { background: "#F9F6EF", borderColor: "#F6DFA0" } : { background: "#EAF5EE", borderColor: "#C4E3D2" }}>
        <div className="flex items-center gap-2 mb-1.5">
          {hasPotential ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L9.5 5.5H14L10.5 8.5 11.5 13 7.5 10.5 3.5 13 4.5 8.5 1 5.5H5.5Z" fill="#B06E0A"/></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="#139485"/><path d="M4.5 7.5L6.5 9.5 10.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          <p className="text-sm font-semibold" style={{ color: hasPotential ? "#B06E0A" : "#139485" }}>
            {hasPotential ? "You have optimization potential." : "You have no optimization potential."}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: hasPotential ? "#8A5E1A" : "#1F5C3C" }}>
          {hasPotential
            ? "Your space or cost per person is above the market average. Aligning closer could free up budget and space for your team."
            : "Your space and cost per person are at or below the market benchmark — great efficiency."}
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, setStep } = useOnboardingStore();
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const isLastStep = currentStep === 3;
  const isLeaseStep = currentStep === 1; // Add Lease Parameters step
  const isCreateStep = currentStep === 0; // Create Project step

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface" style={{ borderBottom: "1px solid #EAE5DC" }}>
        <Logo size="md" />
        <LanguageSelector />
      </header>

      {/* ── Centered fixed stepper ─────────────────────────────────────────── */}
      {!isLastStep && (
        <div className="shrink-0 bg-surface px-6 py-3.5" style={{ borderBottom: "1px solid #EAE5DC" }}>
          <div className="max-w-xl mx-auto">
            <OnboardingStepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setStep} />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isLastStep ? (
          // ── Done step: centred ────────────────────────────────────────────────
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <Step6Done />
          </div>
        ) : isLeaseStep ? (
          // ── Step 2: multi-card scrollable layout ─────────────────────────────
          <div className="flex-1 overflow-y-auto" style={{ background: "var(--color-bg)" }}>
            <div className="w-full max-w-[1080px] mx-auto px-8 py-10 space-y-5">

              {/* Page header */}
              <div>
                <p className="text-[10px] font-bold tracking-[.1em] uppercase mb-1" style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>Step 2 of 3</p>
                <h2 className="text-2xl mb-0.5" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500, letterSpacing: "-.02em" }}>Lease parameters</h2>
                <p className="text-sm text-text-muted leading-relaxed">Type your figures — the preview updates live.</p>
              </div>

              {/* Main grid: inputs left, preview cards right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

                {/* Left card: form inputs & upload */}
                <div className="flex flex-col gap-5">
                  <div className="rounded-[18px] border border-border bg-surface shadow-card p-8">
                    <Step3Lease onNext={nextStep} />
                  </div>

                  <label className="flex flex-col items-center justify-center gap-4 py-10 rounded-[18px] border-2 border-dashed border-primary/30 bg-surface hover:border-[#C4BAED] hover:bg-[#F0EEFF] transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full border border-[#DDD8F7] flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: "#F0EEFF" }}>
                      <Upload size={22} style={{ color: "#6D5FAD" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-text">Drop your lease & floor plans — we&apos;ll auto-fill what we can</p>
                      <p className="text-xs text-text-muted mt-1 font-body">PDF · multiple files supported</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" multiple onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) setUploadedFiles((prev) => [...prev, ...files]); e.target.value = ""; }} />
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-surface-2/60 group">
                          <FileText size={14} className="text-primary shrink-0" />
                          <span className="flex-1 text-xs font-medium text-text truncate min-w-0">{file.name}</span>
                          <span className="text-[10px] text-text-muted font-mono shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                          <button type="button" onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))} className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right column: two stacked cards */}
                <div className="flex flex-col gap-5 h-full">
                  <HeadcountCard />
                  <EfficiencyCard />
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between pb-4">
                <Button variant="secondary" size="lg" type="button" onClick={prevStep} icon={<ArrowLeft size={16} />}>Back</Button>
                <Button size="lg" type="submit" form="lease-form" icon={<ArrowRight size={16} />} iconPosition="right">Continue</Button>
              </div>

            </div>
          </div>
        ) : isCreateStep ? (
          // ── Step 1: illustration + form card ─────────────────────────────────
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">

            {/* Left: illustration panel */}
            <div className="hidden lg:block relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
                  <CityIllusPanel />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: form card */}
            <div className="flex flex-col overflow-y-auto" style={{ background: "var(--color-bg)" }}>
              <div className="flex flex-col w-full max-w-[540px] mx-auto px-8 py-10 gap-8 min-h-full">
                <div className="rounded-[18px] border border-border bg-surface shadow-card flex-1" style={{ padding: "34px 36px" }}>
                  <p className="text-[10px] font-bold tracking-[.1em] uppercase mb-1.5" style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>Step 1 of 3</p>
                  <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500, letterSpacing: "-.02em" }}>Create your first project</h2>
                  <p className="text-sm text-text-muted mb-7 leading-relaxed">Tell us about your building and location.</p>
                  <Step1Project onNext={nextStep} />
                </div>
              </div>
            </div>

          </div>
        ) : (
          // ── Step 3: full-width form card ──────────────────────────────────────
          <div className="flex-1 overflow-y-auto" style={{ background: "var(--color-bg)" }}>
            <div className="w-full max-w-[1080px] mx-auto px-8 py-10">
              <div className="rounded-[18px] border border-border bg-surface shadow-card" style={{ padding: "34px 36px" }}>
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <p className="text-[10px] font-bold tracking-[.1em] uppercase mb-1" style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>Step 3 of 3</p>
                    <h2 className="text-2xl" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500, letterSpacing: "-.02em" }}>Add floor plans</h2>
                  </div>
                  <button type="button" onClick={() => setShowConsultantModal(true)} className="shrink-0 text-sm font-medium text-text-muted hover:text-primary underline underline-offset-2 transition-colors font-body mt-1">
                    Don&apos;t have one?
                  </button>
                </div>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">Upload and verify your floor plan layouts.</p>
                <Step3FloorPlans onNext={nextStep} onBack={prevStep} />
              </div>
            </div>
          </div>
        )}
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
