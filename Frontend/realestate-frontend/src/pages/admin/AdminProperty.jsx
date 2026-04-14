import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiX, FiEye, FiTrash2 } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'
import toast from 'react-hot-toast'
import './AdminPages.css'
import '../owner/OwnerPages.css'

const formatPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(1)} Cr`
  if (p >= 100000) return `₹${(p/100000).toFixed(1)} L`
  return `₹${p?.toLocaleString()}`
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvalFilter, setApprovalFilter] = useState('Pending')

  useEffect(() => { load() }, [approvalFilter])
  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (approvalFilter) params.approvalStatus = approvalFilter
      const r = await propertyAPI.getAllAdmin(params)
      setProperties(r.data.data || [])
    } catch { toast.error('Failed to load properties') }
    finally { setLoading(false) }
  }

  const updateApproval = async (id, status) => {
    try {
      await propertyAPI.updateApproval(id, status)
      toast.success(`Property ${status}!`)
      load()
    } catch { toast.error('Failed to update') }
  }

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property permanently?')) return
    try { await propertyAPI.delete(id); toast.success('Deleted!'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div className="page-wrapper"><div className="container">
      <div className="admin-header">
        <div><h1 className="section-title">Property Management</h1><p className="section-sub">{properties.length} properties</p></div>
      </div>

      <div className="admin-filter-bar">
        <div style={{display:'flex',gap:8}}>
          {['','Pending','Approved','Rejected'].map(s => (
            <button key={s} className={`btn btn-sm ${approvalFilter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setApprovalFilter(s)}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
      : <div className="prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr><th>Property</th><th>Owner</th><th>Price</th><th>Location</th><th>Approval</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80&q=60'} alt="" className="prop-thumb" />
                      <div className="prop-name-cell">
                        <strong>{p.title}</strong>
                        <span>{p.propertyType} · {p.listingType}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="prop-name-cell">
                      <strong>{p.ownerId ? `${p.ownerId.firstName} ${p.ownerId.lastName}` : '—'}</strong>
                      <span>{p.ownerId?.email}</span>
                    </div>
                  </td>
                  <td><strong style={{color:'var(--primary)'}}>{formatPrice(p.price)}</strong></td>
                  <td style={{fontSize:'0.82rem',color:'var(--text-3)'}}>{p.city || '—'}</td>
                  <td>
                    <span className={`badge badge-${p.approvalStatus === 'Approved' ? 'approved' : p.approvalStatus === 'Rejected' ? 'rejected' : 'pending'}`}>
                      {p.approvalStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/property/${p._id}`} className="btn btn-ghost btn-sm" title="View"><FiEye /></Link>
                      {p.approvalStatus !== 'Approved' && (
                        <button className="btn btn-ghost btn-sm" style={{color:'var(--success)'}} title="Approve" onClick={() => updateApproval(p._id, 'Approved')}><FiCheck /></button>
                      )}
                      {p.approvalStatus !== 'Rejected' && (
                        <button className="btn btn-ghost btn-sm" style={{color:'var(--warning)'}} title="Reject" onClick={() => updateApproval(p._id, 'Rejected')}><FiX /></button>
                      )}
                      <button className="btn btn-ghost btn-sm" style={{color:'var(--danger)'}} title="Delete" onClick={() => deleteProperty(p._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && <div className="empty-state" style={{padding:32}}><p>No properties found.</p></div>}
        </div>
      }
    </div></div>
  )
}
