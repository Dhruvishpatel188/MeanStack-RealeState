import { useState, useEffect } from 'react'
import { FiCalendar, FiCheck, FiX } from 'react-icons/fi'
import { visitAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

const STATUS_MAP = {
  Requested: 'badge-pending',
  Approved: 'badge-approved',
  Completed: 'badge-approved',
  Cancelled: 'badge-rejected',
}

export default function AdminVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const r = await visitAPI.getAll()
      setVisits(r.data.data || [])
    } catch { toast.error('Failed to load visits') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await visitAPI.updateStatus(id, status)
      toast.success(`Visit ${status}!`)
      load()
    } catch { toast.error('Failed to update') }
  }

  const filtered = statusFilter
    ? visits.filter(v => v.status === statusFilter)
    : visits

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div>
          <h1 className="section-title"><FiCalendar /> Visit Schedules</h1>
          <p className="section-sub">{visits.length} total visits</p>
        </div>
      </div>

      <div className="admin-filter-bar">
        {['', 'Requested', 'Approved', 'Completed', 'Cancelled'].map(s => (
          <button key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No visits found.</p></div>
      ) : (
        <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Buyer</th>
                <th>Owner</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v._id}>
                  <td>
                    <div className="prop-name-cell">
                      <strong>{v.propertyId?.title || '—'}</strong>
                      <span>₹{v.propertyId?.price?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <div className="prop-name-cell">
                      <strong>{v.buyerId ? `${v.buyerId.firstName} ${v.buyerId.lastName}` : '—'}</strong>
                      <span>{v.buyerId?.email}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {v.ownerId ? `${v.ownerId.firstName} ${v.ownerId.lastName}` : '—'}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {new Date(v.visitDate).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{v.visitTime}</td>
                  <td>
                    <span className={`badge ${STATUS_MAP[v.status] || 'badge-pending'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {v.status === 'Requested' && (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--success)' }}
                            title="Approve"
                            onClick={() => updateStatus(v._id, 'Approved')}>
                            <FiCheck />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Cancel"
                            onClick={() => updateStatus(v._id, 'Cancelled')}>
                            <FiX />
                          </button>
                        </>
                      )}
                      {v.status === 'Approved' && (
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--accent)', color: 'white' }}
                          onClick={() => updateStatus(v._id, 'Completed')}>
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div></div>
  )
}
