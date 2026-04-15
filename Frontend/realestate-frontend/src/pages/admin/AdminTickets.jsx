import { useState, useEffect } from 'react'
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi'
import { supportAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

const STATUS_MAP = { Open: 'badge-pending', InProgress: 'badge-sale', Closed: 'badge-approved' }

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [responses, setResponses] = useState({})

  useEffect(() => { load() }, [statusFilter])
  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      const r = await supportAPI.getAll(params)
      setTickets(r.data.data || [])
    } catch { toast.error('Failed to load tickets') }
    finally { setLoading(false) }
  }

  const respond = async (id, status) => {
    try {
      const data = { status }
      if (responses[id]) data.response = responses[id]
      await supportAPI.respond(id, data)
      toast.success('Ticket updated!')
      setResponses(r => ({ ...r, [id]: '' }))
      load()
    } catch { toast.error('Failed') }
  }

  const deleteTicket = async (id) => {
    if (!confirm('Delete this ticket?')) return
    try { await supportAPI.delete(id); toast.success('Deleted!'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div><h1 className="section-title"><FiMessageSquare /> Support Tickets</h1><p className="section-sub">{tickets.length} ticket(s)</p></div>
      </div>

      <div className="admin-filter-bar">
        {['','Open','InProgress','Closed'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : tickets.length === 0
        ? <div className="empty-state"><p>No tickets found.</p></div>
        : tickets.map(ticket => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <h4>{ticket.subject}</h4>
                <span className={`badge ${STATUS_MAP[ticket.status] || 'badge-pending'}`}>{ticket.status}</span>
              </div>
              <div className="ticket-user">
                👤 {ticket.userId ? `${ticket.userId.firstName} ${ticket.userId.lastName} · ${ticket.userId.email}` : 'Unknown User'}
                <span style={{marginLeft:12}}>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="ticket-desc">{ticket.description}</div>
              {ticket.response && (
                <div className="ticket-response">
                  <strong>Support Response:</strong> {ticket.response}
                </div>
              )}
              <div className="ticket-actions">
                <textarea
                  rows={2} placeholder="Type response here..."
                  value={responses[ticket._id] || ''}
                  onChange={e => setResponses(r => ({ ...r, [ticket._id]: e.target.value }))}
                />
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {ticket.status !== 'InProgress' && (
                    <button className="btn btn-sm" style={{background:'var(--accent)',color:'white'}} onClick={() => respond(ticket._id, 'InProgress')}>In Progress</button>
                  )}
                  {ticket.status !== 'Closed' && (
                    <button className="btn btn-sm btn-primary" onClick={() => respond(ticket._id, 'Closed')}>Close</button>
                  )}
                  <button className="btn btn-sm btn-ghost" style={{color:'var(--danger)'}} onClick={() => deleteTicket(ticket._id)}><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))
      }
    </div></div>
  )
}
