'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Sparkles, Link as LinkIcon, Check, Loader2, ExternalLink, Globe, Bell, Tag, Plus, Flame, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import { useHabitStore, Habit, HabitPriority, GENERAL_CATEGORY } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'
import { openExternalUrl } from '@/lib/utils/url'
import { toast } from 'sonner'

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  editingHabit?: Habit | null
}

const PRESET_COLORS = [
  { name: 'Emerald', value: '#059669' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Sky', value: '#0284c7' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Fuchsia', value: '#c026d3' },
]

const CATEGORY_PRESET_COLORS = ['#059669', '#7c3aed', '#d97706', '#0284c7', '#e11d48', '#0d9488', '#c026d3']

const PRIORITY_OPTIONS: { value: HabitPriority; label: string; hint: string }[] = [
  { value: 'high', label: 'High', hint: '20 XP' },
  { value: 'medium', label: 'Medium', hint: '10 XP' },
  { value: 'low', label: 'Low', hint: '5 XP' },
]

const NEW_CATEGORY_OPTION = '__new_category__'

const STEPS = [
  { id: 'basics', label: 'Basics', title: 'What is the habit?', hint: 'Give it a name and pick an accent color.' },
  { id: 'category', label: 'Category', title: 'Where does it belong?', hint: 'Group it under a category or create a new one.' },
  { id: 'priority', label: 'Priority', title: 'How important is it?', hint: 'Higher priority earns more XP per check-in.' },
  { id: 'schedule', label: 'Schedule', title: 'When should Shodasha nudge you?', hint: 'Optional link and daily reminder time.' },
]

const STEP_TRANSITION = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28 }),
}

