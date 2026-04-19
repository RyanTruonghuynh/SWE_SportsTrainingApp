import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.message === 'Login successful') {
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        navigate(data.user?.questionaire ? '/statistics' : '/questionnaire')
      } else {
        setError(data.message)
      }
    } catch {
      setError('Could not connect to server.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Train<span style={styles.titleAccent}>r</span></h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              className="form-input"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button className="btn-primary" type="submit" style={styles.btn}>
            Sign In
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: colors.pageBg,
    padding: '20px',
  },
  card: {
    backgroundColor: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '10px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: colors.cardShadow,
  },
  title: {
    color: colors.textPrimary,
    margin: 0,
    textAlign: 'center',
    fontSize: '1.6rem',
    fontWeight: '700',
  },
  titleAccent: {
    color: colors.primary,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: colors.textLabel,
  },
  error: {
    color: colors.errorText,
    margin: 0,
    fontSize: '14px',
  },
  btn: {
    padding: '11px 0',
    fontSize: '15px',
    width: '100%',
    marginTop: '4px',
  },
  switchText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: '14px',
    margin: 0,
  },
  link: {
    color: colors.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}

export default Login
