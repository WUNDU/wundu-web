export const env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/proxy",
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
