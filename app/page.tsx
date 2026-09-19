'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
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
  X,
  Zap,
} from 'lucide-react'

type Priority = 'high' | 'medium' | 'low'
type Filter = 'all' | 'active' | 'completed'
type Todo = { id: number; text: string; completed: boolean; priority: Priority }
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const priorityMeta: Record<Priority, { label: string; className: string; emoji: string }> = {
  high:   { label: 'High',   className: 'priority-high',   emoji: '🔴' },
  medium: { label: 'Medium', className: 'priority-medium', emoji: '🟡' },
  low:    { label: 'Low',    className: 'priority-low',    emoji: '🔵' },
}

const seedTodos: Todo[] = [
  { id: 1, text: 'Review quarterly product metrics',  completed: false, priority: 'high'   },
  { id: 2, text: 'Send updated brief to design team', completed: false, priority: 'medium' },
  { id: 3, text: "Plan next week's focus blocks",    completed: true,  priority: 'low'    },
  { id: 4, text: 'Book a 30-minute team sync',       completed: true,  priority: 'medium' },
]

// ─── TaskItem ────────────────────────────────────────────────────────────────

interface TaskItemProps {
  todo: Todo
  isEditing: boolean
  editText: string
  editPriority: Priority
  onToggle: () => void
  onEditStart: () => void
  onEditTextChange: (value: string) => void
  onEditPriorityChange: (value: Priority) => void
  onEditSave: () => void
  onEditCancel: () => void
  onDeleteRequest: () => void
}

