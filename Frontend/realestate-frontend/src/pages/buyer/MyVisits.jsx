import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiHome } from 'react-icons/fi'
import { visitAPI } from '../../services/api'
import toast from 'react-hot-toast'
import '../owner/OwnerPages.css'

const STATUS_MAP = { Requested: 'badge-pending', Approved: 'badge-approved', Completed: 'badge-approved', Cancelled: 'badge-rejected' }

export default function MyVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const r = await visitAPI.getMy(); setVisits(r.data.data || []) }
    catch { toast.error('Failed to load visits') }
    finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="owner-page-header">
        <div><h1 className="section-title"><FiCalendar /> Scheduled Visits</h1><p className="section-sub">{visits.length} visit(s) scheduled</p></div>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : visits.length === 0
        ? <div className="empty-state"><p>No visits scheduled yet.</p><Link to="/properties" className="btn btn-primary" style={{marginTop:16}}>Browse Properties</Link></div>
        : <div className="prop-table-wrap">
            <table className="prop-table">
              <thead><tr><th>Property</th><th>Date</th><th>Time</th><th>Owner</th><th>Status</th></tr></thead>
              <tbody>
                {visits.map(v => {
                  const p = v.propertyId
                  const o = v.ownerId
                  return (
                    <tr key={v._id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <img src={p?.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80&q=60'} alt="" className="prop-thumb" />
                          <div className="prop-name-cell">
                            <strong>{p?.title || '—'}</strong>
                            <span>₹{p?.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </td>
                      <td><FiCalendar style={{marginRight:6,color:'var(--primary)'}}/>{new Date(v.visitDate).toLocaleDateString()}</td>
                      <td><FiClock style={{marginRight:6,color:'var(--primary)'}}/>{v.visitTime}</td>
                      <td>{o ? `${o.firstName} ${o.lastName}` : '—'}</td>
                      <td><span className={`badge ${STATUS_MAP[v.status] || 'badge-pending'}`}>{v.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
      }
    </div></div>
  )
}
