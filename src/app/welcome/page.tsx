"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">

      <header className="shrink-0 px-8 py-4 border-b border-border bg-surface flex items-center">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex flex-col px-3 py-5 min-h-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center text-center max-w-2xl w-full mx-auto h-full gap-4"
        >
          {/* Title + description */}
          <div className="space-y-1.5 shrink-0">
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="text-2xl sm:text-3xl font-extrabold text-text leading-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Your workspace,<br />clearly understood.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm font-extrabold leading-snug"
              style={{
                fontFamily: "var(--font-manrope)",
                background: "linear-gradient(90deg, #0A4F6E 0%, #00C9A7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              And we are here to fix it.
            </motion.p>
          </div>

          {/* Before / After illustration — fills all remaining space */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full flex-1 relative flex items-stretch gap-2 min-h-0"
          >
            {/* Before */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-md min-h-0">
              <Image
                src="/Before.jpeg"
                alt="Before: disturbing open-plan environment"
                width={600}
                height={800}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>

            {/* After */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-md min-h-0">
              <Image
                src="/After.jpeg"
                alt="After: consulted layout — organized efficiency"
                width={600}
                height={800}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>

            {/* Arrow — floats over the centre */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full"
              style={{ background: "linear-gradient(135deg, #0A4F6E, #00C9A7)", boxShadow: "0 4px 14px rgba(10,79,110,0.35)" }}>
              <MoveRight size={18} color="white" strokeWidth={2.5} />
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
