"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Check,
  Plus,
  Minus,
  X,
  ClipboardList,
  Calendar,
  Clock,
  HelpCircle,
  MessageSquare,
  Send,
  Bell,
  Lock,
  User,
  Layers,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCanvasStore } from "@/store/canvas";
import { mockProject, mockCountHistory } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getFormattedDate = (date: Date) => date.toISOString().split("T")[0];

// ─── Round schedule ───────────────────────────────────────────────────────────
// 5 rounds per day, each 2 hours, starting 08:00
const ROUNDS = [
  { round: 1, label: "Round 1", start: "08:00 AM", end: "10:00 AM", startH: 8,  endH: 10 },
  { round: 2, label: "Round 2", start: "10:00 AM", end: "12:00 PM", startH: 10, endH: 12 },
  { round: 3, label: "Round 3", start: "12:00 PM", end: "02:00 PM", startH: 12, endH: 14 },
  { round: 4, label: "Round 4", start: "02:00 PM", end: "04:00 PM", startH: 14, endH: 16 },
  { round: 5, label: "Round 5", start: "04:00 PM", end: "06:00 PM", startH: 16, endH: 18 },
];

function getActiveRound() {
  const h = new Date().getHours();
  return ROUNDS.find((r) => h >= r.startH && h < r.endH) ?? null;
}

function getNextRound() {
  const h = new Date().getHours();
  return ROUNDS.find((r) => r.startH > h) ?? null;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "meeting" | "focus" | "social" | "empty";
type CountingPhase = "setup" | "ready" | "session";
type RoomStatus = "pending" | "ongoing" | "counted";

const FLOOR_CATEGORIES: { id: Category; label: string; desc: string; color: string; badge: string; text: string }[] = [
  { id: "meeting", label: "Meeting",  desc: "Collaborative rooms with shared tables",       color: "border-blue-200 bg-blue-50",      badge: "bg-blue-100 text-blue-700",     text: "text-blue-700" },
  { id: "focus",   label: "Focus",    desc: "Quiet individual workspaces",                   color: "border-violet-200 bg-violet-50",  badge: "bg-violet-100 text-violet-700", text: "text-violet-700" },
  { id: "social",  label: "Social",   desc: "Casual lounge areas for informal gatherings",   color: "border-emerald-200 bg-emerald-50",badge: "bg-emerald-100 text-emerald-700",text: "text-emerald-700" },
  { id: "empty",   label: "Empty",    desc: "Vacant or transitional spaces",                 color: "border-gray-200 bg-gray-50",      badge: "bg-gray-100 text-gray-600",     text: "text-gray-600" },
];

interface RoomMeta {
  status: RoomStatus;
  lockedBy?: string;  // person currently counting
  countedBy?: string; // person who completed the count
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: RoomStatus }) {
  if (status === "counted") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold whitespace-nowrap">
        <Check size={9} strokeWidth={3} /> Counted
      </span>
    );
  }
  if (status === "ongoing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        Ongoing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F1F5F9] text-text-muted text-[10px] font-bold whitespace-nowrap">
      Pending
    </span>
  );
}

