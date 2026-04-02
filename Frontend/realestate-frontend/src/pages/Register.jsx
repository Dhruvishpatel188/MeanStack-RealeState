import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHome, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import './Auth.css'

const ROLES = [
  { value: 'BUYER', label: '🏠 Buyer / Renter', desc: 'Search & rent or buy properties' },
  { value: 'OWNER', label: '🏢 Property Owner', desc: 'List your own properties' },
  { value: 'AGENT', label: '🤝 Real Estate Agent', desc: 'Manage properties for clients' },
]

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profilePreview, setProfilePreview] = useState(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', role: 'BUYER', gender: '',
    address: '', city: '', state: '', pincode: '',
    profilePic: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setForm(f => ({ ...f, [name]: files[0] }))
      setProfilePreview(URL.createObjectURL(files[0]))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v) })

    try {
      await authAPI.register(formData)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" alt="property" />
        <div className="auth-left-overlay">
          <Link to="/" className="auth-logo"><FiHome /> EstateHub</Link>
          <div className="auth-quote">
            <h2>Start Your Property Journey</h2>
            <p>Register today and get access to thousands of verified listings.</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card wide">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Step {step} of 2 — {step === 1 ? 'Basic Info' : 'Address & Profile'}</p>
          </div>

          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit} className="auth-form">
            {step === 1 && (
              <>
                {/* Role picker */}
                <div className="form-group">
                  <label className="form-label">I want to...</label>
                  <div className="role-picker">
                    {ROLES.map(r => (
                      <label key={r.value} className={`role-option ${form.role === r.value ? 'active' : ''}`}>
                        <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={handleChange} />
                        <span className="role-label">{r.label}</span>
                        <span className="role-desc">{r.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <div className="input-icon-wrap">
                      <FiUser className="input-icon" />
                      <input name="firstName" className="form-control" placeholder="John"
                        value={form.firstName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <div className="input-icon-wrap">
                      <FiUser className="input-icon" />
                      <input name="lastName" className="form-control" placeholder="Doe"
                        value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-icon-wrap">
                    <FiMail className="input-icon" />
                    <input name="email" type="email" className="form-control" placeholder="you@email.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-icon-wrap">
                      <FiLock className="input-icon" />
                      <input name="password" type={showPass ? 'text' : 'password'} className="form-control"
                        placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                      <button type="button" className="input-icon-right" onClick={() => setShowPass(s => !s)}>
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div className="input-icon-wrap">
                      <FiPhone className="input-icon" />
                      <input name="phone" className="form-control" placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary auth-submit">Continue →</button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Profile Pic */}
                <div className="form-group">
                  <label className="form-label">Profile Photo (optional)</label>
                  <div className="profile-upload">
                    <div className="profile-preview">
                      {profilePreview ? <img src={profilePreview} alt="preview" /> : <FiCamera />}
                    </div>
                    <label className="btn btn-outline btn-sm">
                      Upload Photo
                      <input type="file" name="profilePic" accept="image/*" onChange={handleChange} hidden />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <div className="input-icon-wrap">
                    <FiMapPin className="input-icon" />
                    <input name="address" className="form-control" placeholder="House no., Street name"
                      value={form.address} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input name="city" className="form-control" placeholder="Ahmedabad"
                      value={form.city} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input name="state" className="form-control" placeholder="Gujarat"
                      value={form.state} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input name="pincode" className="form-control" placeholder="380001"
                    value={form.pincode} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <button type="button" className="btn btn-outline auth-submit" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}
