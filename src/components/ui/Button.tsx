"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-medium focus-ring select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition-all";

    const variants: Record<ButtonVariant, string> = {
      primary: "text-white rounded-full font-semibold",
      secondary: "btn-secondary text-text rounded-full font-medium",
      ghost: "bg-transparent text-primary hover:bg-surface-2 active:scale-[0.98] rounded-[10px]",
      danger: "bg-accent-warm text-white hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg rounded-[10px]",
      outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98] rounded-[10px]",
    };

    // Primary gets size-specific shadow class; others use flat sizes
    const primaryShadowClass: Record<ButtonSize, string> = {
      sm: "btn-primary-sm",
      md: "btn-primary",
      lg: "btn-primary",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-sm px-3 py-1.5 h-8",
      md: "text-sm px-5 py-2.5 h-10",
      lg: "text-base px-7 py-3.5 h-12",
    };

    const shadowClass = variant === "primary" ? primaryShadowClass[size] : "";

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], shadowClass, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          icon && iconPosition === "left" && icon
        )}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);
Button.displayName = "Button";
