import React, { useState, useRef, useCallback, useId } from 'react'
import Papa from 'papaparse'
import html2canvas from 'html2canvas'

// ─── helpers ────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)

const defaultPeople = [
  {
    id: uid(),
    name: 'Sourabh Verma',
    designation: 'Unreal Engine Specialist',
    department: 'Animation',
    bio: 'Supports Unreal Engine development, contributes to scene design and optimization, assists with testing and debugging, and helps ensure applications are deployment-ready for projects.',
    photoUrl: null,
  },
  {
    id: uid(),
    name: 'Shreya Sirohi',
    designation: 'UAV Intern',
    department: 'Testing',
    bio: 'Supports UAV development, contributes to system design and integration, assists with testing and validation, and helps ensure systems are deployment-ready for projects.',
    photoUrl: null,
  },
]

const defaultConfig = {
  logoUrl: null,
  logoText: 'BOTLAB ▲ DYNAMICS',
  greeting: 'Hey Team,',
  intro: "We're excited to introduce some new faces to our Swarm!\nThey bring a wealth of experience, fresh perspectives, and unique skills that will surely propel us forward. So, let's give a warm welcome to our new colleagues!",
  accentColor: '#c8ff00',
  bgColor: '#0f1117',
  cardBg: '#151820',
  textColor: '#e8e8e8',
}

// ─── Card Preview ────────────────────────────────────────────────────────────

function CardPreview({ config, people, previewRef }) {
  const accent = config.accentColor || '#c8ff00'
  return (
    <div
      ref={previewRef}
      style={{
        background: config.bgColor || '#0f1117',
        fontFamily: "'Inter', sans-serif",
        padding: '48px 40px',
        width: '680px',
        minWidth: '680px',
        color: config.textColor || '#e8e8e8',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {config.logoUrl ? (
          <img src={config.logoUrl} alt="logo" style={{ maxHeight: '48px', maxWidth: '200px', objectFit: 'contain' }} />
        ) : (
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '0.06em',
            color: accent,
          }}>
            {config.logoText || 'COMPANY'}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: `${accent}30`, marginBottom: '28px' }} />

      {/* Greeting */}
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
        {config.greeting || 'Hey Team,'}
      </div>

      {/* Intro */}
      <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#aaa', marginBottom: '40px', whiteSpace: 'pre-line' }}>
        {config.intro}
      </div>

      {/* People grid */}
      <div style={{ display: 'grid', gridTemplateColumns: people.length === 1 ? '1fr' : '1fr 1fr', gap: '20px' }}>
        {people.map((p) => (
          <PersonCard key={p.id} person={p} accent={accent} cardBg={config.cardBg} textColor={config.textColor} />
        ))}
      </div>
    </div>
  )
}