// ─── Round notification banner ────────────────────────────────────────────────
function RoundBanner({ isRecording }: { isRecording: boolean }) {
  const active = getActiveRound();
  const next = getNextRound();

  if (isRecording && active) {
    return (
      <div className="mx-6 mt-4 flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
        <p className="text-xs font-semibold text-primary font-body">
          Session active · {active.label} · {active.start} – {active.end}
        </p>
      </div>
    );
  }

  if (active) {
    return (
      <div className="mx-6 mt-4 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
        <Bell size={14} className="text-amber-600 shrink-0" />
        <p className="text-xs font-semibold text-amber-800 font-body">
          {active.label} is open · {active.start} – {active.end} · Click &quot;Start session&quot; to begin
        </p>
      </div>
    );
  }

  if (next) {
    return (
      <div className="mx-6 mt-4 flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
        <Clock size={14} className="text-text-muted shrink-0" />
        <p className="text-xs text-text-muted font-body">
          No round active now · {next.label} starts at {next.start}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-4 flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
      <Clock size={14} className="text-text-muted shrink-0" />
      <p className="text-xs text-text-muted font-body">
        Counting hours: 8:00 AM – 6:00 PM · 5 rounds of 2 hours each
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FloorCountPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const { floors, addCountEntry } = useCanvasStore();

  const [activeFloorId, setActiveFloorId] = useState(floorId);
  const floor = floors.find((f) => f.id === activeFloorId) || floors[0];
  const rooms = floor?.rooms || [];

  const [countingPhase, setCountingPhase] = useState<CountingPhase>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("counting-setup-done") === "true") {
      return "ready";
    }
    return "setup";
  });
  const [startModalDismissed, setStartModalDismissed] = useState(false);
  // Per-room category selected during setup
  const [roomCategories, setRoomCategories] = useState<Record<string, string>>({});
  const [verifiedRooms, setVerifiedRooms] = useState<Set<string>>(new Set());
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategoryRoomId, setAddCategoryRoomId] = useState<string | null>(null);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Multi-room selection state
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<string>("");

  // Editable seat inputs — raw string while typing
  const [roomSeatInputs, setRoomSeatInputs] = useState<Record<string, string>>({});

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState(getFormattedDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return getFormattedDate(d);
  });

  const [activeSection, setActiveSection] = useState<"left" | "right">("left");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [roomSeats, setRoomSeats] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    rooms.forEach((r) => {
      const hash = r.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      initial[r.id] = 4 + (hash % 8);
    });
    return initial;
  });

  // ── Room status (pending / ongoing / counted) ──────────────────────────────
  const [roomMeta, setRoomMeta] = useState<Record<string, RoomMeta>>(() => {
    const init: Record<string, RoomMeta> = {};
    rooms.forEach((r) => { init[r.id] = { status: "pending" }; });
    return init;
  });

  const [showStopModal, setShowStopModal] = useState(false);
  const [_isSessionSaved, setIsSessionSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const [selectedProject] = useState(mockProject.name);
  const [selectedFloorName, setSelectedFloorName] = useState(floor?.name || "Ground Floor");
  const [showNextFloorModal, setShowNextFloorModal] = useState(false);
  const [nextFloorSelection, setNextFloorSelection] = useState("1st Floor");
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      q: "Why do we do this counting exercise?",
      a: "To build a fact-based understanding of how we use our office facilities today.",
    },
    {
      q: "Can we see data continuously while we count?",
      a: "Yes.",
    },
    {
      q: "Do we need to count all areas including common areas in the building?",
      a: "Yes, everything needs to be counted.",
    },
    {
      q: "Do we need to count all seats, including in the social zones and the canteen?",
      a: "Yes.",
    },
    {
      q: "Can I split the counting in two (i.e. count half of the area at 8:00 and the other half at 09:00)?",
      a: "No. It is important to count the whole counting route at once and at the same time every day. The reason for this is that we need accurate and consistent information about how we use the facilities in order to be able to optimize our future.",
    },
  ];

  const activeRound = getActiveRound();
  const roundLabel = activeRound ? `${activeRound.label} of 5 today` : "No active round";

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const selectedZone = (floor?.zones || []).find((z) => z.id === selectedRoom?.zoneId);

  // ── Session start — simulate 2 rooms being counted by other users ───────────
  const handleStartSession = () => {
    setCountingPhase("session");
    setIsRecording(true);
    // Simulate concurrent users: first 2 rooms are already being counted by mock users
    setRoomMeta((prev) => {
      const next = { ...prev };
      if (rooms[0]) next[rooms[0].id] = { status: "ongoing", lockedBy: "Mikkel T." };
      if (rooms[2]) next[rooms[2].id] = { status: "ongoing", lockedBy: "Sara L." };
      return next;
    });
  };

  const handleStartCounting = (roomId: string) => {
    const meta = roomMeta[roomId];
    // Block if another user is counting this room
    if (meta?.status === "ongoing" && meta.lockedBy !== "You") return;

    setSelectedRoomId(roomId);
    setActiveSection("right");

    // Mark room as ongoing by current user
    setRoomMeta((prev) => ({
      ...prev,
      [roomId]: { status: "ongoing", lockedBy: "You" },
    }));

    if (sessionCounts[roomId] === undefined) {
      setSessionCounts((prev) => ({ ...prev, [roomId]: 0 }));
    }
  };

  const adjustCount = (delta: number) => {
    if (!selectedRoomId) return;
    setSessionCounts((prev) => ({
      ...prev,
      [selectedRoomId]: Math.max(0, (prev[selectedRoomId] || 0) + delta),
    }));
  };

  const handleRecordCount = () => {
    if (!selectedRoomId || !floor) return;
    const count = sessionCounts[selectedRoomId] || 0;

    addCountEntry(floor.id, selectedRoomId, {
      count,
      by: "You",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    });

    // Mark current room as counted
    setRoomMeta((prev) => ({
      ...prev,
      [selectedRoomId]: { status: "counted", countedBy: "You" },
    }));

    const currentIndex = rooms.findIndex((r) => r.id === selectedRoomId);
    if (currentIndex < rooms.length - 1) {
      const nextRoomId = rooms[currentIndex + 1].id;
      setSelectedRoomId(nextRoomId);
      // Lock next room for current user
      setRoomMeta((prev) => ({
        ...prev,
        [nextRoomId]: { status: "ongoing", lockedBy: "You" },
      }));
      if (sessionCounts[nextRoomId] === undefined) {
        setSessionCounts((prev) => ({ ...prev, [nextRoomId]: 0 }));
      }
    } else {
      setActiveSection("left");
      setShowNextFloorModal(true);
    }
  };

  const isLastRoom = rooms.findIndex((r) => r.id === selectedRoomId) === rooms.length - 1;

  const handleBackToCanvas = () => {
    if (isRecording) {
      setPendingNav(`/project/${projectId}/floor/${floorId}`);
      setShowStopModal(true);
    } else {
      router.push(`/project/${projectId}/floor/${floorId}`);
    }
  };

  const confirmStopSession = () => {
    setIsRecording(false);
    setTimer(0);
    setIsSessionSaved(true);
    setShowStopModal(false);
    if (pendingNav) router.push(pendingNav);
  };

  const updateSeats = (roomId: string, val: number) => {
    setRoomSeats((prev) => ({ ...prev, [roomId]: Math.max(1, val) }));
  };

  // ── Add custom category ───────────────────────────────────────────────────────
  const handleAddCategory = () => {
    const name = newCategoryInput.trim();
    if (!name) return;
    if (!customCategories.includes(name)) {
      setCustomCategories((prev) => [...prev, name]);
    }
    if (addCategoryRoomId) {
      setRoomCategories((prev) => ({ ...prev, [addCategoryRoomId]: name }));
    }
    setShowAddCategoryModal(false);
    setNewCategoryInput("");
    setAddCategoryRoomId(null);
  };

  // ── Multi-room helpers ─────────────────────────────────────────────────────────
  const toggleRoomSelect = (id: string) => {
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRoomIds.size === rooms.length) {
      setSelectedRoomIds(new Set());
    } else {
      setSelectedRoomIds(new Set(rooms.map((r) => r.id)));
    }
  };

  const applyBulkCategory = () => {
    if (!bulkCategory) return;
    selectedRoomIds.forEach((id) => {
      setRoomCategories((prev) => ({ ...prev, [id]: bulkCategory }));
      setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(id); return n; });
    });
    setSelectedRoomIds(new Set());
    setBulkCategory("");
    setShowBulkModal(false);
  };

  // Auto-open bulk category modal whenever at least one room is selected
  useEffect(() => {
    if (selectedRoomIds.size > 0) {
      setShowBulkModal(true);
    }
  }, [selectedRoomIds]);

  // ── Seat input helpers ─────────────────────────────────────────────────────────
  const getSeatInputValue = (roomId: string) =>
    roomSeatInputs[roomId] ?? String(roomSeats[roomId] || 1);

  const commitSeatInput = (roomId: string, raw: string) => {
    const n = Math.max(1, parseInt(raw.replace(/\D/g, "")) || 1);
    updateSeats(roomId, n);
    setRoomSeatInputs((prev) => ({ ...prev, [roomId]: String(n) }));
  };

  // ── Setup screen confirm ──────────────────────────────────────────────────────
  const handleSetupConfirm = () => {
    localStorage.setItem("counting-setup-done", "true");
    setCountingPhase("ready");
  };

  const allRoomsSetup = rooms.every((r) => roomCategories[r.id] && verifiedRooms.has(r.id));

  if (countingPhase === "setup") {
    return (
      <div className="h-screen flex flex-col font-body overflow-hidden" style={{ background: "#FBF6EE" }}>
        <header className="border-b border-[#E2E8F0] px-6 py-3 shrink-0 bg-white">
          <div className="max-w-[1200px] mx-auto flex items-center gap-4">
            <button
              onClick={handleBackToCanvas}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            {/* Project name */}
            <span className="text-sm font-semibold text-text font-body truncate max-w-[180px]">
              {mockProject.name}
            </span>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            {/* Floor selector */}
            <div className="relative">
              <select
                value={activeFloorId}
                onChange={(e) => setActiveFloorId(e.target.value)}
                className="appearance-none rounded-lg border border-[#E2E8F0] bg-white/60 pl-3 pr-8 py-1.5 text-sm font-medium text-text font-body focus:outline-none focus:border-primary transition-all"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <div className="ml-auto">
              <Button
                size="sm"
                className="h-9 px-6 rounded-full shadow-md shadow-primary/20 font-bold"
                disabled={!allRoomsSetup}
                onClick={handleSetupConfirm}
              >
                Confirm &amp; continue
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Layers size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                  Before you start counting
                </h2>
              </div>
              <p className="text-sm text-text-muted pl-[52px]">
                Set the category and verify the number of seats for each room. This is a one-time setup.
              </p>
            </div>

            {/* Per-room setup table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              {/* Progress bar */}
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {rooms.filter((r) => roomCategories[r.id] && verifiedRooms.has(r.id)).length} of {rooms.length} rooms verified
                </span>
                <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${rooms.length ? (rooms.filter((r) => roomCategories[r.id] && verifiedRooms.has(r.id)).length / rooms.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Column headers */}
              <div className="grid gap-4 px-6 py-3 border-b border-[#F1F5F9] bg-[#FAFBFC]" style={{ gridTemplateColumns: "44px 1fr 1fr 1fr 1fr 64px" }}>
                {/* Select-all checkbox */}
                <div className="flex items-center">
                  <button
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedRoomIds.size === rooms.length && rooms.length > 0
                        ? "bg-primary border-primary"
                        : selectedRoomIds.size > 0
                        ? "bg-primary/30 border-primary"
                        : "border-[#C0D0DC] bg-white"
                    }`}
                    title="Select all rooms"
                  >
                    {selectedRoomIds.size > 0 && <Check size={11} className="text-white" strokeWidth={3} />}
                  </button>
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Room</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Category</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Seats</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Status</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Edit</span>
              </div>

              <div className="divide-y divide-[#F1F5F9]">
                {rooms.map((room) => {
                  const cat = roomCategories[room.id];
                  const seats = roomSeats[room.id] || 1;
                  const isVerified = verifiedRooms.has(room.id);
                  const isChecked = selectedRoomIds.has(room.id);
                  return (
                    <div
                      key={room.id}
                      className={`grid gap-4 px-6 py-4 items-center transition-colors ${isChecked ? "bg-primary/5" : "hover:bg-[#FAFBFC]"}`}
                      style={{ gridTemplateColumns: "44px 1fr 1fr 1fr 1fr 64px" }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleRoomSelect(room.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                          isChecked ? "bg-primary border-primary" : "border-[#C0D0DC] bg-white hover:border-primary"
                        }`}
                      >
                        {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                      </button>

                      {/* Room info */}
                      <div>
                        <p className="text-sm font-bold text-text">{room.name}</p>
                        <p className="text-xs text-text-muted">{formatNumber(room.sqm || 25)} m²</p>
                      </div>

                      {/* Category dropdown — unchanged */}
                      <div className="relative">
                        <select
                          value={cat || ""}
                          onChange={(e) => {
                            if (e.target.value === "add-new") {
                              setAddCategoryRoomId(room.id);
                              setNewCategoryInput("");
                              setShowAddCategoryModal(true);
                            } else {
                              setRoomCategories((prev) => ({ ...prev, [room.id]: e.target.value }));
                              setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(room.id); return n; });
                            }
                          }}
                          className="appearance-none w-full rounded-xl border border-[#E2E8F0] bg-white pl-3 pr-8 py-2 text-xs font-semibold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select category...</option>
                          {FLOOR_CATEGORIES.map((fc) => (
                            <option key={fc.id} value={fc.id}>{fc.label}</option>
                          ))}
                          {customCategories.map((cc) => (
                            <option key={cc} value={cc}>{cc}</option>
                          ))}
                          <option value="add-new">+ Add new category</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>

                      {/* Seats — ± buttons + editable number */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const n = Math.max(1, seats - 1);
                            updateSeats(room.id, n);
                            setRoomSeatInputs((prev) => ({ ...prev, [room.id]: String(n) }));
                          }}
                          className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={getSeatInputValue(room.id)}
                          onChange={(e) =>
                            setRoomSeatInputs((prev) => ({ ...prev, [room.id]: e.target.value.replace(/\D/g, "") }))
                          }
                          onBlur={(e) => commitSeatInput(room.id, e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                          className="w-10 text-center text-sm font-bold text-text tabular-nums rounded-lg border border-[#E2E8F0] py-0.5 focus:outline-none focus:border-primary transition-colors bg-white"
                        />
                        <button
                          onClick={() => {
                            const n = seats + 1;
                            updateSeats(room.id, n);
                            setRoomSeatInputs((prev) => ({ ...prev, [room.id]: String(n) }));
                          }}
                          className="w-7 h-7 rounded-lg border border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Verify / Verified */}
                      <div className="flex justify-center">
                        {isVerified ? (
                          <button
                            onClick={() => setVerifiedRooms((prev) => { const n = new Set(prev); n.delete(room.id); return n; })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold hover:bg-emerald-100 transition-all"
                          >
                            <Check size={11} strokeWidth={3} /> Verified
                          </button>
                        ) : (
                          <button
                            disabled={!cat}
                            onClick={() => setVerifiedRooms((prev) => new Set([...prev, room.id]))}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Verify
                          </button>
                        )}
                      </div>

                      {/* Edit */}
                      <div className="flex justify-center">
                        <button
                          className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                          title="Edit room"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </main>

        {/* ── Add Category Modal ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showAddCategoryModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-text text-sm" style={{ fontFamily: "var(--font-manrope)" }}>
                    Add new category
                  </h3>
                  <button onClick={() => setShowAddCategoryModal(false)} className="text-text-muted hover:text-text transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                      Category name
                    </label>
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="e.g. Storage, Reception..."
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter" && newCategoryInput.trim()) handleAddCategory(); }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowAddCategoryModal(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" className="flex-1" disabled={!newCategoryInput.trim()} onClick={handleAddCategory}>
                      Add category
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Bulk Category Modal ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showBulkModal && (
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) { setSelectedRoomIds(new Set()); setShowBulkModal(false); } }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden w-full max-w-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="font-bold text-text text-sm" style={{ fontFamily: "var(--font-manrope)" }}>
                      Select category
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Apply to {selectedRoomIds.size} selected room{selectedRoomIds.size > 1 ? "s" : ""}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedRoomIds(new Set()); setShowBulkModal(false); }} className="text-text-muted hover:text-text transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {[...FLOOR_CATEGORIES, ...customCategories.map((cc) => ({ id: cc, label: cc, desc: "Custom category", color: "border-gray-200 bg-gray-50", badge: "bg-gray-100 text-gray-600", text: "text-gray-600" }))].map((fc) => (
                    <button
                      key={fc.id}
                      onClick={() => setBulkCategory(fc.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        bulkCategory === fc.id
                          ? `${fc.color} border-opacity-100 shadow-sm`
                          : "border-[#E2E8F0] bg-white hover:border-[#C0D0DC]"
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${bulkCategory === fc.id ? fc.text : "text-text"}`}>{fc.label}</p>
                        <p className="text-xs text-text-muted">{fc.desc}</p>
                      </div>
                      {bulkCategory === fc.id && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${fc.badge}`}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="px-4 pb-4 pt-1 flex gap-3">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setSelectedRoomIds(new Set()); setShowBulkModal(false); }}>
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1" disabled={!bulkCategory} onClick={applyBulkCategory}>
                    Apply to {selectedRoomIds.size} room{selectedRoomIds.size > 1 ? "s" : ""}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg flex flex-col font-body overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBackToCanvas}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <h1
              className="text-lg font-800 text-text leading-none"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
            >
              Room counting
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 px-5 gap-2"
              onClick={() => setShowQuestionsModal(true)}
              icon={<HelpCircle size={14} />}
            >
              Got questions?
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={activeSection === "right"}
              className="h-9 px-5"
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}
            >
              View history
            </Button>

            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 bg-white border border-primary rounded-full px-4 h-9 shadow-sm"
                >
                  <span
                    className="text-lg font-bold text-primary tabular-nums"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {formatTime(timer)}
                  </span>
                  <button
                    onClick={() => setShowStopModal(true)}
                    className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                  >
                    <div className="w-3 h-3 rounded-sm bg-white" />
                  </button>
                </motion.div>
              ) : countingPhase === "session" ? (
                <Button
                  size="sm"
                  onClick={handleStartSession}
                  className="gap-2 h-9 px-5"
                  icon={<Play size={14} fill="currentColor" />}
                >
                  Start session
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setCountingPhase("ready")}
                  className="gap-2 h-9 px-5"
                  icon={<Play size={14} fill="currentColor" />}
                >
                  Start session
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Sub-header ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Project:</span>
            <span className="text-sm font-bold text-text">{selectedProject}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Floor:</span>
            <div className="relative min-w-[160px]">
              <select
                value={selectedFloorName}
                onChange={(e) => setSelectedFloorName(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-10 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all"
              >
                <option>Ground Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex relative p-6 gap-6 max-w-[1600px] mx-auto w-full">

        {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <motion.div
          layout
          animate={{ width: activeSection === "left" ? "100%" : "56px", opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className={cn(
            "flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden",
            activeSection === "right" && "items-center"
          )}
        >
          {activeSection === "right" ? (
            <div className="flex flex-col items-center h-full pt-6 bg-white w-full">
              <button
                onClick={() => setActiveSection("left")}
                className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-text-muted hover:text-primary transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex flex-col gap-1">
                <h3 className="text-lg font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                  Session details
                </h3>
                <p className="text-xs text-text-muted">
                  {isRecording
                    ? "Session is running. Count each room below."
                    : "Click Start session to begin counting."}
                </p>
              </div>

              {/* Round notification banner */}
              <RoundBanner isRecording={isRecording} />

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Date range + round indicator */}
                <div className="flex items-center gap-8 py-2">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase whitespace-nowrap">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-40 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase whitespace-nowrap">
                      End date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-40 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-manrope)" }}>
                      {roundLabel} · Day 1 of 14
                    </p>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden divide-x divide-[#E2E8F0] shadow-sm">
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total seats in floor</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (roomSeats[r.id] || 0), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Seats total</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Seats used today (Avg)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(Math.round(
                          rooms.reduce((acc, r) => acc + (sessionCounts[r.id] || 0), 0) /
                          Math.max(rooms.filter((r) => sessionCounts[r.id] !== undefined).length, 1)
                        ))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Occupants avg</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total floor area</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (r.sqm || 25), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">m² total</span>
                    </div>
                  </div>
                </div>

                {/* ── Room table ─────────────────────────────────────────────── */}
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr className="text-[11px] font-bold text-text-muted">
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Room</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Category</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Square Meters</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">No of seats</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Status</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Counted by</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Counting</th>
                        <th className="px-4 py-3 text-center">Edit room details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {rooms.map((room) => {
                        const meta = roomMeta[room.id] ?? { status: "pending" as RoomStatus };
                        const isLockedByOther =
                          meta.status === "ongoing" && meta.lockedBy !== "You";
                        const count = sessionCounts[room.id];

                        return (
                          <tr
                            key={room.id}
                            className={cn(
                              "transition-colors",
                              isLockedByOther
                                ? "bg-amber-50/40 opacity-70"
                                : meta.status === "counted"
                                ? "bg-emerald-50/30"
                                : "hover:bg-[#F8FAFC]"
                            )}
                          >
                            {/* Room name */}
                            <td className="px-4 py-4 border-r border-[#F1F5F9]">
                              <div className="flex items-center gap-2">
                                {isLockedByOther && (
                                  <Lock size={12} className="text-amber-500 shrink-0" />
                                )}
                                <span className="text-sm font-bold text-text">{room.name}</span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-4 text-sm text-text-muted border-r border-[#F1F5F9]">
                              <span className="px-2 py-1 rounded-md bg-[#F1F5F9] text-[10px] font-bold">
                                Meeting
                              </span>
                            </td>

                            {/* Sqm */}
                            <td className="px-4 py-4 text-sm text-text-muted border-r border-[#F1F5F9]">
                              <span className="font-mono font-bold text-primary">
                                {formatNumber(room.sqm || 25)} m²
                              </span>
                            </td>

                            {/* Seats */}
                            <td className="px-4 py-4 text-sm border-r border-[#F1F5F9]">
                              <span className="font-bold text-primary tabular-nums">{roomSeats[room.id] || 0}</span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4 border-r border-[#F1F5F9]">
                              <StatusBadge status={meta.status} />
                            </td>

                            {/* Counted by */}
                            <td className="px-4 py-4 border-r border-[#F1F5F9]">
                              {meta.status === "counted" && meta.countedBy ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-700 shrink-0">
                                    {meta.countedBy.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                  </div>
                                  <span className="text-xs font-medium text-text">{meta.countedBy}</span>
                                </div>
                              ) : meta.status === "ongoing" && meta.lockedBy ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                                    <User size={9} className="text-amber-700" />
                                  </div>
                                  <span className="text-xs text-text-muted">{meta.lockedBy}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-text-muted">—</span>
                              )}
                            </td>

                            {/* Counting action */}
                            <td className="px-4 py-4 border-r border-[#F1F5F9]">
                              {isLockedByOther ? (
                                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                                  <Lock size={11} />
                                  Locked by {meta.lockedBy}
                                </div>
                              ) : meta.status === "counted" ? (
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-lg font-900 text-primary" style={{ fontFamily: "var(--font-manrope)" }}>
                                    {count ?? 0}
                                  </span>
                                  <button
                                    onClick={() => handleStartCounting(room.id)}
                                    className="text-xs font-semibold text-text-muted hover:text-primary underline underline-offset-4"
                                  >
                                    Edit
                                  </button>
                                </div>
                              ) : count !== undefined ? (
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-lg font-900 text-primary" style={{ fontFamily: "var(--font-manrope)" }}>
                                    {count}
                                  </span>
                                  <button
                                    onClick={() => handleStartCounting(room.id)}
                                    className="text-xs font-semibold text-text-muted hover:text-primary underline underline-offset-4"
                                  >
                                    Edit
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled={!isRecording}
                                  onClick={() => handleStartCounting(room.id)}
                                  className="w-auto px-4"
                                >
                                  Start counting
                                </Button>
                              )}
                            </td>

                            {/* Edit room details */}
                            <td className="px-4 py-4 text-center">
                              <button
                                className="w-8 h-8 rounded-lg border border-[#E2E8F0] inline-flex items-center justify-center text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                title="Edit room details"
                              >
                                <Pencil size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Right panel (counter) ───────────────────────────────────────────── */}
        <AnimatePresence>
          {activeSection === "right" && (
            <motion.div
              layout
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1, flex: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h3
                    className="text-lg font-bold text-text leading-none mb-1"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {selectedRoom?.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {selectedZone ? selectedZone.name : "Unzoned room"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection("left")}
                  className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-text-muted hover:text-primary transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="text-center space-y-8">
                  <p
                    className="text-sm font-bold text-primary"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {roundLabel} · Day 1 of 14
                  </p>
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-text-muted tracking-widest">
                      Current occupancy count
                    </p>
                    <div className="flex items-center justify-center gap-10">
                      <button
                        onClick={() => adjustCount(-1)}
                        className="w-20 h-20 rounded-2xl border-2 border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all"
                      >
                        <Minus size={28} strokeWidth={3} />
                      </button>
                      <span
                        className="text-8xl font-900 text-text tabular-nums"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 900 }}
                      >
                        {formatNumber(sessionCounts[selectedRoomId!] || 0)}
                      </span>
                      <button
                        onClick={() => adjustCount(1)}
                        className="w-20 h-20 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                      >
                        <Plus size={28} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      className="w-auto px-10 h-12 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 gap-2"
                      onClick={handleRecordCount}
                      icon={!isLastRoom ? <ArrowRight size={18} /> : undefined}
                      iconPosition="right"
                    >
                      {isLastRoom ? "Done" : "Save count & continue"}
                    </Button>
                  </div>
                </div>

                {/* Room history */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4
                      className="text-sm font-bold text-text"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      Room history
                    </h4>
                    <button
                      className="text-xs font-semibold text-primary"
                      onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}
                    >
                      View all
                    </button>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Time</th>
                          <th className="px-3 py-2">Round</th>
                          <th className="px-3 py-2">No. of seats</th>
                          <th className="px-3 py-2">Count</th>
                          <th className="px-3 py-2 text-right">By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {(selectedRoom?.countHistory.length
                          ? selectedRoom.countHistory
                          : mockCountHistory
                        )
                          .slice(0, 5)
                          .map((entry, i) => (
                            <tr
                              key={i}
                              className="text-[12px] text-text hover:bg-[#F8FAFC] transition-colors"
                            >
                              <td className="px-3 py-3 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={12} className="text-text-muted" />
                                  {entry.date}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-text-muted">
                                <div className="flex items-center gap-1.5">
                                  <Clock size={12} />
                                  {entry.time}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-primary font-bold">Round {i + 1}</span>
                              </td>
                              <td className="px-3 py-3 text-text-muted">
                                {roomSeats[selectedRoomId!] || 0}
                              </td>
                              <td className="px-3 py-3 font-bold text-lg tabular-nums">
                                {formatNumber(entry.count)}
                              </td>
                              <td className="px-3 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="text-text-muted">{entry.by}</span>
                                  <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[8px] font-bold text-primary border border-white shrink-0">
                                    {entry.by.split(" ").map((n) => n[0]).join("")}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-emerald-500 animate-pulse" : "bg-[#E2E8F0]")} />
            <span className="text-[10px] font-bold text-text-muted tracking-wider">
              {isRecording ? "Session active" : "System ready"}
            </span>
          </div>
          <div className="text-[10px] text-text-muted font-bold">
            {roundLabel} · Day 1 of 14
          </div>
        </div>
        <div className="text-[10px] text-text-muted font-mono">Areasim workspace intelligence</div>
      </footer>

      {/* ── Start session modal (shown when phase="ready") ─────────────────────── */}
      <AnimatePresence>
        {countingPhase === "ready" && !startModalDismissed && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full relative"
            >
              <button
                onClick={() => setStartModalDismissed(true)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-text-muted hover:bg-[#E2E8F0] hover:text-text transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                    Ready to start counting?
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    You&apos;re all set. Start the session to begin recording occupancy counts for <span className="font-bold text-text">{floor?.name || "this floor"}</span>.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full h-12 rounded-2xl shadow-lg shadow-primary/20 text-base font-bold gap-2"
                  onClick={handleStartSession}
                  icon={<Play size={18} fill="currentColor" />}
                >
                  Start session
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Stop confirmation modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStopModal && (() => {
          const pendingCount = rooms.filter(
            (r) => (roomMeta[r.id]?.status ?? "pending") === "pending"
          ).length;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList size={18} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                      Finish session
                    </h3>
                  </div>
                  <button
                    onClick={() => { setShowStopModal(false); setPendingNav(null); }}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8 text-center space-y-5">
                  <div className="space-y-2">
                    <h4
                      className="text-xl font-800 text-text"
                      style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
                    >
                      Stop this session?
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Are you sure you want to stop this session? Once stopped, the data will be
                      locked and saved to the history.
                    </p>
                  </div>

                  {/* Pending rooms warning */}
                  {pendingCount > 0 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-left">
                      <Bell size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 font-body leading-relaxed">
                        <span className="font-bold">{pendingCount} room{pendingCount > 1 ? "s are" : " is"} still pending.</span>{" "}
                        You should count {pendingCount > 1 ? "these rooms" : "this room"} before ending the session.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="secondary"
                      className="flex-1 h-12 rounded-xl border-[#E2E8F0]"
                      onClick={() => { setShowStopModal(false); setPendingNav(null); }}
                    >
                      Not now
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20"
                      onClick={confirmStopSession}
                    >
                      Yes, stop session
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── Got questions modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuestionsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-lg w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={18} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Got questions?
                  </h3>
                </div>
                <button
                  onClick={() => setShowQuestionsModal(false)}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Common Questions
                  </p>
                  <div className="divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] overflow-hidden">
                    {faqItems.map((item, i) => (
                      <div key={i} className="bg-[#F8FAFC]">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white transition-colors group"
                        >
                          <span className="text-sm font-medium text-text leading-snug">{item.q}</span>
                          <motion.div
                            animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown size={15} className={cn("transition-colors", expandedFaq === i ? "text-primary" : "text-text-muted")} />
                          </motion.div>
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0">
                                <p className="text-sm text-text-muted leading-relaxed border-t border-[#E2E8F0] pt-3">{item.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Something else?
                  </p>
                  <textarea
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full h-24 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <Button
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2"
                  onClick={() => {
                    alert("Your questions have been sent to our consultants.");
                    setShowQuestionsModal(false);
                    setExpandedFaq(null);
                    setCustomQuestion("");
                  }}
                  icon={<Send size={16} />}
                >
                  Send to consultants
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Next floor modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNextFloorModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check size={18} className="text-emerald-600" strokeWidth={3} />
                  </div>
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
                    Floor completed
                  </h3>
                </div>
                <button
                  onClick={() => setShowNextFloorModal(false)}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h4
                    className="text-xl font-800 text-text"
                    style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
                  >
                    Continue to the next floor?
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    All rooms on this floor have been counted. Would you like to continue counting on another floor?
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Select floor</label>
                  <div className="relative">
                    <select
                      value={nextFloorSelection}
                      onChange={(e) => setNextFloorSelection(e.target.value)}
                      className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-10 py-3 text-sm font-bold text-text focus:outline-none focus:border-primary transition-all"
                    >
                      <option>1st Floor</option>
                      <option>2nd Floor</option>
                      <option>3rd Floor</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2"
                    onClick={() => {
                      // Find the floor by name and switch to it in-place
                      const nextFloor = floors.find((f) => f.name === nextFloorSelection) || floors.find((f) => f.id !== floorId) || floors[0];
                      if (nextFloor) {
                        setActiveFloorId(nextFloor.id);
                        setSelectedFloorName(nextFloor.name || nextFloorSelection);
                        const firstRoom = nextFloor.rooms?.[0];
                        if (firstRoom) {
                          setSelectedRoomId(firstRoom.id);
                          setSessionCounts((prev) => ({ ...prev, [firstRoom.id]: 0 }));
                          setRoomMeta((prev) => ({ ...prev, [firstRoom.id]: { status: "ongoing", lockedBy: "You" } }));
                        }
                        setActiveSection("right");
                      }
                      setShowNextFloorModal(false);
                    }}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Continue counting
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full h-12 rounded-xl border-[#E2E8F0] text-text-muted"
                    onClick={() => {
                      setShowNextFloorModal(false);
                      setIsRecording(false);
                      setActiveSection("left");
                    }}
                  >
                    Stop counting
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
