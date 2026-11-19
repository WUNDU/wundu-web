"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Circle,
  CircleCheck,
  CircleUser,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  Phone,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  lock: Lock,
  eye: Eye,
  "eye-off": EyeOff,
  "circle-user": CircleUser,
  phone: Phone,
  calendar: Calendar,
  "key-round": KeyRound,
  "mail-check": MailCheck,
  "circle-check": CircleCheck,
  circle: Circle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  wallet: Wallet,
  "arrow-down": ArrowDown,
  "piggy-bank": PiggyBank,
  target: Target,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
};

export function DsIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Cmp = ICONS[name] ?? Circle;
  return <Cmp size={size} aria-hidden="true" />;
}

export function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Button ───

interface DsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "lg";
  block?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
}

export function DsButton({
  variant = "primary",
  size = "lg",
  block = false,
  loading = false,
  iconLeft,
  disabled,
  children,
  type = "button",
  ...props
}: DsButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`wd-btn wd-btn--${variant} wd-btn--${size}${block ? " wd-btn--block" : ""}`}
      {...props}
    >
      {loading ? <span className="wd-btn__spin" aria-hidden="true" /> : null}
      {iconLeft}
      {children}
    </button>
  );
}

// ─── FieldLabel ───

export function DsFieldLabel({ children }: { children: ReactNode }) {
  return <span className="wd-fieldlabel">{children}</span>;
}

// ─── Input ───

interface DsInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  trailingIcon?: string;
  onTrailingClick?: () => void;
  error?: string | false;
  invalid?: boolean;
}

export function DsInput({
  icon,
  trailingIcon,
  onTrailingClick,
  error = false,
  invalid = false,
  id,
  ...props
}: DsInputProps) {
  const showError = !!error || invalid;
  return (
    <div>
      <div className={`wd-input${showError ? " wd-input--error" : ""}`}>
        {icon ? (
          <span className="wd-input__icon">
            <DsIcon name={icon} size={18} />
          </span>
        ) : null}
        <input id={id} className="wd-input__el" {...props} />
        {trailingIcon ? (
          <button
            type="button"
            className="wd-input__trail"
            onClick={onTrailingClick}
            aria-label="Mostrar ou ocultar"
          >
            <DsIcon name={trailingIcon} size={18} />
          </button>
        ) : null}
      </div>
      {typeof error === "string" && error ? (
        <div className="wd-input__hint wd-input__hint--error">{error}</div>
      ) : null}
    </div>
  );
}

// ─── Checkbox ───

export function DsCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="wd-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="wd-check__box" aria-hidden="true" />
      {label}
    </label>
  );
}

// ─── IconTile ───

const TILE_TONES: Record<string, [string, string]> = {
  brand: ["--on-soft-brand", "--primary-light"],
  in: ["--money-in", "--money-in-tint"],
  yellow: ["--tone-gold", "--cat-4-tint"],
  green: ["--cat-1", "--cat-1-tint"],
  purple: ["--cat-5", "--cat-5-tint"],
};

const TILE_SIZES: Record<string, [number, number]> = {
  sm: [32, 16],
  md: [40, 20],
  lg: [48, 24],
};

export function DsIconTile({
  icon,
  tone = "brand",
  size = "md",
}: {
  icon: string;
  tone?: keyof typeof TILE_TONES;
  size?: keyof typeof TILE_SIZES;
}) {
  const [fg, bg] = TILE_TONES[tone] ?? TILE_TONES.brand;
  const [box, glyph] = TILE_SIZES[size] ?? TILE_SIZES.md;
  return (
    <span
      className="wd-tile"
      style={{
        width: box,
        height: box,
        background: `var(${bg})`,
        color: `var(${fg})`,
      }}
    >
      <DsIcon name={icon} size={glyph} />
    </span>
  );
}

// ─── IconButton (voltar) ───

export function DsIconButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="wd-iconbtn wd-iconbtn--lg wd-iconbtn--outline"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <DsIcon name="arrow-left" size={20} />
    </button>
  );
}

// ─── Divisor "ou" ───

export function DsDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: "var(--text-tertiary)",
        fontSize: 13,
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      ou
      <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
    </div>
  );
}

// ─── Link em forma de botão ───

export function DsLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="wa-link" onClick={onClick}>
      {children}
    </button>
  );
}
