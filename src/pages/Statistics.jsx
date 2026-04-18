import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'


/*
-Will need to connect progress bar from workout page to the progress bar on this page, so that it updates as the user completes workouts
Or only track weekly workout completion and update progress bar on this page based on that
-Will need a data structure (array or vector) to store the exercises completed and skills learned, which will be updated from the workout page and displayed on this page
-Will need a variable to keep track of user's daily streak, time spent, and user's current level
*/


function Statistics(){
    const navigate = useNavigate()
    const [progress, setProgress] = useState(100)
    const [userLevel, setUserLevel] = useState(8)
    const maxLevel = 8
    const excerciseList = [
        'Squats',
        'Lunges',
        'Push-ups',
        'Pull-ups',
        'Planks',
        'Burpees',
        'Deadlifts',
        'Bench Press',
        'Rows',
        'Overhead Press',
    ]
    const skillsList = [
        'Skill1',
        'Skill2',
        'Skill3',
    ]
    const HomePage = () => {
        navigate('/')
    }
    const keepCurrentLevel = () => {
        setUserLevel((prev) => prev)
        setProgress(0)
    }
    const progressToNextLevel = () => {
        if (userLevel === maxLevel) {
            navigate('/questionnaire')
        } else {
            setUserLevel((prev) => Math.min(maxLevel, prev + 1))
            setProgress(0)
        }
    }

    return(
        <div style={styles.container}>
            <h1 style={styles.title} onClick={()=> navigate('/')}>Train<span style={styles.titleAccent}>r</span></h1>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Your Statistics</h2>
                <h3 style={styles.progressLabel}>Workout Progress</h3>
                <div style={styles.progressBarContainer}>
                    <div style={{...styles.progressBarFill,width: `${progress}%`}}></div>
                </div>
                <p style={styles.progressText}>{progress}% Complete</p>

                <div style={styles.subContainersRow}>
                    <div style={styles.subContainer1}>
                        <h3 style={styles.subContainerTitle}>Exercises Done</h3>
                        {excerciseList.length === 0 ? (
                            <p style={styles.emptyStateText}>No Exercises Completed!</p>
                        ) : (
                            excerciseList.map((item, index)=> (
                                <p key={index} style={styles.dash}>- {item}</p>
                            ))
                        )}
                    </div>
                    <div style={styles.middleContainersColumn}>
                        <div style={styles.middleContainerCard}>
                            <h3 style={styles.subContainerTitle}>Streak</h3>
                            <p style={styles.middleContainerValue}>7 Days</p>
                        </div>

                        <div style={styles.middleContainerCard}>
                            <h3 style={styles.subContainerTitle}>Time Spent</h3>
                            <p style={styles.middleContainerValue}>3 Weeks</p>
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
                <p style={styles.currentLevelText}>Current Level: {userLevel} ({userLevel}/{maxLevel})</p>
                {progress === 100 && (
                    <div style={styles.buttonContainerRow}>
                        <button style={styles.sameLevelButton} onClick={keepCurrentLevel}>Stay at current level</button>
                        <button style={styles.nextLevelButton} onClick={progressToNextLevel}>{userLevel === maxLevel ? 'Max level (Select New Sport)' : 'Progress to Next Level'}</button>
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
    subtitle: {
        color: colors.textPrimary,
        fontSize: '18px',
        margin: 0,
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '600',
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