import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'
import "../App.css";

function Questionnaire() {
    const navigate = useNavigate() 
    const [sportSelected, setSportSelected] = useState('')
    const [yearsExperience, setYearsExperience] = useState(0)
    const [workoutFreq, setWorkoutFreq] = useState(0)
    const [age, setAge] = useState('') 

    const ageFunc = (e) => {
        const value = e.target.value
        if (value === '' || /^\d{1,2}$/.test(value)) {
            setAge(value)
        }
    }
    const saveAndContinueFunc = () => {
        console.log('Saved preferences:', {
            sport: sportSelected,
            experience: yearsExperience,
            frequency: workoutFreq,
            age: age
        })
        navigate('/NextPage')
    }

    return(
        <div style={styles.container}>
            <h1 style={styles.title}>Train<span style={styles.titleAccent}>r</span></h1>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Select Your Sport</h2>
                <div style={styles.spacing}>
                    <label style={styles.label}>
                        Choose a sport:
                    </label>
                    <select style={styles.select} value={sportSelected} onChange={(e) => setSportSelected(e.target.value)}>
                        <option value="">--Select a Sport--</option>
                        <option value="Football">Football</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Racquet Sports">Racquet Sports</option>
                        <option value="Volleyball">Volleyball</option>
                    </select>
                </div>
                
                {sportSelected && (
                    <>
                        {/*slider for years of experience*/}
                        <div style={styles.sliderContainer}>
                            <div style={styles.sliderHeader}>
                                <span style={styles.sliderLabel}>
                                    Years of experience in {sportSelected}:
                                </span>
                                <span style={styles.sliderValue}>{yearsExperience} years</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={yearsExperience}
                                onChange={(e) => setYearsExperience(parseInt(e.target.value))}
                                style={styles.slider}
                            />
                            <div style={styles.sliderMinMax}>
                                <span>0</span>
                                <span>50</span>
                            </div>
                        </div>

                        {/*slider for workout frequency*/}
                        <div style={styles.sliderContainer}>
                            <div style={styles.sliderHeader}>
                                <span style={styles.sliderLabel}>
                                    How often do you work out in a week?
                                </span>
                                <span style={styles.sliderValue}>{workoutFreq} days</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="7"
                                value={workoutFreq}
                                onChange={(e) => setWorkoutFreq(parseInt(e.target.value))}
                                style={styles.slider}
                            />
                            <div style={styles.sliderMinMax}>
                                <span>0</span>
                                <span>7</span>
                            </div>
                        </div>

                        {/*age input*/}
                        <div style={styles.ageContainer}>
                            <label style={styles.ageLabel}>
                                Your Age:
                            </label>
                            <input
                                type="text"
                                value={age}
                                onChange={ageFunc}
                                placeholder="Enter age"
                                maxLength="2"
                                style={styles.ageInput}
                            />
                            {age && <span style={styles.ageMessage}>years</span>}
                        </div>
                    </>
                )}
                {/*summary of selections*/}
                {sportSelected && (
                    <div style={styles.selectionBox}>
                        <p><strong>Sport:</strong> {sportSelected}</p>
                        <p><strong>Experience:</strong> {yearsExperience} years</p>
                        <p><strong>Frequency:</strong> {workoutFreq} days/week</p>
                        <p><strong>Age:</strong> {age || 'Not entered'} {age && 'years'}</p>
                    </div>
                )}

                {/*Save and Continue Button*/}
                {sportSelected && (
                    <div style={styles.buttonContainer}>
                        <button 
                            style={styles.saveButton}
                            onClick={saveAndContinueFunc}
                        >
                            Save and Continue
                        </button>
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
        backgroundColor: colors.pageBg,
        width: '100%',
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
    },
    titleAccent: {
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '10px',
        padding: '40px 36px',
        width: '600px',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        boxShadow: colors.cardShadow,
    },
    subtitle: {
        color: colors.textPrimary,
        fontSize: '18px',
        margin: 0,
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: '600',
        width: '100%',
    },
    spacing: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
    },
    label: {
        color: colors.textLabel,
        fontWeight: '500',
        fontSize: '13px',
        textAlign: 'left',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: `1.5px solid ${colors.inputBorder}`,
        borderRadius: '10px',
        fontSize: '15px',
        color: colors.textPrimary,
        backgroundColor: colors.inputBgSolid,
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
        outline: 'none',
    },
    selectionBox: {
        padding: '14px 16px',
        background: colors.summaryBg,
        border: `1px solid ${colors.summaryBorder}`,
        borderRadius: '12px',
        color: colors.textMuted,
        textAlign: 'center',
        fontSize: '14px',
        width: '100%',
    },
    sliderContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    sliderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    sliderLabel: {
        color: colors.textPrimary,
        fontWeight: '500',
        fontSize: '15px',
    },
    sliderValue: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: '14px',
        background: colors.sliderBadgeBg,
        border: `1px solid ${colors.sliderBadgeBorder}`,
        padding: '3px 10px',
        borderRadius: '20px',
    },
    slider: {
        width: '100%',
        height: '8px',
        borderRadius: '5px',
        outline: 'none',
        cursor: 'pointer',
    },
    sliderMinMax: {
        display: 'flex',
        justifyContent: 'space-between',
        color: colors.textMuted,
        fontSize: '12px',
        width: '100%',
    },
    ageContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    ageLabel: {
        color: colors.textPrimary,
        fontWeight: '500',
        fontSize: '15px',
    },
    ageInput: {
        width: '100%',
        padding: '12px',
        border: `1.5px solid ${colors.inputBorder}`,
        borderRadius: '10px',
        fontSize: '15px',
        color: colors.textPrimary,
        backgroundColor: colors.inputBgSolid,
        outline: 'none',
    },
    ageMessage: {
        color: colors.textMuted,
        fontSize: '12px',
        marginTop: '4px',
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    saveButton: {
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '13px 28px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.15s ease',
    },
}

export default Questionnaire