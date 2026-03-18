import { colors } from "../styles/theme";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
            <h1 style={styles.title}>Trainr</h1>
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
        backgroundColor: colors.surface,
        width: '100%',
        paddingTop: '20px',      
    },
    title: {
        color: colors.primary,
        fontSize: '48px',
        fontWeight: 'bold',
        margin: 0,
        marginBottom: '20px',
        textAlign: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: colors.background,
        padding: '40px 36px',
        borderRadius: '10px',
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px', 
    },
    subtitle: {
        color: colors.text,
        fontSize: '18px',
        margin: 0,
        marginBottom: '10px',        
        textAlign: 'center',
        fontWeight: '500',
        width: '100%',
    },
    spacing: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
    },
    label: {
        color: colors.textLight,
        fontWeight: '500',
        fontSize: '14px',
        textAlign: 'left',
    }, 
    select: {
        width: '100%',
        padding: '12px',
        border: '2px solid #C5D8D7', 
        borderRadius: '8px',
        fontSize: '15px',
        color: colors.text,
        backgroundColor: colors.background,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },   
    selectionBox: {                  
        padding: '12px',
        backgroundColor: '#E4EEEE', 
        borderRadius: '6px',
        color: colors.text,
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
        color: colors.text,
        fontWeight: '500',
        fontSize: '15px',
    },
    sliderValue: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: '16px',
        backgroundColor: '#E4EEEE',
        padding: '4px 10px',
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
        color: colors.primary,
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
        color: colors.text,
        fontWeight: '500',
        fontSize: '15px',
    },
    ageInput: {
        width: '100%',
        padding: '12px',
        border: '2px solid #C5D8D7',
        borderRadius: '8px',
        fontSize: '15px',
        color: colors.text,
        backgroundColor: colors.background,
        outline: 'none',
    },

    ageMessage: {
        color: colors.textLight,
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
        borderRadius: '8px',
        padding: '14px 28px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
}

export default Questionnaire