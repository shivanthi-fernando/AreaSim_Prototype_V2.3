"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useCanvasStore } from "@/store/canvas";
import { cn, formatNumber } from "@/lib/utils";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  primary:  "#139485",
  dark:     "#0A4F6E",
  amber:    "#F59E0B",
  purple:   "#7C3AED",
  accent:   "#00C9A7",
};

// Light bg tints — UX Illustration Palette lightest shades
const BG = {
  area:  "#DCEFEA",   // Pale Mint Teal
  bar:   "#EFE3C7",   // Linen Cream
  line:  "#E8E2F5",   // Lavender Mist
  radar: "#DCEFE3",   // Mist Sage
  pie:   "#DCE7F5",   // Ice Blue
};

// ── Mock data generation ──────────────────────────────────────────────────────
const ROUNDS = ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"];

const generateRoomHistory = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ROUNDS.map((round, i) => {
    const base = 5 + (hash % 15);
    const count = Math.max(0, Math.round(base + Math.sin((i + hash) * 0.8) * 5));
    return {
      round,
      count,
      time: `${9 + i * 2}:00 ${9 + i * 2 >= 12 ? "PM" : "AM"}`,
      date: "Apr 22, 2024",
      by: i % 2 === 0 ? "John K." : "Sarah L.",
    };
  });
};

const generate14DayTrend = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    count: Math.max(1, Math.round(8 + Math.sin((i + hash) * 0.6) * 6)),
    capacity: 20,
  }));
};

const generateSessionData = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ROUNDS.map((round, i) => ({
    round,
    occupancy: Math.max(1, Math.round(6 + Math.sin((i + hash) * 0.9) * 4)),
    capacity:  20,
    avg:       Math.max(1, Math.round(10 + Math.cos((i + hash) * 0.7) * 3)),
  }));
};

const generateRadarData = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return [
    { metric: "AM Peak",    value: Math.max(10, (hash % 60) + 40) },
    { metric: "PM Peak",    value: Math.max(10, ((hash * 2) % 60) + 30) },
    { metric: "Avg Use",    value: Math.max(10, ((hash * 3) % 50) + 35) },
    { metric: "Off Hours",  value: Math.max(5,  ((hash * 4) % 30) + 10) },
    { metric: "Efficiency", value: Math.max(20, ((hash * 5) % 45) + 40) },
  ];
};

const generatePieData = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return [
    { name: "Meeting",       value: Math.max(5, (hash % 35) + 15),          color: C.primary },
    { name: "Focus work",    value: Math.max(5, ((hash * 2) % 25) + 10),    color: C.dark },
    { name: "Collaboration", value: Math.max(5, ((hash * 3) % 20) + 10),    color: C.amber },
    { name: "Empty",         value: Math.max(3, ((hash * 4) % 15) + 5),     color: C.purple },
  ];
};

