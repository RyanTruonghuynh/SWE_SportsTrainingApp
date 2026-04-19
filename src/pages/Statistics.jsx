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


/*
-Will need to connect progress bar from workout page to the progress bar on this page, so that it updates as the user completes workouts
Or only track weekly workout completion and update progress bar on this page based on that
-Will need a data structure (array or vector) to store the exercises completed and skills learned, which will be updated from the workout page and displayed on this page
-Will need a variable to keep track of user's daily streak, time spent, and user's current level
*/


function Statistics(){
    const navigate = useNavigate()
    const location = useLocation()
    const [progress, setProgress] = useState(0)
    const [planData, setPlanData] = useState(null)
    const [loadError, setLoadError] = useState('')
    const [currentLevel, setCurrentLevel] = useState(0)

    useEffect(() => {
        const loadDashboardData = async () => {
            const storedUser = localStorage.getItem('currentUser')
            const currentUser = storedUser ? JSON.parse(storedUser) : null

            if (location.state?.workoutPlan) {
                setPlanData(location.state)
                setLoadError('')
                return
            }

            // old localStorage format stored _id instead of id; fall back to handle both
            const userId = currentUser?.id ?? currentUser?._id
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
                    setProgress(data.progress?.completionPercent ?? 0)
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
                setPlanData(JSON.parse(storedResult))
                setLoadError('')
            } catch {
                setLoadError('Saved questionnaire result could not be read. Please submit the questionnaire again.')
            }
        }

        loadDashboardData()
    }, [location.state])

    const maxLevel = 3
    const levelMap = {
        beginner: 1,
        intermediate: 2,
        advanced: 3,
    }

    const baseLevel = planData ? levelMap[planData.experienceLevel] ?? 1 : 0
    const weeklyPlan = planData?.workoutPlan?.weeklyPlan ?? []
    const progressDays = planData?.progress?.days ?? []
    const exerciseList = progressDays.flatMap((day) =>
        (day.workoutItems ?? [])
            .filter((item) => item.completed)
            .map((item) => `${day.day}: ${item.title}`)
    )
    const skillsList = progressDays.flatMap((day) =>
        (day.skillItems ?? [])
            .filter((item) => item.completed)
            .map((item) => `${day.day}: ${item.title}`)
    )

    useEffect(() => {
        if (planData?.progress?.completionPercent !== undefined) {
            setProgress(planData.progress.completionPercent)
            return
        }

        setProgress(0)
    }, [planData])

    useEffect(() => {
        setCurrentLevel(baseLevel)
    }, [baseLevel])

    const keepCurrentLevel = () => {
        setProgress(0)
    }
    const progressToNextLevel = () => {
        if (currentLevel === maxLevel) {
            navigate('/questionnaire')
        } else {
            setCurrentLevel((prev) => Math.min(maxLevel, prev + 1))
            setProgress(0)
        }
    }

    return(
        <div style={styles.container}>
            <h1 style={styles.title} onClick={()=> navigate('/weekly')}>Train<span style={styles.titleAccent}>r</span></h1>
            <div style={styles.card}>
                <div style={styles.subtitleRow}>
                    <h2 style={styles.subtitle}>Your Statistics</h2>
                    <button style={styles.workoutBtn} onClick={() => navigate('/weekly')}>View Workout</button>
                </div>
                {planData && (
                    <div style={styles.summaryCard}>
                        <p style={styles.summaryText}><strong>Sport:</strong> {sportLabelMap[planData.sportType] ?? planData.sportType}</p>
                        <p style={styles.summaryText}><strong>Level:</strong> {planData.experienceLevel}</p>
                        <p style={styles.summaryText}><strong>Plan:</strong> {planData.workoutPlan.title}</p>
                    </div>
                )}
                {loadError && <p style={styles.errorText}>{loadError}</p>}
                <h3 style={styles.progressLabel}>Workout Progress</h3>
                <div style={styles.progressBarContainer}>
                    <div style={{...styles.progressBarFill,width: `${progress}%`}}></div>
                </div>
                <p style={styles.progressText}>{progress}% Complete</p>

                <div style={styles.subContainersRow}>
                    <div style={styles.subContainer1}>
                        <h3 style={styles.subContainerTitle}>Exercises Done</h3>
                        {exerciseList.length === 0 ? (
                            <p style={styles.emptyStateText}>No Exercises Completed!</p>
                        ) : (
                            exerciseList.map((item, index)=> (
                                <p key={index} style={styles.dash}>- {item}</p>
                            ))
                        )}
                    </div>
                    <div style={styles.middleContainersColumn}>
                        <div style={styles.middleContainerCard}>
                            <h3 style={styles.subContainerTitle}>Plan Days</h3>
                            <p style={styles.middleContainerValue}>{weeklyPlan.length} Days</p>
                        </div>

                        <div style={styles.middleContainerCard}>
                            <h3 style={styles.subContainerTitle}>Plan Score</h3>
                            <p style={styles.middleContainerValue}>{planData?.score ?? 0}</p>
                        </div>
                    </div>

                    <div style={styles.subContainer2}>
                        <h3 style={styles.subContainerTitle}>Skills Learned</h3>
                        {skillsList.length === 0 ? (
                            <p style={styles.emptyStateText}>No Skills Learned!</p>
                        ) : (
                            skillsList.map((item, index)=> (
                                <p key={`skill-${index}`} style={styles.dash}>- {item}</p>
                            ))
                        )}
                    </div>
                </div>
                <p style={styles.currentLevelText}>
                    Current Level: {planData?.experienceLevel ?? 'Not set'} ({currentLevel}/{maxLevel})
                </p>
                {progress === 100 && (
                    <div style={styles.buttonContainerRow}>
                        <button style={styles.sameLevelButton} onClick={keepCurrentLevel}>Stay at current level</button>
                        <button style={styles.nextLevelButton} onClick={progressToNextLevel}>{currentLevel === maxLevel ? 'Max level (Select New Sport)' : 'Progress to Next Level'}</button>
                    </div>
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
    subtitleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '20px',
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
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
    },
    summaryText: {
        color: colors.textPrimary,
        margin: 0,
        fontSize: '14px',
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
        marginBottom: '8px',
        textAlign: 'center',
        width: '100%',
    },
    progressBarContainer: {
        width: '70%',
        height: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '8px',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: '10px',
        transition: 'width 0.3s ease',
    },
    buttonContainerRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    sameLevelButton:{
        backgroundColor: 'transparent',
        color: colors.textPrimary,
        border: `1px solid ${colors.inputBorder}`,
        borderRadius: '10px',
        padding: '12px 18px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    nextLevelButton: {
        backgroundColor: colors.primary,
        color: colors.textPrimary,
        border: 'none',
        borderRadius: '10px',
        padding: '12px 18px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    subContainersRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    subContainer1:{
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 260px',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '18px',
        alignItems: 'flex-start',
        gap: '8px',
        maxHeight: '220px',
        overflowY: 'auto',
    },
    subContainerTitle: {
        color: colors.textPrimary,
        margin: 0,
        fontSize: '15px',
        fontWeight: '600',
    },
    subContainer2:{
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 280px',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '18px',
        alignItems: 'flex-start',
        gap: '8px',
        maxHeight: '220px',
        overflowY: 'auto',
    },
    middleContainersColumn: {
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 170px',
        gap: '12px',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    middleContainerCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '104px',
        padding: '10px',
        backgroundColor: '#173351',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        textAlign: 'center',
    },
    middleContainerValue: {
        color: colors.textPrimary,
        margin: '6px 0 0 0',
        fontSize: '18px',
        fontWeight: '700',
    },
    dash: {
        color: colors.textMuted,
        margin: 0,
        fontSize: '14px',
        lineHeight: '1.4',
    },
    emptyStateText: {
        color: colors.textMuted,
        margin: 0,
        fontSize: '14px',
        fontStyle: 'italic',
    },
    progressText: {
        color: colors.textMuted,
        fontSize: '13px',
        margin: 0,
        marginBottom: '20px',
        textAlign: 'center',
    },
    currentLevelText: {
        color: colors.textPrimary,
        fontSize: '16px',
        fontWeight: '600',
        margin: 0,
        marginTop: '8px',
        textAlign: 'center',
        width: '100%',
    },
    text: {
        color: colors.textMuted,
        marginTop: '10px',
        marginBottom: '20px',
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
}

export default Statistics
