import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
// Adjust these two paths to wherever the shadcn CLI placed the components
// (e.g. './components/ui/GhostFibers'). If it created a folder, import the .jsx inside it.
import GhostFibers from './components/GhostFibers'
import TechText from './components/TechText'
import './App.css'

const API_URL = 'http://localhost:8000/api/research'
const PLACEHOLDERS = [
  'Try: Impact of geopolitical conflicts on global oil prices...',
  'Try: 2026 breakthroughs in multi-agent AI orchestration...',
  'Try: Quantum computing milestones in 2025 and 2026...',
]
const CHIPS = [
  ['Geopolitical impact on oil & markets', 'Impact of geopolitical conflicts on global oil prices and financial markets'],
  ['2026 Agentic AI breakthroughs', '2026 breakthroughs in multi-agent AI orchestration'],
  ['Quantum computing milestones', 'Quantum computing milestones in 2025 and 2026'],
]
const STAGES = ['Search', 'Read', 'Write', 'Critique']

function parseFeedback(t = '') {
  const s = t.match(/score\W*:?\W*(\d+(?:\.\d+)?)\s*\/\s*10/i)
  const grab = (label, next) => {
    const m = t.match(new RegExp(`${label}[:\\s*#-]*([\\s\\S]*?)(?=${next}|$)`, 'i'))
    return m ? m[1].trim() : ''
  }
  return {
    score: s ? parseFloat(s[1]) : null,
    strengths: grab('strengths', 'areas? to improve|one-line verdict'),
    improve: grab('areas? to improve', 'one-line verdict'),
    verdict: grab('one-line verdict', '$'),
  }
}

function Pipeline({ stage, loading, done }) {
  return (
    <ol className="pipeline" aria-label="Research pipeline">
      {STAGES.map((name, i) => {
        const complete = done || i < stage
        const active = loading && i === stage
        return (
          <li key={name} className={complete ? 'is-done' : active ? 'is-active' : ''}>
            <span>{complete ? '✓' : String(i + 1).padStart(2, '0')}</span> {name}
            {i < 3 && <i aria-hidden>→</i>}
          </li>
        )
      })}
    </ol>
  )
}

