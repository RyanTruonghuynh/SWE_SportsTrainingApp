import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Trainr</h1>
      <p style={styles.subtitle}>Track your workouts and reach your goals.</p>
      <div style={styles.buttons}>
        <button className="btn-primary" style={styles.btn} onClick={() => navigate('/login')}>Sign In</button>
        <button className="btn-secondary" style={styles.btn} onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: '3rem',
    color: colors.primary,
    margin: 0,
  },
  subtitle: {
    color: colors.textLight,
    margin: 0,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
    width: '220px',
  },
  btn: {
    padding: '12px 0',
    fontSize: '16px',
    width: '100%',
  },
}

export default Landing
