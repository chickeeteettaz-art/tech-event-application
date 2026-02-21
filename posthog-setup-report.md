<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **DevEvent** Next.js App Router application. Here is a summary of every change made:

- **`instrumentation-client.ts`** *(new file)* — Initialises PostHog client-side using the Next.js 15.3+ `instrumentation-client` convention. Configured with a reverse-proxy `api_host`, automatic exception capture (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** *(updated)* — Added `rewrites` for `/ingest/*` → PostHog US ingestion endpoints and set `skipTrailingSlashRedirect: true` so PostHog's trailing-slash API calls are not redirected.
- **`components/ExploreButton.tsx`** *(updated)* — Captures `explore_events_clicked` when the hero CTA button is clicked.
- **`components/EventCard.tsx`** *(updated)* — Captures `event_card_clicked` with rich properties (`event_title`, `event_slug`, `event_location`, `event_date`, `event_time`) when a card is clicked.
- **`components/NavBar.tsx`** *(updated)* — Captures `nav_link_clicked` with a `link_label` property (Home, Events, Create Event, Logo) when any navigation link is clicked.
- **`.env.local`** *(new file)* — Stores `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` as environment variables (covered by `.gitignore`).

---

## Tracked events

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" hero CTA button | `components/ExploreButton.tsx` |
| `event_card_clicked` | User clicked an event card (includes title, slug, location, date, time) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link (includes `link_label`) | `components/NavBar.tsx` |

---

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://us.posthog.com/project/290044/dashboard/1297256
- 📈 **User Engagement Trends (30 days)**: https://us.posthog.com/project/290044/insights/o9DslTGS
- 🔽 **Event Discovery Funnel** (Explore → Card click): https://us.posthog.com/project/290044/insights/2DBAjqAO
- 🗂️ **Nav Link Clicks by Label**: https://us.posthog.com/project/290044/insights/JOSwWbfM
- 🏆 **Most Clicked Events** (by event title): https://us.posthog.com/project/290044/insights/xAFrxl7n
- 👥 **Daily Active Users**: https://us.posthog.com/project/290044/insights/X938ZnTL

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