function PersonCard({ person, accent, cardBg, textColor }) {
  return (
    <div style={{
      background: cardBg || '#1a1d2a',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Photo + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: `${accent}20`,
          border: `2px solid ${accent}40`,
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', fontWeight: 700, color: accent,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {person.photoUrl
            ? <img src={person.photoUrl} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (person.name || '?')[0]?.toUpperCase()
          }
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', color: textColor || '#e8e8e8' }}>
            {person.name || 'Name'}
          </div>
          <div style={{ fontSize: '12px', color: accent, fontWeight: 600, marginTop: '2px' }}>
            {[person.designation, person.department].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>
      {person.bio && (
        <div style={{ fontSize: '12px', lineHeight: 1.65, color: '#999', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          {person.bio}
        </div>
      )}
    </div>
  )
}

// ─── Panel Components ─────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function PhotoUploadButton({ photoUrl, onChange }) {
  const ref = useRef()
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: '#1a1a1a', border: '1px solid #333',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', color: '#555', flexShrink: 0,
      }}>
        {photoUrl
          ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '👤'
        }
      </div>
      <button
        onClick={() => ref.current.click()}
        style={{ background: '#222', color: '#ccc', padding: '6px 12px', border: '1px solid #333', fontSize: '12px' }}
      >
        {photoUrl ? 'Change' : 'Upload Photo'}
      </button>
      {photoUrl && (
        <button onClick={() => onChange(null)} style={{ background: 'transparent', color: '#c55', padding: '6px 8px', border: '1px solid #c5555530', fontSize: '12px' }}>
          ✕
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

function PersonEditor({ person, onChange, onRemove, index }) {
  const update = (key, val) => onChange({ ...person, [key]: val })
  const handlePhoto = useCallback((url) => update('photoUrl', url), [person])

  return (
    <div style={{
      background: '#111', border: '1px solid #222', borderRadius: '10px',
      padding: '16px', marginBottom: '12px', position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '13px', color: '#aaa' }}>
          Person {index + 1}
        </span>
        <button
          onClick={onRemove}
          style={{ background: 'transparent', color: '#c55', border: '1px solid #c5555530', padding: '3px 8px', fontSize: '12px', borderRadius: '6px' }}
        >
          Remove
        </button>
      </div>

      <PhotoUploadButton photoUrl={person.photoUrl} onChange={handlePhoto} />
      <div style={{ marginTop: '12px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Field label="Name">
          <input value={person.name} onChange={e => update('name', e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Designation">
          <input value={person.designation} onChange={e => update('designation', e.target.value)} placeholder="Job title" />
        </Field>
      </div>
      <Field label="Department">
        <input value={person.department} onChange={e => update('department', e.target.value)} placeholder="Team / Department" />
      </Field>
      <Field label="Bio">
        <textarea value={person.bio} onChange={e => update('bio', e.target.value)} placeholder="Short bio or intro..." />
      </Field>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [config, setConfig] = useState(defaultConfig)
  const [people, setPeople] = useState(defaultPeople)
  const [exporting, setExporting] = useState(false)
  const previewRef = useRef()
  const logoFileRef = useRef()
  const csvRef = useRef()

  const updateConfig = (key, val) => setConfig(c => ({ ...c, [key]: val }))

  const addPerson = () => setPeople(p => [...p, { id: uid(), name: '', designation: '', department: '', bio: '', photoUrl: null }])
  const updatePerson = (id, data) => setPeople(p => p.map(x => x.id === id ? data : x))
  const removePerson = (id) => setPeople(p => p.filter(x => x.id !== id))

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateConfig('logoUrl', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleCSV = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const newPeople = data.map(row => ({
          id: uid(),
          name: row.name || row.Name || '',
          designation: row.designation || row.Designation || '',
          department: row.department || row.Department || '',
          bio: row.bio || row.Bio || '',
          photoUrl: null,
        }))
        setPeople(p => [...p, ...newPeople])
      }
    })
    e.target.value = ''
  }

  const exportAs = async (type) => {
    if (!previewRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, backgroundColor: null,
        width: 680, height: previewRef.current.scrollHeight,
      })
      if (type === 'html') {
        const blob = new Blob([previewRef.current.outerHTML], { type: 'text/html' })
        downloadBlob(blob, 'new-joinees.html')
      } else {
        const mime = type === 'jpg' ? 'image/jpeg' : 'image/png'
        canvas.toBlob(blob => downloadBlob(blob, `new-joinees.${type}`), mime, 0.95)
      }
    } finally {
      setExporting(false)
    }
  }

  const downloadBlob = (blob, name) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const downloadSampleCSV = () => {
    const csv = 'name,designation,department,bio\nJohn Doe,Software Engineer,Engineering,Passionate about building scalable systems.\nJane Smith,Product Designer,Design,Crafts user experiences that delight and convert.'
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadBlob(blob, 'sample-joinees.csv')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: '#111', borderBottom: '1px solid #222',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🎉</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px' }}>
            New Joinee Card Generator
          </span>
          <span style={{ color: '#555', fontSize: '12px', marginLeft: '4px' }}>
            Import CSV · Upload photos · Export PNG / JPG / HTML
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => exportAs('html')}
            disabled={exporting}
            style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #333', padding: '8px 14px' }}
          >
            Export HTML
          </button>
          <button
            onClick={() => exportAs('png')}
            disabled={exporting}
            style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #333', padding: '8px 14px' }}
          >
            Export PNG
          </button>
          <button
            onClick={() => exportAs('jpg')}
            disabled={exporting}
            style={{ background: config.accentColor || '#c8ff00', color: '#000', padding: '8px 16px' }}
          >
            {exporting ? 'Exporting…' : 'Export JPG'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 57px)' }}>

        {/* Left Panel */}
        <aside style={{
          width: '360px', minWidth: '360px', background: '#111', borderRight: '1px solid #1e1e1e',
          overflowY: 'auto', padding: '24px 20px',
        }}>

          {/* Header section */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '11px',
              color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px',
            }}>Header</div>

            <Field label="Company Logo (Image)">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                {config.logoUrl && (
                  <img src={config.logoUrl} alt="logo" style={{ height: '36px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #222' }} />
                )}
                <button
                  onClick={() => logoFileRef.current.click()}
                  style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #333', padding: '7px 12px', flex: 1 }}
                >
                  {config.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </button>
                {config.logoUrl && (
                  <button onClick={() => updateConfig('logoUrl', null)} style={{ background: 'transparent', color: '#c55', border: '1px solid #c5555530', padding: '7px 10px', fontSize: '12px' }}>
                    ✕
                  </button>
                )}
              </div>
              <input ref={logoFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            </Field>

            <Field label="Company Logo Text (used if no image)">
              <input value={config.logoText} onChange={e => updateConfig('logoText', e.target.value)} />
            </Field>

            <Field label="Greeting">
              <input value={config.greeting} onChange={e => updateConfig('greeting', e.target.value)} />
            </Field>

            <Field label="Intro Paragraph">
              <textarea value={config.intro} onChange={e => updateConfig('intro', e.target.value)} style={{ minHeight: '96px' }} />
            </Field>
          </div>

          {/* Style section */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '11px',
              color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px',
            }}>Colors</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Field label="Accent Color">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="color" value={config.accentColor} onChange={e => updateConfig('accentColor', e.target.value)}
                    style={{ width: '36px', height: '32px', padding: '2px', cursor: 'pointer' }} />
                  <input value={config.accentColor} onChange={e => updateConfig('accentColor', e.target.value)} style={{ flex: 1 }} />
                </div>
              </Field>
              <Field label="Background">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="color" value={config.bgColor} onChange={e => updateConfig('bgColor', e.target.value)}
                    style={{ width: '36px', height: '32px', padding: '2px', cursor: 'pointer' }} />
                  <input value={config.bgColor} onChange={e => updateConfig('bgColor', e.target.value)} style={{ flex: 1 }} />
                </div>
              </Field>
              <Field label="Card Background">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="color" value={config.cardBg} onChange={e => updateConfig('cardBg', e.target.value)}
                    style={{ width: '36px', height: '32px', padding: '2px', cursor: 'pointer' }} />
                  <input value={config.cardBg} onChange={e => updateConfig('cardBg', e.target.value)} style={{ flex: 1 }} />
                </div>
              </Field>
              <Field label="Text Color">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="color" value={config.textColor} onChange={e => updateConfig('textColor', e.target.value)}
                    style={{ width: '36px', height: '32px', padding: '2px', cursor: 'pointer' }} />
                  <input value={config.textColor} onChange={e => updateConfig('textColor', e.target.value)} style={{ flex: 1 }} />
                </div>
              </Field>
            </div>
          </div>

          {/* People section */}
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '11px',
              color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>People</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => csvRef.current.click()} style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', padding: '4px 10px', fontSize: '11px' }}>
                  Import CSV
                </button>
                <button onClick={addPerson} style={{ background: config.accentColor || '#c8ff00', color: '#000', padding: '4px 10px', fontSize: '11px' }}>
                  + Add
                </button>
              </div>
            </div>

            <input ref={csvRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />

            <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>
              CSV columns: <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: '3px', color: '#888' }}>name, designation, department, bio</code>{' '}
              <span style={{ color: config.accentColor, cursor: 'pointer', textDecoration: 'underline' }} onClick={downloadSampleCSV}>
                Download example CSV
              </span>
            </div>

            {people.map((p, i) => (
              <PersonEditor
                key={p.id}
                person={p}
                index={i}
                onChange={(data) => updatePerson(p.id, data)}
                onRemove={() => removePerson(p.id)}
              />
            ))}

            {people.length === 0 && (
              <div style={{ textAlign: 'center', color: '#444', padding: '24px', border: '1px dashed #222', borderRadius: '8px', fontSize: '13px' }}>
                No people yet — add one or import a CSV
              </div>
            )}
          </div>
        </aside>

        {/* Preview Pane */}
        <main style={{
          flex: 1, overflowY: 'auto', padding: '32px',
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{ marginBottom: '16px', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Live Preview
          </div>
          <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
            <CardPreview config={config} people={people} previewRef={previewRef} />
          </div>
        </main>
      </div>
    </div>
  )
}
