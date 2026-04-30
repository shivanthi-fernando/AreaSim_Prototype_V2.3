"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore, LeaseParams } from "@/store/onboarding";

const schema = z.object({
  totalArea:        z.string().min(1, "Total area is required"),
  annualRent:       z.string().min(1, "Annual rent is required"),
  commonAreaCost:   z.string().min(1, "Common area cost is required"),
  targetHeadcount:  z.number().min(1, "At least 1 employee required"),
  consultantsCount: z.number().optional(),
  showConsultants:  z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Slider Row ───────────────────────────────────────────────────────────────
interface SliderRowProps {
  label:   string;
  value:   number;
  min:     number;
  max:     number;
  step:    number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, step, prefix, suffix, onChange }: SliderRowProps) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2.5">
      {/* Label + value readout */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text font-body">{label}</span>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5">
          {prefix && (
            <span className="text-[11px] font-semibold text-text-muted font-mono select-none shrink-0">
              {prefix}
            </span>
          )}
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || min;
              onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-[72px] text-right text-sm font-bold text-text font-mono bg-transparent focus:outline-none min-w-0"
          />
          {suffix && (
            <span className="text-[11px] font-semibold text-text-muted font-mono select-none shrink-0">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Slider track */}
      <div className="relative flex items-center h-7">
        {/* Track background */}
        <div
          className="absolute w-full h-1.5 rounded-full"
          style={{ background: "var(--color-border)" }}
        />
        {/* Filled portion */}
        <div
          className="absolute h-1.5 rounded-full transition-all duration-75"
          style={{ width: `${pct}%`, background: "var(--color-accent)" }}
        />
        {/* Native range input — transparent, handles all interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full cursor-pointer"
          style={{ opacity: 0, WebkitAppearance: "none", appearance: "none" }}
        />
        {/* Visual thumb */}
        <div
          className="absolute w-[18px] h-[18px] rounded-full bg-white border-2 pointer-events-none transition-all duration-75"
          style={{
            left: `calc(${pct}% - 9px)`,
            borderColor: "var(--color-accent)",
            boxShadow: "0 1px 6px rgba(0,201,167,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  onNext: () => void;
}

export function Step3Lease({ onNext }: Props) {
  const { leaseParams, setLeaseParams } = useOnboardingStore();

  const { handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      totalArea:        leaseParams.totalArea       || "760",
      annualRent:       leaseParams.annualRent       || "2250000",
      commonAreaCost:   leaseParams.commonAreaCost   || "300000",
      targetHeadcount:  leaseParams.targetHeadcount  || 12,
      consultantsCount: leaseParams.consultantsCount || 0,
      showConsultants:  leaseParams.showConsultants  || false,
    },
  });

  const totalArea      = parseFloat(watch("totalArea"))      || 760;
  const annualRent     = parseFloat(watch("annualRent"))     || 2250000;
  const commonAreaCost = parseFloat(watch("commonAreaCost")) || 300000;
  const employees      = watch("targetHeadcount")            || 12;
  const consultants    = watch("consultantsCount")           || 0;
  const showConsultants = watch("showConsultants")           || false;
  const effectiveTotal = employees + (showConsultants ? consultants * 0.5 : 0);

  // Sync to global store so right panel live preview reacts in real time
  useEffect(() => {
    const sub = watch((values) => {
      setLeaseParams({
        totalArea:        String(values.totalArea ?? ""),
        annualRent:       String(values.annualRent ?? ""),
        commonAreaCost:   String(values.commonAreaCost ?? ""),
        targetHeadcount:  Number(values.targetHeadcount) || 1,
        consultantsCount: Number(values.consultantsCount) || 0,
        showConsultants:  Boolean(values.showConsultants),
      });
    });
    return () => sub.unsubscribe();
  }, [watch, setLeaseParams]);

  const onSubmit = (data: FormValues) => {
    setLeaseParams(data as LeaseParams);
    onNext();
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const item = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  };

  return (
    <motion.form
      id="lease-form"
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <motion.p variants={item} className="text-xs italic text-text-muted font-body">
        Slide or type — your cost overview updates as you go.
      </motion.p>

      <motion.div variants={item}>
        <SliderRow
          label="Total area"
          value={totalArea}
          min={100}
          max={10000}
          step={10}
          suffix="m²"
          onChange={(v) => setValue("totalArea", String(v))}
        />
      </motion.div>

      <motion.div variants={item}>
        <SliderRow
          label="Annual rent"
          value={annualRent}
          min={100000}
          max={15000000}
          step={50000}
          prefix="NOK"
          onChange={(v) => setValue("annualRent", String(v))}
        />
      </motion.div>

      <motion.div variants={item}>
        <SliderRow
          label="Common area cost"
          value={commonAreaCost}
          min={0}
          max={3000000}
          step={10000}
          prefix="NOK"
          onChange={(v) => setValue("commonAreaCost", String(v))}
        />
      </motion.div>

      <motion.div variants={item}>
        <SliderRow
          label="Permanent employees"
          value={employees}
          min={1}
          max={500}
          step={1}
          suffix="ppl"
          onChange={(v) => setValue("targetHeadcount", v)}
        />
      </motion.div>

      {/* Consultants toggle section */}
      <motion.div variants={item}>
        <div
          className="rounded-xl border p-4 space-y-4 transition-colors duration-300"
          style={{
            background:  showConsultants ? "rgba(0,201,167,0.04)"  : "var(--color-surface-2)",
            borderColor: showConsultants ? "rgba(0,201,167,0.35)" : "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text font-body leading-tight">Consultants</p>
              <p className="text-xs text-text-muted font-body mt-0.5">counts as 0.5 per seat</p>
            </div>
            <button
              type="button"
              onClick={() => setValue("showConsultants", !showConsultants)}
              role="switch"
              aria-checked={showConsultants}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: showConsultants ? "var(--color-accent)" : "var(--color-border)" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: showConsultants ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showConsultants && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden space-y-3"
              >
                <SliderRow
                  label="How many?"
                  value={consultants}
                  min={0}
                  max={100}
                  step={1}
                  suffix="ppl"
                  onChange={(v) => setValue("consultantsCount", v)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted font-body">Effective headcount:</span>
                  <motion.span
                    key={effectiveTotal}
                    initial={{ opacity: 0.5, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold font-mono"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {effectiveTotal.toLocaleString("no-NO")}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <p className="text-[11px] italic text-text-muted font-body">
          You can update these any time from your project settings.
        </p>
      </motion.div>
    </motion.form>
  );
}
