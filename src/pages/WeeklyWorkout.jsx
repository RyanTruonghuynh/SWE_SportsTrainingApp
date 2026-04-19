import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, ringColors } from '../styles/theme'
import { getCurrentWeekProgress, toggleProgressItem } from '../services/progress'
import '../styles/workout.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// used to determine past/today/future for each day
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const getDayIndex = (day) => DAY_ORDER.indexOf(day)

// localStorage helpers
const getWeekKey = () => {
  const d = new Date()
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay()
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return `trainr_${d.toISOString().split('T')[0]}`
}

// composite key: "day::itemType::title"
const makeItemKey = (day, type, title) => `${day}::${type}::${title}`

const loadLocalSaved = () => {
  try {
    const raw = localStorage.getItem(getWeekKey())
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

const saveLocalSaved = (set) => {
  try { localStorage.setItem(getWeekKey(), JSON.stringify([...set])) } catch {}
}
// end localStorage helpers 

function transformWorkoutData(data) {
  const { workoutPlan } = data
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayIndex = getDayIndex(todayName)

  // backend completion is ignored; localStorage is applied separately in applyLocalCompleted
  const days = (workoutPlan.weeklyPlan ?? []).map(dayPlan => {
    const dayIndex = getDayIndex(dayPlan.day)
    const isToday = dayPlan.day === todayName

    return {
      dayOfWeek: dayPlan.day,
      isToday,
      isPast: dayIndex < todayIndex,
      isFuture: dayIndex > todayIndex,
      isActive: isToday,
      workout: (dayPlan.workoutItems ?? []).map(item => ({
        name: item.title,
        sets: item.sets,
        reps: item.reps,
        duration: item.duration,
        completed: false,
      })),
      skills: (dayPlan.skillsItems ?? []).map(item => ({
        name: item.title,
        sets: item.sets,
        reps: item.reps,
        duration: item.duration,
        completed: false,
      })),
    }
  })

  return {
    weekLabel: workoutPlan.title,
    workoutPlanId: workoutPlan._id,
    days,
  }
}

// apply localStorage completion state on top of the base weekData
function applyLocalCompleted(weekData, saved) {
  if (!saved || saved.size === 0) return weekData
  return {
    ...weekData,
    days: weekData.days.map(day => ({
      ...day,
      workout: day.workout.map(item => ({
        ...item,
        completed: saved.has(makeItemKey(day.dayOfWeek, 'workout', item.name)),
      })),
      skills: day.skills.map(item => ({
        ...item,
        completed: saved.has(makeItemKey(day.dayOfWeek, 'skill', item.name)),
      })),
    })),
  }
}

// apply backend progress completion state on top of the base weekData
function applyBackendCompleted(weekData, progressDays) {
  if (!progressDays?.length) return weekData
  return {
    ...weekData,
    days: weekData.days.map(day => {
      const progDay = progressDays.find(d => d.day === day.dayOfWeek)
      if (!progDay) return day
      return {
        ...day,
        workout: day.workout.map(item => ({
          ...item,
          completed: progDay.workoutItems?.find(w => w.title === item.name)?.completed ?? false,
        })),
        skills: day.skills.map(item => ({
          ...item,
          completed: progDay.skillItems?.find(s => s.title === item.name)?.completed ?? false,
        })),
      }
    }),
  }
}

// build a localStorage Set from backend progress days so they stay in sync
function buildSavedFromBackend(progressDays) {
  const saved = new Set()
  for (const day of progressDays ?? []) {
    for (const item of day.workoutItems ?? []) {
      if (item.completed) saved.add(makeItemKey(day.day, 'workout', item.title))
    }
    for (const item of day.skillItems ?? []) {
      if (item.completed) saved.add(makeItemKey(day.day, 'skill', item.title))
    }
  }
  return saved
}

// Helpers
function formatDayLabel(dayOfWeek, date) {
  if (!date) return dayOfWeek
  const d = new Date(date)
  return `${dayOfWeek}, ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
}

// Per Day Accordion, only today allows marking items complete
function DayAccordion({ dayId, label, exercises, isToday, isPast, isFuture, ringColor, isOpen, onOpenToggle, onToggleItem }) {
  return (
    <div style={accordionSt.row(isToday, isPast)}>
      <button
        style={accordionSt.trigger}
        onClick={onOpenToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${dayId}`}
      >
        <span className={`wr-chevron${isOpen ? ' wr-chevron--open' : ''}`}>›</span>
        <span style={accordionSt.dayLabel(isToday)}>{label}</span>
        {isToday && <span style={accordionSt.badge('today')}>Today</span>}
        {isFuture && <span style={accordionSt.badge('future')}>Upcoming</span>}
        {isPast && <span style={accordionSt.badge('past')}>Past</span>}
      </button>

      <div id={`panel-${dayId}`} className={`wr-body${isOpen ? ' wr-body--open' : ''}`} role="region">
        <div className="wr-inner">
          <ul style={accordionSt.list}>
            {exercises.map((ex, i) => (
              // entire row is the click target for easy tapping
              <li
                key={ex._id || i}
                className={isToday ? 'wr-ex-row' : ''}
                style={accordionSt.item(isToday)}
                onClick={() => isToday && onToggleItem(ex.name, !ex.completed)}
                role={isToday ? 'button' : undefined}
                tabIndex={isToday ? 0 : undefined}
                onKeyDown={(e) => isToday && e.key === 'Enter' && onToggleItem(ex.name, !ex.completed)}
                title={!isToday ? 'Only available on the day of' : ''}
                aria-label={isToday ? (ex.completed ? `Unmark ${ex.name}` : `Mark ${ex.name} done`) : ex.name}
              >
                {/* visual dot only - no glow, no button */}
                <span style={accordionSt.dot(ex.completed, ringColor)} aria-hidden="true" />
                <div style={accordionSt.nameCol}>
                  <span style={accordionSt.name(ex.completed)}>{ex.name}</span>
                  {(ex.sets || ex.reps || ex.duration) && (
                    <span style={accordionSt.meta}>
                      {ex.sets && ex.reps
                        ? `${ex.sets} sets × ${ex.reps} reps`
                        : ex.duration || ''}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const accordionSt = {
  row: (isToday, isPast) => ({
    borderRadius: '8px',
    overflow: 'hidden',
    background: isToday ? 'rgba(48,155,193,0.07)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${isToday ? 'rgba(48,155,193,0.3)' : isPast ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`,
    opacity: isPast ? 0.6 : 1,
    transition: 'border-color 0.2s, opacity 0.2s',
  }),
  trigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 13px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    outline: 'none',
  },
  dayLabel: (isToday) => ({
    color: isToday ? colors.textPrimary : 'rgba(240,244,248,0.7)',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '14px',
    fontWeight: isToday ? '600' : '500',
    flex: 1,
  }),
  badge: (type) => {
    const styles = {
      today: { background: 'rgba(48,155,193,0.2)', color: '#3BBFE8' },
      past: { background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,248,0.35)' },
      future: { background: 'rgba(255,255,255,0.04)', color: 'rgba(240,244,248,0.3)' },
    }
    const s = styles[type] || styles.future
    return {
      fontSize: '10px',
      fontFamily: "'Outfit', sans-serif",
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: s.color,
      background: s.background,
      borderRadius: '4px',
      padding: '2px 6px',
      marginLeft: 'auto',
      flexShrink: 0,
    }
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: '2px 13px 12px 13px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: (isToday) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '5px 6px',
    borderRadius: '6px',
    cursor: isToday ? 'pointer' : 'default',
    transition: 'background 0.15s',
    background: 'transparent',
  }),
  dot: (completed, ringColor) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '2px',
    border: completed ? 'none' : '2px solid rgba(240,244,248,0.25)',
    background: completed ? ringColor : 'transparent',
    transition: 'background 0.18s, border-color 0.18s',
  }),
  nameCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  name: (completed) => ({
    color: completed ? 'rgba(240,244,248,0.4)' : 'rgba(240,244,248,0.82)',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '13px',
    textDecoration: completed ? 'line-through' : 'none',
    transition: 'color 0.2s',
  }),
  meta: {
    color: 'rgba(240,244,248,0.38)',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '11px',
  },
}

// WorkoutPanel - one accordion open at a time, defaults to today's day
function WorkoutPanel({ title, days, dataKey, onToggleItem }) {
  const [openDayIndex, setOpenDayIndex] = useState(() => {
    const todayIdx = days.findIndex(d => d.isToday)
    return todayIdx >= 0 ? todayIdx : 0
  })

  const handleOpenToggle = (i) => {
    setOpenDayIndex(prev => (prev === i ? -1 : i))
  }

  // map panel key to API itemType ('skills' -> 'skill')
  const itemType = dataKey === 'workout' ? 'workout' : 'skill'

  // count completed items for the panel header
  const totalDone = days.reduce((sum, d) => sum + (d[dataKey] || []).filter(e => e.completed).length, 0)
  const totalAll = days.reduce((sum, d) => sum + (d[dataKey] || []).length, 0)

  return (
    <div style={panelSt.panel}>
      <div style={panelSt.header}>
        <h2 style={panelSt.title}>{title}</h2>
        <span style={panelSt.count}>{totalDone}/{totalAll}</span>
      </div>
      <div className="wr-panel-body">
        {days.map((day, i) => (
          <DayAccordion
            key={day._id || day.dayOfWeek || i}
            dayId={`${dataKey}-${day._id || i}`}
            label={day.label || formatDayLabel(day.dayOfWeek, day.date)}
            exercises={day[dataKey] || []}
            isToday={!!day.isToday}
            isPast={!!day.isPast}
            isFuture={!!day.isFuture}
            ringColor={ringColors[i % ringColors.length]}
            isOpen={openDayIndex === i}
            onOpenToggle={() => handleOpenToggle(i)}
            onToggleItem={(itemName, completed) =>
              onToggleItem(day.dayOfWeek, itemName, itemType, completed)
            }
          />
        ))}
      </div>
    </div>
  )
}

const panelSt = {
  panel: {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: colors.cardShadow,
  },
  header: {
    padding: '14px 16px 12px',
    borderBottom: `1px solid ${colors.cardBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    color: '#3B9EE2',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '18px',
    fontWeight: '700',
  },
  count: {
    color: 'rgba(240,244,248,0.4)',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '13px',
  },
}

// Donut Chart
const STROKE = 10
const RING_GAP = 3
const SVG_SIZE = 220
const CX = SVG_SIZE / 2

function DonutChart({ days }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  const rings = days.map((day, i) => {
    const r = 95 - i * (STROKE + RING_GAP)
    const circ = 2 * Math.PI * r
    const allItems = [...(day.workout || []), ...(day.skills || [])]
    const done = allItems.filter(e => e.completed).length
    const total = allItems.length
    const ratio = total > 0 ? done / total : 0
    const label = day.label || formatDayLabel(day.dayOfWeek, day.date)
    return { r, circ, offset: circ * (1 - ratio), color: ringColors[i % ringColors.length], label, done, total }
  })

  return (
    <div style={chartSt.wrapper}>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        role="img"
        aria-label="Weekly workout completion rings"
        style={{ display: 'block' }}
      >
        {rings.map(({ r, circ, offset, color, label, done, total }, i) => (
          <g key={i} transform={`rotate(-90 ${CX} ${CX})`}>
            {/* track */}
            <circle cx={CX} cy={CX} r={r} fill="none" stroke={`${color}22`} strokeWidth={STROKE} />
            {/* fill */}
            <circle
              cx={CX} cy={CX} r={r} fill="none"
              stroke={color} strokeWidth={STROKE} strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={animated ? offset : circ}
              style={{ transition: `stroke-dashoffset 0.9s cubic-bezier(.25,1,.5,1) ${i * 0.08}s` }}
            >
              <title>{label} — {done}/{total} completed</title>
            </circle>
          </g>
        ))}
      </svg>
      <p style={chartSt.caption}>Weekly completion</p>
    </div>
  )
}

const chartSt = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  caption: {
    margin: 0,
    color: colors.textMuted,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '12px',
    textAlign: 'center',
    letterSpacing: '0.04em',
  },
}

// Progress Bar
function ProgressBar({ currentWeek, totalWeeks }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const pct = totalWeeks > 0 ? Math.min((currentWeek / totalWeeks) * 100, 100) : 0
  const weeksLeft = totalWeeks - currentWeek

  return (
    <div style={progressSt.wrapper}>
      <div style={progressSt.labelRow}>
        <span style={progressSt.label}>Progress</span>
        <span style={progressSt.weeksLeft}>
          {weeksLeft} week{weeksLeft !== 1 ? 's' : ''} left
        </span>
      </div>
      <div
        style={progressSt.track}
        role="progressbar"
        aria-valuenow={currentWeek}
        aria-valuemin={0}
        aria-valuemax={totalWeeks}
        aria-label={`Week ${currentWeek} of ${totalWeeks}`}
      >
        <div
          style={{
            ...progressSt.fill,
            width: animated ? `${pct}%` : '0%',
          }}
        />
      </div>
    </div>
  )
}

const progressSt = {
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#3B9EE2',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  weeksLeft: {
    color: colors.textMuted,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '13px',
  },
  track: {
    width: '100%',
    height: '10px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #309BC1 0%, #3BBFE8 100%)',
    borderRadius: '5px',
    transition: 'width 1s cubic-bezier(.25,1,.5,1)',
  },
}

// WeeklyWorkout (page)
function WeeklyWorkout() {
  const navigate = useNavigate()
  const [weekData, setWeekData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const latestToggleTokenRef = useRef({})

  // read session user for progress API calls
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { return null }
  })()
  const userId = currentUser?.id ?? currentUser?._id

  useEffect(() => {
    const stored = localStorage.getItem('questionnaireResult')
    if (!stored) {
      setError('No active session.')
      setLoading(false)
      return
    }

    let parsed
    try {
      parsed = JSON.parse(stored)
    } catch {
      setError('Could not read session data.')
      setLoading(false)
      return
    }

    const { sportType, experienceLevel } = parsed
    const params = new URLSearchParams({ sportType, experienceLevel })
    if (userId) params.set('userId', userId)

    fetch(`${API_URL}/program/current?${params}`)
      .then(r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then(async data => {
        if (data.error || data.message) throw new Error(data.error || data.message)
        const base = transformWorkoutData(data)

        if (userId) {
          // authenticated mode: backend progress is the canonical source
          const progress = await getCurrentWeekProgress(userId)
          const progressDays = progress?.days
          const applied = applyBackendCompleted(base, progressDays)
          // keep localStorage in sync with backend snapshot
          saveLocalSaved(buildSavedFromBackend(progressDays))
          setWeekData(applied)
          return
        }

        setWeekData(applyLocalCompleted(base, loadLocalSaved()))
      })
      .catch(err => setError(err.message || 'Could not load workout data.'))
      .finally(() => setLoading(false))
  }, [])

  // for authenticated users, backend response is canonical source of truth
  const handleToggleItem = (dayOfWeek, itemName, itemType, newCompleted) => {
    const key = makeItemKey(dayOfWeek, itemType, itemName)
    const previousCompleted = !newCompleted

    if (!userId) {
      // local-only mode for sessions without a persisted user id
      const saved = loadLocalSaved()
      if (newCompleted) { saved.add(key) } else { saved.delete(key) }
      saveLocalSaved(saved)
    }

    // update UI state
    const updateItems = (items) =>
      items.map(item => item.name === itemName ? { ...item, completed: newCompleted } : item)

    setWeekData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map(day => {
          if (day.dayOfWeek !== dayOfWeek) return day
          return {
            ...day,
            workout: itemType === 'workout' ? updateItems(day.workout) : day.workout,
            skills: itemType === 'skill' ? updateItems(day.skills) : day.skills,
          }
        }),
      }
    })

    // persist to backend; if successful, sync UI from canonical backend state
    if (userId) {
      const token = `${Date.now()}-${Math.random()}`
      latestToggleTokenRef.current[key] = token

      toggleProgressItem(userId, {
        day: dayOfWeek,
        category: itemType,
        title: itemName,
        completed: newCompleted,
      })
        .then((progress) => {
          if (latestToggleTokenRef.current[key] !== token) {
            return
          }

          const progressDays = progress?.days
          if (!progressDays) {
            return
          }

          setWeekData((prev) => {
            if (!prev) {
              return prev
            }

            return applyBackendCompleted(prev, progressDays)
          })
          saveLocalSaved(buildSavedFromBackend(progressDays))
        })
        .catch(() => {
          if (latestToggleTokenRef.current[key] !== token) {
            return
          }

          // rollback optimistic UI on failed write to keep pages in sync
          const rollbackItems = (items) =>
            items.map(item => item.name === itemName ? { ...item, completed: previousCompleted } : item)

          setWeekData((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              days: prev.days.map(day => {
                if (day.dayOfWeek !== dayOfWeek) return day
                return {
                  ...day,
                  workout: itemType === 'workout' ? rollbackItems(day.workout) : day.workout,
                  skills: itemType === 'skill' ? rollbackItems(day.skills) : day.skills,
                }
              }),
            }
          })
          setError('Could not save your progress. Please try again.')
        })
    }
  }

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div />
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>
            Train<span style={styles.titleAccent}>r</span>
          </h1>
          <div style={styles.weekRow}>
            <span style={styles.weekLabel}>
              {weekData ? `Week (${weekData.weekLabel})` : 'Weekly View'}
            </span>
            <button className="btn-secondary" style={styles.statsBtn} onClick={() => navigate('/statistics')}>
              Stats
            </button>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.avatar} aria-label="User profile" role="img" />
        </div>
      </header>

      {/* ── Body ── */}
      <main style={styles.main}>
        {loading && (
          <p style={styles.status}>Loading workout data…</p>
        )}

        {!loading && error && (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No workout plan yet</p>
            <p style={styles.emptyBody}>
              Your plan will appear here once it's been set up.
            </p>
          </div>
        )}

        {!loading && !error && weekData && (
          <>
            <div className="wr-grid">
              <WorkoutPanel
                title="Workout"
                days={weekData.days}
                dataKey="workout"
                onToggleItem={handleToggleItem}
              />

              <div className="wr-chart-col" style={styles.chartCol}>
                <DonutChart days={weekData.days} />
              </div>

              <WorkoutPanel
                title="Skills"
                days={weekData.days}
                dataKey="skills"
                onToggleItem={handleToggleItem}
              />
            </div>

            {weekData.totalWeeks && (
              <div style={styles.progressSection}>
                <ProgressBar
                  currentWeek={weekData.currentWeek}
                  totalWeeks={weekData.totalWeeks}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.pageBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px 48px',
  },
  header: {
    width: '100%',
    maxWidth: '1100px',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '24px 0 20px',
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '2rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  titleAccent: {
    color: colors.primary,
  },
  weekRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  weekLabel: {
    color: colors.textMuted,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '14px',
    fontWeight: '500',
  },
  statsBtn: {
    padding: '5px 14px',
    fontSize: '12px',
    fontWeight: '600',
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    border: '2px solid rgba(255,255,255,0.18)',
    cursor: 'pointer',
  },
  main: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  chartCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '48px',
  },
  progressSection: {
    padding: '0 4px',
  },
  status: {
    color: colors.textMuted,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '15px',
    textAlign: 'center',
    marginTop: '60px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginTop: '80px',
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  emptyBody: {
    color: colors.textMuted,
    fontFamily: "'Outfit', sans-serif",
    fontSize: '14px',
    margin: 0,
  },
}

export default WeeklyWorkout