function ScoreRing({ score }) {
  const r = 34, c = 2 * Math.PI * r
  return (
    <svg className="ring" viewBox="0 0 84 84" role="img" aria-label={`Score ${score} out of 10`}>
      <circle cx="42" cy="42" r={r} className="ring-bg" />
      <circle cx="42" cy="42" r={r} className="ring-fg" strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(score, 10) / 10)} />
      <text x="42" y="46" textAnchor="middle">{score}</text>
      <text x="42" y="60" textAnchor="middle" className="ring-sub">/10</text>
    </svg>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [ph, setPh] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | loading | done | error
  const [stage, setStage] = useState(0)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const lastTopic = useRef('')
  const ctrl = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    if (focused || query) return
    const id = setInterval(() => setPh(p => (p + 1) % PLACEHOLDERS.length), 3500)
    return () => clearInterval(id)
  }, [focused, query])

  useEffect(() => () => { clearInterval(timer.current); ctrl.current?.abort() }, [])

  async function run(raw) {
    const topic = raw.trim()
    if (!topic) return
    lastTopic.current = topic
    setQuery(topic); setPhase('loading'); setStage(0); setError(''); setData(null)
    ctrl.current?.abort()
    ctrl.current = new AbortController()
    clearInterval(timer.current)
    timer.current = setInterval(() => setStage(s => Math.min(s + 1, 3)), 12000)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
        signal: ctrl.current.signal,
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      setData(await res.json())
      setPhase('done')
    } catch (e) {
      if (e.name === 'AbortError') return
      setError(e.message === 'Failed to fetch'
        ? 'Could not reach the research server at localhost:8000. Check that the API is running.'
        : e.message)
      setPhase('error')
    } finally {
      clearInterval(timer.current)
    }
  }

  function reset() {
    ctrl.current?.abort(); clearInterval(timer.current)
    setPhase('idle'); setQuery(''); setData(null); setError('')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(data.report)
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([data.report], { type: 'text/markdown' }))
    a.download = 'synthea-report.md'; a.click(); URL.revokeObjectURL(a.href)
  }

  const idle = phase === 'idle'
  const loading = phase === 'loading'
  const fb = data ? parseFeedback(data.feedback) : null

  return (
    <>
      <div className="bg" aria-hidden>
        <GhostFibers lineColor="#1a1233" glowColor="#7C5CFF" speed={0.18} />
      </div>

      <main className={`shell ${idle ? 'is-idle' : 'is-active'}`}>
        <header className="head">
          <div className="fold badge-wrap"><div>
            <span className="badge"><b className="dot" />Multi-Agent Research Engine • Autonomous Pipeline</span>
          </div></div>

          <div className="bar">
            <h1 className="brand" aria-label="Synthea"><TechText text="Synthea" /></h1>

            <div className="search-col">
              <form className="search" onSubmit={e => { e.preventDefault(); run(query) }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={PLACEHOLDERS[ph]}
                  aria-label="Research topic"
                  disabled={loading}
                />
                <span className="hint-wrap" data-hint={!query ? PLACEHOLDERS[ph] : undefined}>
                  <button type="submit" disabled={loading || !query.trim()}>
                    {loading ? 'Researching…' : <>Research <span aria-hidden>✦</span></>}
                  </button>
                </span>
              </form>

              <div className="fold"><div className="chips">
                <small>Try:</small>
                {CHIPS.map(([label, full]) => (
                  <button key={label} type="button" onClick={() => run(full)}>{label}</button>
                ))}
              </div></div>
            </div>
          </div>

          <div className="fold copy-wrap"><div>
            <p className="tagline">Autonomous multi-agent deep research.</p>
            <p className="sub">Four specialized AI agents search the live web, read primary sources, synthesize structured reports, and score their own rigor.</p>
          </div></div>

          {!idle && <Pipeline stage={stage} loading={loading} done={phase === 'done'} />}
        </header>

        {phase === 'error' && (
          <div className="banner" role="alert">
            <span>{error}</span>
            <button onClick={() => run(lastTopic.current)}>Retry</button>
          </div>
        )}

        {phase === 'done' && data && (
          <section className="workspace glass">
            <article className="report">
              <div className="actions">
                <button onClick={copy}>{copied ? 'Copied' : 'Copy Markdown'}</button>
                <button onClick={download}>Download .md</button>
                <button className="ghost" onClick={reset}>New Research</button>
              </div>
              <ReactMarkdown components={{ a: p => <a {...p} target="_blank" rel="noreferrer" /> }}>
                {data.report}
              </ReactMarkdown>
            </article>

            <aside className="side">
              <div className="critic">
                <div className="critic-top">
                  {fb.score != null && <ScoreRing score={fb.score} />}
                  <span className="mono">Critic evaluation</span>
                </div>
                {fb.strengths || fb.improve || fb.verdict ? (<>
                  {fb.strengths && <><h3>Strengths</h3><ReactMarkdown>{fb.strengths}</ReactMarkdown></>}
                  {fb.improve && <><h3>Areas to improve</h3><ReactMarkdown>{fb.improve}</ReactMarkdown></>}
                  {fb.verdict && <blockquote><ReactMarkdown>{fb.verdict}</ReactMarkdown></blockquote>}
                </>) : <ReactMarkdown>{data.feedback}</ReactMarkdown>}
              </div>
              <details><summary>Raw Search Results</summary><pre>{data.search_results}</pre></details>
              <details><summary>Scraped Source Content</summary><pre>{data.scraped_content}</pre></details>
            </aside>
          </section>
        )}
      </main>

      {idle && <div className="bottom-pipe"><Pipeline stage={-1} loading={false} done={false} /></div>}
    </>
  )
}