function TaskItem({
  todo,
  isEditing,
  editText,
  editPriority,
  onToggle,
  onEditStart,
  onEditTextChange,
  onEditPriorityChange,
  onEditSave,
  onEditCancel,
  onDeleteRequest,
}: TaskItemProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) onEditSave()
    if (event.key === 'Escape') onEditCancel()
  }

  return (
    <article className={`task-row ${todo.completed ? 'is-complete' : ''}`}>
      {/* Checkbox */}
      <button
        className={`check-button ${todo.completed ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label={todo.completed ? 'Mark task active' : 'Mark task complete'}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Content area */}
      <div className="task-content">
        {isEditing ? (
          <div className="edit-row">
            {/* Title input */}
            <input
              ref={inputRef}
              className="edit-input"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Edit task title"
            />
            {/* Priority pills */}
            <div className="edit-priority-pills" role="group" aria-label="Select priority">
              {(Object.keys(priorityMeta) as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`edit-priority-pill ${priorityMeta[p].className} ${editPriority === p ? 'active' : ''}`}
                  onClick={() => onEditPriorityChange(p)}
                  aria-pressed={editPriority === p}
                  aria-label={`${priorityMeta[p].label} priority`}
                >
                  {priorityMeta[p].emoji} {priorityMeta[p].label}
                </button>
              ))}
            </div>
            {/* Save / Cancel */}
            <div className="edit-action-btns">
              <button
                className="edit-save-btn"
                onClick={onEditSave}
                aria-label="Save changes"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button
                className="edit-cancel-btn"
                onClick={onEditCancel}
                aria-label="Cancel editing"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="task-title" onDoubleClick={onEditStart}>{todo.text}</p>
            <span className={`priority-tag ${priorityMeta[todo.priority].className}`}>
              <Circle size={7} fill="currentColor" /> {priorityMeta[todo.priority].label}
            </span>
          </>
        )}
      </div>

      {/* Hover actions */}
      {!isEditing && (
        <div className="task-actions">
          <button onClick={onEditStart} aria-label={`Edit ${todo.text}`}>
            <Edit3 size={16} />
          </button>
          <button onClick={onDeleteRequest} aria-label={`Delete ${todo.text}`}>
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </article>
  )
}

// ─── DeleteConfirmModal ──────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  task: Todo | null
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirmModal({ task, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <Dialog.Root open={!!task} onOpenChange={(open) => { if (!open) onCancel() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="confirm-backdrop" />
        <Dialog.Popup className="confirm-dialog" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
          {/* Icon */}
          <div className="confirm-icon" aria-hidden="true">
            <Trash2 size={22} />
          </div>
          {/* Text */}
          <h2 id="confirm-title" className="confirm-title">Delete Task?</h2>
          <p id="confirm-desc" className="confirm-desc">
            Are you sure you want to delete{' '}
            <strong>&ldquo;{task?.text}&rdquo;</strong>?{' '}
            This action cannot be undone.
          </p>
          {/* Actions */}
          <div className="confirm-actions">
            <Dialog.Close
              className="confirm-cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </Dialog.Close>
            <button
              className="confirm-delete-btn"
              onClick={onConfirm}
              autoFocus
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [todos, setTodos]               = useState<Todo[]>(seedTodos)
  const [filter, setFilter]             = useState<Filter>('all')
  const [text, setText]                 = useState('')
  const [priority, setPriority]         = useState<Priority>('medium')
  const [editingId, setEditingId]       = useState<number | null>(null)
  const [editText, setEditText]         = useState('')
  const [editPriority, setEditPriority] = useState<Priority>('medium')
  const [taskToDelete, setTaskToDelete] = useState<Todo | null>(null)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled]   = useState(false)
  const [userName, setUserName]         = useState('')
  const [nameInput, setNameInput]       = useState('')
  const [menuOpen, setMenuOpen]         = useState(false)
  const [darkMode, setDarkMode]         = useState(true)

  useEffect(() => {
    const storedTodos = window.localStorage.getItem('taskpulse-todos')
    const storedName  = window.localStorage.getItem('taskpulse-user-name')
    const storedTheme = window.localStorage.getItem('taskpulse-theme')
    if (storedTodos) {
      try { setTodos(JSON.parse(storedTodos)) } catch { setTodos(seedTodos) }
    }
    if (storedName)  setUserName(storedName)
    if (storedTheme === 'light') setDarkMode(false)

    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    setIsInstalled(standalone)
    const onBeforeInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent) }
    const onAppInstalled  = () => { setIsInstalled(true); setInstallPrompt(null) }
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

  const completed    = todos.filter((t) => t.completed).length
  const active       = todos.length - completed
  const progress     = todos.length ? Math.round((completed / todos.length) * 100) : 0
  const visibleTodos = useMemo(() => todos.filter((t) => filter === 'all' || (filter === 'active' ? !t.completed : t.completed)), [todos, filter])

  function addTodo() {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((c) => [{ id: Date.now(), text: trimmed, completed: false, priority }, ...c])
    setText(''); setPriority('medium')
  }

  function completeOnboarding() {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    window.localStorage.setItem('taskpulse-user-name', trimmed)
    setUserName(trimmed)
  }

  function resetApp() {
    window.localStorage.removeItem('taskpulse-todos')
    window.localStorage.removeItem('taskpulse-user-name')
    window.localStorage.removeItem('taskpulse-theme')
    setTodos(seedTodos); setUserName(''); setNameInput(''); setDarkMode(true); setMenuOpen(false)
  }

  function toggleTodo(id: number) {
    setTodos((c) => c.map((t) => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id: number) {
    setTodos((c) => c.filter((t) => t.id !== id))
    setTaskToDelete(null)
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditPriority(todo.priority)
  }

  function saveEdit(id: number) {
    const trimmed = editText.trim()
    if (!trimmed) return
    setTodos((c) => c.map((t) => t.id === id ? { ...t, text: trimmed, priority: editPriority } : t))
    setEditingId(null)
  }

  function cancelEdit() { setEditingId(null) }

  function clearCompleted() { setTodos((c) => c.filter((t) => !t.completed)) }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  // ── Onboarding ──────────────────────────────────────────────────────────────
  if (!userName) return (
    <main className="shell onboarding-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="onboarding-card" aria-labelledby="onboarding-title">
        <div className="brand" aria-label="TaskPulse"><img className="brand-image" style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32, objectFit: 'contain' }} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png" alt="" width={32} height={32} /><span>TaskPulse</span></div>
        <h1 id="onboarding-title">Make space for your best work</h1>
        <form onSubmit={(e) => { e.preventDefault(); completeOnboarding() }} className="onboarding-form">
          <label htmlFor="name">Your name</label>
          <input id="name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Your name" autoComplete="name" autoFocus />
          <button className="primary-button" type="submit">Get Started <ArrowUpRight size={16} /></button>
        </form>
      </section>
    </main>
  )

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <main className="shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="app-frame">

        {/* Top bar */}
        <header className="topbar">
          <div className="brand" aria-label="TaskPulse"><img className="brand-image" style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32, objectFit: 'contain' }} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png" alt="" width={32} height={32} /><span>TaskPulse</span></div>
          <div className="top-actions">
            <div className="live-pill"><span className="live-dot" /> Local-first</div>
            {installPrompt && !isInstalled && <button className="install-button" onClick={installApp} aria-label="Install TaskPulse app"><Download size={15} /> Install app</button>}
            <div className="menu-wrap">
              <button className="icon-button" onClick={() => setMenuOpen((o) => !o)} aria-label="More options" aria-expanded={menuOpen}><MoreHorizontal size={19} /></button>
              {menuOpen && <div className="menu-popover" role="menu">
                <button onClick={() => { clearCompleted(); setMenuOpen(false) }} role="menuitem">Clear completed</button>
                <button onClick={() => { setDarkMode((m) => !m); setMenuOpen(false) }} role="menuitem">Use {darkMode ? 'light' : 'dark'} mode</button>
                <button className="danger-action" onClick={resetApp} role="menuitem">Reset app data</button>
              </div>}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div><Greeting userName={userName} /><p className="subtitle">A calm space for your most important work.</p></div>
          <div className="hero-stat"><span className="stat-label">Today&apos;s focus</span><strong>{active} <small>active tasks</small></strong><div className="mini-bars"><i /><i /><i /><i className="muted" /></div></div>
        </section>

        {/* Progress */}
        <section className="progress-card" aria-label={`Task progress: ${progress}% completed`}><div className="progress-head"><div><span className="section-kicker">Your momentum</span><strong>{progress}% <span>completed</span></strong></div><div className="progress-count"><CheckCircle2 size={16} /> {completed} of {todos.length} done</div></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></section>

        {/* Workspace */}
        <section className="workspace">
          <div className="workspace-head"><div><span className="section-kicker">Workspace</span><h2>My tasks</h2></div><button className="clear-button" onClick={clearCompleted}>Clear completed <ArrowUpRight size={15} /></button></div>

          {/* Composer */}
          <div className="composer">
            <div className="composer-icon"><Plus size={19} /></div>
            <input
              aria-label="New task"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) addTodo() }}
              placeholder="What needs your attention?"
            />
            <div className="priority-select">
              <select aria-label="Task priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                {Object.entries(priorityMeta).map(([key, val]) => <option key={key} value={key}>{val.label} priority</option>)}
              </select>
              <ChevronDown size={14} />
            </div>
            <button className="add-button" onClick={addTodo} aria-label="Add task"><Plus size={20} /></button>
          </div>

          {/* Filters */}
          <div className="filter-row" role="tablist" aria-label="Task filters">
            {(['all', 'active', 'completed'] as Filter[]).map((item) => (
              <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>
                {item[0].toUpperCase() + item.slice(1)} <span>{item === 'all' ? todos.length : item === 'active' ? active : completed}</span>
              </button>
            ))}
          </div>

          {/* Task list */}
          <div className="task-list">
            {visibleTodos.length ? visibleTodos.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                editText={editText}
                editPriority={editPriority}
                onToggle={() => toggleTodo(todo.id)}
                onEditStart={() => startEdit(todo)}
                onEditTextChange={setEditText}
                onEditPriorityChange={setEditPriority}
                onEditSave={() => saveEdit(todo.id)}
                onEditCancel={cancelEdit}
                onDeleteRequest={() => setTaskToDelete(todo)}
              />
            )) : (
              <div className="empty-state">
                <Archive size={26} /><strong>No tasks here</strong><span>Try switching filters or add a new task above.</span>
              </div>
            )}
          </div>

          <footer className="workspace-footer">
            <span><ListTodo size={15} /> {active} item{active !== 1 ? 's' : ''} left</span>
            <span className="keyboard-hint">Double-click a task to edit · Enter to save · Esc to cancel</span>
          </footer>
        </section>

        <footer className="app-footer"><span>TaskPulse <b>•</b> Built for focused days</span><span className="offline-status"><span className="live-dot" /> Changes saved locally</span></footer>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={taskToDelete}
        onConfirm={() => taskToDelete && deleteTodo(taskToDelete.id)}
        onCancel={() => setTaskToDelete(null)}
      />
    </main>
  )
}
