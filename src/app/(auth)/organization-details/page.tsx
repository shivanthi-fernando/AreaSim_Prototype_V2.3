"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Hash, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ organization: "", organizationNumber: "" });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push("/welcome");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-700 text-text mb-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
          Your organisation
        </h1>
        <p className="text-sm text-text-muted font-body">
          Tell us about your workspace.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <Input
            label="Organization name"
            placeholder="Larsen & Partners AS"
            icon={<Building2 size={16} />}
            value={values.organization}
            onChange={handleChange("organization")}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input
            label="Organization number"
            placeholder="e.g. 123 456 789"
            icon={<Hash size={16} />}
            value={values.organizationNumber}
            onChange={handleChange("organizationNumber")}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
