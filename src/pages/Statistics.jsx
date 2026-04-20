import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const sportLabelMap = {
    football: 'Football',
    soccer: 'Soccer',
    volleyball: 'Volleyball',
    racketsports: 'Racquet Sports',
}

const levelMap = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
}

const LEVEL_LABELS = ['Beginner', 'Intermediate', 'Advanced']
const MAX_LEVEL = 3

// scoped per user so multiple accounts on the same browser don't share dismissal state
const getDismissedKey = (userId) => `trainr_completed_dismissed_${userId}`

// groups a flat [{day, title}] list into [{day, items:[]}] preserving day order
function groupByDay(list) {
    const map = new Map()
    for (const item of list) {
        if (!map.has(item.day)) map.set(item.day, [])
        map.get(item.day).push(item.title)
    }
    return Array.from(map.entries()).map(([day, items]) => ({ day, items }))
}

function Statistics() {
    const navigate = useNavigate()
    const location = useLocation()
    const [progress, setProgress] = useState(0)
    const [planData, setPlanData] = useState(null)
    const [loadError, setLoadError] = useState('')
    const [currentLevel, setCurrentLevel] = useState(0)
    const [expandedExerciseDays, setExpandedExerciseDays] = useState(new Set())
    const [expandedSkillDays, setExpandedSkillDays] = useState(new Set())

    const toggleDay = (setter, day) => {
        setter((prev) => {
            const next = new Set(prev)
            next.has(day) ? next.delete(day) : next.add(day)
            return next
        })
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            const storedUser = localStorage.getItem('currentUser')
            const currentUser = storedUser ? JSON.parse(storedUser) : null
            const userId = currentUser?.id ?? currentUser?._id

            // check if user clicked "stay at level" previously, so we don't flash 100% again
            const resolveProgress = (rawPercent) => {
                const dismissed = userId ? localStorage.getItem(getDismissedKey(userId)) : null
                return dismissed && rawPercent === 100 ? 0 : rawPercent
            }

            if (location.state?.workoutPlan) {
                setPlanData(location.state)
                setCurrentLevel(levelMap[location.state.experienceLevel] ?? 1)
                setProgress(resolveProgress(location.state?.progress?.completionPercent ?? 0))
                setLoadError('')
                return
            }

            if (userId && currentUser?.questionaire) {
                try {
                    const res = await fetch(`${API_URL}/progress/dashboard/${userId}`)
                    const data = await res.json()

                    if (!res.ok) {
                        setLoadError(data.message || 'Could not load saved dashboard data.')
                        return
                    }

                    const dashboardData = {
                        sportType: data.user.questionaire.sportType,
                        experienceLevel: data.user.questionaire.experienceLevel,
                        score: data.user.questionaire.score,
                        workoutPlan: data.workoutPlan,
                        progress: data.progress,
                    }

                    localStorage.setItem('questionnaireResult', JSON.stringify(dashboardData))
                    setPlanData(dashboardData)
                    setCurrentLevel(levelMap[dashboardData.experienceLevel] ?? 1)
                    setProgress(resolveProgress(data.progress?.completionPercent ?? 0))
                    setLoadError('')
                    return
                } catch {
                    setLoadError('Could not load your saved dashboard. Please try again.')
                    return
                }
            }

            const storedResult = localStorage.getItem('questionnaireResult')
            if (!storedResult) {
                setLoadError('No questionnaire result found yet. Please complete the questionnaire first.')
                return
            }

            try {
                const parsed = JSON.parse(storedResult)
                setPlanData(parsed)
                setCurrentLevel(levelMap[parsed.experienceLevel] ?? 1)
                setProgress(resolveProgress(parsed?.progress?.completionPercent ?? 0))
                setLoadError('')
            } catch {
                setLoadError('Saved questionnaire result could not be read. Please submit the questionnaire again.')
            }
        }

        loadDashboardData()
    }, [location.state])

    const weeklyPlan = planData?.workoutPlan?.weeklyPlan ?? []
    const progressDays = planData?.progress?.days ?? []

    const exerciseGroups = groupByDay(
        progressDays.flatMap((day) =>
            (day.workoutItems ?? [])
                .filter((item) => item.completed)
                .map((item) => ({ day: day.day, title: item.title }))
        )
    )
    const skillGroups = groupByDay(
        progressDays.flatMap((day) =>
            (day.skillItems ?? [])
                .filter((item) => item.completed)
                .map((item) => ({ day: day.day, title: item.title }))
        )
    )

    const keepCurrentLevel = () => {
        const storedUser = localStorage.getItem('currentUser')
        const currentUser = storedUser ? JSON.parse(storedUser) : null
        const userId = currentUser?.id ?? currentUser?._id
        if (userId) {
            localStorage.setItem(getDismissedKey(userId), 'true')
        }
        setProgress(0)
    }

    const progressToNextLevel = () => {
        const storedUser = localStorage.getItem('currentUser')
        const currentUser = storedUser ? JSON.parse(storedUser) : null
        const userId = currentUser?.id ?? currentUser?._id
        // clear dismissal so fresh progress can accumulate from the real backend value
        if (userId) {
            localStorage.removeItem(getDismissedKey(userId))
        }
        if (currentLevel === MAX_LEVEL) {
            navigate('/questionnaire')
        } else {
            setCurrentLevel((prev) => Math.min(MAX_LEVEL, prev + 1))
            setProgress(0)
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title} onClick={() => navigate('/weekly')}>
                Train<span style={styles.titleAccent}>r</span>
            </h1>
            <div style={styles.card}>
                <div style={styles.subtitleRow}>
                    <h2 style={styles.subtitle}>Your Statistics</h2>
                    <button style={styles.workoutBtn} onClick={() => navigate('/weekly')}>View Workout</button>
                </div>

                {planData && (
                    <div style={styles.summaryCard}>
                        <p style={styles.summaryText}><strong>Sport:</strong> {sportLabelMap[planData.sportType] ?? planData.sportType}</p>
                        <p style={styles.summaryText}><strong>Level:</strong> {planData.experienceLevel.charAt(0).toUpperCase() + planData.experienceLevel.slice(1)}</p>
                        <p style={styles.summaryText}><strong>Plan:</strong> {planData.workoutPlan.title}</p>
                    </div>
                )}

                {loadError && <p style={styles.errorText}>{loadError}</p>}

                <h3 style={styles.progressLabel}>Workout Progress</h3>
                <div style={styles.progressBarContainer}>
                    <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
                </div>
                <p style={styles.progressText}>{progress}% Complete</p>

                <div style={styles.subContainersRow}>
                    <div style={styles.listCard}>
                        <h3 style={styles.subContainerTitle}>Exercises Done</h3>
                        {exerciseGroups.length === 0 ? (
                            <p style={styles.emptyStateText}>No exercises completed yet</p>
                        ) : (
                            exerciseGroups.map(({ day, items }) => {
                                const isOpen = expandedExerciseDays.has(day)
                                return (
                                    <div key={day} style={styles.dayGroup}>
                                        <button
                                            style={styles.dayGroupHeader}
                                            onClick={() => toggleDay(setExpandedExerciseDays, day)}
                                        >
                                            <span style={styles.dayBadge}>{day.slice(0, 3)}</span>
                                            <span style={styles.dayGroupCount}>{items.length} exercise{items.length !== 1 ? 's' : ''}</span>
                                            <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                                        </button>
                                        {isOpen && items.map((title, i) => (
                                            <p key={i} style={styles.dayGroupItem}>{title}</p>
                                        ))}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div style={styles.middleContainersColumn}>
                        <div style={styles.statCard}>
                            <p style={styles.statValue}>{weeklyPlan.length}</p>
                            <h3 style={styles.statLabel}>Plan Days</h3>
                        </div>
                        <div style={styles.statCard}>
                            <p style={styles.statValue}>{planData?.score ?? 0}</p>
                            <h3 style={styles.statLabel}>Plan Score</h3>
                        </div>
                    </div>

                    <div style={styles.listCard}>
                        <h3 style={styles.subContainerTitle}>Skills Learned</h3>
                        {skillGroups.length === 0 ? (
                            <p style={styles.emptyStateText}>No skills learned yet</p>
                        ) : (
                            skillGroups.map(({ day, items }) => {
                                const isOpen = expandedSkillDays.has(day)
                                return (
                                    <div key={day} style={styles.dayGroup}>
                                        <button
                                            style={styles.dayGroupHeader}
                                            onClick={() => toggleDay(setExpandedSkillDays, day)}
                                        >
                                            <span style={styles.dayBadge}>{day.slice(0, 3)}</span>
                                            <span style={styles.dayGroupCount}>{items.length} skill{items.length !== 1 ? 's' : ''}</span>
                                            <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                                        </button>
                                        {isOpen && items.map((title, i) => (
                                            <p key={i} style={styles.dayGroupItem}>{title}</p>
                                        ))}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* level progression indicator */}
                <div style={styles.levelStepsContainer}>
                    {LEVEL_LABELS.map((label, i) => {
                        const stepNum = i + 1
                        const isActive = currentLevel === stepNum
                        const isCompleted = currentLevel > stepNum
                        return (
                            <div key={label} style={styles.levelStepGroup}>
                                {i > 0 && (
                                    <div style={{
                                        ...styles.levelConnector,
                                        backgroundColor: currentLevel >= stepNum ? colors.primary : colors.inputBorder,
                                    }} />
                                )}
                                <div style={styles.levelStepItem}>
                                    <div style={{
                                        ...styles.levelDot,
                                        backgroundColor: isCompleted || isActive ? colors.primary : 'transparent',
                                        borderColor: isCompleted || isActive ? colors.primary : colors.inputBorder,
                                        color: isCompleted || isActive ? '#fff' : colors.textMuted,
                                    }}>
                                        {isCompleted ? '✓' : stepNum}
                                    </div>
                                    <span style={{
                                        ...styles.levelStepLabel,
                                        color: isActive ? colors.textPrimary : colors.textMuted,
                                        fontWeight: isActive ? '600' : '400',
                                    }}>{label}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {progress === 100 && (
                    <>
                        <div style={styles.completionBanner}>
                            <span style={styles.completionTitle}>Plan complete</span>
                            <span style={styles.completionSub}>Choose how you&apos;d like to continue</span>
                        </div>
                        <div style={styles.buttonContainerRow}>
                            <button style={styles.sameLevelButton} onClick={keepCurrentLevel}>
                                Stay at current level
                            </button>
                            <button style={styles.nextLevelButton} onClick={progressToNextLevel}>
                                {currentLevel === MAX_LEVEL ? 'Max level — choose new sport' : 'Progress to next level'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.pageBg,
        paddingTop: '32px',
        paddingBottom: '40px',
    },
    title: {
        color: colors.textPrimary,
        fontSize: '2.4rem',
        fontWeight: '700',
        margin: 0,
        marginBottom: '24px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    titleAccent: {
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '40px 36px',
        width: '900px',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        boxShadow: colors.cardShadow,
    },
    subtitleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    subtitle: {
        color: colors.textPrimary,
        fontSize: '18px',
        margin: 0,
        fontWeight: '600',
    },
    workoutBtn: {
        backgroundColor: colors.primary,
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        flexShrink: 0,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '16px 18px',
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '16px',
        flexWrap: 'wrap',
    },
    summaryText: {
        color: colors.textPrimary,
        margin: 0,
        fontSize: '14px',
        flex: '1 1 0',
        textAlign: 'center',
    },
    errorText: {
        color: colors.errorText,
        margin: 0,
        fontSize: '14px',
        textAlign: 'center',
        width: '100%',
    },
    progressLabel: {
        color: colors.textPrimary,
        fontSize: '16px',
        fontWeight: '600',
        margin: 0,
        textAlign: 'center',
        width: '100%',
    },
    progressBarContainer: {
        width: '70%',
        height: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
        borderRadius: '10px',
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    progressText: {
        color: colors.textMuted,
        fontSize: '13px',
        margin: 0,
        textAlign: 'center',
    },
    subContainersRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        width: '100%',
        alignItems: 'flex-start',
    },
    listCard: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '18px',
        alignItems: 'flex-start',
        gap: '8px',
        maxHeight: '220px',
        overflowY: 'auto',
        minWidth: 0,
    },
    subContainerTitle: {
        color: colors.textPrimary,
        margin: 0,
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '2px',
    },
    dayGroup: {
        width: '100%',
    },
    dayGroupHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        background: 'none',
        border: 'none',
        padding: '4px 0',
        cursor: 'pointer',
        textAlign: 'left',
    },
    dayBadge: {
        fontSize: '10px',
        fontWeight: '700',
        color: colors.primary,
        backgroundColor: 'rgba(48, 155, 193, 0.12)',
        borderRadius: '4px',
        padding: '2px 5px',
        flexShrink: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
    },
    dayGroupCount: {
        color: colors.textMuted,
        fontSize: '13px',
        flex: 1,
    },
    chevron: {
        color: colors.textMuted,
        fontSize: '9px',
        flexShrink: 0,
    },
    dayGroupItem: {
        color: colors.textPrimary,
        fontSize: '13px',
        margin: '2px 0',
        paddingLeft: '12px',
        lineHeight: '1.5',
    },
    emptyStateText: {
        color: colors.textMuted,
        margin: 0,
        fontSize: '13px',
        fontStyle: 'italic',
    },
    middleContainersColumn: {
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 150px',
        gap: '12px',
        alignItems: 'stretch',
    },
    statCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        minHeight: '100px',
        padding: '12px',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        textAlign: 'center',
    },
    statValue: {
        color: colors.textPrimary,
        margin: 0,
        fontSize: '30px',
        fontWeight: '700',
        lineHeight: '1',
    },
    statLabel: {
        color: colors.textMuted,
        margin: '6px 0 0 0',
        fontSize: '11px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    levelStepsContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '4px',
    },
    levelStepGroup: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    levelConnector: {
        height: '2px',
        width: '72px',
        marginTop: '15px', // vertically centers bar with the 32px dot
        flexShrink: 0,
    },
    levelStepItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    levelDot: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '600',
        flexShrink: 0,
    },
    levelStepLabel: {
        fontSize: '12px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
    },
    completionBanner: {
        width: '100%',
        backgroundColor: 'rgba(48, 155, 193, 0.08)',
        border: `1px solid ${colors.successBorder}`,
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
    },
    completionTitle: {
        color: colors.successText,
        fontSize: '16px',
        fontWeight: '600',
    },
    completionSub: {
        color: colors.textMuted,
        fontSize: '13px',
    },
    buttonContainerRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sameLevelButton: {
        backgroundColor: 'transparent',
        color: colors.textPrimary,
        border: `1px solid ${colors.inputBorder}`,
        borderRadius: '10px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    nextLevelButton: {
        backgroundColor: colors.primary,
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
    },
}

export default Statistics
