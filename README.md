# Tempo

Web application for organizing workout routines and tracking daily progress. Track exercises and sets, sync progress to the cloud, and view an activity summary.

[Live app](https://gemini-rutina-cele.netlify.app/) · [GitHub repository](https://github.com/arielBiagio/Tempo)

## Features

- Email and password sign-in through Supabase Auth.
- Select routines organized by training day, with exercises, sets, reps, rest periods, and instructions.
- Automatic tracking by date and week, without manually activating plans or selecting weeks.
- Exercise and set progress tracked independently for each routine and user.
- Activity summary covering active days and weeks, completed sessions, exercises, sets, and estimated minutes.
- Local storage and synchronization of pending changes when connectivity returns, provided the session and routine have already loaded.
- Mobile-friendly interface with a personalized greeting and cloud sync status.
- Electric Slate visual identity, animated startup screen, and collapsible information panels.
- Routine and statistics queries through agents that support MCP and OAuth.

Minutes in the summary are calculated from the planned duration of completed sessions; they do not represent measured workout time.

## Tech stack

React, TypeScript, Vite, and Tailwind CSS. Supabase Auth and PostgreSQL with Row Level Security (RLS) policies handle authentication and persistence; IndexedDB stores cached data and pending changes. The MCP server runs on Supabase Edge Functions, and the frontend is hosted on Netlify.

## Agent integration: MCP

Tempo exposes five **read-only** tools through a remote MCP server using Streamable HTTP transport. Compatible agents, such as Sesame, can query account information without opening the app.

| Tool | What it provides |
| --- | --- |
| `mi_perfil` | Name, time zone, and selected routine ID. |
| `mis_rutinas` | Available routines, goals, difficulty levels, and training frequency. |
| `mi_rutina` | The selected routine or another routine by ID: schedule, exercises, sets, reps, rest periods, instructions, and weekly progress. |
| `mi_entrenamiento` | The workout for today, tomorrow, or a specific date: pending exercises, progress, rest day information, and the next scheduled session. |
| `mis_estadisticas` | Active days and weeks, completed sessions, exercises and sets, and estimated minutes, across all time, a week, a month, or a date range. |

Example questions: “What am I training tomorrow?”, “Which exercises do I have left today?”, or “How many days did I train this week?”

The connection uses **OAuth** and requires account authorization. MCP permissions and RLS policies restrict access to the authenticated user's data. The agent cannot modify routines, log exercises, or delete information. Statistics reflect synchronized data only; minutes are estimates, not measured workout time.

For your own deployment, the endpoint follows this format:

```text
https://<your-project>.supabase.co/functions/v1/glow-mcp
```

MCP setup requires enabling the Supabase OAuth server, configuring the `/oauth/consent` consent screen, and applying the permissions included in the migrations. Passwords and private keys are not shared with the agent.

## Design decisions

- **JSON-over-fetch data layer:** workout plans are separate from the UI and can be extended without rewriting screens.
- **Automatic scheduling and snapshots:** progress is recorded by date, preserving the routine version used each week so that plan changes do not alter historical records.
- **Local storage and synchronization:** a per-account queue preserves pending changes until connectivity returns; conflicts between devices require an explicit user decision.
- **Focused, read-only MCP:** purpose-built workout tools use OAuth and least-privilege permissions instead of generic database access.
- **Agent context:** [Code Mode](https://blog.cloudflare.com/code-mode/) was evaluated and ruled out at the current scale—five read-only tools. SQL statistics aggregation serves the same context-saving goal by keeping raw history out of the agent's context, without adding a code execution runtime.

## Local development

Requires Node.js and npm. The project has been verified with Node.js 24.

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and add your public Supabase configuration:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   For a new installation, apply the [SQL migrations](supabase/migrations/) in order and set up an email and password account in Supabase Auth. Do not rerun migrations on an existing migrated installation. Use only the public client key, never a secret or `service_role` key. Do not commit `.env.local`. Without Supabase configuration, the app offers a preview with local storage.

3. Start the development server:

   ```sh
   npm run dev
   ```

## Build and deployment

```sh
npm run build
npm run preview
```

The production build is generated in `dist/` and can be deployed to Netlify or another static host. Supabase environment variables must be configured before building.

## Local checks

```sh
npm run typecheck
npm run lint
```

## Customizing routines

Routines are defined in `public/routines/`. When customizing them, preserve existing IDs and increase the version when changing the workout prescription to keep historical records intact.

Some identifiers retain the app's previous name for compatibility with existing data and connections.
