# Wundu Interface System

## Direction
**Who is this human?** A person looking for financial clarity, often checking their balance or uploading receipts on the go.
**What must they accomplish?** Quickly understand their financial status, upload documents for OCR, and track goals.
**What should this feel like?** Precise and technical like a Swiss bank, but approachable and modern like a FinTech leader. Reliable, clean, and fast.

## Color World
- **Primary (Wundu Blue):** `#003cc3` - Trust, stability.
- **Accent (Wundu Gold):** `#ffd400` - Energy, wealth, focus.
- **Surface:** `#F1F5FA` (Canvas), `#FFFFFF` (Cards/Sidebar).
- **Ink:** `#0F172A` (Primary), `#64748B` (Secondary).

## Depth Strategy
**Layered & Precise.** 
- Use whisper-quiet borders (`border-slate-100` or `rgba(0, 60, 195, 0.04)`) for structure.
- Use subtle elevation for cards (`shadow-sm` or `shadow-[0_2px_4px_rgba(0,60,195,0.04)]`).
- Higher elevation for modals and dropdowns.

## Spacing & Radii
- **Base Unit:** 4px.
- **Radii:** 
    - `sm`: 6px (Small controls)
    - `md`: 12px (Buttons, Inputs)
    - `lg`: 16px (Cards)
    - `xl`: 24px (Large containers/Modals)

## Typography
- **Headings:** `Inter`, Bold/ExtraBold, tight tracking.
- **Body:** `Inter`, Medium/Regular.
- **Data:** Tabular nums for financial values.

## Key Patterns
- **Brand Line:** Instead of a simple 2px line, use a subtle gradient or integrated accent in headers/active states.
- **Glass Shimmer:** Used on secondary cards to indicate they are secondary to the primary "High Impact" metrics.
- **OCR Feedback:** Immediate visual feedback via toast stacks and loading states.

## Signature
**Planetary Orbit & Data Gravity.**
The concept of "Centralization" (the nucleus) from the landing page should translate to the dashboard via focused "Central Cards" and clear hierarchical paths leading to the "Core" (Total Balance/Document Queue).
