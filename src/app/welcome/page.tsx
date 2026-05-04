"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const HERO_VIDEO_SRC = "/AreaSim_Video.mp4";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="shrink-0 px-8 py-4 border-b border-border bg-surface flex items-center">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center text-center max-w-2xl w-full gap-8"
        >
          {/* Title + description */}
          <div className="space-y-3 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="text-3xl sm:text-4xl font-extrabold text-text leading-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Your workspace,<br />clearly understood.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-base text-text-muted font-body leading-relaxed"
            >
              Map your floor plan, count occupancy, and get instant insights — your first workplace report in minutes.
            </motion.p>
          </div>

          {/* Hero video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="w-full overflow-hidden rounded-2xl border border-border bg-[#0a1628] shadow-xl shadow-[#0A4F6E]/10 ring-1 ring-black/[0.04]"
          >
            <div className="relative aspect-video w-full">
              <video
                className="absolute inset-0 h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
                aria-label="AreaSim overview: from data to decision"
              >
                <source src={HERO_VIDEO_SRC} type="video/mp4" />
              </video>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/onboarding")}
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              className="px-8 shadow-[0_4px_16px_rgba(10,79,110,0.28)]"
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