export function AddHabitModal({ isOpen, onClose, editingHabit }: AddHabitModalProps) {
  const addHabit = useHabitStore((s) => s.addHabit)
  const updateHabit = useHabitStore((s) => s.updateHabit)
  const habitCategories = useHabitStore((s) => s.habitCategories)
  const addCategory = useHabitStore((s) => s.addCategory)
  const tasks = useTaskStore((s) => s.tasks)
  const shouldReduceMotion = useReducedMotion()

  const [name, setName] = useState('')
  const [color, setColor] = useState('var(--accent-emerald)')
  const [linkedTaskId, setLinkedTaskId] = useState('')
  const [url, setUrl] = useState('')
  const [priority, setPriority] = useState<HabitPriority>('medium')
  const [category, setCategory] = useState(GENERAL_CATEGORY)
  const [reminderTime, setReminderTime] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_PRESET_COLORS[0])

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name)
      setColor(editingHabit.color || 'var(--accent-emerald)')
      setLinkedTaskId(editingHabit.linkedTaskId || '')
      setUrl(editingHabit.url || '')
      setPriority(editingHabit.priority || 'medium')
      setCategory(editingHabit.category || GENERAL_CATEGORY)
      setReminderTime(editingHabit.reminderTime || '')
    } else {
      setName('')
      setColor('var(--accent-emerald)')
      setLinkedTaskId('')
      setUrl('')
      setPriority('medium')
      setCategory(GENERAL_CATEGORY)
      setReminderTime('')
    }
    setIsCreatingCategory(false)
    setNewCategoryName('')
    setNewCategoryColor(CATEGORY_PRESET_COLORS[0])
    setCurrentStep(0)
    setDirection(1)
    setIsSuccess(false)
    setIsSubmitting(false)
  }, [editingHabit, isOpen])

  const isCurrentStepValid = () => {
    if (currentStep === 0) return name.trim().length > 0
    if (currentStep === 1 && isCreatingCategory) return newCategoryName.trim().length > 0
    return true
  }

  const handleNext = () => {
    if (currentStep >= STEPS.length - 1) return
    if (!isCurrentStepValid()) {
      if (currentStep === 0) {
        toast.error('Habit title is required')
      } else if (currentStep === 1) {
        toast.error('New category name is required')
      }
      return
    }
    setDirection(1)
    setCurrentStep((s) => s + 1)
    toast.success(`${STEPS[currentStep].label} complete — on to ${STEPS[currentStep + 1].label}`, {
      duration: 1500,
      icon: <Check className="w-4 h-4 text-[var(--success)]" />,
    })
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep((s) => Math.max(0, s - 1))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      let finalCategory = category
      if (isCreatingCategory) {
        const catName = newCategoryName.trim()
        addCategory(catName, newCategoryColor)
        const created = useHabitStore.getState().habitCategories.find(
          (c) => c.name.toLowerCase() === catName.toLowerCase()
        )
        finalCategory = created?.id ?? GENERAL_CATEGORY
      }
      const reminder = reminderTime.trim() || null

      if (editingHabit) {
        await updateHabit(
          editingHabit.id,
          name.trim(),
          color,
          linkedTaskId || undefined,
          url.trim() || undefined,
          priority,
          finalCategory,
          reminder
        )
      } else {
        await addHabit(
          name.trim(),
          color,
          linkedTaskId || undefined,
          url.trim() || undefined,
          priority,
          finalCategory,
          reminder
        )
      }
      setIsSuccess(true)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save habit')
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSuccess) return
    if (currentStep < STEPS.length - 1) {
      handleNext()
    } else {
      handleSubmit()
    }
  }

  const stepCircle = (stepIndex: number) => {
    const isComplete = isSuccess || stepIndex < currentStep
    const isCurrent = !isSuccess && stepIndex === currentStep
    const Icon = STEPS[stepIndex].id === 'basics' ? Sparkles : STEPS[stepIndex].id === 'category' ? Tag : STEPS[stepIndex].id === 'priority' ? Flame : Bell

    return (
      <div className="flex items-center gap-1.5 flex-col w-14 sm:w-16 shrink-0">
        <motion.div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
            isComplete
              ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
              : isCurrent
              ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
              : 'border-[var(--border-default)] text-[var(--text-tertiary)] bg-[var(--bg-primary)]'
          }`}
          animate={
            isComplete
              ? { scale: [1, 1.15, 1] }
              : isCurrent
              ? { scale: [1, 1.08, 1] }
              : { scale: 1 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          aria-current={isCurrent ? 'step' : undefined}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center justify-center"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.span>
            ) : (
              <motion.span key="icon" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center justify-center">
                <Icon className="w-3.5 h-3.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <span
          className={`text-[10px] font-medium leading-none text-center ${
            isComplete ? 'text-[var(--accent)]' : isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
          }`}
        >
          {STEPS[stepIndex].label}
        </span>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={editingHabit ? 'Edit habit' : 'Create new habit'}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  {isSuccess ? <PartyPopper className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[var(--text-primary)]">
                    {isSuccess
                      ? editingHabit
                        ? 'Habit Updated'
                        : 'Habit Created'
                      : editingHabit
                      ? 'Edit Habit'
                      : 'Create New Habit'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {isSuccess ? 'Your changes are live on the board' : 'A few quick steps — one at a time'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isSuccess && (
              <>
                {/* Ant-style Steps */}
                <div className="flex items-start justify-center mt-5" aria-label="Progress">
                  {STEPS.map((step, i) => (
                    <div key={step.id} className={`flex items-start ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                      {stepCircle(i)}
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-0.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden relative top-4 mx-1.5">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                            initial={false}
                            animate={{ width: isSuccess || i < currentStep ? '100%' : '0%' }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step body */}
                <form onSubmit={handleFormSubmit} className="mt-5">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={STEP_TRANSITION}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="mb-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                          Step {currentStep + 1} of {STEPS.length}
                        </p>
                        <h4 className="text-base font-bold font-display text-[var(--text-primary)] mt-0.5">
                          {STEPS[currentStep].title}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{STEPS[currentStep].hint}</p>
                      </div>

                      {currentStep === 0 && (
                        <div className="space-y-5">
                          <div>
                            <label htmlFor="habit-title" className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                              Habit Title *
                            </label>
                            <input
                              id="habit-title"
                              type="text"
                              autoFocus
                              placeholder="e.g. 30m Daily Deep Reading"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                              Accent Color
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                              {PRESET_COLORS.map((c) => {
                                const isSelected = color.toLowerCase() === c.value.toLowerCase()
                                return (
                                  <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    aria-label={`Select ${c.name} color`}
                                    aria-pressed={isSelected}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                                      isSelected ? 'scale-110 ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] ring-[var(--text-primary)]' : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                  >
                                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="habit-category" className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                                Category
                              </label>
                              <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                                <Tag className="w-3 h-3" /> Groups your habit on the board
                              </span>
                            </div>
                            <select
                              id="habit-category"
                              value={isCreatingCategory ? NEW_CATEGORY_OPTION : category}
                              onChange={(e) => {
                                if (e.target.value === NEW_CATEGORY_OPTION) {
                                  setIsCreatingCategory(true)
                                } else {
                                  setIsCreatingCategory(false)
                                  setCategory(e.target.value)
                                }
                              }}
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                            >
                              <option value={GENERAL_CATEGORY}>General</option>
                              {habitCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                              <option value={NEW_CATEGORY_OPTION}>+ New Category…</option>
                            </select>
                          </div>

                          {isCreatingCategory && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2.5 rounded-xl border border-dashed border-[var(--border-default)] bg-[var(--bg-tertiary)]/30 p-3">
                                <div className="flex items-center gap-2">
                                  <Plus className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />
                                  <input
                                    autoFocus
                                    type="text"
                                    placeholder="Category name (e.g. Finance)"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                                  />
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {CATEGORY_PRESET_COLORS.map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() => setNewCategoryColor(c)}
                                      aria-label={`Use category color ${c}`}
                                      className={`w-5 h-5 rounded-full transition-transform ${
                                        newCategoryColor.toLowerCase() === c.toLowerCase()
                                          ? 'scale-110 ring-2 ring-offset-1 ring-offset-[var(--bg-secondary)] ring-[var(--text-primary)]'
                                          : 'hover:scale-105'
                                      }`}
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                                </div>
                                <p className="text-[10px] text-[var(--text-tertiary)]">
                                  The new category is created when you finish the wizard.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                              Priority
                            </label>
                            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Habit priority">
                              {PRIORITY_OPTIONS.map((opt) => {
                                const isSelected = priority === opt.value
                                const dotColor =
                                  opt.value === 'high' ? 'var(--error)' : opt.value === 'medium' ? 'var(--accent-amber)' : 'var(--success)'
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() => setPriority(opt.value)}
                                    className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl border text-left transition-colors ${
                                      isSelected
                                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]/20'
                                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)]'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                                      {opt.label}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-tertiary)]">{opt.hint} per check-in</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="habit-linked-task" className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                                Linked Task (Optional)
                              </label>
                              <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" /> Auto-completes task
                              </span>
                            </div>
                            <select
                              id="habit-linked-task"
                              value={linkedTaskId}
                              onChange={(e) => setLinkedTaskId(e.target.value)}
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                            >
                              <option value="">-- No Linked Task --</option>
                              {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                  [{task.status.toUpperCase()}] {task.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="habit-reminder" className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                                Daily Reminder Time (Optional)
                              </label>
                              <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                                <Bell className="w-3 h-3" /> Nudges you each day
                              </span>
                            </div>
                            <input
                              id="habit-reminder"
                              type="time"
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                            />
                            <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)]">
                              Shodasha reminds you at this time — and catches up with an overdue nudge if the app was closed when the time passed.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label htmlFor="habit-url" className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                                Web Link / URL (Optional)
                              </label>
                              {url.trim() && (
                                <button
                                  type="button"
                                  onClick={() => openExternalUrl(url)}
                                  className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
                                >
                                  Test Link <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div className="relative">
                              <Globe className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-3" />
                              <input
                                id="habit-url"
                                type="url"
                                placeholder="https://example.com/habit"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 0 || isSubmitting}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs font-semibold transition-colors ${
                        currentStep === 0
                          ? 'text-[var(--text-tertiary)]/50 opacity-50 cursor-not-allowed'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || (currentStep < STEPS.length - 1 && !isCurrentStepValid())}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold transition-all shadow-xs ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </span>
                        ) : currentStep === STEPS.length - 1 ? (
                          editingHabit ? 'Save Changes' : 'Create Habit'
                        ) : (
                          <>
                            Next <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {/* Success screen */}
            {isSuccess && (
              <div className="mt-6 flex flex-col items-center text-center pb-2">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 16, delay: 0.05 }}
                    className="w-16 h-16 rounded-full bg-[var(--success)]/15 border border-[var(--success)]/30 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-[var(--success)] stroke-[3]" />
                  </motion.div>
                  {!shouldReduceMotion && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -18 }}
                        transition={{ duration: 1.2, delay: 0.25 }}
                        className="absolute -top-1 -right-2 text-[var(--accent-amber)]"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -24 }}
                        transition={{ duration: 1.4, delay: 0.4 }}
                        className="absolute top-2 -left-4 text-[var(--accent)]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -14 }}
                        transition={{ duration: 1.1, delay: 0.55 }}
                        className="absolute -bottom-1 right-0 text-[var(--accent-rose)]"
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.span>
                    </>
                  )}
                </div>
                <motion.h4
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="mt-4 text-lg font-bold font-display text-[var(--text-primary)]"
                >
                  {editingHabit ? 'Habit updated successfully!' : 'Habit created successfully!'}
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.25 }}
                  className="mt-1.5 text-sm text-[var(--text-secondary)] max-w-xs"
                >
                  {editingHabit
                    ? `Changes to "${name.trim()}" are saved and synced.`
                    : `"${name.trim()}" is now on your board. Check it in daily to build the streak.`}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 }}
                  onClick={onClose}
                  className="mt-6 px-6 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                >
                  Done
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
