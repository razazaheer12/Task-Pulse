'use client'

import { useEffect, useMemo, useState } from 'react'
import Greeting from '@/components/Greeting'
import {
  Archive,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Download,
  Edit3,
  ListTodo,
  MoreHorizontal,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react'

type Priority = 'high' | 'medium' | 'low'
type Filter = 'all' | 'active' | 'completed'
type Todo = { id: number; text: string; completed: boolean; priority: Priority }
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const priorityMeta: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low: { label: 'Low', className: 'priority-low' },
}

const seedTodos: Todo[] = [
  { id: 1, text: 'Review quarterly product metrics', completed: false, priority: 'high' },
  { id: 2, text: 'Send updated brief to design team', completed: false, priority: 'medium' },
  { id: 3, text: 'Plan next week’s focus blocks', completed: true, priority: 'low' },
  { id: 4, text: 'Book a 30-minute team sync', completed: true, priority: 'medium' },
]

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>(seedTodos)
  const [filter, setFilter] = useState<Filter>('all')
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const storedTodos = window.localStorage.getItem('taskpulse-todos')
    const storedName = window.localStorage.getItem('taskpulse-user-name')
    const storedTheme = window.localStorage.getItem('taskpulse-theme')
    if (storedTodos) {
      try { setTodos(JSON.parse(storedTodos)) } catch { setTodos(seedTodos) }
    }
    if (storedName) setUserName(storedName)
    if (storedTheme === 'light') setDarkMode(false)

    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    setIsInstalled(standalone)
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const onAppInstalled = () => { setIsInstalled(true); setInstallPrompt(null) }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  useEffect(() => { window.localStorage.setItem('taskpulse-todos', JSON.stringify(todos)) }, [todos])
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    window.localStorage.setItem('taskpulse-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const completed = todos.filter((todo) => todo.completed).length
  const active = todos.length - completed
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0
  const visibleTodos = useMemo(() => todos.filter((todo) => filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed)), [todos, filter])

  function addTodo() {
    const trimmedText = text.trim()
    if (!trimmedText) return
    setTodos((current) => [{ id: Date.now(), text: trimmedText, completed: false, priority }, ...current])
    setText('')
    setPriority('medium')
  }
  function completeOnboarding() {
    const trimmedName = nameInput.trim()
    if (!trimmedName) return
    window.localStorage.setItem('taskpulse-user-name', trimmedName)
    setUserName(trimmedName)
  }
  function resetApp() {
    window.localStorage.removeItem('taskpulse-todos')
    window.localStorage.removeItem('taskpulse-user-name')
    window.localStorage.removeItem('taskpulse-theme')
    setTodos(seedTodos); setUserName(''); setNameInput(''); setDarkMode(true); setMenuOpen(false)
  }
  function toggleTodo(id: number) { setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo)) }
  function deleteTodo(id: number) { setTodos((current) => current.filter((todo) => todo.id !== id)) }
  function updateTodo(id: number, nextText: string) {
    if (!nextText.trim()) return
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, text: nextText.trim() } : todo)); setEditingId(null)
  }
  function clearCompleted() { setTodos((current) => current.filter((todo) => !todo.completed)) }
  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  if (!userName) return (
    <main className="shell onboarding-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="onboarding-card" aria-labelledby="onboarding-title">
        <div className="brand" aria-label="TaskPulse"><img className="brand-image" style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32, objectFit: 'contain' }} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png" alt="" width={32} height={32} /><span>TaskPulse</span></div>
        <h1 id="onboarding-title">Make space for your best work</h1>
        <form onSubmit={(event) => { event.preventDefault(); completeOnboarding() }} className="onboarding-form">
          <label htmlFor="name">Your name</label>
          <input id="name" value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="Your name" autoComplete="name" autoFocus />
          <button className="primary-button" type="submit">Get Started <ArrowUpRight size={16} /></button>
        </form>
      </section>
    </main>
  )

  return (
    <main className="shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="app-frame">
        <header className="topbar">
          <div className="brand" aria-label="TaskPulse"><img className="brand-image" style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32, objectFit: 'contain' }} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png" alt="" width={32} height={32} /><span>TaskPulse</span></div>
          <div className="top-actions">
            <div className="live-pill"><span className="live-dot" /> Local-first</div>
            {installPrompt && !isInstalled && <button className="install-button" onClick={installApp} aria-label="Install TaskPulse app"><Download size={15} /> Install app</button>}
            <div className="menu-wrap">
              <button className="icon-button" onClick={() => setMenuOpen((open) => !open)} aria-label="More options" aria-expanded={menuOpen}><MoreHorizontal size={19} /></button>
              {menuOpen && <div className="menu-popover" role="menu">
                <button onClick={() => { clearCompleted(); setMenuOpen(false) }} role="menuitem">Clear completed</button>
                <button onClick={() => { setDarkMode((mode) => !mode); setMenuOpen(false) }} role="menuitem">Use {darkMode ? 'light' : 'dark'} mode</button>
                <button className="danger-action" onClick={resetApp} role="menuitem">Reset app data</button>
              </div>}
            </div>
          </div>
        </header>

        <section className="hero">
          <div><Greeting userName={userName} /><p className="subtitle">A calm space for your most important work.</p></div>
          <div className="hero-stat"><span className="stat-label">Today&apos;s focus</span><strong>{active} <small>active tasks</small></strong><div className="mini-bars"><i /><i /><i /><i className="muted" /></div></div>
        </section>

        <section className="progress-card" aria-label={`Task progress: ${progress}% completed`}><div className="progress-head"><div><span className="section-kicker">Your momentum</span><strong>{progress}% <span>completed</span></strong></div><div className="progress-count"><CheckCircle2 size={16} /> {completed} of {todos.length} done</div></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></section>
        <section className="workspace">
          <div className="workspace-head"><div><span className="section-kicker">Workspace</span><h2>My tasks</h2></div><button className="clear-button" onClick={clearCompleted}>Clear completed <ArrowUpRight size={15} /></button></div>
          <div className="composer"><div className="composer-icon"><Plus size={19} /></div><input aria-label="New task" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) addTodo() }} placeholder="What needs your attention?" /><div className="priority-select"><select aria-label="Task priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>{Object.entries(priorityMeta).map(([key, value]) => <option key={key} value={key}>{value.label} priority</option>)}</select><ChevronDown size={14} /></div><button className="add-button" onClick={addTodo} aria-label="Add task"><Plus size={20} /></button></div>
          <div className="filter-row" role="tablist" aria-label="Task filters">{(['all', 'active', 'completed'] as Filter[]).map((item) => <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item[0].toUpperCase() + item.slice(1)} <span>{item === 'all' ? todos.length : item === 'active' ? active : completed}</span></button>)}</div>
          <div className="task-list">{visibleTodos.length ? visibleTodos.map((todo) => <article className={`task-row ${todo.completed ? 'is-complete' : ''}`} key={todo.id}><button className={`check-button ${todo.completed ? 'checked' : ''}`} onClick={() => toggleTodo(todo.id)} aria-label={todo.completed ? 'Mark task active' : 'Mark task complete'}>{todo.completed && <Check size={14} strokeWidth={3} />}</button><div className="task-content">{editingId === todo.id ? <input className="edit-input" autoFocus defaultValue={todo.text} onBlur={(event) => updateTodo(todo.id, event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') updateTodo(todo.id, event.currentTarget.value); if (event.key === 'Escape') setEditingId(null) }} /> : <><p className="task-title" onDoubleClick={() => setEditingId(todo.id)}>{todo.text}</p><span className={`priority-tag ${priorityMeta[todo.priority].className}`}><Circle size={7} fill="currentColor" /> {priorityMeta[todo.priority].label}</span></>}</div><div className="task-actions"><button onClick={() => setEditingId(todo.id)} aria-label={`Edit ${todo.text}`}><Edit3 size={16} /></button><button onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.text}`}><Trash2 size={16} /></button></div></article>) : <div className="empty-state"><Archive size={26} /><strong>No tasks here</strong><span>Try switching filters or add a new task above.</span></div>}</div>
          <footer className="workspace-footer"><span><ListTodo size={15} /> {active} item{active !== 1 ? 's' : ''} left</span><span className="keyboard-hint">Double-click a task to edit</span></footer>
        </section>
        <footer className="app-footer"><span>TaskPulse <b>•</b> Built for focused days</span><span className="offline-status"><span className="live-dot" /> Changes saved locally</span></footer>
      </div>
    </main>
  )
}
