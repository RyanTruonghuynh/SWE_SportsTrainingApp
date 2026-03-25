import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Train<span style={styles.titleAccent}>r</span>
      </h1>
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
    minHeight: '100vh',
    width: '100%',
    backgroundColor: colors.pageBg,
    gap: '16px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: colors.textPrimary,
    margin: 0,
    letterSpacing: '-2px',
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    color: colors.textMuted,
    margin: 0,
    fontSize: '1rem',
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
