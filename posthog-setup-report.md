<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Wundu Next.js 15 (App Router) project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event reliability. User identification is called on successful login and registration, and `posthog.reset()` is called on logout. Unhandled exceptions are captured using `posthog.captureException()` at key error boundaries.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully logs into their Wundu account | `app/(auth)/login/page.tsx` |
| `user_sign_in_failed` | User login attempt failed due to invalid credentials or error | `app/(auth)/login/page.tsx` |
| `user_registered` | User successfully completes the full registration flow | `app/(auth)/register/page.tsx` |
| `user_registration_step_completed` | User completes step 1 of registration (personal data) | `app/(auth)/register/page.tsx` |
| `transaction_added` | User successfully adds a manual transaction | `src/components/home/add-transaction-modal.tsx` |
| `document_uploaded` | User uploads a PDF receipt and OCR processing succeeds | `app/(protected)/(dashboard)/home/page.tsx` |
| `document_upload_failed` | OCR processing of an uploaded document fails | `app/(protected)/(dashboard)/home/page.tsx` |
| `goal_created` | User successfully creates a new financial goal | `src/components/goals/new-goal-modal.tsx` |
| `ai_message_sent` | User sends a typed message to the Wundu AI assistant | `app/(protected)/(dashboard)/home/chat/page.tsx` |
| `ai_topic_selected` | User selects a quick-topic shortcut in the AI chat | `app/(protected)/(dashboard)/home/chat/page.tsx` |
| `premium_upgrade_clicked` | Free-plan user clicks the "Actualizar para Premium" button | `app/(protected)/(dashboard)/home/profile/page.tsx` |
| `transaction_filter_applied` | User applies a filter or sort on the transactions list | `app/(protected)/(dashboard)/home/transactions/page.tsx` |
| `user_signed_out` | User logs out (with `posthog.reset()` called) | `src/components/layout/sidebar-right.tsx` |

## Files created / modified

- **Created** `instrumentation-client.ts` — PostHog client-side initialization
- **Modified** `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true`
- **Modified** `.env.local` — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/386050/dashboard/1479322
- **Insight — User Signup Funnel**: https://us.posthog.com/project/386050/insights/NxFzzF5j
- **Insight — Login Success vs Failure Rate**: https://us.posthog.com/project/386050/insights/4Q5B99C3
- **Insight — Transaction Activity (Manual & OCR)**: https://us.posthog.com/project/386050/insights/OYmPoPYl
- **Insight — Premium Upgrade Clicks**: https://us.posthog.com/project/386050/insights/VJAWwhn0
- **Insight — AI & Goals Engagement**: https://us.posthog.com/project/386050/insights/A5oMsGqd

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
