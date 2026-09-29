import { useEffect, useRef, useState } from 'react'
import { toPng, toJpeg } from 'html-to-image'
import { supabase } from './supabase'

const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const nl = s => esc(s).replace(/\n/g, '<br/>')

const FONTS = ['Inter', 'Exo 2', 'Poppins', 'DM Sans', 'Manrope', 'Outfit', 'Space Grotesk', 'Montserrat', 'Raleway', 'Oxanium', 'Playfair Display', 'Lora']
const styleDef = { headingFont: 'Inter', bodyFont: 'Inter', headingColor: '#ffffff', linkColor: '#ffffff' }
const stack = f => `'${f}',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif`
const fontHref = f => `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
const fontLinks = m => [...new Set([m.headingFont, m.bodyFont])].map(f => `<link href="${fontHref(f)}" rel="stylesheet"/>`).join('')
const loadFonts = s => { const m = { ...styleDef, ...s }; [m.headingFont, m.bodyFont].forEach(f => { const id = 'gf-' + f.replace(/ /g, '-'); if (!document.getElementById(id)) { const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = fontHref(f); document.head.appendChild(l) } }) }
const footerDef = { followText: 'Follow us on:', instagram: 'https://www.instagram.com/botlabdynamics', linkedin: 'https://www.linkedin.com/company/botlabdynamics', x: 'https://x.com/botlabdynamics', youtube: 'https://www.youtube.com/@botlabdynamics',
  about: "We are BotLab Dynamics - India's leading drone show company based in New Delhi, with 7x Guinness World Records and a portfolio of 500+ drone shows. We've performed at Global Summits, Stadium Finales, Tourism Festivals, and National Celebrations like Mahakumbh 2025, Filmfare, IIFA, IPL, ICC Women's World Cup, Mysuru Dasara, Ayodhya Deepotsav, and more.",
  moreText: 'know more log on to', website: 'www.botlabdynamics.com' }
const starter = () => ({ ...footerDef, ...styleDef,
  logo: '', logoText: 'BOTLAB DYNAMICS', greeting: 'Hey Team,',
  intro: "We're excited to introduce some new faces to our Swarm!\nThey bring a wealth of experience, fresh perspectives, and unique skills that will surely propel us forward. So, let's give a warm welcome to our new colleagues!",
  people: [
    { name: 'Sourabh Verma', designation: 'Unreal Engine Specialist', department: 'Animation', bio: 'Supports Unreal Engine development, contributes to scene design and optimization, assists with testing and debugging, and helps ensure applications are deployment-ready for projects.', image: '' },
    { name: 'Shreya Sirohi', designation: 'UAV Intern', department: 'Testing', bio: 'Supports UAV development, contributes to system design and integration, assists with testing and validation, and helps ensure systems are deployment-ready for projects.', image: '' },
  ],
})

const F = "Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
// Single source of truth: table-based, inline-styled, 600px email-safe card
const hosted = {}
const iconUrl = (n, s) => s['icon_' + n] || hosted[n] || `${window.location.origin}/icons/${n}.png`
const link = u => /^https?:\/\//.test(u) ? u : 'https://' + u
export const cardHtml = s0 => { const s = { ...footerDef, ...styleDef, ...s0 }; return `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="width:600px;max-width:100%;margin:0 auto;background:#0f0f11;font-family:${stack(s.bodyFont)};color:#fafafa">
<tr><td style="padding:40px 6% 0"><div style="text-align:center">${s.logo ? `<img src="${esc(s.logo)}" alt="" height="36" style="height:36px;display:inline-block;border:0"/>` : `<span style="font-family:${stack(s.headingFont)};font-weight:600;letter-spacing:5px;font-size:12px;color:#fafafa">${esc(s.logoText)}</span>`}</div>
<div style="height:1px;background:#26262b;margin:28px 0 32px;line-height:1px;font-size:1px">&nbsp;</div>
<div style="font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-0.5px;font-family:${stack(s.headingFont)};color:${esc(s.headingColor)};margin:0 0 12px">${esc(s.greeting)}</div>
<div style="font-size:14px;line-height:1.7;color:#a1a1aa">${nl(s.intro)}</div></td></tr>
${s.people.map(p => `<tr><td style="padding:28px 6% 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #26262b"><tr>
<td class="ph" width="96" valign="top" style="padding:28px 20px 0 0">${p.image ? `<img src="${esc(p.image)}" width="96" height="96" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:12px;display:block;border:0"/>` : `<div style="width:96px;height:96px;border-radius:12px;background:#1c1c20;color:#52525b;text-align:center;line-height:96px;font-size:12px">photo</div>`}</td>
<td class="pt" valign="top" style="padding-top:28px"><div style="font-size:17px;line-height:1.3;font-weight:600;font-family:${stack(s.headingFont)};color:${esc(s.headingColor)}">${esc(p.name)}</div>
<div style="font-size:13px;color:#a1a1aa;margin:4px 0 10px">${esc(p.designation)}${p.department ? ' &nbsp;·&nbsp; ' + esc(p.department) : ''}</div>
<div style="font-size:13px;line-height:1.65;color:#d4d4d8">${nl(p.bio)}</div></td></tr></table></td></tr>`).join('')}
<tr><td style="padding:36px 6% 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #26262b"><tr><td align="center" style="padding:32px 0 0">
<div style="font-size:13px;font-weight:500;font-family:${stack(s.headingFont)};color:${esc(s.headingColor)};margin-bottom:12px">${esc(s.followText)}</div>
<div>${['instagram', 'linkedin', 'x', 'youtube'].filter(n => s[n]).map(n => `<a href="${esc(link(s[n]))}" style="display:inline-block;margin:0 5px;text-decoration:none"><img src="${iconUrl(n, s)}" width="24" height="24" alt="${n}" style="display:block;border:0;width:24px;height:24px"/></a>`).join('')}</div>
<div style="font-size:11.5px;line-height:1.7;color:#a1a1aa;margin:20px 0 12px">${nl(s.about)}</div>
<div style="font-size:11.5px;color:#a1a1aa">${esc(s.moreText)} <a href="${esc(link(s.website))}" style="color:${esc(s.linkColor)};text-decoration:underline">${esc(s.website)}</a></div>
</td></tr></table></td></tr>
<tr><td style="height:40px;line-height:40px;font-size:1px">&nbsp;</td></tr></table>` }

const fullHtml = s => `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${esc(s.logoText)}</title>${fontLinks({ ...styleDef, ...s })}<style>@media(max-width:480px){.ph,.pt{display:block!important;width:100%!important}.ph{padding:24px 0 0!important}.pt{padding-top:16px!important}}</style></head><body style="margin:0;padding:0;background:#0f0f11"><div style="max-width:600px;margin:0 auto">${cardHtml(s)}</div></body></html>`

const b64 = h => { const [m, d] = h.split(','); const bin = atob(d), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: m.match(/:(.*?);/)[1] }) }
// accepts a Blob or a base64 data URL; works in browsers and sandboxed previews
const download = async (data, name) => {
  const blob = typeof data === 'string' ? b64(data) : data
  try { const d = window.claude && await window.claude.use('downloads'); if (d) { await d.save({ filename: name, data: blob }); return } } catch {}
  const u = URL.createObjectURL(blob), a = document.createElement('a')
  a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000)
}

