"use client";
import type { FC } from "react";


const SIZE_MAP = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-lg",
} as const;

const FALLBACK_COLORS = [
  "bg-secondary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
];

function getFallbackColor(name?: string | null): string {
  if (!name) return FALLBACK_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function getInitial(name?: string | null): string {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ src, name, size = "sm", className = "" }) => {
  const sizeClass = SIZE_MAP[size];

  if (src) {
    return (
      <div className={`relative flex-shrink-0 overflow-hidden rounded-full ${sizeClass} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name || "Usuário"}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass} ${getFallbackColor(name)} ${className}`}
    >
      {getInitial(name)}
    </div>
  );
};

export default UserAvatar;
