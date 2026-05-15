"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  LayoutGrid,
  BarChart2,
  TrendingUp,
  Activity,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
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

// 14-day trend (one number per day)
const generate14DayTrend = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    count: Math.max(1, Math.round(8 + Math.sin((i + hash) * 0.6) * 6)),
    capacity: 20,
  }));
};

// 5-session multi-metric bar data
const generateSessionData = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ROUNDS.map((round, i) => ({
    round,
    occupancy: Math.max(1, Math.round(6 + Math.sin((i + hash) * 0.9) * 4)),
    capacity:  20,
    avg:       Math.max(1, Math.round(10 + Math.cos((i + hash) * 0.7) * 3)),
  }));
};

// Radar: 5 metrics
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

// Pie: category breakdown
const generatePieData = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const meeting  = Math.max(5, (hash % 35) + 15);
  const focus    = Math.max(5, ((hash * 2) % 25) + 10);
  const collab   = Math.max(5, ((hash * 3) % 20) + 10);
  const empty    = Math.max(3, ((hash * 4) % 15) + 5);
  return [
    { name: "Meeting",       value: meeting,  color: C.primary },
    { name: "Focus work",    value: focus,    color: C.dark },
    { name: "Collaboration", value: collab,   color: C.amber },
    { name: "Empty",         value: empty,    color: C.purple },
  ];
};

// ── Chart type config ─────────────────────────────────────────────────────────
const CHART_TYPES = [
  { id: "area",  label: "Area trend",    Icon: TrendingUp,     description: "Occupancy over 14 days" },
  { id: "bar",   label: "Sessions",      Icon: BarChart2,      description: "Count per session round" },
  { id: "line",  label: "Capacity line", Icon: LineChartIcon,  description: "Count vs capacity over rounds" },
  { id: "radar", label: "Metrics radar", Icon: Activity,       description: "Multi-metric breakdown" },
  { id: "pie",   label: "Usage split",   Icon: PieChartIcon,   description: "Occupancy category share" },
] as const;

type ChartId = typeof CHART_TYPES[number]["id"];

// ── Custom tooltip ────────────────────────────────────────────────────────────
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
  const params   = useParams();
  const router   = useRouter();
  const projectId = params.id as string;
  const floorId   = params.floorId as string;

  const { floors } = useCanvasStore();
  const floor = floors.find(f => f.id === floorId) || floors[0];
  const rooms = floor?.rooms || [];

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartId>("area");

  const historyData    = useMemo(() => selectedRoom ? generateRoomHistory(selectedRoom.name)    : [], [selectedRoom]);
  const trend14Data    = useMemo(() => selectedRoom ? generate14DayTrend(selectedRoom.name)     : [], [selectedRoom]);
  const sessionData    = useMemo(() => selectedRoom ? generateSessionData(selectedRoom.name)    : [], [selectedRoom]);
  const radarData      = useMemo(() => selectedRoom ? generateRadarData(selectedRoom.name)      : [], [selectedRoom]);
  const pieData        = useMemo(() => selectedRoom ? generatePieData(selectedRoom.name)        : [], [selectedRoom]);

  return (
    <div className="h-screen bg-bg flex flex-col font-body overflow-hidden">

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/count`)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to counting
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase mb-0.5">Analytics</span>
              <h1 className="text-xl text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                Room history
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

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {/* ── Chart type tabs ── */}
          <div className="flex items-center gap-2 flex-wrap">
            {CHART_TYPES.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveChart(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                  activeChart === id
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-white text-text-muted border-[#E2E8F0] hover:border-primary hover:text-primary"
                )}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Chart panel ── */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between bg-bg/50">
              <div>
                <h3 className="text-lg font-bold text-text leading-none mb-1" style={{ fontFamily: "var(--font-manrope)" }}>
                  {CHART_TYPES.find(c => c.id === activeChart)?.label}
                </h3>
                <p className="text-xs text-text-muted">
                  {CHART_TYPES.find(c => c.id === activeChart)?.description}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                {activeChart === "area" && (
                  <ChartLegend color={C.primary} label="Occupancy" />
                )}
                {activeChart === "bar" && (
                  <>
                    <ChartLegend color={C.primary} label="Occupancy" />
                    <ChartLegend color={C.amber} label="Average" />
                  </>
                )}
                {activeChart === "line" && (
                  <>
                    <ChartLegend color={C.primary} label="Count" />
                    <ChartLegend color={C.purple} label="Capacity" />
                  </>
                )}
                {activeChart === "radar" && <ChartLegend color={C.accent} label="Score (0–100)" />}
              </div>
            </div>

            <div className="flex-1 p-6" style={{ minHeight: 260 }}>
              {/* 1 – Area chart: 14-day trend */}
              {activeChart === "area" && (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trend14Data}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.primary} stopOpacity={0.15} />
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
              )}

              {/* 2 – Bar chart: sessions */}
              {activeChart === "bar" && (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sessionData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="occupancy" name="Occupancy" fill={C.primary} radius={[6, 6, 0, 0]} animationDuration={1000} />
                    <Bar dataKey="avg"       name="Average"   fill={C.amber}   radius={[6, 6, 0, 0]} animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* 3 – Line chart: count vs capacity */}
              {activeChart === "line" && (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="round" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "#8CA3B0" }} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="count" name="Count"    stroke={C.primary} strokeWidth={2.5} dot={{ r: 4, fill: C.primary, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} animationDuration={1200} />
                    <Line type="monotone" dataKey={() => 12} name="Capacity" stroke={C.purple}  strokeWidth={2} strokeDasharray="5 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {/* 4 – Radar chart */}
              {activeChart === "radar" && (
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 600, fill: "#5A7184" }} />
                    <Tooltip {...tooltipStyle} />
                    <Radar name="Score" dataKey="value" stroke={C.accent} strokeWidth={2} fill={C.accent} fillOpacity={0.18} animationDuration={1200} />
                  </RadarChart>
                </ResponsiveContainer>
              )}

              {/* 5 – Pie chart: usage split */}
              {activeChart === "pie" && (
                <div className="flex items-center justify-center gap-12 h-[260px]">
                  <ResponsiveContainer width="100%" height={260}>
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
                        innerRadius={65}
                        outerRadius={100}
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
                </div>
              )}
            </div>
          </section>

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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-text">
                          <Calendar size={14} className="text-text-muted" strokeWidth={2.5} />
                          {row.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
                          <Clock size={14} className="text-text-muted" strokeWidth={2.5} />
                          {row.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-bold text-sm">{row.round}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-muted font-medium">12</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl text-text tabular-nums" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                          {formatNumber(row.count)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm text-text-muted font-medium">{row.by}</span>
                          <div className="w-8 h-8 rounded-full bg-[#EDE8E0] flex items-center justify-center text-[10px] font-bold text-primary border border-white shrink-0">
                            {row.by.split(" ").map(n => n[0]).join("")}
                          </div>
                        </div>
                      </td>
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
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] text-[#8CA3B0] font-bold tracking-wider uppercase">
          <span>Areasim analytics engine</span>
          <span>Export CSV • Export PDF</span>
        </div>
      </footer>
    </div>
  );
}

// ── Small helper ──────────────────────────────────────────────────────────────
function ChartLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[11px] font-bold text-text-muted">{label}</span>
    </div>
  );
}