function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++ } else if (c === '"') q = false; else cur += c }
    else if (c === '"') q = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = '' }
    else cur += c
  }
  if (cur || row.length) { row.push(cur); rows.push(row) }
  const [head, ...rest] = rows.filter(r => r.some(x => x.trim()))
  const keys = head.map(h => h.trim().toLowerCase())
  return rest.map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])))
}

/* ---------------- Login ---------------- */
export function Login() {
  const [mode, setMode] = useState('in'), [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  async function go(e, p, m = mode) {
    setBusy(true); setMsg('')
    const { data, error } = m === 'in' ? await supabase.auth.signInWithPassword({ email: e, password: p }) : await supabase.auth.signUp({ email: e, password: p })
    if (error) setMsg(error.message); else if (m === 'up' && !data.session) setMsg('Check your inbox to confirm your email.')
    setBusy(false)
  }
  return (
    <div className="login">
      <section className="hero">
        <div className="brand">BOTLAB DYNAMICS</div>
        <div className="dots" />
        <div className="hero-copy">
          <span className="pill"><i /> NEW JOINEE STUDIO</span>
          <h1>From a name on a list to a <em>welcome</em> worth sharing.</h1>
          <p>Craft, save, and re-edit your team's welcome cards in one place — built for the BotLab swarm.</p>
        </div>
      </section>
      <section className="panel">
        <form onSubmit={e => { e.preventDefault(); go(email, password) }}>
          <svg className="mark" viewBox="0 0 100 110"><path d="M35 0h22L47 40l45 25-22 45H0l14-30 20 4z" fill="#0f0f11" /></svg>
          <h2>{mode === 'in' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="sub">{mode === 'in' ? 'Sign in to access your saved projects.' : 'Sign up to start saving projects.'}</p>
          <button type="button" className="demo" onClick={() => go('demo@botlab.app', 'demo1234', 'in')}><i /> Try the demo account</button>
          <div className="hint">Signs you in as <b>demo@botlab.app</b> · password <b>demo1234</b></div>
          <div className="or"><span>OR CONTINUE WITH EMAIL</span></div>
          <label>EMAIL</label><input type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label>PASSWORD</label><input type="password" required minLength={6} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          {msg && <div className="err">{msg}</div>}
          <button className="primary" disabled={busy}>{mode === 'in' ? 'Sign in' : 'Sign up'}</button>
          <p className="switch">{mode === 'in' ? "Don't have an account? " : 'Already have an account? '}<a onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Sign up' : 'Sign in'}</a></p>
          <p className="copy">© BotLab Dynamics · All rights reserved</p>
        </form>
      </section>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */
export function Dashboard({ user }) {
  const [s, setS] = useState(starter), [name, setName] = useState('Untitled project'), [id, setId] = useState(null)
  const [projects, setProjects] = useState([]), [toast, setToast] = useState('')
  const ref = useRef(), csvRef = useRef()
  const flash = t => { setToast(t); setTimeout(() => setToast(''), 2200) }
  const load = async () => { const { data } = await supabase.from('projects').select('id,name,data,updated_at').order('updated_at', { ascending: false }); setProjects(data || []) }
  useEffect(() => { load() }, [])

  const set = (k, v) => setS(x => ({ ...x, [k]: v }))
  useEffect(() => { loadFonts(s) }, [s.headingFont, s.bodyFont])
  const sf = (k, label) => <div><label>{label}</label><select value={s[k] ?? styleDef[k]} onChange={e => set(k, e.target.value)}>{FONTS.map(f => <option key={f}>{f}</option>)}</select></div>
  const cf = (k, label) => <div><label>{label}</label><div className="colr"><input type="color" value={s[k] ?? styleDef[k]} onChange={e => set(k, e.target.value)} /><input value={s[k] ?? styleDef[k]} onChange={e => set(k, e.target.value)} /></div></div>
  const setP = (i, k, v) => setS(x => ({ ...x, people: x.people.map((p, j) => j === i ? { ...p, [k]: v } : p) }))
  async function upload(file, cb) {
    if (!file) return
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.]/g, '_')}`
    const { error } = await supabase.storage.from('photos').upload(path, file)
    if (error) return flash(error.message)
    cb(supabase.storage.from('photos').getPublicUrl(path).data.publicUrl)
  }
  const L = useRef(), lastSaved = useRef(JSON.stringify({ s, name })), saving = useRef(false)
  L.current = { s, name, id }
  const [status, setStatus] = useState('')
  async function save(silent) {
    if (saving.current) return
    saving.current = true; setStatus('Saving…')
    const { s, name, id } = L.current, snap = JSON.stringify({ s, name })
    const row = { name, data: s, updated_at: new Date().toISOString() }
    const q = id ? supabase.from('projects').update(row).eq('id', id).select().single() : supabase.from('projects').insert(row).select().single()
    const { data, error } = await q
    saving.current = false
    if (error) { setStatus('Save failed'); return flash(error.message) }
    L.current.id = data.id; setId(data.id); lastSaved.current = snap
    setStatus((silent ? 'Auto-saved ' : 'Saved ') + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    if (!silent) flash('Saved')
    load()
  }
  // auto-save every 10 seconds when there are unsaved changes
  useEffect(() => { const t = setInterval(() => { const c = L.current; if (JSON.stringify({ s: c.s, name: c.name }) !== lastSaved.current) save(true) }, 10000); return () => clearInterval(t) }, [])
  const [, tick] = useState(0)
  // host the default PNG icons in Supabase Storage so they load in Gmail even when running on localhost
  useEffect(() => { (async () => {
    for (const n of ['instagram', 'linkedin', 'x', 'youtube']) {
      const path = `${user.id}/icons/${n}.png`
      hosted[n] = supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
      try {
        const b = await (await fetch(`/icons/${n}.png`)).blob()
        const r = await supabase.storage.from('photos').upload(path, b, { contentType: 'image/png' })
        if (r.error && !/exist|duplicate/i.test(r.error.message)) delete hosted[n]
      } catch { delete hosted[n] }
    }
    tick(x => x + 1)
  })() }, [])
  const [dbErr, setDbErr] = useState(''), [dbOk, setDbOk] = useState(false)
  useEffect(() => { (async () => {
    const a = await supabase.from('projects').select('id', { head: true, count: 'exact' })
    if (a.error) return setDbErr(`Database not ready: ${a.error.message}. Run supabase.sql in the Supabase SQL Editor.`)
    const b = await supabase.storage.from('photos').list('', { limit: 1 })
    if (b.error) return setDbErr(`Storage not ready: ${b.error.message}. Run supabase.sql to create the "photos" bucket.`)
    setDbOk(true)
  })() }, [])
  const dirty = JSON.stringify({ s, name }) !== lastSaved.current
  const newProject = () => { const n = starter(); setS(n); setName('Untitled project'); setId(null); lastSaved.current = JSON.stringify({ s: n, name: 'Untitled project' }); setStatus('') }
  const edit = p => { setS(p.data); setName(p.name); setId(p.id); lastSaved.current = JSON.stringify({ s: p.data, name: p.name }); setStatus(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const dup = async p => { const { error } = await supabase.from('projects').insert({ name: p.name + ' (copy)', data: p.data }); if (error) return flash(error.message); flash('Duplicated'); load() }
  const del = async p => { if (!confirm(`Delete "${p.name}"?`)) return; await supabase.from('projects').delete().eq('id', p.id); if (p.id === id) newProject(); load() }

  async function copyEmail() {
    const html = cardHtml(s)
    try { await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([html], { type: 'text/plain' }) })]); flash('Copied — paste into your email') }
    catch { flash('Clipboard blocked by browser') }
  }
  const img = async fn => { try { await download(await fn(ref.current.firstElementChild, { pixelRatio: 2, cacheBust: true, ...(fn === toJpeg && { backgroundColor: '#ffffff', quality: 0.95 }) }), `${name}.${fn === toPng ? 'png' : 'jpg'}`) } catch { flash('Export failed — check image URLs') } }
  const importCsv = async f => { if (!f) return; const rows = parseCsv(await f.text()); set('people', rows.map(r => ({ name: r.name || '', designation: r.designation || '', department: r.department || '', bio: r.bio || '', image: r.image || '' }))); csvRef.current.value = '' }
  const exampleCsv = () => download(new Blob(['name,designation,department,bio,image\nJane Doe,Robotics Engineer,R&D,"Builds and tests autonomous systems.",'], { type: 'text/csv' }), 'example.csv')

  return (
    <div className="dash">
      <header>
        <div><h1>New Joinee Card Generator</h1><small>Signed in as {user.email}{dbOk && ' · Connected to Supabase'}</small></div>
        <div className="actions">
          <span className="status">{saving.current ? 'Saving…' : dirty ? 'Unsaved changes' : status || 'Auto-save on'}</span>
          <input className="pname" value={name} onChange={e => setName(e.target.value)} />
          <button className="fill" onClick={() => save(false)}>Save</button>
          <button onClick={newProject}>New</button>
          <button onClick={copyEmail}>Copy for Email</button>
          <button onClick={() => download(new Blob([fullHtml(s)], { type: 'text/html' }), `${name}.html`)}>Export HTML</button>
          <button className="fill" onClick={() => img(toPng)}>Export PNG</button>
          <button className="fill" onClick={() => img(toJpeg)}>Export JPG</button>
          <button className="dark" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </header>
      {dbErr && <div className="banner">{dbErr}</div>}
      <main>
        <div className="left">
          <div className="card"><div className="row"><h3>My Projects</h3><small>{projects.length} saved</small></div>
            {projects.map(p => <div className="proj" key={p.id}><div><b>{p.name}</b><small>Updated {new Date(p.updated_at).toLocaleString('en-IN')}</small></div>
              <div><button className="sm" onClick={() => edit(p)}>Edit</button> <button className="sm" onClick={() => dup(p)}>Duplicate</button> <button className="sm dark" onClick={() => del(p)}>Delete</button></div></div>)}
          </div>
          <div className="card"><h3>Header</h3>
            <label>COMPANY LOGO (IMAGE)</label>
            <div className="logo-row"><div className="logo-box">{s.logo ? <img src={s.logo} /> : 'No logo'}</div>
              <label className="sm upl">Upload Logo<input hidden type="file" accept="image/*" onChange={e => upload(e.target.files[0], u => set('logo', u))} /></label>
              {s.logo && <button className="sm dark" onClick={() => set('logo', '')}>Remove</button>}</div>
            <label>COMPANY LOGO TEXT (USED IF NO IMAGE)</label><input value={s.logoText} onChange={e => set('logoText', e.target.value)} />
            <label>GREETING</label><input value={s.greeting} onChange={e => set('greeting', e.target.value)} />
            <label>INTRO PARAGRAPH</label><textarea rows={4} value={s.intro} onChange={e => set('intro', e.target.value)} />
          </div>
          <div className="card"><h3>Style</h3>
            <div className="two">{sf('headingFont', 'HEADING FONT')}{sf('bodyFont', 'DESCRIPTION FONT')}</div>
            <div className="two">{cf('headingColor', 'HEADING / NAME COLOR')}{cf('linkColor', 'LINK COLOR')}</div></div>
          <div className="card"><div className="row"><h3>People</h3><div>
            <button className="sm" onClick={() => csvRef.current.click()}>Import CSV</button> <button className="sm fill" onClick={() => setS(x => ({ ...x, people: [...x.people, { name: '', designation: '', department: '', bio: '', image: '' }] }))}>+ Add</button>
            <input ref={csvRef} hidden type="file" accept=".csv" onChange={e => importCsv(e.target.files[0])} /></div></div>
            <p className="csvhint">CSV columns: <code>name, designation, department, bio, image</code> (image optional — a URL) · <a onClick={exampleCsv}>Download example CSV</a></p>
            {s.people.map((p, i) => (
              <div className="person" key={i}>
                <div className="ph"><div className="phbox">{p.image ? <img src={p.image} /> : 'No photo'}</div>
                  <label className="upl link">Upload<input hidden type="file" accept="image/*" onChange={e => upload(e.target.files[0], u => setP(i, 'image', u))} /></label></div>
                <div className="fields"><input placeholder="Name" value={p.name} onChange={e => setP(i, 'name', e.target.value)} />
                  <div className="two"><input placeholder="Designation" value={p.designation} onChange={e => setP(i, 'designation', e.target.value)} /><input placeholder="Department" value={p.department} onChange={e => setP(i, 'department', e.target.value)} /></div>
                  <textarea rows={3} placeholder="Bio" value={p.bio} onChange={e => setP(i, 'bio', e.target.value)} /></div>
                <button className="x" onClick={() => setS(x => ({ ...x, people: x.people.filter((_, j) => j !== i) }))}>×</button>
              </div>))}
          </div>
          <div className="card"><h3>Footer</h3>
            <label>FOLLOW HEADING</label><input value={s.followText ?? footerDef.followText} onChange={e => set('followText', e.target.value)} />
            <label>SOCIAL LINKS & PNG ICONS (BLANK = HIDDEN)</label>
            {['instagram', 'linkedin', 'x', 'youtube'].map(n => <div className="icrow" key={n}><img src={iconUrl(n, s)} alt="" /><input placeholder={n + ' URL'} value={s[n] ?? footerDef[n]} onChange={e => set(n, e.target.value)} /><label className="sm upl">PNG<input hidden type="file" accept="image/*" onChange={e => upload(e.target.files[0], u => set('icon_' + n, u))} /></label>{s['icon_' + n] && <button className="sm dark" onClick={() => set('icon_' + n, '')}>Reset</button>}</div>)}
            <label>ABOUT TEXT</label><textarea rows={5} value={s.about ?? footerDef.about} onChange={e => set('about', e.target.value)} />
            <label>WEBSITE LINE</label><div className="two"><input value={s.moreText ?? footerDef.moreText} onChange={e => set('moreText', e.target.value)} /><input value={s.website ?? footerDef.website} onChange={e => set('website', e.target.value)} /></div>
          </div>
        </div>
        <div className="right"><div className="lp">LIVE PREVIEW</div><div className="stage"><div ref={ref} className="preview" dangerouslySetInnerHTML={{ __html: cardHtml(s) }} /></div></div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
