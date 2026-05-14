"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SlidersHorizontal, Gem, User, Play } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { WorkplaceJourneyBar } from "@/components/ui/WorkplaceJourneyBar";
import { PotentialScoreWidget } from "@/components/ui/PotentialScoreWidget";
import { DetailPanel } from "@/components/canvas/DetailPanel";
import { SurveyModal } from "@/components/canvas/SurveyModal";
import { CompletionModal } from "@/components/canvas/CompletionModal";
import { GuideOverlay, GUIDE_TOTAL } from "@/components/canvas/GuideOverlay";
import { useCanvasStore } from "@/store/canvas";
import { mockProject } from "@/lib/mockData";

const FloorCanvas = dynamic(
  () => import("@/components/canvas/FloorCanvas").then((m) => m.FloorCanvas),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-text-muted font-body text-sm">Loading canvas…</div> }
);

export default function FloorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const {
    floors, setActiveFloor,
    setDetailPanel, detailPanelOpen,
    setCompletionModal,
  } = useCanvasStore();

  const [_floorDropdownOpen, _setFloorDropdownOpen] = useState(false);

  // Guide state
  const [showGuide, setShowGuide] = useState(true);
  const [guideStep, setGuideStep] = useState(0);

  // Open/close detail panel based on guide step
  const panelSteps = new Set([0, 3, 4]);
  const noPanelSteps = new Set([5, 6]);
  useEffect(() => {
    if (!showGuide) return;
    if (panelSteps.has(guideStep)) setDetailPanel(true);
    if (noPanelSteps.has(guideStep)) setDetailPanel(false);
  }, [showGuide, guideStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuideNext = () => {
    if (guideStep >= GUIDE_TOTAL - 1) { setShowGuide(false); setGuideStep(0); }
    else setGuideStep(s => s + 1);
  };
  const handleGuideBack = () => setGuideStep(s => Math.max(0, s - 1));
  const handleGuideClose = () => { setShowGuide(false); setGuideStep(0); };
  const handleOpenGuide = () => { setGuideStep(0); setShowGuide(true); };

  const activeFloor = floors.find((f) => f.id === floorId) ?? floors[0];
  const activeFloorRooms = activeFloor?.rooms ?? [];
  const allCounted = activeFloorRooms.length > 0 && activeFloorRooms.every((r) => r.status === "counted");

  // Highlight first room when on panel steps 1 or 4 (0-indexed 0 or 3)
  const guideHighlightFirstRoom = showGuide && (guideStep === 0 || guideStep === 3 || guideStep === 4);

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden relative">
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-3 py-2 bg-surface shrink-0">
        {/* Logo — navigates to dashboard */}
        <button onClick={() => router.push("/dashboard")} className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo size="md" showText={false} />
        </button>

        <div className="w-px h-5 bg-border" />

        {/* Project name */}
        <span className="hidden sm:block text-sm font-semibold text-text font-body truncate max-w-[200px]">
          {mockProject.name}
        </span>

        <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />

        {/* Floor selector — native select styled like counting page */}
        <div className="relative min-w-[148px]">
          <select
            value={activeFloor?.id ?? ""}
            onChange={(e) => {
              setActiveFloor(e.target.value);
              router.push(`/project/${projectId}/floor/${e.target.value}`);
            }}
            className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-9 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>{floor.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Start room counting — primary */}
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={13} />}
            onClick={() => router.push(`/project/${projectId}/floor/${floorId}/count`)}
            className="h-9 py-2 px-4"
          >
            <span className="hidden sm:inline">Start room counting</span>
          </Button>

          {/* Rooms list — secondary */}
          <Button
            variant="secondary"
            size="sm"
            icon={<SlidersHorizontal size={14} />}
            onClick={() => setDetailPanel(!detailPanelOpen)}
            className="h-9 py-2 px-4"
          >
            <span className="hidden sm:inline">Rooms list</span>
          </Button>



          {allCounted && (
            <Button
              variant="primary"
              size="sm"
              icon={<Gem size={14} />}
              onClick={() => setCompletionModal(true)}
              className="h-9 py-2 px-4"
              style={{ background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)", boxShadow: "0 4px 14px rgba(180,83,9,0.35)" }}
            >
              <span className="hidden sm:inline">Room Program</span>
            </Button>
          )}

          <PotentialScoreWidget />
          <LanguageSelector />

          {/* User avatar */}
          <button
            onClick={() => router.push("/settings")}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
            style={{ background: "linear-gradient(106deg, #E8E2F5 0%, #B8AFDF 100%)" }}
            title="Settings"
          >
            <User size={14} color="#6C62AA" />
          </button>
        </div>
      </header>

      {/* ── Workplace Journey Bar ── */}
      <WorkplaceJourneyBar activeStep="1-2" />

      {/* ── Main Area ── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Canvas always full width */}
        <div className="w-full h-full flex flex-col relative">
          <FloorCanvas
            floorId={floorId}
            imageUrl={activeFloor?.imageUrl ?? "/mock/floorplan-oslo.svg"}
            showGuide={showGuide}
            guideStep={guideStep}
            onOpenGuide={handleOpenGuide}
          />
        </div>

        {/* Detail panel — absolute overlay, right-aligned, 1/3 screen width */}
        <DetailPanel floorId={floorId} guideHighlightFirstRoom={guideHighlightFirstRoom} />
      </div>

      {/* Guide overlay — fixed positioning, renders above everything */}
      <AnimatePresence>
        {showGuide && (
          <GuideOverlay
            step={guideStep}
            onNext={handleGuideNext}
            onBack={handleGuideBack}
            onClose={handleGuideClose}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <SurveyModal />
      <CompletionModal />
    </div>
  );
}