// ── Custom tooltip style ──────────────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    fontFamily: "var(--font-manrope)",
  },
  labelStyle: { fontWeight: "bold", color: "#0D1B2A", marginBottom: "4px" },
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function RoomHistoryPage() {
  const params    = useParams();
  const router    = useRouter();
  const projectId  = params.id as string;
  const floorId    = params.floorId as string;

  const { floors } = useCanvasStore();
  const floor  = floors.find(f => f.id === floorId) || floors[0];
  const rooms  = floor?.rooms || [];

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const historyData  = useMemo(() => selectedRoom ? generateRoomHistory(selectedRoom.name)  : [], [selectedRoom]);
  const trend14Data  = useMemo(() => selectedRoom ? generate14DayTrend(selectedRoom.name)   : [], [selectedRoom]);
  const sessionData  = useMemo(() => selectedRoom ? generateSessionData(selectedRoom.name)  : [], [selectedRoom]);
  const radarData    = useMemo(() => selectedRoom ? generateRadarData(selectedRoom.name)    : [], [selectedRoom]);
  const pieData      = useMemo(() => selectedRoom ? generatePieData(selectedRoom.name)      : [], [selectedRoom]);

  return (
    <div className="h-screen bg-bg flex flex-col font-body overflow-hidden">

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/count#session-details`)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to counting
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase mb-0.5">Analytics</span>
              <h1 className="text-xl text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                Counting history
              </h1>
            </div>
          </div>

          {/* Room picker */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm hover:border-primary transition-all min-w-[220px]"
            >
              <LayoutGrid size={16} className="text-primary" />
              <div className="flex-1 text-left">
                <p className="text-[10px] text-text-muted font-bold uppercase leading-none mb-1">Selected room</p>
                <p className="text-sm font-bold text-text leading-none">{selectedRoom?.name || "Select room"}</p>
              </div>
              <ChevronDown size={14} className={cn("text-text-muted transition-transform", isDropdownOpen && "rotate-180")} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 py-2 max-h-[300px] overflow-y-auto">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => { setSelectedRoomId(room.id); setIsDropdownOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      selectedRoomId === room.id ? "bg-primary/5 text-primary font-bold" : "text-text hover:bg-bg"
                    )}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* ── Charts grid — all 5 visible simultaneously ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* 1 – Pie: usage split — full-width, shown first */}
            <div className="xl:col-span-2">
              <ChartCard
                title="Usage split"
                description="Occupancy category share"
                bg={BG.pie}
              >
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Tooltip {...tooltipStyle} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ fontSize: 11, fontWeight: 600, color: "#5A7184" }}>{value}</span>}
                    />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={1200}
                      label={({ percent }: { percent?: number }) => percent != null ? `${Math.round(percent * 100)}%` : ""}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* 2 – Bar: count per session round */}
            <ChartCard
              title="Sessions"
              description="Count per session round"
              bg={BG.bar}
              legend={[{ color: C.primary, label: "Occupancy" }, { color: C.amber, label: "Average" }]}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sessionData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="occupancy" name="Occupancy" fill={C.primary} radius={[6, 6, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="avg"       name="Average"   fill={C.amber}   radius={[6, 6, 0, 0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 3 – Line: count vs capacity */}
            <ChartCard
              title="Capacity line"
              description="Count vs capacity over rounds"
              bg={BG.line}
              legend={[{ color: C.primary, label: "Count" }, { color: C.purple, label: "Capacity" }]}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="count" name="Count" stroke={C.primary} strokeWidth={2.5} dot={{ r: 4, fill: C.primary, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} animationDuration={1200} />
                  <Line type="monotone" dataKey={() => 12} name="Capacity" stroke={C.purple} strokeWidth={2} strokeDasharray="5 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 4 – Radar: multi-metric breakdown */}
            <ChartCard
              title="Metrics radar"
              description="Multi-metric breakdown"
              bg={BG.radar}
              legend={[{ color: C.accent, label: "Score (0–100)" }]}
            >
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 600, fill: "#5A7184" }} />
                  <Tooltip {...tooltipStyle} />
                  <Radar name="Score" dataKey="value" stroke={C.accent} strokeWidth={2} fill={C.accent} fillOpacity={0.2} animationDuration={1200} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 5 – Area: 14-day occupancy trend */}
            <ChartCard
              title="Area trend"
              description="Occupancy over 14 days"
              bg={BG.area}
              legend={[{ color: C.primary, label: "Occupancy" }]}
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trend14Data}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.primary} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="count" name="Occupancy" stroke={C.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#areaGrad)" animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          {/* ── Session records table ── */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#F1F5F9] bg-bg/50">
              <h3 className="text-lg font-bold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>Session records</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-bg border-b border-[#E2E8F0]">
                  <tr className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Round</th>
                    <th className="px-6 py-4">No. of seats</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4 text-right">Conducted by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {historyData.map((row, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      className="hover:bg-bg transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-text-muted font-body">{row.date}</td>
                      <td className="px-6 py-4 text-sm text-text-muted font-body">{row.time}</td>
                      <td className="px-6 py-4 text-sm text-text-muted font-body">{row.round}</td>
                      <td className="px-6 py-4 text-sm text-text-muted font-body">12</td>
                      <td className="px-6 py-4 text-sm text-text-muted font-body">{formatNumber(row.count)}</td>
                      <td className="px-6 py-4 text-sm text-text-muted font-body text-right">{row.by}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {historyData.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-text-muted">No history records found for this room.</p>
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[11px] text-[#8CA3B0] font-bold tracking-wider uppercase">
          <span>Areasim analytics engine</span>
          <span>Export CSV • Export PDF</span>
        </div>
      </footer>
    </div>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({
  title,
  description,
  bg,
  legend,
  children,
}: {
  title: string;
  description: string;
  bg: string;
  legend?: { color: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col"
      style={{ background: bg }}
    >
      <div className="px-5 py-4 border-b border-[#E2E8F0]/60 flex items-center justify-between bg-white/70">
        <div>
          <h3 className="text-sm font-bold text-text leading-none mb-1" style={{ fontFamily: "var(--font-manrope)" }}>
            {title}
          </h3>
          <p className="text-[11px] text-text-muted">{description}</p>
        </div>
        {legend && legend.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {legend.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[11px] font-bold text-text-muted">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-5">{children}</div>
    </section>
  );
}
