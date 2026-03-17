import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../styles/theme'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const res = await fetch('http://localhost:5000/auth/signUP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.message === 'New user created') {
        setSuccess('Account created! Redirecting...')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Could not connect to server.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            className="form-input"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button className="btn-primary" type="submit" style={styles.btn}>Sign Up</button>
        </form>
        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/login')}>Sign In</span>
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
    height: '100vh',
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.background,
    padding: '40px 36px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(48,155,193,0.12)',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    color: colors.primary,
    margin: 0,
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btn: {
    padding: '11px 0',
    fontSize: '15px',
    width: '100%',
    marginTop: '4px',
  },
  error: {
    color: colors.error,
    margin: 0,
    fontSize: '14px',
  },
  success: {
    color: colors.primary,
    margin: 0,
    fontSize: '14px',
  },
  switchText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: '14px',
    margin: 0,
  },
  link: {
    color: colors.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}

export default Signup
