# BotLab · New Joinee Card Generator

## Connect Supabase (local)
1. supabase.com → New project. Then **SQL Editor** → paste all of `supabase.sql` → Run.
2. **Project Settings → API**: copy *Project URL* and the **anon public** key (never the service_role key).
3. Create `.env` in this folder (next to package.json):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. **Restart** `npm run dev` (Vite reads .env only at startup). Open http://localhost:5173
5. **Authentication → Providers → Email**: for local testing turn off "Confirm email" (or confirm via inbox).
6. **Authentication → Users → Add user**: `demo@botlab.app` / `demo1234`, tick auto-confirm (powers the demo button).
7. After login the header shows "Connected to Supabase". A red banner means a step above is missing.

## Deploy
Vercel → import repo (Vite) → add the same two env vars → deploy. In Supabase → Authentication → URL Configuration add your Vercel URL.
