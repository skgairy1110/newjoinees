import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase, configured } from './supabase'
import { Login, Dashboard } from './App'
import './styles.css'
function Root() {
  const [session, setSession] = useState(undefined)
  const [recovery, setRecovery] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      setSession(s)
    })
    return () => data.subscription.unsubscribe()
  }, [])
  if (!configured) return <div className="setup"><h2>Connect Supabase</h2><p>Create a <code>.env</code> file in the project root (next to <code>package.json</code>):</p><pre>{'VITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-public-key'}</pre><p>Find both in Supabase → Project Settings → API. Then <b>restart</b> <code>npm run dev</code> — Vite only reads .env at startup.</p></div>
  if (session === undefined) return null
  return session && !recovery ? <Dashboard user={session.user} /> : <Login recovery={recovery} onRecoveryComplete={() => setRecovery(false)} />
}
createRoot(document.getElementById('root')).render(<Root />)
