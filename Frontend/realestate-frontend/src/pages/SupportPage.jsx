import { useState, useEffect } from 'react'
import { FiPlusCircle, FiMessageSquare } from 'react-icons/fi'
import { supportAPI } from '../services/api'
import toast from 'react-hot-toast'
import './owner/OwnerPages.css'

const STATUS_MAP = { Open: 'badge-pending', InProgress: 'badge-sale', Closed: 'badge-approved' }

export default function SupportPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await supportAPI.getMy(); setTickets(r.data.data || []) }
    catch { toast.error('Failed to load tickets') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await supportAPI.create(form)
      toast.success('Support ticket created!')
      setForm({ subject: '', description: '' })
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="page-wrapper"><div className="container" style={{maxWidth:800}}>
      <div className="owner-page-header">
        <div><h1 className="section-title"><FiMessageSquare /> Support Center</h1><p className="section-sub">Raise and track your support requests</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlusCircle /> New Ticket
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{marginBottom:24}}>
          <h3 className="form-card-title">Create Support Ticket</h3>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input className="form-control" placeholder="Brief description of your issue" value={form.subject}
                onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-control" rows={4} placeholder="Explain your issue in detail..."
                value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Ticket'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : tickets.length === 0
        ? <div className="empty-state"><p>No tickets yet. Click "New Ticket" to get help.</p></div>
        : <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {tickets.map(t => (
              <div key={t._id} className="form-card" style={{gap:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h4 style={{fontWeight:600,fontSize:'0.95rem'}}>{t.subject}</h4>
                  <span className={`badge ${STATUS_MAP[t.status] || 'badge-pending'}`}>{t.status}</span>
                </div>
                <p style={{fontSize:'0.85rem',color:'var(--text-3)'}}>📅 {new Date(t.createdAt).toLocaleDateString()}</p>
                <div style={{background:'var(--bg)',padding:'10px',borderRadius:'var(--radius-sm)',fontSize:'0.88rem',color:'var(--text-2)'}}>{t.description}</div>
                {t.response && (
                  <div style={{background:'#d1e7dd',padding:'10px',borderRadius:'var(--radius-sm)',fontSize:'0.85rem',color:'#0f5132'}}>
                    <strong>Support Response:</strong> {t.response}
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div></div>
  )
}
