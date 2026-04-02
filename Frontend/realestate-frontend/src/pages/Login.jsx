import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome } from 'react-icons/fi'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.data, res.data.token)
      toast.success(`Welcome back, ${res.data.data.firstName}!`)
      // redirect by role
      const role = res.data.data.role
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'OWNER' || role === 'AGENT') navigate('/owner/properties')
      else navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80" alt="property" />
        <div className="auth-left-overlay">
          <Link to="/" className="auth-logo"><FiHome /> EstateHub</Link>
          <div className="auth-quote">
            <h2>Find Your Perfect Home</h2>
            <p>Join thousands of happy homeowners and renters across India.</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to EstateHub</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input name="email" type="email" className="form-control" placeholder="you@email.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input name="password" type={showPass ? 'text' : 'password'} className="form-control"
                  placeholder="Your password" value={form.password} onChange={handleChange} required />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          {/* Demo credentials */}
          <div className="demo-creds">
            <p className="demo-label">Demo Accounts</p>
            <div className="demo-grid">
              {[
                { role: 'Admin', email: 'admin@demo.com', pass: 'Admin@123' },
                { role: 'Owner', email: 'owner@demo.com', pass: 'Owner@123' },
                { role: 'Buyer', email: 'buyer@demo.com', pass: 'Buyer@123' },
              ].map(d => (
                <button key={d.role} className="demo-btn"
                  onClick={() => { setForm({ email: d.email, password: d.pass }); toast.success(`${d.role} credentials filled!`) }}>
                  <span className={`demo-role demo-${d.role.toLowerCase()}`}>{d.role}</span>
                  <span>{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
