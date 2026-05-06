"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const checklist = [
  "Verify identified rooms on floor plan",
  "Mark zones",
  "Get employee count of each room",
  "Conduct survey",
];

export function Step6Done() {
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<number>(0);

  useEffect(() => {
    checklist.forEach((_, i) => {
      setTimeout(() => setVisibleItems(i + 1), 400 + i * 300);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center space-y-8"
    >
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-accent/10"
        style={{ background: "linear-gradient(135deg, #F2FFF9 0%, #C7EAE2 14%, #A6DAD2 30%, #BBD7F4 57%, #D2DADA 77%, #F4DEB4 100%)" }}
      >
        <CheckCircle2 size={36} color="#139485" />
      </motion.div>

      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-800 text-text"
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}
        >
          Great! You&apos;re all set!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-text-muted font-body max-w-sm leading-relaxed"
        >
          In order to give you advice on your space utilisation, it&apos;s important
          for us to understand your space and people. For that, we mainly want you to do few things:
        </motion.p>
      </div>

      {/* Animated checklist */}
      <div className="w-full max-w-sm space-y-3">
        {checklist.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -16 }}
            animate={
              visibleItems > i
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -16 }
            }
            transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-3 py-1"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={visibleItems > i ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="w-6 h-6 rounded-full bg-[#B7ACE1]/15 flex items-center justify-center shrink-0"
            >
              <span className="text-sm" style={{ color: "#B7ACE1" }}>✦</span>
            </motion.span>
            <span className="text-sm font-medium text-text font-body">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="w-full flex justify-center"
      >
        <Button
          size="lg"
          className="px-10 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/25"
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          onClick={() => router.push("/project/proj-1/floor/floor-1")}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
