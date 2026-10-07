import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, configured } from './lib/firebase'
import { Login, Dashboard } from './App'
import './styles.css'

function Root() {
  const [session, setSession] = useState(undefined)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (!configured) {
      setSession(null)
      return undefined
    }
    const params = new URLSearchParams(window.location.search)
    setRecovery(params.get('mode') === 'resetPassword' && Boolean(params.get('oobCode')))
    return onAuthStateChanged(auth, user => setSession(user))
  }, [])

  if (!configured) return <div className="setup"><h2>Connect Firebase</h2><p>Create a <code>.env</code> file in the project root (next to <code>package.json</code>):</p><pre>{'VITE_FIREBASE_API_KEY=your-api-key\nVITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your-project-id\nVITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id\nVITE_FIREBASE_APP_ID=your-app-id'}</pre><p>Find these values in Firebase → Project settings → Your apps. Then <b>restart</b> <code>npm run dev</code> — Vite only reads .env at startup.</p></div>
  if (session === undefined) return null
  return session && !recovery ? <Dashboard user={session} /> : <Login recovery={recovery} onRecoveryComplete={() => { window.history.replaceState({}, document.title, window.location.pathname); setRecovery(false) }} />
}

createRoot(document.getElementById('root')).render(<Root />)
